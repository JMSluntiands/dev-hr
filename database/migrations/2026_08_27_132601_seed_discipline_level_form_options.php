<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $levels = [
            'Verbal Warning',
            'Written Warning',
            'Final Warning',
            'Suspension',
            'Termination',
        ];

        foreach ($levels as $index => $name) {
            $exists = DB::table('form_options')
                ->where('category', 'discipline_level')
                ->where('name', $name)
                ->exists();

            if (! $exists) {
                DB::table('form_options')->insert([
                    'category' => 'discipline_level',
                    'name' => $name,
                    'is_active' => true,
                    'sort_order' => $index + 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        DB::table('form_options')->where('category', 'discipline_level')->delete();
    }
};
