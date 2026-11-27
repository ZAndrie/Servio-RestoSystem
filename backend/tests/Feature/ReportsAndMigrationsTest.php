<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Table;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReportsAndMigrationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_daily_report_and_dashboard_count_paid_non_cancelled_orders_accurately(): void
    {
        $admin = User::factory()->admin()->create();
        $waiter = User::factory()->waiter()->create();

        $category = Category::query()->create(['name' => 'Dishes', 'slug' => 'dishes']);
        $adobo = MenuItem::query()->create([
            'category_id' => $category->id,
            'name' => 'Chicken Adobo',
            'price' => 240.00,
            'is_available' => true,
        ]);
        $t1 = Table::query()->create(['table_number' => 'T-01', 'capacity' => 2, 'status' => Table::STATUS_AVAILABLE]);
        $t2 = Table::query()->create(['table_number' => 'T-02', 'capacity' => 4, 'status' => Table::STATUS_OCCUPIED]);

        // Paid & completed today (cash)
        $paidCash = Order::query()->create([
            'order_ref' => 'ORD-1001',
            'table_id' => $t1->id,
            'user_id' => $waiter->id,
            'status' => Order::STATUS_PAID,
            'payment_status' => Order::PAYMENT_PAID,
            'total' => 480.00,
            'payment_method' => Order::PAYMENT_CASH,
            'amount_paid' => 500.00,
            'paid_at' => now(),
        ]);
        OrderItem::query()->create([
            'order_id' => $paidCash->id,
            'menu_item_id' => $adobo->id,
            'unit_price' => 240.00,
            'quantity' => 2,
        ]);

        // Paid today & still cooking in KDS (gcash) — still counts in Pay-First today's revenue!
        $paidCooking = Order::query()->create([
            'order_ref' => 'ORD-1002',
            'table_id' => $t2->id,
            'user_id' => $waiter->id,
            'status' => Order::STATUS_PREPARING,
            'payment_status' => Order::PAYMENT_PAID,
            'total' => 240.00,
            'payment_method' => Order::PAYMENT_GCASH,
            'amount_paid' => 240.00,
            'paid_at' => now(),
        ]);
        OrderItem::query()->create([
            'order_id' => $paidCooking->id,
            'menu_item_id' => $adobo->id,
            'unit_price' => 240.00,
            'quantity' => 1,
        ]);

        // Cancelled order today — excluded from revenue, counted in cancelled_orders_count
        Order::query()->create([
            'order_ref' => 'ORD-1003',
            'table_id' => $t1->id,
            'user_id' => $waiter->id,
            'status' => Order::STATUS_CANCELLED,
            'payment_status' => Order::PAYMENT_PAID,
            'total' => 500.00,
            'payment_method' => Order::PAYMENT_CASH,
            'amount_paid' => 500.00,
            'cancellation_reason' => 'Refunded',
            'paid_at' => now(),
        ]);

        // Unpaid draft order today — excluded from revenue
        Order::query()->create([
            'order_ref' => 'ORD-1004',
            'table_id' => $t2->id,
            'user_id' => $waiter->id,
            'status' => Order::STATUS_PENDING,
            'payment_status' => Order::PAYMENT_UNPAID,
            'total' => 240.00,
        ]);

        // Paid yesterday — excluded from today's report
        Order::query()->create([
            'order_ref' => 'ORD-1005',
            'table_id' => $t1->id,
            'user_id' => $waiter->id,
            'status' => Order::STATUS_PAID,
            'payment_status' => Order::PAYMENT_PAID,
            'total' => 999.00,
            'payment_method' => Order::PAYMENT_CARD,
            'amount_paid' => 999.00,
            'paid_at' => now()->subDay(),
        ]);

        Sanctum::actingAs($admin);

        $today = now(config('app.timezone', 'Asia/Manila'))->toDateString();
        $this->getJson("/api/reports/daily?date={$today}")
            ->assertOk()
            ->assertJsonPath('date', $today)
            ->assertJsonPath('timezone', 'Asia/Manila')
            ->assertJsonPath('summary.total_sales', '720.00')
            ->assertJsonPath('summary.order_count', 2)
            ->assertJsonPath('summary.average_order_value', '360.00')
            ->assertJsonPath('summary.cancelled_orders_count', 1)
            ->assertJsonPath('summary.by_payment_method.cash.count', 1)
            ->assertJsonPath('summary.by_payment_method.cash.total', '480.00')
            ->assertJsonPath('summary.by_payment_method.gcash.count', 1)
            ->assertJsonPath('summary.by_payment_method.gcash.total', '240.00')
            ->assertJsonPath('items_sold.0.quantity_sold', 3)
            ->assertJsonPath('items_sold.0.revenue', '720.00');

        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('today_sales', '720.00')
            ->assertJsonPath('paid_orders_today', 2)
            ->assertJsonPath('unpaid_orders_count', 1)
            ->assertJsonPath('orders_by_status.preparing', 1)
            ->assertJsonPath('orders_by_status.unpaid', 1)
            ->assertJsonPath('tables.total', 2)
            ->assertJsonPath('tables.available', 1)
            ->assertJsonPath('tables.occupied', 1);
    }

    public function test_seeders_create_frontend_aligned_users_tables_and_21_menu_items_idempotently(): void
    {
        $this->seed(DatabaseSeeder::class);
        $this->seed(DatabaseSeeder::class);

        $this->assertSame(5, User::query()->count());
        $this->assertDatabaseHas('users', ['username' => 'admin', 'role' => 'admin', 'is_active' => true]);
        $this->assertDatabaseHas('users', ['username' => 'waiter', 'role' => 'waiter', 'is_active' => true]);
        $this->assertDatabaseHas('users', ['username' => 'kitchen', 'role' => 'kitchen', 'is_active' => true]);
        $this->assertDatabaseHas('users', ['username' => 'kitchen_liza', 'is_active' => false]);

        $this->assertSame(10, Table::query()->count());
        $this->assertDatabaseHas('tables', ['table_number' => 'T-01', 'capacity' => 2]);
        $this->assertDatabaseHas('tables', ['table_number' => 'T-10', 'capacity' => 8]);

        $this->assertSame(3, Category::query()->count());
        $this->assertSame(21, MenuItem::query()->count());
        $this->assertDatabaseHas('menu_items', ['name' => 'Chicken Curry', 'is_available' => false]);
        $this->assertDatabaseHas('menu_items', ['name' => 'Sinigang na Baboy', 'is_popular' => true]);
    }

    public function test_migrations_can_be_rolled_back_and_re_migrated_cleanly(): void
    {
        $tables = ['users', 'categories', 'menu_items', 'tables', 'orders', 'order_items'];

        foreach ($tables as $table) {
            $this->assertTrue(Schema::hasTable($table), "Expected table '{$table}' to exist.");
        }

        Artisan::call('migrate:reset');

        foreach ($tables as $table) {
            $this->assertFalse(Schema::hasTable($table), "Expected table '{$table}' to be dropped after rollback.");
        }

        Artisan::call('migrate');

        foreach ($tables as $table) {
            $this->assertTrue(Schema::hasTable($table), "Expected table '{$table}' to exist after re-migrate.");
        }
    }
}
