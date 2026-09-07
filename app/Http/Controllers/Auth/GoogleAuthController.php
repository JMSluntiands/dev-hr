<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use App\Services\PermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{
    private const ALLOWED_DOMAIN = 'luntiands.com';

    /**
     * Bootstrap admins who can sign in even before being added as employees.
     *
     * @var list<string>
     */
    private const BOOTSTRAP_ADMINS = [
        'admin@luntiands.com',
    ];

    /**
     * Redirect the user to Google's OAuth page.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->with(['hd' => self::ALLOWED_DOMAIN, 'prompt' => 'select_account'])
            ->redirect();
    }

    /**
     * Handle the Google OAuth callback.
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (Throwable $e) {
            report($e);

            return redirect()
                ->route('login')
                ->with(
                    'error',
                    'Google sign-in failed. Check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI on the server (must match '.url('/auth/google/callback').').',
                );
        }

        $email = Str::lower($googleUser->getEmail() ?? '');

        if (! Str::endsWith($email, '@'.self::ALLOWED_DOMAIN)) {
            return redirect()
                ->route('login')
                ->with('error', 'Only @'.self::ALLOWED_DOMAIN.' Workspace accounts can sign in.');
        }

        $isBootstrapAdmin = in_array($email, self::BOOTSTRAP_ADMINS, true)
            // Fresh install: first Workspace sign-in becomes admin.
            || ! User::query()->exists();

        $user = User::query()->where('email', $email)->first();

        $employee = Employee::query()
            ->whereRaw('LOWER(email) = ?', [$email])
            ->first();

        // Everyone except bootstrap admins must be added as an employee first.
        if (! $user && ! $employee && ! $isBootstrapAdmin) {
            return redirect()
                ->route('login')
                ->with('error', 'Please contact admin. Your Google account must be added as an employee before you can sign in.');
        }

        if (
            $employee
            && ! $user
            && ! $isBootstrapAdmin
            && Str::lower((string) $employee->employment_status) !== 'active'
        ) {
            return redirect()
                ->route('login')
                ->with('error', 'Please contact admin. Your employee record is not active.');
        }

        if ($user) {
            $user->forceFill([
                'name' => $googleUser->getName() ?: $user->name,
                'google_id' => $googleUser->getId(),
                'email_verified_at' => $user->email_verified_at ?? now(),
                'role' => $isBootstrapAdmin ? 'admin' : ($user->role ?: 'employee'),
            ])->save();
        } else {
            $user = User::query()->create([
                'name' => $googleUser->getName() ?: ($employee?->full_name ?: Str::before($email, '@')),
                'email' => $email,
                'google_id' => $googleUser->getId(),
                'email_verified_at' => now(),
                'password' => Hash::make(Str::random(40)),
                'role' => $isBootstrapAdmin ? 'admin' : 'employee',
            ]);
        }

        // Ensure bootstrap admin always has full admin permissions.
        if ($isBootstrapAdmin) {
            $permissions = app(PermissionService::class);
            $permissions->syncDefinitions();
            $permissions->syncRolePermissionDefaults();
            $permissions->resetUserToRoleDefaults($user->fresh());
        }

        Auth::login($user->fresh(), remember: true);

        request()->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
