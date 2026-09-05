<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            $table->foreignId('reviewed_by')->nullable()->after('status')->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->text('review_notes')->nullable()->after('reviewed_at');
        });

        // Existing "submitted" rows wait for approval before showing in the main list.
        DB::table('incidents')
            ->where('status', 'submitted')
            ->update(['status' => 'pending']);
    }

    public function down(): void
    {
        DB::table('incidents')
            ->where('status', 'pending')
            ->update(['status' => 'submitted']);

        Schema::table('incidents', function (Blueprint $table) {
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn(['reviewed_at', 'review_notes']);
        });
    }
};
