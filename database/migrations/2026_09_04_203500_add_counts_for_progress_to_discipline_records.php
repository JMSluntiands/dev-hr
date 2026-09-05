<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('discipline_records', function (Blueprint $table) {
            $table->boolean('counts_for_progress')->default(true)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('discipline_records', function (Blueprint $table) {
            $table->dropColumn('counts_for_progress');
        });
    }
};
