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

    public function test_daily_report_and_dashboard_return_accurate_aggregates(): void
    {
        $admin = User::factory()->admin()->create();
        $waiter = User::factory()->waiter()->create();

        $category = Category::query()->create(['name' => 'Mains']);
        $adobo = MenuItem::query()->create([
            'category_id' => $category->id,
            'name' => 'Adobo',
            'price' => 150.00,
            'is_available' => true,
        ]);
        $t1 = Table::query()->create(['table_number' => 'T1', 'status' => Table::STATUS_AVAILABLE]);
        $t2 = Table::query()->create(['table_number' => 'T2', 'status' => Table::STATUS_OCCUPIED]);

        // Paid today (cash)
        $paidCash = Order::query()->create([
            'table_id' => $t1->id,
            'user_id' => $waiter->id,
            'status' => Order::STATUS_PAID,
            'total' => 300.00,
            'payment_method' => Order::PAYMENT_CASH,
            'amount_paid' => 500.00,
            'paid_at' => now(),
        ]);
        OrderItem::query()->create([
            'order_id' => $paidCash->id,
            'menu_item_id' => $adobo->id,
            'quantity' => 2,
        ]);

        // Paid today (gcash)
        $paidGcash = Order::query()->create([
            'table_id' => $t1->id,
            'user_id' => $waiter->id,
            'status' => Order::STATUS_PAID,
            'total' => 150.00,
            'payment_method' => Order::PAYMENT_GCASH,
            'amount_paid' => 150.00,
            'paid_at' => now(),
        ]);
        OrderItem::query()->create([
            'order_id' => $paidGcash->id,
            'menu_item_id' => $adobo->id,
            'quantity' => 1,
        ]);

        // Paid yesterday (excluded from today's report)
        Order::query()->create([
            'table_id' => $t1->id,
            'user_id' => $waiter->id,
            'status' => Order::STATUS_PAID,
            'total' => 999.00,
            'payment_method' => Order::PAYMENT_CARD,
            'amount_paid' => 999.00,
            'paid_at' => now()->subDay(),
        ]);

        // Active pending order on T2
        Order::query()->create([
            'table_id' => $t2->id,
            'user_id' => $waiter->id,
            'status' => Order::STATUS_PENDING,
            'total' => 150.00,
        ]);

        Sanctum::actingAs($admin);

        // Daily sales report for today
        $today = now()->toDateString();
        $this->getJson("/api/reports/daily?date={$today}")
            ->assertOk()
            ->assertJsonPath('date', $today)
            ->assertJsonPath('summary.total_sales', '450.00')
            ->assertJsonPath('summary.order_count', 2)
            ->assertJsonPath('summary.average_order_value', '225.00')
            ->assertJsonPath('summary.by_payment_method.cash.count', 1)
            ->assertJsonPath('summary.by_payment_method.cash.total', '300.00')
            ->assertJsonPath('summary.by_payment_method.gcash.count', 1)
            ->assertJsonPath('summary.by_payment_method.gcash.total', '150.00')
            ->assertJsonPath('summary.by_payment_method.card.count', 0)
            ->assertJsonPath('items_sold.0.quantity_sold', 3);

        // Dashboard metrics
        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('today_sales', '450.00')
            ->assertJsonPath('paid_orders_today', 2)
            ->assertJsonPath('active_orders_count', 1)
            ->assertJsonPath('orders_by_status.pending', 1)
            ->assertJsonPath('orders_by_status.paid_today', 2)
            ->assertJsonPath('tables.total', 2)
            ->assertJsonPath('tables.available', 1)
            ->assertJsonPath('tables.occupied', 1);
    }

    public function test_seeders_create_default_users_tables_and_menu_idempotently(): void
    {
        $this->seed(DatabaseSeeder::class);
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseHas('users', ['username' => 'admin', 'role' => 'admin']);
        $this->assertDatabaseHas('users', ['username' => 'waiter', 'role' => 'waiter']);
        $this->assertDatabaseHas('users', ['username' => 'kitchen', 'role' => 'kitchen']);
        $this->assertSame(10, Table::query()->count());
        $this->assertSame(4, Category::query()->count());
        $this->assertGreaterThanOrEqual(10, MenuItem::query()->count());
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
