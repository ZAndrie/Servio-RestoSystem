<?php

namespace Database\Seeders;

use App\Models\Table;
use Illuminate\Database\Seeder;

class TableSeeder extends Seeder
{
    public function run(): void
    {
        $capacities = [2, 2, 4, 4, 6, 4, 4, 2, 6, 8];

        foreach ($capacities as $index => $capacity) {
            $num = str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT);

            Table::query()->firstOrCreate(
                ['table_number' => "T-{$num}"],
                [
                    'capacity' => $capacity,
                    'status' => Table::STATUS_AVAILABLE,
                ]
            );
        }
    }
}
