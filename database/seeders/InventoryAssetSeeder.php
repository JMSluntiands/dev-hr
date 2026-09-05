<?php

namespace Database\Seeders;

use App\Models\InventoryAsset;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class InventoryAssetSeeder extends Seeder
{
    public function run(): void
    {
        $parts = [
            database_path('data/inventory_assets_part1.json'),
            database_path('data/inventory_assets_part2.json'),
            database_path('data/inventory_assets_part3.json'),
            database_path('data/inventory_assets_part4.json'),
        ];

        $rows = [];

        foreach ($parts as $path) {
            if (! File::exists($path)) {
                continue;
            }

            $decoded = json_decode(File::get($path), true);

            if (is_array($decoded)) {
                $rows = array_merge($rows, $decoded);
            }
        }

        foreach ($rows as $row) {
            InventoryAsset::query()->updateOrCreate(
                ['item_code' => $row['item_code']],
                [
                    'name' => $row['name'],
                    'description' => $row['description'] ?? null,
                    'type' => $row['type'] ?? null,
                    'allocated_to_employee_id' => null,
                    'allocated_to_name' => null,
                    'condition' => $row['condition'] ?? null,
                    'status' => $row['status'] ?? null,
                    'remarks' => $row['remarks'] ?? null,
                    'date_arrived' => $row['date_arrived'] ?? null,
                    'date_purchased' => $row['date_purchased'] ?? null,
                    'service_months' => 38,
                    'brand' => $row['brand'] ?? null,
                ],
            );
        }

        $this->command?->info('Imported '.count($rows).' inventory assets (staff left blank, service = 38 months).');
    }
}
