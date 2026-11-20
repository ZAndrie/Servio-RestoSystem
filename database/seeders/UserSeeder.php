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
                'name' => 'System Admin',
                'username' => 'admin',
                'password' => 'admin123',
                'role' => User::ROLE_ADMIN,
            ],
            [
                'name' => 'Juan Dela Cruz',
                'username' => 'waiter',
                'password' => 'waiter123',
                'role' => User::ROLE_WAITER,
            ],
            [
                'name' => 'Chef Maria',
                'username' => 'kitchen',
                'password' => 'kitchen123',
                'role' => User::ROLE_KITCHEN,
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
