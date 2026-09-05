<?php

namespace App\Services;

use App\Models\Permission;
use App\Models\User;
use App\Support\PermissionRegistry;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class PermissionService
{
    public function syncDefinitions(): void
    {
        foreach (PermissionRegistry::definitions() as $definition) {
            Permission::query()->updateOrCreate(
                ['key' => $definition['key']],
                [
                    'label' => $definition['label'],
                    'group' => $definition['group'],
                    'description' => $definition['description'] ?? null,
                ],
            );
        }

        $validKeys = collect(PermissionRegistry::definitions())->pluck('key')->all();

        Permission::query()
            ->whereNotIn('key', $validKeys)
            ->each(function (Permission $permission) {
                DB::table('role_permission')->where('permission_id', $permission->id)->delete();
                DB::table('user_permission')->where('permission_id', $permission->id)->delete();
                $permission->delete();
            });
    }

    public function syncRolePermissionDefaults(): void
    {
        $permissions = Permission::query()->pluck('id', 'key');

        DB::table('role_permission')->delete();

        $now = now();
        $rows = [];

        foreach (PermissionRegistry::defaultRoleMap() as $role => $keys) {
            foreach ($keys as $key) {
                if (! isset($permissions[$key])) {
                    continue;
                }

                $rows[] = [
                    'role' => $role,
                    'permission_id' => $permissions[$key],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        if ($rows !== []) {
            DB::table('role_permission')->insert($rows);
        }
    }

    public function seedDefaultRolePermissionsIfEmpty(): void
    {
        if (DB::table('role_permission')->exists()) {
            return;
        }

        $this->syncRolePermissionDefaults();
    }

    /**
     * Replace a user's permissions with the defaults for their current role.
     */
    public function resetUserToRoleDefaults(User $user): void
    {
        DB::table('user_permission')->where('user_id', $user->id)->delete();
        $this->seedUserFromRoleIfEmpty($user->fresh());
    }

    /**
     * @return list<string>
     */
    public function keysForRole(?string $role): array
    {
        if (! $role) {
            return [];
        }

        return Permission::query()
            ->whereIn('id', function ($query) use ($role) {
                $query->select('permission_id')
                    ->from('role_permission')
                    ->where('role', $role);
            })
            ->pluck('key')
            ->all();
    }

    public function userHasCustomPermissions(User $user): bool
    {
        return DB::table('user_permission')
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     * Copy role defaults into user_permission the first time we need them.
     */
    public function seedUserFromRoleIfEmpty(User $user): void
    {
        if ($this->userHasCustomPermissions($user)) {
            return;
        }

        $permissionIds = Permission::query()
            ->whereIn('id', function ($query) use ($user) {
                $query->select('permission_id')
                    ->from('role_permission')
                    ->where('role', $user->role ?: 'employee');
            })
            ->pluck('id');

        if ($permissionIds->isEmpty()) {
            $keys = PermissionRegistry::defaultRoleMap()[$user->role ?: 'employee'] ?? [];
            $permissionIds = Permission::query()->whereIn('key', $keys)->pluck('id');
        }

        $now = now();
        $rows = $permissionIds->map(fn ($id) => [
            'user_id' => $user->id,
            'permission_id' => $id,
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        if ($rows !== []) {
            DB::table('user_permission')->insert($rows);
        }
    }

    /**
     * @param  Collection<int, User>|iterable<User>  $users
     */
    public function seedUsersFromRoleIfEmpty(iterable $users): void
    {
        foreach ($users as $user) {
            $this->seedUserFromRoleIfEmpty($user);
        }
    }

    /**
     * @return list<string>
     */
    public function keysForUser(?User $user): array
    {
        if (! $user) {
            return [];
        }

        if (! $this->userHasCustomPermissions($user)) {
            return $this->keysForRole($user->role ?: 'employee');
        }

        return Permission::query()
            ->whereIn('id', function ($query) use ($user) {
                $query->select('permission_id')
                    ->from('user_permission')
                    ->where('user_id', $user->id);
            })
            ->pluck('key')
            ->all();
    }

    /**
     * @param  list<string>  $permissionKeys
     */
    public function syncUserPermissions(User $user, array $permissionKeys): void
    {
        $permissionIds = Permission::query()
            ->whereIn('key', $permissionKeys)
            ->pluck('id');

        DB::transaction(function () use ($user, $permissionIds) {
            DB::table('user_permission')
                ->where('user_id', $user->id)
                ->delete();

            $now = now();
            $rows = $permissionIds->map(fn ($id) => [
                'user_id' => $user->id,
                'permission_id' => $id,
                'created_at' => $now,
                'updated_at' => $now,
            ])->all();

            if ($rows !== []) {
                DB::table('user_permission')->insert($rows);
            }
        });
    }

    /**
     * Grant a permission key to every user whose role default includes it,
     * without removing any existing custom permissions.
     */
    public function grantMissingPermissionKey(string $permissionKey): void
    {
        $this->syncDefinitions();
        $this->syncRolePermissionDefaults();

        $permission = Permission::query()->where('key', $permissionKey)->first();

        if (! $permission) {
            return;
        }

        $now = now();
        $roleMap = PermissionRegistry::defaultRoleMap();

        User::query()
            ->whereNotNull('role')
            ->get(['id', 'role'])
            ->each(function (User $user) use ($permission, $permissionKey, $roleMap, $now) {
                $defaults = $roleMap[$user->role] ?? [];

                if (! in_array($permissionKey, $defaults, true) && $user->role !== 'admin') {
                    return;
                }

                DB::table('user_permission')->insertOrIgnore([
                    'user_id' => $user->id,
                    'permission_id' => $permission->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            });
    }

    public function roleHas(string $role, string $permissionKey): bool
    {
        return in_array($permissionKey, $this->keysForRole($role), true);
    }

    public function userHas(?User $user, string $permissionKey): bool
    {
        return in_array($permissionKey, $this->keysForUser($user), true);
    }
}
