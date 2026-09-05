<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDisciplineRecordRequest;
use App\Http\Requests\UpdateDisciplineStatusRequest;
use App\Models\DisciplineRecord;
use App\Models\Employee;
use App\Models\FormOption;
use App\Services\ActivityLogger;
use App\Services\PermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DisciplineController extends Controller
{
    public function __construct(private PermissionService $permissions)
    {
    }

    public function index(Request $request): Response
    {
        $this->permissions->grantMissingPermissionKey('discipline.view');
        $this->permissions->grantMissingPermissionKey('discipline.create');

        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'discipline.view'), 403);

        $canManage = $this->permissions->userHas($user, 'discipline.manage');
        $canCreate = $this->permissions->userHas($user, 'discipline.create');
        $search = trim((string) $request->string('search'));
        $sort = $request->string('sort')->toString() ?: 'created_at';
        $direction = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';
        $perPage = (int) $request->integer('per_page', 10);

        if (! in_array($perPage, [10, 25, 50], true)) {
            $perPage = 10;
        }

        $allowedSorts = [
            'employee_name',
            'incident_date',
            'offense_type',
            'discipline_level',
            'next_review_date',
            'created_at',
        ];

        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'created_at';
        }

        $ownEmployeeIds = Employee::query()
            ->whereRaw('LOWER(email) = ?', [strtolower((string) $user->email)])
            ->pluck('id');

        $records = DisciplineRecord::query()
            ->with(['recordedBy:id,name,email', 'employee:id,employee_number,department'])
            ->when($canManage, function ($query) {
                // HR/Admin: all records
            }, function ($query) use ($canCreate, $user, $ownEmployeeIds) {
                $query->where(function ($query) use ($canCreate, $user, $ownEmployeeIds) {
                    // Employees: only records filed against them
                    $query->whereIn('employee_id', $ownEmployeeIds);

                    // Creators without manage: also see records they filed
                    if ($canCreate) {
                        $query->orWhere('recorded_by_user_id', $user->id);
                    }
                });
            })
            ->when($search !== '', function ($query) use ($search) {
                $like = '%'.$search.'%';

                $query->where(function ($query) use ($like) {
                    $query->where('employee_name', 'like', $like)
                        ->orWhere('offense_type', 'like', $like)
                        ->orWhere('discipline_level', 'like', $like)
                        ->orWhere('incident_description', 'like', $like);
                });
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (DisciplineRecord $record) => [
                'id' => $record->id,
                'employee_name' => $record->employee_name,
                'employee_number' => $record->employee?->employee_number,
                'department' => $record->employee?->department,
                'recorded_by' => $record->recordedBy?->name,
                'recorded_by_email' => $record->recordedBy?->email,
                'incident_date' => optional($record->incident_date)->format('Y-m-d'),
                'offense_type' => $record->offense_type,
                'discipline_level' => $record->discipline_level,
                'incident_description' => $record->incident_description,
                'action_taken' => $record->action_taken,
                'next_review_date' => optional($record->next_review_date)->format('Y-m-d'),
                'status' => $record->status ?: 'Active',
                'created_at' => $record->created_at?->toDateTimeString(),
            ]);

        $isOwnView = ! $canManage && ! $canCreate;

        $progress = null;
        if ($isOwnView && $ownEmployeeIds->isNotEmpty()) {
            $progress = $this->buildProgressForEmployee((int) $ownEmployeeIds->first());
        }

        return Inertia::render('Discipline/Index', [
            'records' => $records,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
            'canManage' => $canManage,
            'canCreate' => $canCreate,
            'isOwnView' => $isOwnView,
            'progress' => $progress,
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($this->permissions->userHas($request->user(), 'discipline.create'), 403);

        return Inertia::render('Discipline/Create', [
            'employees' => Employee::query()
                ->orderBy('first_name')
                ->orderBy('last_name')
                ->get(['id', 'first_name', 'middle_name', 'last_name', 'email', 'employee_number', 'department', 'position'])
                ->map(fn (Employee $employee) => [
                    'id' => $employee->id,
                    'name' => $employee->full_name,
                    'employee_number' => $employee->employee_number,
                    'department' => $employee->department,
                    'position' => $employee->position,
                ]),
            'disciplineLevels' => FormOption::activeOptions('discipline_level'),
        ]);
    }

    public function store(StoreDisciplineRecordRequest $request): RedirectResponse
    {
        abort_unless($this->permissions->userHas($request->user(), 'discipline.create'), 403);

        $validated = $request->validated();
        $employee = Employee::query()->findOrFail($validated['employee_id']);

        $record = DisciplineRecord::query()->create([
            'recorded_by_user_id' => $request->user()->id,
            'employee_id' => $employee->id,
            'employee_name' => $employee->full_name,
            'incident_date' => $validated['incident_date'],
            'offense_type' => $validated['offense_type'],
            'discipline_level' => $validated['discipline_level'],
            'incident_description' => $validated['incident_description'],
            'action_taken' => $validated['action_taken'] ?? null,
            'next_review_date' => $validated['next_review_date'] ?? null,
            'status' => 'Active',
            'counts_for_progress' => true,
        ]);

        ActivityLogger::log(
            'Discipline',
            'created',
            'Added discipline record for '.$employee->full_name,
            $record,
            [
                'discipline_level' => $record->discipline_level,
                'incident_date' => $record->incident_date?->format('Y-m-d'),
            ],
        );

        return redirect()
            ->route('discipline.index')
            ->with('success', 'Discipline record saved successfully.');
    }

    public function show(Request $request, DisciplineRecord $discipline): Response
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'discipline.view'), 403);
        abort_unless($this->canAccessRecord($user, $discipline), 403);

        $discipline->load([
            'recordedBy:id,name,email',
            'employee:id,employee_number,department,position,email',
        ]);

        $canManage = $this->permissions->userHas($user, 'discipline.manage');
        $canCreate = $this->permissions->userHas($user, 'discipline.create');

        return Inertia::render('Discipline/Show', [
            'record' => [
                'id' => $discipline->id,
                'employee_id' => $discipline->employee_id,
                'employee_name' => $discipline->employee_name,
                'employee_number' => $discipline->employee?->employee_number,
                'department' => $discipline->employee?->department,
                'position' => $discipline->employee?->position,
                'employee_email' => $discipline->employee?->email,
                'recorded_by' => $discipline->recordedBy?->name,
                'recorded_by_email' => $discipline->recordedBy?->email,
                'incident_date' => optional($discipline->incident_date)->format('Y-m-d'),
                'offense_type' => $discipline->offense_type,
                'discipline_level' => $discipline->discipline_level,
                'incident_description' => $discipline->incident_description,
                'action_taken' => $discipline->action_taken,
                'next_review_date' => optional($discipline->next_review_date)->format('Y-m-d'),
                'status' => $discipline->status ?: 'Active',
                'created_at' => $discipline->created_at?->format('M j, Y g:i A'),
            ],
            'progress' => $this->buildProgressForEmployee((int) $discipline->employee_id),
            'canUpdateStatus' => $canManage || $canCreate,
            'canReset' => $canManage,
        ]);
    }

    public function resetProgress(Request $request, Employee $employee): RedirectResponse
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'discipline.manage'), 403);

        $updated = DisciplineRecord::query()
            ->where('employee_id', $employee->id)
            ->where('counts_for_progress', true)
            ->update([
                'counts_for_progress' => false,
                'status' => 'Resolved',
            ]);

        ActivityLogger::log(
            'Discipline',
            'progress_reset',
            'Reset discipline progress for '.$employee->full_name.' ('.$updated.' record'.($updated === 1 ? '' : 's').')',
            $employee,
            ['records_updated' => $updated],
        );

        return back()->with('success', 'Discipline progress reset for '.$employee->full_name.'.');
    }

    public function updateStatus(
        UpdateDisciplineStatusRequest $request,
        DisciplineRecord $discipline,
    ): RedirectResponse {
        $user = $request->user();
        abort_unless(
            $this->permissions->userHas($user, 'discipline.manage')
                || $this->permissions->userHas($user, 'discipline.create'),
            403,
        );

        $validated = $request->validated();
        $previous = $discipline->status ?: 'Active';

        $discipline->update([
            'status' => $validated['status'],
        ]);

        ActivityLogger::log(
            'Discipline',
            'status_updated',
            'Updated discipline status for '.$discipline->employee_name.' from '.$previous.' to '.$validated['status'],
            $discipline,
            [
                'from' => $previous,
                'to' => $validated['status'],
            ],
        );

        return back()->with('success', 'Discipline status updated to '.$validated['status'].'.');
    }

    /**
     * @return array{current_level: int, total_levels: int, steps: list<array{key: string, label: string}>, latest_status: string|null}
     */
    private function buildProgressForEmployee(int $employeeId): array
    {
        $steps = [
            ['key' => 'verbal warning', 'label' => 'Verbal'],
            ['key' => 'written warning', 'label' => 'Written'],
            ['key' => 'final warning', 'label' => 'Final'],
            ['key' => 'suspension', 'label' => 'Suspension'],
            ['key' => 'termination', 'label' => 'Termination'],
        ];

        $records = DisciplineRecord::query()
            ->where('employee_id', $employeeId)
            ->where('counts_for_progress', true)
            ->orderByDesc('created_at')
            ->get(['discipline_level', 'status', 'created_at']);

        $currentLevel = 0;

        foreach ($records as $record) {
            $rank = $this->levelRank((string) $record->discipline_level);
            if ($rank > $currentLevel) {
                $currentLevel = $rank;
            }
        }

        $latest = $records->first();

        return [
            'current_level' => $currentLevel,
            'total_levels' => count($steps),
            'steps' => $steps,
            'latest_status' => $latest?->status ?: ($records->isEmpty() ? null : 'Active'),
        ];
    }

    private function levelRank(string $level): int
    {
        $normalized = strtolower(trim($level));

        return match (true) {
            str_contains($normalized, 'verbal') => 1,
            str_contains($normalized, 'written') => 2,
            str_contains($normalized, 'final') => 3,
            str_contains($normalized, 'suspension') => 4,
            str_contains($normalized, 'termination') => 5,
            default => 0,
        };
    }

    private function canAccessRecord($user, DisciplineRecord $discipline): bool
    {
        if ($this->permissions->userHas($user, 'discipline.manage')) {
            return true;
        }

        if (
            $this->permissions->userHas($user, 'discipline.create')
            && (int) $discipline->recorded_by_user_id === (int) $user->id
        ) {
            return true;
        }

        $ownEmployeeIds = Employee::query()
            ->whereRaw('LOWER(email) = ?', [strtolower((string) $user->email)])
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();

        return in_array((int) $discipline->employee_id, $ownEmployeeIds, true);
    }
}
