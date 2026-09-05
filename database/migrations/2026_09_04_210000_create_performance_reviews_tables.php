<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('performance_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reviewed_by_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('supervisor_name');
            $table->foreignId('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->string('employee_name');
            $table->string('employee_number')->nullable();
            $table->string('department')->nullable();
            $table->string('position')->nullable();
            $table->date('review_date');
            $table->decimal('overall_score', 4, 2)->nullable();
            $table->string('status')->default('Submitted');
            $table->timestamps();
        });

        Schema::create('performance_review_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('performance_review_id')->constrained('performance_reviews')->cascadeOnDelete();
            $table->string('competency_key');
            $table->string('competency_title');
            $table->unsignedTinyInteger('rating');
            $table->text('explanation');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['performance_review_id', 'competency_key'], 'perf_review_competency_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('performance_review_ratings');
        Schema::dropIfExists('performance_reviews');
    }
};
