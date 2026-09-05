<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->boolean('emergency_contact_same_address')->default(false)->after('emergency_contact_phone');
            $table->text('emergency_contact_address')->nullable()->after('emergency_contact_same_address');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['emergency_contact_same_address', 'emergency_contact_address']);
        });
    }
};
