<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_assets', function (Blueprint $table) {
            $table->id();
            $table->string('item_code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type')->nullable();
            $table->foreignId('allocated_to_employee_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->string('allocated_to_name')->nullable();
            $table->string('condition')->nullable();
            $table->text('remarks')->nullable();
            $table->date('date_arrived')->nullable();
            $table->string('brand')->nullable();
            $table->string('picture_path')->nullable();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_assets');
    }
};
