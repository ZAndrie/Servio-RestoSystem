<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MenuAndUserCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_crud_users_and_cannot_delete_self(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        $createResponse = $this->postJson('/api/users', [
            'name' => 'New Waiter',
            'username' => 'waiter_new',
            'password' => 'pass1234',
            'role' => 'waiter',
        ]);

        $createResponse->assertCreated()
            ->assertJsonPath('username', 'waiter_new')
            ->assertJsonPath('role', 'waiter')
            ->assertJsonMissingPath('password');

        $userId = $createResponse->json('id');
        $created = User::query()->findOrFail($userId);
        $this->assertTrue(Hash::check('pass1234', $created->password));

        $this->putJson("/api/users/{$userId}", [
            'name' => 'Updated Waiter',
            'role' => 'kitchen',
        ])->assertOk()
            ->assertJsonPath('name', 'Updated Waiter')
            ->assertJsonPath('role', 'kitchen');

        // Self-delete blocked
        $this->deleteJson("/api/users/{$admin->id}")->assertUnprocessable();

        // Deleting another user works
        $this->deleteJson("/api/users/{$userId}")->assertOk();
        $this->assertDatabaseMissing('users', ['id' => $userId]);
    }

    public function test_admin_can_crud_categories_menu_items_and_toggle_availability(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        // Category CRUD
        $catResponse = $this->postJson('/api/categories', ['name' => 'Specials']);
        $catResponse->assertCreated()->assertJsonPath('name', 'Specials');
        $categoryId = $catResponse->json('id');

        $this->putJson("/api/categories/{$categoryId}", ['name' => 'Chef Specials'])
            ->assertOk()
            ->assertJsonPath('name', 'Chef Specials');

        // Menu Item CRUD
        $itemResponse = $this->postJson('/api/menu-items', [
            'category_id' => $categoryId,
            'name' => 'Sinigang na Baboy',
            'price' => 260.50,
        ]);

        $itemResponse->assertCreated()
            ->assertJsonPath('name', 'Sinigang na Baboy')
            ->assertJsonPath('price', '260.50')
            ->assertJsonPath('is_available', true);

        $itemId = $itemResponse->json('id');

        // Cannot delete category while menu items exist
        $this->deleteJson("/api/categories/{$categoryId}")->assertStatus(409);

        // Toggle Sold Out
        $this->patchJson("/api/menu-items/{$itemId}/availability", ['is_available' => false])
            ->assertOk()
            ->assertJsonPath('is_available', false);

        // Filter available vs sold out
        $this->getJson('/api/menu-items?is_available=false')
            ->assertOk()
            ->assertJsonCount(1);

        // Update price
        $this->putJson("/api/menu-items/{$itemId}", ['price' => 275.00])
            ->assertOk()
            ->assertJsonPath('price', '275.00');

        // Delete item then category
        $this->deleteJson("/api/menu-items/{$itemId}")->assertOk();
        $this->deleteJson("/api/categories/{$categoryId}")->assertOk();
    }
}
