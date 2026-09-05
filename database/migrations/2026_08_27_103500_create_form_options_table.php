<?php

use App\Support\FormOptionRegistry;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_options', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['category', 'name']);
            $table->index(['category', 'is_active', 'sort_order']);
        });

        $now = now();
        $rows = [];

        $seeds = [
            'gender' => ['Male', 'Female', 'Other', 'Prefer not to say'],
            'civil_status' => ['Single', 'Married', 'Widowed', 'Separated', 'Divorced'],
            'leave_type' => [
                'Vacation Leave',
                'Sick Leave',
                'Emergency Leave',
                'Bereavement Leave',
                'Maternity Leave',
                'Paternity Leave',
                'Unofficial Leave',
            ],
            'injury_type' => [
                'Cut / Laceration',
                'Bruise / Contusion',
                'Burn',
                'Fracture',
                'Sprain / Strain',
                'Eye Injury',
                'Head Injury',
                'Other',
            ],
        ];

        foreach ($seeds as $category => $names) {
            foreach ($names as $index => $name) {
                $rows[] = [
                    'category' => $category,
                    'name' => $name,
                    'is_active' => true,
                    'sort_order' => $index + 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DB::table('form_options')->insert($rows);

        $genderMap = [
            'male' => 'Male',
            'female' => 'Female',
            'other' => 'Other',
            'prefer_not_to_say' => 'Prefer not to say',
        ];

        foreach ($genderMap as $from => $to) {
            DB::table('employees')->where('gender', $from)->update(['gender' => $to]);
        }

        $civilMap = [
            'single' => 'Single',
            'married' => 'Married',
            'widowed' => 'Widowed',
            'separated' => 'Separated',
            'divorced' => 'Divorced',
        ];

        foreach ($civilMap as $from => $to) {
            DB::table('employees')->where('civil_status', $from)->update(['civil_status' => $to]);
        }

        // Ensure registry categories stay documented in schema comments via existence.
        FormOptionRegistry::keys();
    }

    public function down(): void
    {
        Schema::dropIfExists('form_options');
    }
};
