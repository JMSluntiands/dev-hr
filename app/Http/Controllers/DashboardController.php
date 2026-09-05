<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\User;
use App\Services\AttendanceClockService;
use App\Services\PermissionService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private PermissionService $permissions,
        private AttendanceClockService $clock,
    ) {
    }

    public function index(Request $request): Response
    {
        $this->permissions->grantMissingPermissionKey('employees.view');
        $this->permissions->grantMissingPermissionKey('attendance.view');
        $this->permissions->grantMissingPermissionKey('leave.history');

        $user = $request->user()?->fresh();
        $canViewEmployees = $this->permissions->userHas($user, 'employees.view');
        $canViewAttendance = $this->permissions->userHas($user, 'attendance.view')
            || $canViewEmployees;
        $canViewCalendar = $canViewEmployees
            || $this->permissions->userHas($user, 'leave.history')
            || $this->permissions->userHas($user, 'leave.approvals');

        $phtNow = AttendanceClockService::now();
        $today = AttendanceClockService::todayDate();
        $month = (int) $request->integer('month', (int) $phtNow->month);
        $year = (int) $request->integer('year', (int) $phtNow->year);

        if ($month < 1 || $month > 12) {
            $month = (int) $phtNow->month;
        }

        if ($year < 2000 || $year > 2100) {
            $year = (int) $phtNow->year;
        }

        $employeesQuery = Employee::query()
            ->orderBy('last_name')
            ->orderBy('first_name');

        $employeeCount = (clone $employeesQuery)->count();
        $pendingLeaveCount = LeaveRequest::query()
            ->where('status', 'pending')
            ->count();

        $employees = [];
        $attendanceRows = [];
        $clockedInCount = 0;
        $employeeModels = collect();

        if ($canViewEmployees || $canViewAttendance || $canViewCalendar) {
            $employeeModels = $employeesQuery->get();
        }

        if ($canViewEmployees || $canViewAttendance) {
            $emailToPortalUserId = collect(
                DB::connection('portal')
                    ->table('users')
                    ->whereNotNull('email')
                    ->where('email', '!=', '')
                    ->get(['id', 'email'])
            )->mapWithKeys(fn ($row) => [
                strtolower((string) $row->email) => (int) $row->id,
            ]);

            $attendanceByUserId = Attendance::query()
                ->whereDate('attendance_date', $today)
                ->get()
                ->keyBy(fn (Attendance $row) => (int) $row->user_id);

            foreach ($employeeModels as $employee) {
                $portalUserId = $emailToPortalUserId[strtolower((string) $employee->email)] ?? null;
                $attendance = $portalUserId
                    ? $attendanceByUserId->get($portalUserId)
                    : null;

                $clockedIn = $attendance && $attendance->clocked_in_at;
                if ($clockedIn) {
                    $clockedInCount++;
                }

                $serialized = [
                    'id' => $employee->id,
                    'employee_number' => $employee->employee_number,
                    'name' => $employee->full_name,
                    'email' => $employee->email,
                    'department' => $employee->department,
                    'position' => $employee->position,
                    'employment_status' => $employee->employment_status,
                    'photo_url' => $employee->photo_path
                        ? Storage::disk('public')->url($employee->photo_path)
                        : null,
                    'clocked_in' => (bool) $clockedIn,
                    'clocked_in_at' => AttendanceClockService::formatTime($attendance?->clocked_in_at),
                    'clocked_out_at' => AttendanceClockService::formatTime($attendance?->clocked_out_at),
                    'status' => $clockedIn ? 'Clocked in' : 'No clock in',
                ];

                if ($canViewEmployees) {
                    $employees[] = $serialized;
                }

                if ($canViewAttendance) {
                    $attendanceRows[] = $serialized;
                }
            }

            if ($canViewAttendance) {
                usort($attendanceRows, function (array $a, array $b) {
                    if ($a['clocked_in'] !== $b['clocked_in']) {
                        return $a['clocked_in'] ? -1 : 1;
                    }

                    return strcasecmp($a['name'], $b['name']);
                });
            }
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'employees' => $canViewEmployees ? $employeeCount : null,
                'attendance_today' => $canViewAttendance ? $clockedInCount : null,
                'attendance_total' => $canViewAttendance ? count($attendanceRows) : null,
                'leave_requests' => $this->permissions->userHas($user, 'leave.approvals')
                    || $this->permissions->userHas($user, 'leave.history')
                        ? $pendingLeaveCount
                        : null,
            ],
            'employees' => $employees,
            'attendance' => $attendanceRows,
            'attendanceDate' => $today,
            'canViewEmployees' => $canViewEmployees,
            'canViewAttendance' => $canViewAttendance,
            'canViewCalendar' => $canViewCalendar,
            'myAttendance' => $this->clock->todayStatusFor($user),
            'calendar' => $canViewCalendar
                ? [
                    'month' => $month,
                    'year' => $year,
                    'events' => $this->calendarEvents($employeeModels, $month, $year),
                ]
                : null,
        ]);
    }

    /**
     * @param  \Illuminate\Support\Collection<int, Employee>  $employees
     * @return list<array{date: string, type: string, label: string, employee: string, initials: string, photo_url: string|null, detail: string|null}>
     */
    private function calendarEvents($employees, int $month, int $year): array
    {
        $events = [];
        $monthStart = Carbon::create($year, $month, 1, 0, 0, 0, AttendanceClockService::TIMEZONE)->startOfDay();
        $monthEnd = $monthStart->copy()->endOfMonth();

        $employeesByEmail = $employees
            ->filter(fn (Employee $employee) => filled($employee->email))
            ->mapWithKeys(fn (Employee $employee) => [
                strtolower((string) $employee->email) => $employee,
            ]);

        foreach ($employees as $employee) {
            if (! $employee->date_of_birth) {
                continue;
            }

            $birthday = $employee->date_of_birth->copy()->year($year);
            if ((int) $birthday->month !== $month) {
                continue;
            }

            // Handle Feb 29 in non-leap years by clamping to Feb 28.
            if ((int) $employee->date_of_birth->month === 2
                && (int) $employee->date_of_birth->day === 29
                && ! $birthday->isLeapYear()
            ) {
                $birthday->day(28);
            }

            $events[] = $this->calendarEventPayload(
                $birthday->toDateString(),
                'birthday',
                'Birthday',
                $employee->full_name,
                $employee,
                null,
            );
        }

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
            ->get(['id', 'name', 'email'])
            ->keyBy('id');

        foreach ($leaves as $leave) {
            $leaveUser = $usersById->get($leave->user_id);
            $matchedEmployee = $leaveUser
                ? ($employeesByEmail[strtolower((string) $leaveUser->email)] ?? null)
                : null;
            $employeeName = $matchedEmployee?->full_name
                ?? $leaveUser?->name
                ?? 'Unknown';

            $isSick = $this->isSickLeave((string) $leave->leave_type);
            $type = $isSick ? 'sl' : 'leave';
            $label = $isSick ? 'SL' : 'Leave';

            $cursor = $leave->start_date->copy()->startOfDay();
            $end = $leave->end_date->copy()->startOfDay();

            while ($cursor->lte($end)) {
                if ($cursor->betweenIncluded($monthStart, $monthEnd)) {
                    $events[] = $this->calendarEventPayload(
                        $cursor->toDateString(),
                        $type,
                        $label,
                        $employeeName,
                        $matchedEmployee,
                        $leave->leave_type.($leave->status === 'pending' ? ' (pending)' : ''),
                    );
                }
                $cursor->addDay();
            }
        }

        usort($events, function (array $a, array $b) {
            return [$a['date'], $a['type'], $a['employee']]
                <=> [$b['date'], $b['type'], $b['employee']];
        });

        return $events;
    }

    /**
     * @return array{date: string, type: string, label: string, employee: string, initials: string, photo_url: string|null, detail: string|null}
     */
    private function calendarEventPayload(
        string $date,
        string $type,
        string $label,
        string $employeeName,
        ?Employee $employee,
        ?string $detail,
    ): array {
        return [
            'date' => $date,
            'type' => $type,
            'label' => $label,
            'employee' => $employeeName,
            'initials' => $this->employeeInitials($employeeName),
            'photo_url' => $employee?->photo_path
                ? Storage::disk('public')->url($employee->photo_path)
                : null,
            'detail' => $detail,
        ];
    }

    private function employeeInitials(string $name): string
    {
        return collect(preg_split('/\s+/', trim($name)) ?: [])
            ->filter()
            ->take(2)
            ->map(fn (string $part) => mb_strtoupper(mb_substr($part, 0, 1)))
            ->implode('');
    }

    private function isSickLeave(string $leaveType): bool
    {
        $normalized = strtolower(trim($leaveType));

        return $normalized === 'sl'
            || str_contains($normalized, 'sick');
    }
}
