<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\PermissionService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DefaultAdminSeeder extends Seeder
{
    /**
     * Default admin for fresh Hostinger / empty databases.
     * Email/password login works even if Google OAuth is not configured yet.
     */
    public function run(): void
    {
        $email = 'admin@luntiands.com';

        $user = User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Luntian Admin',
                'role' => 'admin',
                'password' => Hash::make('LuntianAdmin@2026'),
                'email_verified_at' => now(),
            ],
        );

        $permissions = app(PermissionService::class);
        $permissions->syncDefinitions();
        $permissions->syncRolePermissionDefaults();
        $permissions->resetUserToRoleDefaults($user->fresh());
    }
}
