<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employment_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique('name');
        });

        Schema::create('employment_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique('name');
        });

        $now = now();

        DB::table('employment_types')->insert([
            ['name' => 'Regular', 'is_active' => true, 'sort_order' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Probationary', 'is_active' => true, 'sort_order' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Contractual', 'is_active' => true, 'sort_order' => 3, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Part-time', 'is_active' => true, 'sort_order' => 4, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Intern', 'is_active' => true, 'sort_order' => 5, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('employment_statuses')->insert([
            ['name' => 'Active', 'is_active' => true, 'sort_order' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Inactive', 'is_active' => true, 'sort_order' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Resigned', 'is_active' => true, 'sort_order' => 3, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Terminated', 'is_active' => true, 'sort_order' => 4, 'created_at' => $now, 'updated_at' => $now],
        ]);

        $typeMap = [
            'regular' => 'Regular',
            'probationary' => 'Probationary',
            'contractual' => 'Contractual',
            'part_time' => 'Part-time',
            'intern' => 'Intern',
        ];

        foreach ($typeMap as $from => $to) {
            DB::table('employees')->where('employment_type', $from)->update(['employment_type' => $to]);
        }

        $statusMap = [
            'active' => 'Active',
            'inactive' => 'Inactive',
            'resigned' => 'Resigned',
            'terminated' => 'Terminated',
        ];

        foreach ($statusMap as $from => $to) {
            DB::table('employees')->where('employment_status', $from)->update(['employment_status' => $to]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('employment_statuses');
        Schema::dropIfExists('employment_types');
    }
};
