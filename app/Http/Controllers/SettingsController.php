<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ActivityLogger;
use App\Services\PermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * @var list<string>
     */
    public const ROLES = ['admin', 'hr', 'manager', 'employee'];

    public function __construct(private PermissionService $permissions)
    {
    }

    public function index(): Response
    {
        $syncedEmails = User::query()
            ->whereNotNull('google_id')
            ->orderBy('email')
            ->get(['id', 'name', 'email', 'role', 'google_id', 'email_verified_at', 'updated_at'])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?: 'employee',
                'synced_at' => optional($user->updated_at)->toDateTimeString(),
                'verified' => filled($user->email_verified_at),
            ]);

        return Inertia::render('Settings/Index', [
            'syncedEmails' => $syncedEmails,
            'allowedDomain' => 'luntiands.com',
            'roles' => self::ROLES,
        ]);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', Rule::in(self::ROLES)],
        ]);

        $previousRole = $user->role ?: 'employee';

        $user->update([
            'role' => $validated['role'],
        ]);

        // Role change resets account permissions to that role's defaults.
        $this->permissions->syncDefinitions();
        $this->permissions->syncRolePermissionDefaults();
        $this->permissions->resetUserToRoleDefaults($user->fresh());

        ActivityLogger::log(
            'Settings',
            'role_updated',
            'Changed role of '.$user->email.' from '.$previousRole.' to '.$validated['role'],
            $user,
            ['from' => $previousRole, 'to' => $validated['role']],
        );

        return redirect()
            ->route('settings.index')
            ->with('success', 'Role updated for '.$user->email.'.');
    }
}
