<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_item_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code_prefix');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique('name');
            $table->unique('code_prefix');
        });

        $now = now();
        $rows = [
            ['Laptop', 'LAP-', 1],
            ['Mouse', 'MOU-', 2],
            ['Keyboard', 'KEY-', 3],
            ['Charger', 'CHG-', 4],
            ['Power Cord', 'COR-', 5],
            ['Monitor', 'MON-', 6],
            ['Laptop Stand', 'LST-', 7],
            ['Laptop Sleeve', 'LSL-', 8],
            ['Storage Bag', 'STB-', 9],
            ['Bag', 'BAG-', 10],
            ['Company Phone', 'CPH-', 11],
            ['Table', 'TAB-', 12],
            ['Miscellaneous', 'MSC-', 13],
        ];

        DB::table('inventory_item_types')->insert(
            collect($rows)->map(fn (array $row) => [
                'name' => $row[0],
                'code_prefix' => $row[1],
                'is_active' => true,
                'sort_order' => $row[2],
                'created_at' => $now,
                'updated_at' => $now,
            ])->all()
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_item_types');
    }
};
