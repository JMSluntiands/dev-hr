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
            $table->json('picture_paths')->nullable()->after('brand');
        });

        $rows = DB::table('inventory_assets')
            ->whereNotNull('picture_path')
            ->where('picture_path', '!=', '')
            ->get(['id', 'picture_path']);

        foreach ($rows as $row) {
            DB::table('inventory_assets')->where('id', $row->id)->update([
                'picture_paths' => json_encode([$row->picture_path]),
            ]);
        }

        Schema::table('inventory_assets', function (Blueprint $table) {
            $table->dropColumn('picture_path');
        });
    }

    public function down(): void
    {
        Schema::table('inventory_assets', function (Blueprint $table) {
            $table->string('picture_path')->nullable()->after('brand');
        });

        $rows = DB::table('inventory_assets')
            ->whereNotNull('picture_paths')
            ->get(['id', 'picture_paths']);

        foreach ($rows as $row) {
            $paths = json_decode((string) $row->picture_paths, true);
            $first = is_array($paths) ? ($paths[0] ?? null) : null;

            DB::table('inventory_assets')->where('id', $row->id)->update([
                'picture_path' => $first,
            ]);
        }

        Schema::table('inventory_assets', function (Blueprint $table) {
            $table->dropColumn('picture_paths');
        });
    }
};
