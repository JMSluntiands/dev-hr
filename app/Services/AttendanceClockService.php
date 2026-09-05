<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AttendanceClockService
{
    public const TIMEZONE = 'Asia/Manila';

    public static function formatTime(?CarbonInterface $time): ?string
    {
        if (! $time) {
            return null;
        }

        return $time->copy()->timezone(self::TIMEZONE)->format('h:i A');
    }

    public static function todayDate(): string
    {
        return now(self::TIMEZONE)->toDateString();
    }

    public static function now()
    {
        return now(self::TIMEZONE);
    }

    /**
     * Resolve the portal `users.id` used by the legacy `attendances` table.
     */
    public function portalUserIdFor(User $user): ?int
    {
        $email = strtolower(trim((string) $user->email));

        if ($email === '') {
            return null;
        }

        $existingId = DB::connection('portal')
            ->table('users')
            ->whereRaw('LOWER(email) = ?', [$email])
            ->value('id');

        if ($existingId) {
            return (int) $existingId;
        }

        $usernameBase = Str::before($email, '@') ?: 'user';
        $username = $usernameBase;
        $suffix = 1;

        while (
            DB::connection('portal')
                ->table('users')
                ->where('username', $username)
                ->exists()
        ) {
            $username = $usernameBase.$suffix;
            $suffix++;
        }

        $uniqueCode = 'HR-'.strtoupper(Str::random(8));

        while (
            DB::connection('portal')
                ->table('users')
                ->where('unique_code', $uniqueCode)
                ->exists()
        ) {
            $uniqueCode = 'HR-'.strtoupper(Str::random(8));
        }

        $now = self::now();

        return (int) DB::connection('portal')->table('users')->insertGetId([
            'unique_code' => $uniqueCode,
            'username' => $username,
            'email' => $user->email,
            'fullname' => $user->name ?: $username,
            'role' => 'User',
            'branch' => 'HQ',
            'password' => Hash::make(Str::random(40)),
            'status' => 'Active',
            'leave_credits' => 15,
            'is_employee' => 1,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    /**
     * @return array{
     *     clocked_in: bool,
     *     clocked_in_at: string|null,
     *     can_clock_in: bool,
     *     date: string
     * }
     */
    public function todayStatusFor(User $user): array
    {
        $today = self::todayDate();
        $portalUserId = $this->portalUserIdFor($user);

        $attendance = $portalUserId
            ? Attendance::query()
                ->where('user_id', $portalUserId)
                ->where('attendance_date', $today)
                ->first()
            : null;

        $clockedIn = (bool) ($attendance?->clocked_in_at);

        return [
            'clocked_in' => $clockedIn,
            'clocked_in_at' => self::formatTime($attendance?->clocked_in_at),
            'can_clock_in' => ! $clockedIn,
            'date' => $today,
        ];
    }

    public function clockIn(User $user): Attendance
    {
        $portalUserId = $this->portalUserIdFor($user);

        if (! $portalUserId) {
            throw new \RuntimeException('Unable to link your account for attendance.');
        }

        $today = self::todayDate();

        $attendance = Attendance::query()
            ->where('user_id', $portalUserId)
            ->where('attendance_date', $today)
            ->first();

        if ($attendance?->clocked_in_at) {
            throw new \RuntimeException('You already clocked in today.');
        }

        if (! $attendance) {
            $attendance = new Attendance([
                'user_id' => $portalUserId,
                'attendance_date' => $today,
            ]);
        }

        $attendance->clocked_in_at = self::now();
        $attendance->save();

        return $attendance->refresh();
    }
}
