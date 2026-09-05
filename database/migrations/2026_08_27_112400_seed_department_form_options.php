<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $names = [
            'Energy Department',
            'IT',
            'Management',
            'Supervisor',
            'Team Energy',
        ];

        $rows = [];

        foreach ($names as $index => $name) {
            $rows[] = [
                'category' => 'department',
                'name' => $name,
                'is_active' => true,
                'sort_order' => $index + 1,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        foreach ($rows as $row) {
            $exists = DB::table('form_options')
                ->where('category', $row['category'])
                ->where('name', $row['name'])
                ->exists();

            if (! $exists) {
                DB::table('form_options')->insert($row);
            }
        }
    }

    public function down(): void
    {
        DB::table('form_options')->where('category', 'department')->delete();
    }
};
