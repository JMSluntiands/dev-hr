<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->unsignedInteger('quantity')->default(0)->after('description');
        });

        $now = now();

        $categories = [
            ['code' => 'IT-LAP-001', 'name' => 'Laptop', 'quantity' => 26, 'description' => 'Standard company laptop'],
            ['code' => 'IT-MOU-001', 'name' => 'Mouse', 'quantity' => 17, 'description' => 'USB / wireless mouse'],
            ['code' => 'IT-KEY-001', 'name' => 'Keyboard', 'quantity' => 14, 'description' => 'Standard keyboard'],
            ['code' => 'IT-CHG-001', 'name' => 'Charger', 'quantity' => 2, 'description' => 'Device charger'],
            ['code' => 'IT-PC-001', 'name' => 'Power Cord', 'quantity' => 0, 'description' => 'Power cable'],
            ['code' => 'IT-MON-001', 'name' => 'Monitor', 'quantity' => 6, 'description' => 'External display monitor'],
            ['code' => 'IT-PMON-001', 'name' => 'Portable Monitor', 'quantity' => 11, 'description' => 'Portable display'],
            ['code' => 'IT-STAND-001', 'name' => 'Laptop Stand', 'quantity' => 13, 'description' => 'Laptop stand'],
            ['code' => 'IT-SLEEVE-001', 'name' => 'Laptop Sleeve', 'quantity' => 5, 'description' => 'Laptop sleeve'],
            ['code' => 'IT-SBAG-001', 'name' => 'Storage Bag', 'quantity' => 7, 'description' => 'Storage bag'],
            ['code' => 'IT-BAG-001', 'name' => 'Bag', 'quantity' => 1, 'description' => 'Company bag'],
            ['code' => 'IT-PHONE-001', 'name' => 'Company Phone', 'quantity' => 5, 'description' => 'Company mobile phone'],
            ['code' => 'IT-TBL-001', 'name' => 'Table', 'quantity' => 1, 'description' => 'Office table'],
            ['code' => 'IT-MISC-001', 'name' => 'Miscellaneous', 'quantity' => 62, 'description' => 'Other inventory items'],
            ['code' => 'IT-HS-001', 'name' => 'Headset', 'quantity' => 8, 'description' => 'Headset with microphone'],
        ];

        foreach ($categories as $category) {
            $existing = DB::table('inventory_items')->where('code', $category['code'])->first();

            if ($existing) {
                DB::table('inventory_items')->where('id', $existing->id)->update([
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'quantity' => $category['quantity'],
                    'is_active' => true,
                    'updated_at' => $now,
                ]);
            } else {
                DB::table('inventory_items')->insert([
                    'code' => $category['code'],
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'quantity' => $category['quantity'],
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropColumn('quantity');
        });
    }
};
