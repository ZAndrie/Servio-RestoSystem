<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthAndRoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_fetch_profile_change_password_and_logout(): void
    {
        $user = User::factory()->admin()->mustChangePassword()->create([
            'name' => 'Maria Santos',
            'username' => 'admin',
            'password' => 'secret123',
        ]);

        $loginResponse = $this->postJson('/api/login', [
            'username' => 'admin',
            'password' => 'secret123',
        ]);

        $loginResponse->assertOk()
            ->assertJsonStructure([
                'token',
                'token_type',
                'user' => ['id', 'name', 'username', 'role', 'is_active', 'must_change_password'],
            ])
            ->assertJsonPath('user.username', 'admin')
            ->assertJsonPath('user.is_active', true)
            ->assertJsonPath('user.must_change_password', true);

        $token = $loginResponse->json('token');

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('user.username', 'admin');

        // First-login mandatory password change clears must_change_password
        $this->withToken($token)
            ->postJson('/api/change-password', ['password' => 'newpass456'])
            ->assertOk()
            ->assertJsonPath('user.must_change_password', false);

        $this->assertTrue(Hash::check('newpass456', $user->fresh()->password));
        $this->assertFalse($user->fresh()->must_change_password);

        $this->withToken($token)
            ->postJson('/api/logout')
            ->assertOk();

        $this->app['auth']->forgetGuards();

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertUnauthorized();
    }

    public function test_inactive_user_login_is_rejected_with_403(): void
    {
        User::factory()->kitchen()->inactive()->create([
            'username' => 'kitchen_liza',
            'password' => 'kitchen123',
        ]);

        $this->postJson('/api/login', [
            'username' => 'kitchen_liza',
            'password' => 'kitchen123',
        ])->assertForbidden()
            ->assertJsonStructure(['message']);
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
        $this->postJson('/api/change-password', ['password' => 'newpass123'])->assertUnauthorized();
    }

    public function test_role_access_matrix_enforces_frontend_rbac(): void
    {
        $admin = User::factory()->admin()->create();
        $waiter = User::factory()->waiter()->create();
        $kitchen = User::factory()->kitchen()->create();

        $category = Category::query()->create(['name' => 'Dishes', 'slug' => 'dishes']);
        $menuItem = MenuItem::query()->create([
            'category_id' => $category->id,
            'name' => 'Adobo',
            'price' => 240.00,
            'is_available' => true,
        ]);
        $table = Table::query()->create([
            'table_number' => 'T-01',
            'capacity' => 4,
            'status' => Table::STATUS_AVAILABLE,
        ]);
        $order = Order::query()->create([
            'order_ref' => 'ORD-1001',
            'table_id' => $table->id,
            'user_id' => $waiter->id,
            'status' => Order::STATUS_PENDING,
            'payment_status' => Order::PAYMENT_UNPAID,
            'total' => 240.00,
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
        // Waiter CAN access tables, menu, orders, dashboard
        $this->getJson('/api/categories')->assertOk();
        $this->getJson('/api/menu-items')->assertOk();
        $this->getJson('/api/tables')->assertOk();
        $this->getJson('/api/dashboard')->assertOk();

        // Kitchen cannot access admin, tables, POS order creation, payment, cancel, dashboard, or reports
        Sanctum::actingAs($kitchen);
        $this->getJson('/api/users')->assertForbidden();
        $this->getJson('/api/tables')->assertForbidden();
        $this->patchJson("/api/tables/{$table->id}/release")->assertForbidden();
        $this->getJson('/api/dashboard')->assertForbidden();
        $this->getJson('/api/reports/daily')->assertForbidden();
        $this->postJson('/api/orders', [
            'table_id' => $table->id,
            'items' => [['menu_item_id' => $menuItem->id, 'quantity' => 1]],
        ])->assertForbidden();
        $this->postJson("/api/orders/{$order->id}/pay", [
            'payment_method' => 'cash',
            'amount_paid' => 240,
        ])->assertForbidden();
        $this->postJson("/api/orders/{$order->id}/cancel", [
            'reason' => 'Not allowed for kitchen',
        ])->assertForbidden();
        // Kitchen CAN read orders, categories, menu items
        $this->getJson('/api/orders')->assertOk();
        $this->getJson('/api/categories')->assertOk();
        $this->getJson('/api/menu-items')->assertOk();

        // Admin has full operational access across admin, floor, POS, and KDS
        Sanctum::actingAs($admin);
        $this->getJson('/api/users')->assertOk();
        $this->getJson('/api/reports/daily')->assertOk();
        $this->getJson('/api/dashboard')->assertOk();
        $this->getJson('/api/tables')->assertOk();
        $this->getJson('/api/orders')->assertOk();
    }

    public function test_must_change_password_blocks_operational_routes_and_voluntary_change_requires_current_password(): void
    {
        $staff = User::factory()->waiter()->mustChangePassword()->create([
            'username' => 'temp_waiter',
            'password' => 'temp123',
        ]);

        $tokenA = $staff->createToken('tablet-a')->plainTextToken;
        $tokenB = $staff->createToken('tablet-b')->plainTextToken;

        // Operational endpoints blocked until temporary password is changed
        $this->withToken($tokenA)->getJson('/api/orders')->assertForbidden()
            ->assertJsonPath('must_change_password', true);
        $this->withToken($tokenA)->getJson('/api/menu-items')->assertForbidden();
        $this->withToken($tokenA)->getJson('/api/tables')->assertForbidden();

        // /me and /change-password remain accessible without current_password during first-login change
        $this->withToken($tokenA)->getJson('/api/me')->assertOk();
        $this->withToken($tokenA)->postJson('/api/change-password', [
            'password' => 'firstpass123',
        ])->assertOk()
            ->assertJsonPath('user.must_change_password', false);

        // Other active tokens were revoked when password changed
        $this->app['auth']->forgetGuards();
        $this->withToken($tokenB)->getJson('/api/me')->assertUnauthorized();

        // Current token now passes operational endpoints
        $this->app['auth']->forgetGuards();
        $this->withToken($tokenA)->getJson('/api/menu-items')->assertOk();

        // Voluntary password change now requires current_password
        $this->withToken($tokenA)->postJson('/api/change-password', [
            'password' => 'secondpass123',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('current_password');

        $this->withToken($tokenA)->postJson('/api/change-password', [
            'current_password' => 'wrongpass',
            'password' => 'secondpass123',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('current_password');

        $tokenC = $staff->fresh()->createToken('tablet-c')->plainTextToken;

        $this->withToken($tokenA)->postJson('/api/change-password', [
            'current_password' => 'firstpass123',
            'password' => 'secondpass123',
        ])->assertOk();

        $this->assertTrue(Hash::check('secondpass123', $staff->fresh()->password));
        $this->app['auth']->forgetGuards();
        $this->withToken($tokenC)->getJson('/api/me')->assertUnauthorized();
    }

    public function test_inactive_user_with_existing_token_is_blocked_on_all_authenticated_routes(): void
    {
        $waiter = User::factory()->waiter()->create();
        $token = $waiter->createToken('existing')->plainTextToken;

        // Simulate deactivation without token revocation
        $waiter->update(['is_active' => false]);

        $this->withToken($token)->getJson('/api/me')->assertForbidden();
        $this->withToken($token)->getJson('/api/categories')->assertForbidden();
        $this->withToken($token)->getJson('/api/menu-items')->assertForbidden();
    }

    public function test_login_endpoint_is_rate_limited(): void
    {
        User::factory()->waiter()->create([
            'username' => 'throttled_user',
            'password' => 'correctpass',
        ]);

        for ($i = 0; $i < 10; $i++) {
            $this->postJson('/api/login', [
                'username' => 'throttled_user',
                'password' => 'wrongpass',
            ])->assertUnauthorized();
        }

        $this->postJson('/api/login', [
            'username' => 'throttled_user',
            'password' => 'wrongpass',
        ])->assertTooManyRequests();
    }
}
