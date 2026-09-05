<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->string('emergency_contact_relation')->nullable()->after('emergency_contact_name');
        });

        $now = now();
        $names = [
            'Spouse',
            'Parent',
            'Sibling',
            'Child',
            'Relative',
            'Friend',
            'Guardian',
            'Other',
        ];

        foreach ($names as $index => $name) {
            $exists = DB::table('form_options')
                ->where('category', 'emergency_contact_relation')
                ->where('name', $name)
                ->exists();

            if ($exists) {
                continue;
            }

            DB::table('form_options')->insert([
                'category' => 'emergency_contact_relation',
                'name' => $name,
                'is_active' => true,
                'sort_order' => $index + 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        DB::table('form_options')->where('category', 'emergency_contact_relation')->delete();

        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn('emergency_contact_relation');
        });
    }
};
