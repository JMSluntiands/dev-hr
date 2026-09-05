<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventory_assets', function (Blueprint $table) {
            $table->date('date_purchased')->nullable()->after('date_arrived');
            $table->unsignedSmallInteger('service_months')->default(38)->after('date_purchased');
            $table->string('status')->nullable()->after('condition');
        });

        $exists = DB::table('inventory_item_types')
            ->where('code_prefix', 'PMO-')
            ->orWhere('name', 'Portable Monitor')
            ->exists();

        if (! $exists) {
            $sort = (int) DB::table('inventory_item_types')->max('sort_order') + 1;
            $now = now();

            DB::table('inventory_item_types')->insert([
                'name' => 'Portable Monitor',
                'code_prefix' => 'PMO-',
                'is_active' => true,
                'sort_order' => $sort,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('inventory_assets', function (Blueprint $table) {
            $table->dropColumn(['date_purchased', 'service_months', 'status']);
        });

        DB::table('inventory_item_types')->where('code_prefix', 'PMO-')->delete();
    }
};
