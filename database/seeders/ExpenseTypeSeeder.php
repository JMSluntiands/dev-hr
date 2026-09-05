<?php

namespace Database\Seeders;

use App\Models\ExpenseType;
use Illuminate\Database\Seeder;

class ExpenseTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            'Office Supplies',
            'Travel',
            'Training Materials',
            'Equipment',
            'Birthday Treat',
            'Meal Treat',
            'Miscellaneous',
        ];

        foreach ($types as $index => $name) {
            ExpenseType::query()->updateOrCreate(
                ['name' => $name],
                [
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ],
            );
        }
    }
}
