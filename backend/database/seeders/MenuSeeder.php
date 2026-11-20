<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $menu = [
            'Mains' => [
                ['name' => 'Chicken Adobo', 'price' => 185.00],
                ['name' => 'Pork Sisig', 'price' => 210.00],
                ['name' => 'Beef Tapa', 'price' => 225.00],
                ['name' => 'Grilled Bangus', 'price' => 240.00],
            ],
            'Appetizers' => [
                ['name' => 'Lumpiang Shanghai', 'price' => 135.00],
                ['name' => 'Calamares', 'price' => 165.00],
                ['name' => 'Garlic Rice', 'price' => 45.00],
            ],
            'Drinks' => [
                ['name' => 'Iced Tea', 'price' => 55.00],
                ['name' => 'Calamansi Juice', 'price' => 60.00],
                ['name' => 'Mango Shake', 'price' => 95.00],
                ['name' => 'Bottled Water', 'price' => 35.00],
            ],
            'Desserts' => [
                ['name' => 'Halo-Halo', 'price' => 120.00],
                ['name' => 'Leche Flan', 'price' => 85.00],
            ],
        ];

        foreach ($menu as $categoryName => $items) {
            $category = Category::query()->firstOrCreate(['name' => $categoryName]);

            foreach ($items as $item) {
                MenuItem::query()->firstOrCreate(
                    [
                        'category_id' => $category->id,
                        'name' => $item['name'],
                    ],
                    [
                        'price' => $item['price'],
                        'is_available' => true,
                    ]
                );
            }
        }
    }
}
