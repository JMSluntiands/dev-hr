<?php

namespace Database\Seeders;

use App\Models\IncidentType;
use Illuminate\Database\Seeder;

class IncidentTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            'Slip / Trip / Fall',
            'Equipment Accident',
            'Vehicle Accident',
            'Workplace Violence',
            'Fire / Explosion',
            'Chemical Exposure',
            'Near Miss',
            'Other',
        ];

        foreach ($types as $index => $name) {
            IncidentType::query()->updateOrCreate(
                ['name' => $name],
                [
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ],
            );
        }
    }
}
