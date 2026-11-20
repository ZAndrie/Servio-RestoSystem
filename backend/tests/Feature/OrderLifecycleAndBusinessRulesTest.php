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

    public function test_full_order_lifecycle_total_computation_table_status_and_polling(): void
    {
        $waiter = User::factory()->waiter()->create();
        $kitchen = User::factory()->kitchen()->create();
        $admin = User::factory()->admin()->create();

        $category = Category::query()->create(['name' => 'Mains']);
        $adobo = MenuItem::query()->create([
            'category_id' => $category->id,
            'name' => 'Chicken Adobo',
            'price' => 185.50,
            'is_available' => true,
        ]);
        $tea = MenuItem::query()->create([
            'category_id' => $category->id,
            'name' => 'Iced Tea',
            'price' => 55.25,
            'is_available' => true,
        ]);
        $table = Table::query()->create([
            'table_number' => 'T1',
            'status' => Table::STATUS_AVAILABLE,
        ]);

        // 1. Waiter submits order (even if frontend tries to forge total = 1.00, backend computes 2*185.50 + 3*55.25 = 536.75)
        Sanctum::actingAs($waiter);
        $createResponse = $this->postJson('/api/orders', [
            'table_id' => $table->id,
            'total' => 1.00,
            'items' => [
                ['menu_item_id' => $adobo->id, 'quantity' => 2, 'notes' => 'extra sauce'],
                ['menu_item_id' => $tea->id, 'quantity' => 3, 'notes' => 'less ice'],
            ],
        ]);

        $createResponse->assertCreated()
            ->assertJsonPath('status', Order::STATUS_PENDING)
            ->assertJsonPath('total', '536.75')
            ->assertJsonPath('table.status', Table::STATUS_OCCUPIED);

        $orderId = $createResponse->json('id');

        // Table is now occupied in DB
        $this->assertDatabaseHas('tables', [
            'id' => $table->id,
            'status' => Table::STATUS_OCCUPIED,
        ]);

        // 2. Kitchen polls pending,preparing and sees the new order immediately
        Sanctum::actingAs($kitchen);
        $this->getJson('/api/orders?status=pending,preparing')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $orderId);

        // Kitchen moves pending -> preparing -> ready
        $this->patchJson("/api/orders/{$orderId}/status", ['status' => 'preparing'])
            ->assertOk()
            ->assertJsonPath('status', 'preparing');

        $this->patchJson("/api/orders/{$orderId}/status", ['status' => 'ready'])
            ->assertOk()
            ->assertJsonPath('status', 'ready');

        // 3. Waiter polls ready orders and marks served
        Sanctum::actingAs($waiter);
        $this->getJson('/api/orders?status=ready')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $orderId);

        $this->patchJson("/api/orders/{$orderId}/status", ['status' => 'served'])
            ->assertOk()
            ->assertJsonPath('status', 'served');

        // 4. Price change later does NOT affect the stored order total
        Sanctum::actingAs($admin);
        $this->putJson("/api/menu-items/{$adobo->id}", ['price' => 999.00])->assertOk();

        // 5. Waiter processes payment and receives exact change; table returns to available
        Sanctum::actingAs($waiter);
        $payResponse = $this->postJson("/api/orders/{$orderId}/pay", [
            'payment_method' => 'cash',
            'amount_paid' => 600.00,
        ]);

        $payResponse->assertOk()
            ->assertJsonPath('order.status', Order::STATUS_PAID)
            ->assertJsonPath('order.total', '536.75')
            ->assertJsonPath('order.amount_paid', '600.00')
            ->assertJsonPath('order.payment_method', 'cash')
            ->assertJsonPath('order.table.status', Table::STATUS_AVAILABLE)
            ->assertJsonPath('change', '63.25');

        $this->assertDatabaseHas('tables', [
            'id' => $table->id,
            'status' => Table::STATUS_AVAILABLE,
        ]);
    }

    public function test_sold_out_items_and_occupied_tables_are_rejected(): void
    {
        $waiter = User::factory()->waiter()->create();
        $category = Category::query()->create(['name' => 'Mains']);

        $availableItem = MenuItem::query()->create([
            'category_id' => $category->id,
            'name' => 'Sisig',
            'price' => 210.00,
            'is_available' => true,
        ]);
        $soldOutItem = MenuItem::query()->create([
            'category_id' => $category->id,
            'name' => 'Bulalo',
            'price' => 350.00,
            'is_available' => false,
        ]);

        $availableTable = Table::query()->create(['table_number' => 'T2', 'status' => Table::STATUS_AVAILABLE]);
        $occupiedTable = Table::query()->create(['table_number' => 'T3', 'status' => Table::STATUS_OCCUPIED]);

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

        $this->assertDatabaseHas('tables', [
            'id' => $availableTable->id,
            'status' => Table::STATUS_AVAILABLE,
        ]);

        // Occupied table rejected
        $this->postJson('/api/orders', [
            'table_id' => $occupiedTable->id,
            'items' => [
                ['menu_item_id' => $availableItem->id, 'quantity' => 1],
            ],
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('table_id');
    }

    public function test_invalid_status_jumps_backward_moves_and_wrong_role_transitions_are_rejected(): void
    {
        $waiter = User::factory()->waiter()->create();
        $kitchen = User::factory()->kitchen()->create();
        $table = Table::query()->create(['table_number' => 'T4', 'status' => Table::STATUS_OCCUPIED]);

        $order = Order::query()->create([
            'table_id' => $table->id,
            'user_id' => $waiter->id,
            'status' => Order::STATUS_PENDING,
            'total' => 200.00,
        ]);

        // Invalid jump: pending -> paid via status endpoint
        Sanctum::actingAs($waiter);
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'paid'])
            ->assertUnprocessable();

        // Invalid jump: pending -> ready
        Sanctum::actingAs($kitchen);
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'ready'])
            ->assertUnprocessable();

        // Invalid jump: paying a pending order directly via /pay
        Sanctum::actingAs($waiter);
        $this->postJson("/api/orders/{$order->id}/pay", [
            'payment_method' => 'cash',
            'amount_paid' => 250.00,
        ])->assertUnprocessable();

        // Wrong role for valid next step: waiter cannot move pending -> preparing
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'preparing'])
            ->assertForbidden();

        // Kitchen moves pending -> preparing
        Sanctum::actingAs($kitchen);
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'preparing'])->assertOk();

        // Backward move: preparing -> pending rejected
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'pending'])
            ->assertUnprocessable();

        // Kitchen moves preparing -> ready
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'ready'])->assertOk();

        // Wrong role: kitchen cannot move ready -> served
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'served'])
            ->assertForbidden();
    }

    public function test_underpayment_and_double_payment_are_rejected(): void
    {
        $waiter = User::factory()->waiter()->create();
        $table = Table::query()->create(['table_number' => 'T5', 'status' => Table::STATUS_OCCUPIED]);

        $order = Order::query()->create([
            'table_id' => $table->id,
            'user_id' => $waiter->id,
            'status' => Order::STATUS_SERVED,
            'total' => 300.00,
        ]);

        Sanctum::actingAs($waiter);

        // Underpayment rejected
        $this->postJson("/api/orders/{$order->id}/pay", [
            'payment_method' => 'gcash',
            'amount_paid' => 299.99,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('amount_paid');

        // Exact payment succeeds
        $this->postJson("/api/orders/{$order->id}/pay", [
            'payment_method' => 'gcash',
            'amount_paid' => 300.00,
        ])->assertOk()
            ->assertJsonPath('change', '0.00');

        // Paying again is rejected
        $this->postJson("/api/orders/{$order->id}/pay", [
            'payment_method' => 'cash',
            'amount_paid' => 300.00,
        ])->assertUnprocessable();
    }
}
