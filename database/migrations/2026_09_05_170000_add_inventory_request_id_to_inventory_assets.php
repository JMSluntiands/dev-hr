<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventory_assets', function (Blueprint $table) {
            $table->foreignId('inventory_request_id')
                ->nullable()
                ->after('created_by_user_id')
                ->constrained('inventory_requests')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('inventory_assets', function (Blueprint $table) {
            $table->dropConstrainedForeignId('inventory_request_id');
        });
    }
};
