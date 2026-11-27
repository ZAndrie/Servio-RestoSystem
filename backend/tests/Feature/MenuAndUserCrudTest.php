<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MenuItem;
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
}
