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

class AuthAndRoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_fetch_profile_and_logout(): void
    {
        User::factory()->admin()->create([
            'name' => 'Admin User',
            'username' => 'admin',
            'password' => 'secret123',
        ]);

        $loginResponse = $this->postJson('/api/login', [
            'username' => 'admin',
            'password' => 'secret123',
        ]);

        $loginResponse->assertOk()
            ->assertJsonStructure(['token', 'token_type', 'user' => ['id', 'name', 'username', 'role']])
            ->assertJsonPath('user.username', 'admin')
            ->assertJsonPath('user.role', 'admin');

        $token = $loginResponse->json('token');

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('user.username', 'admin');

        $this->withToken($token)
            ->postJson('/api/logout')
            ->assertOk();

        // Reset auth guard cache to verify token is revoked in DB.
        $this->app['auth']->forgetGuards();

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertUnauthorized();
    }

    public function test_invalid_login_credentials_are_rejected(): void
    {
        User::factory()->waiter()->create([
            'username' => 'waiter1',
            'password' => 'correctpass',
        ]);

        $this->postJson('/api/login', [
            'username' => 'waiter1',
            'password' => 'wrongpass',
        ])->assertUnauthorized();
    }

    public function test_unauthenticated_requests_are_blocked_on_protected_endpoints(): void
    {
        $this->getJson('/api/users')->assertUnauthorized();
        $this->getJson('/api/categories')->assertUnauthorized();
        $this->getJson('/api/menu-items')->assertUnauthorized();
        $this->getJson('/api/tables')->assertUnauthorized();
        $this->getJson('/api/orders')->assertUnauthorized();
        $this->getJson('/api/dashboard')->assertUnauthorized();
        $this->getJson('/api/reports/daily')->assertUnauthorized();
    }

    public function test_role_access_matrix_blocks_unauthorized_roles(): void
    {
        $admin = User::factory()->admin()->create();
        $waiter = User::factory()->waiter()->create();
        $kitchen = User::factory()->kitchen()->create();

        $category = Category::query()->create(['name' => 'Mains']);
        $menuItem = MenuItem::query()->create([
            'category_id' => $category->id,
            'name' => 'Adobo',
            'price' => 150.00,
            'is_available' => true,
        ]);
        $table = Table::query()->create(['table_number' => 'T1', 'status' => Table::STATUS_AVAILABLE]);
        $order = Order::query()->create([
            'table_id' => $table->id,
            'user_id' => $waiter->id,
            'status' => Order::STATUS_SERVED,
            'total' => 150.00,
        ]);

        // Waiter cannot access admin-only endpoints
        Sanctum::actingAs($waiter);
        $this->getJson('/api/users')->assertForbidden();
        $this->postJson('/api/categories', ['name' => 'Blocked'])->assertForbidden();
        $this->postJson('/api/menu-items', [
            'category_id' => $category->id,
            'name' => 'Blocked Item',
            'price' => 50,
        ])->assertForbidden();
        $this->patchJson("/api/menu-items/{$menuItem->id}/availability", ['is_available' => false])->assertForbidden();
        $this->getJson('/api/reports/daily')->assertForbidden();
        // Waiter CAN read categories, menu items, tables, dashboard
        $this->getJson('/api/categories')->assertOk();
        $this->getJson('/api/menu-items')->assertOk();
        $this->getJson('/api/tables')->assertOk();
        $this->getJson('/api/dashboard')->assertOk();

        // Kitchen cannot access admin, waiter order creation, tables, dashboard, reports, or payment
        Sanctum::actingAs($kitchen);
        $this->getJson('/api/users')->assertForbidden();
        $this->getJson('/api/tables')->assertForbidden();
        $this->getJson('/api/dashboard')->assertForbidden();
        $this->getJson('/api/reports/daily')->assertForbidden();
        $this->postJson('/api/orders', [
            'table_id' => $table->id,
            'items' => [['menu_item_id' => $menuItem->id, 'quantity' => 1]],
        ])->assertForbidden();
        $this->postJson("/api/orders/{$order->id}/pay", [
            'payment_method' => 'cash',
            'amount_paid' => 200,
        ])->assertForbidden();
        // Kitchen CAN read orders, categories, menu items
        $this->getJson('/api/orders')->assertOk();
        $this->getJson('/api/categories')->assertOk();
        $this->getJson('/api/menu-items')->assertOk();

        // Admin cannot create orders, update kitchen/waiter order status, or process payment
        Sanctum::actingAs($admin);
        $this->postJson('/api/orders', [
            'table_id' => $table->id,
            'items' => [['menu_item_id' => $menuItem->id, 'quantity' => 1]],
        ])->assertForbidden();
        $this->patchJson("/api/orders/{$order->id}/status", ['status' => 'preparing'])->assertForbidden();
        $this->postJson("/api/orders/{$order->id}/pay", [
            'payment_method' => 'cash',
            'amount_paid' => 200,
        ])->assertForbidden();
        // Admin CAN access users, reports, dashboard, tables, orders
        $this->getJson('/api/users')->assertOk();
        $this->getJson('/api/reports/daily')->assertOk();
        $this->getJson('/api/dashboard')->assertOk();
        $this->getJson('/api/tables')->assertOk();
        $this->getJson('/api/orders')->assertOk();
    }
}
