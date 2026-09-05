<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\User;
use App\Services\ActivityLogger;
use App\Services\PermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    public function __construct(private PermissionService $permissions)
    {
    }

    public function index(): Response
    {
        $this->permissions->syncDefinitions();
        $this->permissions->syncRolePermissionDefaults();
        $this->permissions->grantMissingPermissionKey('activity_log.view');

        $accounts = User::query()
            ->whereNotNull('google_id')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role']);

        $this->permissions->seedUsersFromRoleIfEmpty($accounts);

        $permissionGroups = Permission::query()
            ->orderBy('group')
            ->orderBy('label')
            ->get()
            ->groupBy('group')
            ->map(fn ($items, $group) => [
                'group' => $group,
                'items' => $items->map(fn (Permission $permission) => [
                    'id' => $permission->id,
                    'key' => $permission->key,
                    'label' => $permission->label,
                    'description' => $permission->description,
                ])->values(),
            ])
            ->values();

        $accountPermissions = [];
        foreach ($accounts as $account) {
            $accountPermissions[$account->id] = $this->permissions->keysForUser($account);
        }

        return Inertia::render('Settings/Permissions', [
            'permissionGroups' => $permissionGroups,
            'accounts' => $accounts->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?: 'employee',
            ])->values(),
            'accountPermissions' => $accountPermissions,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(fn ($query) => $query->whereNotNull('google_id')),
            ],
            'permissions' => ['array'],
            'permissions.*' => ['string', Rule::exists('permissions', 'key')],
        ]);

        $this->permissions->syncDefinitions();

        $user = User::query()->findOrFail($validated['user_id']);
        $this->permissions->syncUserPermissions($user, $validated['permissions'] ?? []);

        ActivityLogger::log(
            'Settings',
            'permissions_updated',
            'Updated permissions for '.$user->email,
            $user,
            ['permissions_count' => count($validated['permissions'] ?? [])],
        );

        return redirect()
            ->route('settings.permissions')
            ->with('success', 'Permissions updated for '.$user->email.'.');
    }
}
