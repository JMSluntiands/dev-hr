<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->string('company')->default('Luntian');
            $table->foreignId('reported_by_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('employee_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->string('employee_name');
            $table->string('location_area');
            $table->date('incident_date');
            $table->time('incident_time');
            $table->foreignId('incident_type_id')->constrained('incident_types')->restrictOnDelete();
            $table->text('details');
            $table->string('witness')->nullable();
            $table->boolean('has_injury')->default(false);
            $table->json('injury_types')->nullable();
            $table->text('injury_details')->nullable();
            $table->date('report_date');
            $table->time('report_time');
            $table->text('action_taken')->nullable();
            $table->string('status')->default('submitted');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};
