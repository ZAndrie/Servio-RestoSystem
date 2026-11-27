<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderLifecycleAndBusinessRulesTest extends TestCase
{
    use RefreshDatabase;

    public function test_pay_first_dine_after_lifecycle_price_snapshot_extra_food_and_table_release(): void
    {
        $waiter = User::factory()->waiter()->create(['name' => 'Ana Reyes']);
        $kitchen = User::factory()->kitchen()->create(['name' => 'Ramon Cruz']);
        $admin = User::factory()->admin()->create(['name' => 'Maria Santos']);

        $category = Category::query()->create(['name' => 'Dishes', 'slug' => 'dishes']);
        $sinigang = MenuItem::query()->create([
            'category_id' => $category->id,
            'name' => 'Sinigang na Baboy',
            'price' => 345.00,
            'is_available' => true,
        ]);
        $juice = MenuItem::query()->create([
            'category_id' => $category->id,
            'name' => 'Calamansi Juice',
            'price' => 75.00,
            'is_available' => true,
        ]);
        $table = Table::query()->create([
            'table_number' => 'T-04',
            'capacity' => 4,
            'status' => Table::STATUS_AVAILABLE,
        ]);

        // 1. Waiter creates unpaid order (forged frontend total=1.00 is ignored; server computes 345 + 75 = 420.00)
        Sanctum::actingAs($waiter);
        $createResponse = $this->postJson('/api/orders', [
            'table_id' => $table->id,
            'total' => 1.00,
            'items' => [
                ['menu_item_id' => $sinigang->id, 'quantity' => 1, 'notes' => 'More broth'],
                ['menu_item_id' => $juice->id, 'quantity' => 1, 'notes' => 'Less ice'],
            ],
        ]);

        $createResponse->assertCreated()
            ->assertJsonPath('status', Order::STATUS_PENDING)
            ->assertJsonPath('payment_status', Order::PAYMENT_UNPAID)
            ->assertJsonPath('total', '420.00')
            ->assertJsonPath('table_number', 'T-04')
            ->assertJsonPath('server_name', 'Ana Reyes')
            ->assertJsonPath('items.0.unit_price', '345.00')
            ->assertJsonPath('items.0.name', 'Sinigang na Baboy');

        $orderId = $createResponse->json('id');
        $orderRef = $createResponse->json('order_ref');

        $this->assertDatabaseHas('tables', [
            'id' => $table->id,
            'status' => Table::STATUS_OCCUPIED,
            'active_order_id' => $orderId,
            'active_order_ref' => $orderRef,
        ]);

        // 2. Step back to edit unpaid order items (add a 2nd juice: 345 + 150 = 495.00)
        $this->putJson("/api/orders/{$orderId}/items", [
            'items' => [
                ['menu_item_id' => $sinigang->id, 'quantity' => 1, 'notes' => 'More broth'],
                ['menu_item_id' => $juice->id, 'quantity' => 2, 'notes' => 'Less ice'],
            ],
        ])->assertOk()
            ->assertJsonPath('total', '495.00');

        // 3. Kitchen CANNOT start cooking an unpaid order (Pay-First invariant!)
        Sanctum::actingAs($kitchen);
        $this->patchJson("/api/orders/{$orderId}/status", ['status' => 'preparing'])
            ->assertUnprocessable();

        // 4. Waiter collects upfront Cash payment (500.00 -> change 5.00).
        // Order becomes payment_status='paid' while status stays 'pending' and table stays 'occupied'!
        Sanctum::actingAs($waiter);
        $payResponse = $this->postJson("/api/orders/{$orderId}/pay", [
            'payment_method' => 'cash',
            'amount_paid' => 500.00,
        ]);

        $payResponse->assertOk()
            ->assertJsonPath('payment_status', Order::PAYMENT_PAID)
            ->assertJsonPath('status', Order::STATUS_PENDING)
            ->assertJsonPath('payment_method', 'cash')
            ->assertJsonPath('amount_paid', '500.00')
            ->assertJsonPath('change_amount', '5.00')
            ->assertJsonPath('table.status', Table::STATUS_OCCUPIED);

        // Paid orders can no longer be edited via PUT /orders/{id}/items
        $this->putJson("/api/orders/{$orderId}/items", [
            'items' => [['menu_item_id' => $juice->id, 'quantity' => 1]],
        ])->assertUnprocessable();

        // 5. Kitchen now sees the paid order in pending queue and advances pending -> preparing -> ready
        Sanctum::actingAs($kitchen);
        $this->getJson('/api/orders?status=pending,preparing&payment_status=paid')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $orderId);

        $this->patchJson("/api/orders/{$orderId}/status", ['status' => 'preparing'])
            ->assertOk()
            ->assertJsonPath('status', 'preparing');

        $this->patchJson("/api/orders/{$orderId}/status", ['status' => 'ready'])
            ->assertOk()
            ->assertJsonPath('status', 'ready');

        // 6. Waiter cannot release table while paid kitchen order is still unserved (without force)
        Sanctum::actingAs($waiter);
        $this->patchJson("/api/tables/{$table->id}/release")
            ->assertUnprocessable();

        // Waiter serves order to table
        $this->patchJson("/api/orders/{$orderId}/status", ['status' => 'served'])
            ->assertOk()
            ->assertJsonPath('status', 'served');

        // 7. Admin changes menu price later -> past order total and unit_price snapshot remain unchanged!
        Sanctum::actingAs($admin);
        $this->putJson("/api/menu-items/{$sinigang->id}", ['price' => 999.00])->assertOk();
        $this->getJson("/api/orders/{$orderId}")
            ->assertOk()
            ->assertJsonPath('total', '495.00')
            ->assertJsonPath('items.0.unit_price', '345.00');

        // 8. Guests request Extra Food on occupied table (allow_occupied=true) -> separate unpaid add-on ticket
        Sanctum::actingAs($waiter);
        $addonResponse = $this->postJson('/api/orders', [
            'table_id' => $table->id,
            'allow_occupied' => true,
            'items' => [['menu_item_id' => $juice->id, 'quantity' => 1]],
        ]);
        $addonResponse->assertCreated()
            ->assertJsonPath('payment_status', Order::PAYMENT_UNPAID)
            ->assertJsonPath('total', '75.00');
        $addonId = $addonResponse->json('id');

        // Pay add-on with exact GCash amount, cook, and serve
        $this->postJson("/api/orders/{$addonId}/pay", [
            'payment_method' => 'gcash',
            'amount_paid' => 75.00,
        ])->assertOk()
            ->assertJsonPath('change_amount', '0.00');

        Sanctum::actingAs($kitchen);
        $this->patchJson("/api/orders/{$addonId}/status", ['status' => 'preparing'])->assertOk();
        $this->patchJson("/api/orders/{$addonId}/status", ['status' => 'ready'])->assertOk();

        Sanctum::actingAs($waiter);
        $this->patchJson("/api/orders/{$addonId}/status", ['status' => 'served'])->assertOk();

        // 9. Guests finish dining -> Clear Table archives both paid orders to status='paid' & frees table
        $releaseResponse = $this->patchJson("/api/tables/{$table->id}/release");
        $releaseResponse->assertOk()
            ->assertJsonPath('table.status', Table::STATUS_AVAILABLE)
            ->assertJsonPath('table.active_order_id', null)
            ->assertJsonCount(2, 'orders');

        $this->assertDatabaseHas('orders', ['id' => $orderId, 'status' => Order::STATUS_PAID]);
        $this->assertDatabaseHas('orders', ['id' => $addonId, 'status' => Order::STATUS_PAID]);
        $this->assertDatabaseHas('tables', ['id' => $table->id, 'status' => Table::STATUS_AVAILABLE]);
    }

    public function test_sold_out_items_and_occupied_tables_without_flag_are_rejected(): void
    {
        $waiter = User::factory()->waiter()->create();
        $category = Category::query()->create(['name' => 'Dishes', 'slug' => 'dishes']);

        $availableItem = MenuItem::query()->create([
            'category_id' => $category->id,
            'name' => 'Sisig',
            'price' => 290.00,
            'is_available' => true,
        ]);
        $soldOutItem = MenuItem::query()->create([
            'category_id' => $category->id,
            'name' => 'Chicken Curry',
            'price' => 260.00,
            'is_available' => false,
        ]);

        $availableTable = Table::query()->create(['table_number' => 'T-02', 'capacity' => 2, 'status' => Table::STATUS_AVAILABLE]);
        $occupiedTable = Table::query()->create(['table_number' => 'T-03', 'capacity' => 4, 'status' => Table::STATUS_OCCUPIED]);

        Sanctum::actingAs($waiter);

        // Sold out item rejected, table remains available
        $this->postJson('/api/orders', [
            'table_id' => $availableTable->id,
            'items' => [
                ['menu_item_id' => $availableItem->id, 'quantity' => 1],
                ['menu_item_id' => $soldOutItem->id, 'quantity' => 1],
            ],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('items');

        $this->assertDatabaseHas('tables', ['id' => $availableTable->id, 'status' => Table::STATUS_AVAILABLE]);

        // Occupied table rejected when allow_occupied is not true
        $this->postJson('/api/orders', [
            'table_id' => $occupiedTable->id,
            'items' => [['menu_item_id' => $availableItem->id, 'quantity' => 1]],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('table_id');
    }

    public function test_cancellation_releases_table_only_when_no_other_active_orders_remain(): void
    {
        $waiter = User::factory()->waiter()->create();
        $category = Category::query()->create(['name' => 'Dishes', 'slug' => 'dishes']);
        $item = MenuItem::query()->create([
            'category_id' => $category->id,
            'name' => 'Adobo',
            'price' => 240.00,
            'is_available' => true,
        ]);
        $table = Table::query()->create(['table_number' => 'T-05', 'capacity' => 6, 'status' => Table::STATUS_AVAILABLE]);

        Sanctum::actingAs($waiter);

        // Create and pay Order 1
        $order1Id = $this->postJson('/api/orders', [
            'table_id' => $table->id,
            'items' => [['menu_item_id' => $item->id, 'quantity' => 1]],
        ])->assertCreated()->json('id');

        $this->postJson("/api/orders/{$order1Id}/pay", [
            'payment_method' => 'cash',
            'amount_paid' => 240.00,
        ])->assertOk();

        // Create unpaid Extra Food Order 2 on same table
        $order2Id = $this->postJson('/api/orders', [
            'table_id' => $table->id,
            'allow_occupied' => true,
            'items' => [['menu_item_id' => $item->id, 'quantity' => 1]],
        ])->assertCreated()->json('id');

        // Cancel Order 2 -> table MUST stay occupied because Order 1 is still active!
        $this->postJson("/api/orders/{$order2Id}/cancel", [
            'reason' => 'Guest changed mind on extra dish',
        ])->assertOk()
            ->assertJsonPath('status', Order::STATUS_CANCELLED)
            ->assertJsonPath('cancellation_reason', 'Guest changed mind on extra dish');

        $this->assertDatabaseHas('tables', [
            'id' => $table->id,
            'status' => Table::STATUS_OCCUPIED,
            'active_order_id' => $order1Id,
        ]);

        // Cancel Order 1 -> no active orders left, table returns to available!
        $this->postJson("/api/orders/{$order1Id}/cancel", [
            'reason' => 'Kitchen out of stock',
        ])->assertOk();

        $this->assertDatabaseHas('tables', [
            'id' => $table->id,
            'status' => Table::STATUS_AVAILABLE,
            'active_order_id' => null,
        ]);
    }

    public function test_invalid_status_jumps_backward_moves_wrong_roles_and_payment_validations(): void
    {
        $waiter = User::factory()->waiter()->create();
        $kitchen = User::factory()->kitchen()->create();
        $table = Table::query()->create(['table_number' => 'T-06', 'capacity' => 4, 'status' => Table::STATUS_OCCUPIED]);

        $order = Order::query()->create([
            'order_ref' => 'ORD-1050',
            'table_id' => $table->id,
            'user_id' => $waiter->id,
            'status' => Order::STATUS_PENDING,
            'payment_status' => Order::PAYMENT_UNPAID,
            'total' => 300.00,
        ]);

        Sanctum::actingAs($waiter);

        // Underpayment rejected
        $this->postJson("/api/orders/{$order->id}/pay", [
            'payment_method' => 'cash',
            'amount_paid' => 299.99,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('amount_paid');

        // Digital payment (gcash/card) must match exact total
        $this->postJson("/api/orders/{$order->id}/pay", [
            'payment_method' => 'gcash',
            'amount_paid' => 350.00,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('amount_paid');

        // Exact card payment succeeds
        $this->postJson("/api/orders/{$order->id}/pay", [
            'payment_method' => 'card',
            'amount_paid' => 300.00,
        ])->assertOk()
            ->assertJsonPath('payment_status', Order::PAYMENT_PAID)
            ->assertJsonPath('change_amount', '0.00');

        // Double payment rejected
        $this->postJson("/api/orders/{$order->id}/pay", [
            'payment_method' => 'cash',
            'amount_paid' => 300.00,
        ])->assertUnprocessable();

        // Waiter cannot move pending -> preparing (403)
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'preparing'])
            ->assertForbidden();

        // Invalid jump: pending -> ready (422)
        Sanctum::actingAs($kitchen);
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'ready'])
            ->assertUnprocessable();

        // Invalid jump: pending -> paid (422)
        Sanctum::actingAs($waiter);
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'paid'])
            ->assertUnprocessable();

        // Kitchen moves pending -> preparing
        Sanctum::actingAs($kitchen);
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'preparing'])->assertOk();

        // Backward move: preparing -> pending rejected (422)
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'pending'])
            ->assertUnprocessable();

        // Kitchen moves preparing -> ready
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'ready'])->assertOk();

        // Kitchen cannot move ready -> served (403)
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'served'])
            ->assertForbidden();
    }
}
