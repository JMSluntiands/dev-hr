<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\User;
use App\Services\AttendanceClockService;
use App\Services\PermissionService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function __construct(
        private PermissionService $permissions,
        private AttendanceClockService $clock,
    ) {
    }

    public function index(Request $request): Response
    {
        $this->permissions->grantMissingPermissionKey('attendance.view');

        $user = $request->user()?->fresh();
        abort_unless($this->permissions->userHas($user, 'attendance.view'), 403);

        $phtNow = AttendanceClockService::now();
        $month = (int) $request->integer('month', (int) $phtNow->month);
        $year = (int) $request->integer('year', (int) $phtNow->year);

        if ($month < 1 || $month > 12) {
            $month = (int) $phtNow->month;
        }

        if ($year < 2000 || $year > 2100) {
            $year = (int) $phtNow->year;
        }

        $monthStart = Carbon::create($year, $month, 1, 0, 0, 0, AttendanceClockService::TIMEZONE)->startOfDay();
        $monthEnd = $monthStart->copy()->endOfMonth();
        $today = $phtNow->copy()->startOfDay();

        $employees = Employee::query()
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        $emailToPortalUserId = collect(
            DB::connection('portal')
                ->table('users')
                ->whereNotNull('email')
                ->where('email', '!=', '')
                ->get(['id', 'email'])
        )->mapWithKeys(fn ($row) => [
            strtolower((string) $row->email) => (int) $row->id,
        ]);

        $attendances = Attendance::query()
            ->whereBetween('attendance_date', [
                $monthStart->toDateString(),
                $monthEnd->toDateString(),
            ])
            ->get()
            ->groupBy(fn (Attendance $row) => (int) $row->user_id);

        $employeesByEmail = $employees
            ->filter(fn (Employee $employee) => filled($employee->email))
            ->mapWithKeys(fn (Employee $employee) => [
                strtolower((string) $employee->email) => $employee->id,
            ]);

        $leaveMarkers = $this->leaveMarkersForMonth($employeesByEmail, $monthStart, $monthEnd);

        $employeeColumns = $employees->map(function (Employee $employee) {
            $name = $employee->full_name;

            return [
                'id' => $employee->id,
                'name' => $name,
                'initials' => $this->initials($name),
                'employee_number' => $employee->employee_number,
                'department' => $employee->department,
                'photo_url' => $employee->photo_path
                    ? Storage::disk('public')->url($employee->photo_path)
                    : null,
            ];
        })->values()->all();

        $dates = [];
        $cells = [];

        for ($day = 1; $day <= $monthEnd->day; $day++) {
            $date = Carbon::create($year, $month, $day, 0, 0, 0, AttendanceClockService::TIMEZONE)->startOfDay();
            $dateKey = $date->toDateString();
            $isFuture = $date->greaterThan($today);
            $isWeekend = $date->isWeekend();

            $dates[] = [
                'date' => $dateKey,
                'day' => $day,
                'weekday' => $date->format('D'),
                'label' => $date->format('M j'),
                'is_today' => $date->equalTo($today),
                'is_weekend' => $isWeekend,
                'is_future' => $isFuture,
            ];

            foreach ($employees as $employee) {
                $portalUserId = $emailToPortalUserId[strtolower((string) $employee->email)] ?? null;
                $attendance = null;

                if ($portalUserId && isset($attendances[$portalUserId])) {
                    $attendance = $attendances[$portalUserId]
                        ->first(fn (Attendance $row) => optional($row->attendance_date)->toDateString() === $dateKey);
                }

                $clockedIn = $attendance && $attendance->clocked_in_at;
                $markers = $leaveMarkers[$employee->id][$dateKey] ?? [];

                if ($employee->date_of_birth
                    && (int) $employee->date_of_birth->month === $month
                    && (int) $this->birthdayDayForYear($employee->date_of_birth, $year) === $day
                ) {
                    $markers[] = 'birthday';
                }

                $markers = array_values(array_unique($markers));

                $status = 'empty';
                if (! $isFuture) {
                    $status = $clockedIn ? 'clocked_in' : 'no_clock_in';
                }

                $cells[$dateKey][$employee->id] = [
                    'status' => $status,
                    'clocked_in_at' => AttendanceClockService::formatTime($attendance?->clocked_in_at),
                    'clocked_out_at' => AttendanceClockService::formatTime($attendance?->clocked_out_at),
                    'markers' => $markers,
                ];
            }
        }

        return Inertia::render('Attendance/Index', [
            'month' => $month,
            'year' => $year,
            'monthLabel' => $monthStart->format('F Y'),
            'employees' => $employeeColumns,
            'dates' => $dates,
            'cells' => $cells,
            'myAttendance' => $this->clock->todayStatusFor($user),
        ]);
    }

    public function clockIn(Request $request): RedirectResponse
    {
        try {
            $this->clock->clockIn($request->user());
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Clocked in successfully.');
    }

    /**
     * @param  \Illuminate\Support\Collection<string, int>  $employeesByEmail
     * @return array<int, array<string, list<string>>>
     */
    private function leaveMarkersForMonth($employeesByEmail, Carbon $monthStart, Carbon $monthEnd): array
    {
        $markers = [];

        $leaves = LeaveRequest::query()
            ->whereIn('status', ['approved', 'pending'])
            ->where(function ($query) use ($monthStart, $monthEnd) {
                $query->whereBetween('start_date', [$monthStart->toDateString(), $monthEnd->toDateString()])
                    ->orWhereBetween('end_date', [$monthStart->toDateString(), $monthEnd->toDateString()])
                    ->orWhere(function ($nested) use ($monthStart, $monthEnd) {
                        $nested->where('start_date', '<=', $monthStart->toDateString())
                            ->where('end_date', '>=', $monthEnd->toDateString());
                    });
            })
            ->get();

        $usersById = User::query()
            ->whereIn('id', $leaves->pluck('user_id')->unique()->filter()->all())
            ->get(['id', 'email'])
            ->keyBy('id');

        foreach ($leaves as $leave) {
            $leaveUser = $usersById->get($leave->user_id);
            if (! $leaveUser?->email) {
                continue;
            }

            $employeeId = $employeesByEmail[strtolower((string) $leaveUser->email)] ?? null;
            if (! $employeeId) {
                continue;
            }

            $type = $this->isSickLeave((string) $leave->leave_type) ? 'sl' : 'leave';
            $cursor = $leave->start_date->copy()->startOfDay();
            $end = $leave->end_date->copy()->startOfDay();

            while ($cursor->lte($end)) {
                if ($cursor->betweenIncluded($monthStart, $monthEnd)) {
                    $markers[$employeeId][$cursor->toDateString()][] = $type;
                }
                $cursor->addDay();
            }
        }

        return $markers;
    }

    private function birthdayDayForYear(Carbon $dateOfBirth, int $year): int
    {
        if ((int) $dateOfBirth->month === 2
            && (int) $dateOfBirth->day === 29
            && ! Carbon::create($year, 1, 1)->isLeapYear()
        ) {
            return 28;
        }

        return (int) $dateOfBirth->day;
    }

    private function isSickLeave(string $leaveType): bool
    {
        $normalized = strtolower(trim($leaveType));

        return $normalized === 'sl' || str_contains($normalized, 'sick');
    }

    private function initials(string $name): string
    {
        return collect(preg_split('/\s+/', trim($name)) ?: [])
            ->filter()
            ->take(2)
            ->map(fn (string $part) => mb_strtoupper(mb_substr($part, 0, 1)))
            ->implode('');
    }
}
