<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Maria Santos',
                'username' => 'admin',
                'password' => 'admin123',
                'role' => User::ROLE_ADMIN,
                'is_active' => true,
                'must_change_password' => false,
            ],
            [
                'name' => 'Ana Reyes',
                'username' => 'waiter',
                'password' => 'waiter123',
                'role' => User::ROLE_WAITER,
                'is_active' => true,
                'must_change_password' => false,
            ],
            [
                'name' => 'Ramon Cruz',
                'username' => 'kitchen',
                'password' => 'kitchen123',
                'role' => User::ROLE_KITCHEN,
                'is_active' => true,
                'must_change_password' => false,
            ],
            [
                'name' => 'Paolo Mendoza',
                'username' => 'waiter_paolo',
                'password' => 'waiter123',
                'role' => User::ROLE_WAITER,
                'is_active' => true,
                'must_change_password' => false,
            ],
            [
                'name' => 'Liza Bautista',
                'username' => 'kitchen_liza',
                'password' => 'kitchen123',
                'role' => User::ROLE_KITCHEN,
                'is_active' => false,
                'must_change_password' => false,
            ],
        ];

        foreach ($users as $data) {
            User::query()->firstOrCreate(
                ['username' => $data['username']],
                $data
            );
        }
    }
}
