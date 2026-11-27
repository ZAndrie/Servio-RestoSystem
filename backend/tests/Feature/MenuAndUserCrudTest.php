<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Table;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MenuAndUserCrudTest extends TestCase
{
    use RefreshDatabase;

    private function fakePngUpload(string $filename = 'dish.png'): UploadedFile
    {
        // Minimal valid 1x1 PNG binary (works even without PHP GD extension).
        $pngBytes = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
        );

        return UploadedFile::fake()->createWithContent($filename, $pngBytes);
    }

    public function test_admin_can_manage_staff_toggle_active_and_reset_password(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        // Creating a staff member defaults is_active=true and must_change_password=true
        $createResponse = $this->postJson('/api/users', [
            'name' => 'New Waiter',
            'username' => 'waiter_new',
            'password' => 'temp1234',
            'role' => 'waiter',
        ]);

        $createResponse->assertCreated()
            ->assertJsonPath('username', 'waiter_new')
            ->assertJsonPath('role', 'waiter')
            ->assertJsonPath('is_active', true)
            ->assertJsonPath('must_change_password', true)
            ->assertJsonMissingPath('password');

        $userId = $createResponse->json('id');
        $staff = User::query()->findOrFail($userId);
        $this->assertTrue(Hash::check('temp1234', $staff->password));

        // Issue a token for the staff member, then deactivate them -> token should be revoked
        $staffToken = $staff->createToken('test-token')->plainTextToken;
        $this->assertSame(1, $staff->tokens()->count());

        $this->patchJson("/api/users/{$userId}/toggle-active")
            ->assertOk()
            ->assertJsonPath('is_active', false);

        $this->assertSame(0, $staff->fresh()->tokens()->count());

        // Self-deactivation blocked
        $this->patchJson("/api/users/{$admin->id}/toggle-active")->assertUnprocessable();

        // Re-activate staff member
        $this->patchJson("/api/users/{$userId}/toggle-active")
            ->assertOk()
            ->assertJsonPath('is_active', true);

        // Reset temporary password sets must_change_password=true
        $staff->update(['must_change_password' => false]);
        $this->postJson("/api/users/{$userId}/reset-password", [
            'password' => 'reset999',
        ])->assertOk()
            ->assertJsonPath('user.must_change_password', true);

        $this->assertTrue(Hash::check('reset999', $staff->fresh()->password));
        $this->assertNotEmpty($staffToken);

        // Self-delete blocked; deleting other user works
        $this->deleteJson("/api/users/{$admin->id}")->assertUnprocessable();
        $this->deleteJson("/api/users/{$userId}")->assertOk();
        $this->assertDatabaseMissing('users', ['id' => $userId]);
    }

    public function test_admin_can_crud_categories_menu_items_toggle_availability_and_upload_dish_photos(): void
    {
        Storage::fake('public');

        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        // Category CRUD (auto slug)
        $catResponse = $this->postJson('/api/categories', ['name' => 'Chef Specials']);
        $catResponse->assertCreated()
            ->assertJsonPath('name', 'Chef Specials')
            ->assertJsonPath('slug', 'chef-specials');
        $categoryId = $catResponse->json('id');

        // Multipart dish creation with image upload
        $createResponse = $this->post('/api/menu-items', [
            'category_id' => $categoryId,
            'name' => 'Sinigang na Baboy',
            'description' => 'Tender pork ribs in tamarind broth.',
            'price' => '345.00',
            'is_popular' => '1',
            'image' => $this->fakePngUpload('sinigang.png'),
        ], ['Accept' => 'application/json']);

        $createResponse->assertCreated()
            ->assertJsonPath('name', 'Sinigang na Baboy')
            ->assertJsonPath('price', '345.00')
            ->assertJsonPath('is_available', true)
            ->assertJsonPath('is_popular', true);

        $itemId = $createResponse->json('id');
        /** @var MenuItem $createdItem */
        $createdItem = MenuItem::query()->findOrFail($itemId);
        $firstRawPath = $createdItem->getRawImagePath();
        $this->assertNotNull($firstRawPath);
        $this->assertStringStartsWith('/storage/menu/', $firstRawPath);
        Storage::disk('public')->assertExists(substr($firstRawPath, strlen('/storage/')));

        // Cannot delete category while menu items exist
        $this->deleteJson("/api/categories/{$categoryId}")->assertStatus(409);

        // Empty-body availability toggle flips true -> false -> true
        $this->patchJson("/api/menu-items/{$itemId}/availability")
            ->assertOk()
            ->assertJsonPath('is_available', false);

        $this->patchJson("/api/menu-items/{$itemId}/availability", ['is_available' => true])
            ->assertOk()
            ->assertJsonPath('is_available', true);

        // Multipart update using Laravel _method=PUT replaces old file cleanly
        $updateResponse = $this->post("/api/menu-items/{$itemId}", [
            '_method' => 'PUT',
            'name' => 'Sinigang Special',
            'price' => '360.00',
            'image' => $this->fakePngUpload('sinigang-new.png'),
        ], ['Accept' => 'application/json']);

        $updateResponse->assertOk()
            ->assertJsonPath('name', 'Sinigang Special')
            ->assertJsonPath('price', '360.00');

        $secondRawPath = $createdItem->fresh()->getRawImagePath();
        $this->assertNotSame($firstRawPath, $secondRawPath);
        Storage::disk('public')->assertMissing(substr($firstRawPath, strlen('/storage/')));
        Storage::disk('public')->assertExists(substr($secondRawPath, strlen('/storage/')));

        // JSON update with remove_image=true deletes stored photo and clears column
        $this->putJson("/api/menu-items/{$itemId}", [
            'name' => 'Sinigang Special',
            'remove_image' => true,
        ])->assertOk()
            ->assertJsonPath('image', null);

        Storage::disk('public')->assertMissing(substr($secondRawPath, strlen('/storage/')));

        // Delete item then category
        $this->deleteJson("/api/menu-items/{$itemId}")->assertOk();
        $this->deleteJson("/api/categories/{$categoryId}")->assertOk();
        $this->assertDatabaseMissing('categories', ['id' => $categoryId]);
    }

    public function test_admin_update_prevents_self_role_demotion_and_revokes_tokens_on_role_or_password_change(): void
    {
        $admin = User::factory()->admin()->create();
        $staff = User::factory()->waiter()->create(['must_change_password' => false]);
        $staff->createToken('staff-session');

        Sanctum::actingAs($admin);

        // Admin cannot demote their own role
        $this->putJson("/api/users/{$admin->id}", ['role' => 'waiter'])
            ->assertUnprocessable();
        $this->assertSame(User::ROLE_ADMIN, $admin->fresh()->role);

        // Changing another user's role revokes their active tokens
        $this->putJson("/api/users/{$staff->id}", ['role' => 'kitchen'])
            ->assertOk()
            ->assertJsonPath('role', 'kitchen');
        $this->assertSame(0, $staff->fresh()->tokens()->count());

        // Overwriting another user's password via PUT revokes tokens and forces password change
        $staff->createToken('staff-session-2');
        $this->putJson("/api/users/{$staff->id}", ['password' => 'adminreset123'])
            ->assertOk()
            ->assertJsonPath('must_change_password', true);
        $this->assertSame(0, $staff->fresh()->tokens()->count());
        $this->assertTrue(Hash::check('adminreset123', $staff->fresh()->password));
    }

    public function test_category_slug_collisions_return_422_and_menu_images_are_protected(): void
    {
        Storage::fake('public');

        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $cat1 = $this->postJson('/api/categories', ['name' => 'Chef Specials'])
            ->assertCreated()
            ->json('id');

        // Distinct name with identical slug returns 422 instead of 500
        $this->postJson('/api/categories', ['name' => 'Chef-Specials'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('slug');

        $cat2 = $this->postJson('/api/categories', ['name' => 'Drinks'])
            ->assertCreated()
            ->json('id');

        $this->putJson("/api/categories/{$cat2}", ['name' => 'Chef_Specials'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('slug');

        // Direct /storage/... string injection is rejected on create
        $this->postJson('/api/menu-items', [
            'category_id' => $cat1,
            'name' => 'Forged Photo Dish',
            'price' => 150,
            'image' => '/storage/menu/other-dish.png',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('image');

        // Create item with real uploaded photo
        $created = $this->post('/api/menu-items', [
            'category_id' => $cat1,
            'name' => 'Kare-Kare',
            'price' => '360.00',
            'image' => $this->fakePngUpload('karekare.png'),
        ], ['Accept' => 'application/json'])->assertCreated();

        $itemId = $created->json('id');
        /** @var MenuItem $menuItem */
        $menuItem = MenuItem::query()->findOrFail($itemId);
        $rawPath = $menuItem->getRawImagePath();
        $resolvedUrl = $created->json('image');
        $this->assertNotNull($rawPath);

        // Echoing back the item's own resolved image URL during a JSON update succeeds and preserves raw /storage/... path
        $this->putJson("/api/menu-items/{$itemId}", [
            'name' => 'Kare-Kare Deluxe',
            'price' => 380.00,
            'image' => $resolvedUrl,
        ])->assertOk();
        $this->assertSame($rawPath, $menuItem->fresh()->getRawImagePath());

        // Referencing the item in an order blocks deletion with 409 AND preserves the stored image
        $table = Table::query()->create(['table_number' => 'T-99', 'capacity' => 4, 'status' => Table::STATUS_OCCUPIED]);
        $order = Order::query()->create([
            'order_ref' => 'ORD-1999',
            'table_id' => $table->id,
            'user_id' => $admin->id,
            'status' => Order::STATUS_PENDING,
            'payment_status' => Order::PAYMENT_UNPAID,
            'total' => 380.00,
        ]);
        OrderItem::query()->create([
            'order_id' => $order->id,
            'menu_item_id' => $itemId,
            'unit_price' => 380.00,
            'quantity' => 1,
        ]);

        $this->deleteJson("/api/menu-items/{$itemId}")->assertStatus(409);
        Storage::disk('public')->assertExists(substr($rawPath, strlen('/storage/')));
    }
}
