<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = [
            [
                'name' => 'Dishes',
                'slug' => 'dishes',
                'items' => [
                    [
                        'name' => 'Sinigang na Baboy',
                        'description' => 'Tender pork ribs simmered in fresh tamarind broth with kangkong, radish, and okra.',
                        'price' => 345.00,
                        'is_available' => true,
                        'is_popular' => true,
                        'image' => '/Dishes/Sinigang na Baboy.jpg',
                        'artwork' => 'bowl',
                    ],
                    [
                        'name' => 'Pork Belly Kare-Kare',
                        'description' => 'Crisp pork belly in toasted peanut sauce with pechay, string beans, and bagoong.',
                        'price' => 360.00,
                        'is_available' => true,
                        'is_popular' => true,
                        'image' => '/Dishes/Pork Belly Kare-Kare.jpg',
                        'artwork' => 'bowl',
                    ],
                    [
                        'name' => 'Chicken Inasal',
                        'description' => 'Charcoal-grilled chicken quarter glazed in annatto garlic oil and lemongrass.',
                        'price' => 235.00,
                        'is_available' => true,
                        'is_popular' => true,
                        'image' => '/Dishes/Chicken Inasal.jpg',
                        'artwork' => 'plate',
                    ],
                    [
                        'name' => 'Sizzling Pork Sisig',
                        'description' => 'Crisp chopped pork with calamansi, onions, and green chili on a hot plate.',
                        'price' => 290.00,
                        'is_available' => true,
                        'is_popular' => true,
                        'image' => '/Dishes/Sisig de porc.jpg',
                        'artwork' => 'plate',
                    ],
                    [
                        'name' => 'Pancit Canton',
                        'description' => 'Stir-fried egg noodles tossed with pork, shrimp, crisp vegetables, and calamansi.',
                        'price' => 215.00,
                        'is_available' => true,
                        'is_popular' => false,
                        'image' => '/Dishes/Pancit Canton.jpg',
                        'artwork' => 'plate',
                    ],
                    [
                        'name' => 'Bistek Tagalog',
                        'description' => 'Beef sirloin simmered in soy sauce, calamansi, garlic, and sweet onion rings.',
                        'price' => 280.00,
                        'is_available' => true,
                        'is_popular' => false,
                        'image' => '/Dishes/Bistek.jpg',
                        'artwork' => 'plate',
                    ],
                    [
                        'name' => 'Chicken Adobo',
                        'description' => 'Classic braised chicken in cane vinegar, soy sauce, garlic, and bay leaves.',
                        'price' => 240.00,
                        'is_available' => true,
                        'is_popular' => false,
                        'image' => '/Dishes/Chicken Adobo.jpg',
                        'artwork' => 'bowl',
                    ],
                    [
                        'name' => 'Tinolang Manok',
                        'description' => 'Warm ginger chicken soup with green papaya and fresh chili leaves.',
                        'price' => 250.00,
                        'is_available' => true,
                        'is_popular' => false,
                        'image' => '/Dishes/Tinolang Manok.jpg',
                        'artwork' => 'bowl',
                    ],
                    [
                        'name' => 'Baked Lasagna',
                        'description' => 'Layered pasta baked with savory beef sauce, creamy bechamel, and melted cheese.',
                        'price' => 225.00,
                        'is_available' => true,
                        'is_popular' => false,
                        'image' => '/Desserts/Lasagna.jpg',
                        'artwork' => 'plate',
                    ],
                    [
                        'name' => 'Chicken Curry',
                        'description' => 'Home-style chicken simmered in coconut milk, mild curry, peppers, and potatoes.',
                        'price' => 260.00,
                        'is_available' => false,
                        'is_popular' => false,
                        'image' => '/Dishes/Chicken Curry.jpg',
                        'artwork' => 'bowl',
                    ],
                ],
            ],
            [
                'name' => 'Desserts',
                'slug' => 'desserts',
                'items' => [
                    [
                        'name' => 'Special Halo-Halo',
                        'description' => 'Shaved ice with ube, leche flan, sweet beans, pinipig, and rich milk.',
                        'price' => 145.00,
                        'is_available' => true,
                        'is_popular' => true,
                        'image' => '/Drinks/HaloHalo.jpg',
                        'artwork' => 'dessert',
                    ],
                    [
                        'name' => 'Flan de Queso',
                        'description' => 'Creamy baked custard topped with golden caramel syrup.',
                        'price' => 140.00,
                        'is_available' => true,
                        'is_popular' => false,
                        'image' => '/Desserts/Flan de Queso.jpg',
                        'artwork' => 'dessert',
                    ],
                    [
                        'name' => 'Kakanin Specials',
                        'description' => 'Warm platter of biko, sapin-sapin, and cassava topped with toasted latik.',
                        'price' => 160.00,
                        'is_available' => true,
                        'is_popular' => false,
                        'image' => '/Desserts/Kakanin Specials.jpg',
                        'artwork' => 'dessert',
                    ],
                    [
                        'name' => 'Fluffy Pancakes',
                        'description' => 'Stack of warm griddle pancakes served with butter and sweet syrup.',
                        'price' => 150.00,
                        'is_available' => true,
                        'is_popular' => false,
                        'image' => '/Desserts/Pancakes.jpg',
                        'artwork' => 'dessert',
                    ],
                    [
                        'name' => 'Chocolate Brownies',
                        'description' => 'Warm rich cocoa squares with melted chocolate chunks.',
                        'price' => 120.00,
                        'is_available' => true,
                        'is_popular' => false,
                        'image' => '/Desserts/Brownies.jpg',
                        'artwork' => 'dessert',
                    ],
                    [
                        'name' => 'Custard Tarts',
                        'description' => 'Flaky pastry tartlets filled with freshly baked vanilla egg custard.',
                        'price' => 110.00,
                        'is_available' => true,
                        'is_popular' => false,
                        'image' => '/Desserts/Tarts.jpg',
                        'artwork' => 'dessert',
                    ],
                ],
            ],
            [
                'name' => 'Drinks',
                'slug' => 'drinks',
                'items' => [
                    [
                        'name' => 'Calamansi Juice',
                        'description' => 'Freshly squeezed calamansi lightly sweetened with honey over ice.',
                        'price' => 75.00,
                        'is_available' => true,
                        'is_popular' => true,
                        'image' => '/Drinks/Calamansi Juice (Filipino Lemonade) – Tangy & Refreshing!.jpg',
                        'artwork' => 'glass',
                    ],
                    [
                        'name' => 'Evening Special Drink',
                        'description' => 'Chilled sparkling berry and hibiscus refresher with fresh mint.',
                        'price' => 95.00,
                        'is_available' => true,
                        'is_popular' => false,
                        'image' => '/Drinks/Evening special drink.jpg',
                        'artwork' => 'glass',
                    ],
                    [
                        'name' => 'Mango Sago',
                        'description' => 'Sweet ripe mango cubes with chilled coconut milk and soft sago pearls.',
                        'price' => 95.00,
                        'is_available' => true,
                        'is_popular' => false,
                        'image' => '/Drinks/Mango Sago.jpg',
                        'artwork' => 'glass',
                    ],
                    [
                        'name' => 'House Iced Tea',
                        'description' => 'Freshly brewed iced black tea finished with a splash of calamansi.',
                        'price' => 65.00,
                        'is_available' => true,
                        'is_popular' => false,
                        'image' => '/Drinks/Iced Tea.jpg',
                        'artwork' => 'glass',
                    ],
                    [
                        'name' => 'Chilled Taho',
                        'description' => 'Soft silken tofu layered with brown-sugar syrup and chewy sago pearls.',
                        'price' => 70.00,
                        'is_available' => true,
                        'is_popular' => false,
                        'image' => '/Drinks/Taho (Filipino Sweet Tofu).jpg',
                        'artwork' => 'glass',
                    ],
                ],
            ],
        ];

        foreach ($catalog as $catData) {
            $category = Category::query()->firstOrCreate(
                ['name' => $catData['name']],
                ['slug' => $catData['slug']]
            );

            foreach ($catData['items'] as $item) {
                MenuItem::query()->firstOrCreate(
                    [
                        'category_id' => $category->id,
                        'name' => $item['name'],
                    ],
                    $item
                );
            }
        }
    }
}
