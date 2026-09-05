<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreIncidentRequest;
use App\Http\Requests\UpdateIncidentStatusRequest;
use App\Models\Employee;
use App\Models\FormOption;
use App\Models\Incident;
use App\Models\IncidentAttachment;
use App\Models\IncidentType;
use App\Services\ActivityLogger;
use App\Services\AttendanceClockService;
use App\Services\PermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class IncidentController extends Controller
{
    public function __construct(private PermissionService $permissions)
    {
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'incident.view'), 403);

        $this->permissions->grantMissingPermissionKey('incident.manage');

        $canManage = $this->permissions->userHas($user, 'incident.manage');
        $ownEmployeeIds = $this->employeeIdsForUser($user);

        // Managers: approved only. Employees: reports they submitted OR about them.
        $incidents = Incident::query()
            ->with(['incidentType:id,name', 'reportedBy:id,name,email', 'reviewer:id,name'])
            ->when(
                $canManage,
                fn ($query) => $query->where('status', 'approved'),
                function ($query) use ($user, $ownEmployeeIds) {
                    $query
                        ->whereIn('status', ['pending', 'approved', 'rejected'])
                        ->where(function ($scope) use ($user, $ownEmployeeIds) {
                            $scope->where('reported_by_user_id', $user->id);

                            if ($ownEmployeeIds !== []) {
                                $scope->orWhereIn('employee_id', $ownEmployeeIds);
                            }
                        });
                },
            )
            ->latest()
            ->get()
            ->map(fn (Incident $incident) => $this->mapIncident($incident));

        return Inertia::render('Incidents/Index', [
            'incidents' => $incidents,
            'canManage' => $canManage,
            'canCreate' => $this->permissions->userHas($user, 'incident.create'),
            'canApprove' => $canManage,
            'currentUserId' => $user->id,
        ]);
    }

    public function approvals(Request $request): Response
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'incident.manage'), 403);

        $incidents = Incident::query()
            ->with(['incidentType:id,name', 'reportedBy:id,name,email'])
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(fn (Incident $incident) => $this->mapIncident($incident, detailed: true));

        return Inertia::render('Incidents/Approvals', [
            'incidents' => $incidents,
        ]);
    }

    public function create(Request $request): Response
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'incident.create'), 403);

        $canManage = $this->permissions->userHas($user, 'incident.manage');

        $incidentTypes = IncidentType::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name']);

        $employees = $canManage
            ? Employee::query()
                ->where('employment_status', 'active')
                ->orderBy('first_name')
                ->orderBy('last_name')
                ->get(['id', 'first_name', 'middle_name', 'last_name', 'email', 'employee_number'])
                ->map(fn (Employee $employee) => [
                    'id' => $employee->id,
                    'name' => $employee->full_name,
                    'email' => $employee->email,
                    'employee_number' => $employee->employee_number,
                ])
            : [];

        return Inertia::render('Incidents/Create', [
            'incidentTypes' => $incidentTypes,
            'employees' => $employees,
            'canChooseEmployee' => $canManage,
            'defaults' => [
                'company' => 'Luntian',
                'employee_name' => $user->name,
                'report_date' => now(AttendanceClockService::TIMEZONE)->format('Y-m-d'),
                'report_time' => now(AttendanceClockService::TIMEZONE)->format('H:i'),
            ],
            'injuryOptions' => FormOption::activeNames('injury_type'),
        ]);
    }

    public function store(StoreIncidentRequest $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'incident.create'), 403);

        $canManage = $this->permissions->userHas($user, 'incident.manage');
        $validated = $request->validated();

        $employeeName = $user->name;
        $employeeId = null;

        if ($canManage && ! empty($validated['employee_id'])) {
            $employee = Employee::query()->findOrFail($validated['employee_id']);
            $employeeName = $employee->full_name;
            $employeeId = $employee->id;
        } elseif (! $canManage) {
            $ownEmployee = Employee::query()
                ->whereRaw('LOWER(email) = ?', [Str::lower((string) $user->email)])
                ->first();

            if ($ownEmployee) {
                $employeeId = $ownEmployee->id;
                $employeeName = $ownEmployee->full_name;
            }
        }

        DB::transaction(function () use ($request, $validated, $user, $employeeName, $employeeId) {
            $incident = Incident::query()->create([
                'company' => $validated['company'] ?? 'Luntian',
                'reported_by_user_id' => $user->id,
                'employee_id' => $employeeId,
                'employee_name' => $employeeName,
                'location_area' => $validated['location_area'],
                'incident_date' => $validated['incident_date'],
                'incident_time' => $validated['incident_time'],
                'incident_type_id' => $validated['incident_type_id'],
                'details' => $validated['details'],
                'witness' => $validated['witness'] ?? null,
                'has_injury' => $validated['has_injury'],
                'injury_types' => ($validated['has_injury'] ?? false)
                    ? ($validated['injury_types'] ?? [])
                    : [],
                'injury_details' => ($validated['has_injury'] ?? false)
                    ? ($validated['injury_details'] ?? null)
                    : null,
                'report_date' => $validated['report_date'],
                'report_time' => $validated['report_time'],
                'action_taken' => $validated['action_taken'] ?? null,
                'status' => 'pending',
            ]);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('incidents', 'public');

                    IncidentAttachment::query()->create([
                        'incident_id' => $incident->id,
                        'original_name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'mime_type' => $file->getClientMimeType(),
                        'size' => $file->getSize(),
                    ]);
                }
            }

            ActivityLogger::log(
                'Incident',
                'submitted',
                'Submitted incident report for '.$employeeName.' (pending approval)',
                $incident,
                [
                    'location_area' => $incident->location_area,
                    'incident_date' => $incident->incident_date?->format('Y-m-d'),
                ],
            );
        });

        return redirect()
            ->route('incident.index')
            ->with('success', 'Incident report submitted and waiting for approval.');
    }

    public function updateStatus(
        UpdateIncidentStatusRequest $request,
        Incident $incident,
    ): RedirectResponse {
        abort_unless($this->permissions->userHas($request->user(), 'incident.manage'), 403);

        if ($incident->status !== 'pending') {
            return back()->with('error', 'Only pending incident reports can be reviewed.');
        }

        $validated = $request->validated();
        $status = $validated['status'];

        $incident->update([
            'status' => $status,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'review_notes' => $validated['review_notes'] ?? null,
        ]);

        ActivityLogger::log(
            'Incident',
            $status,
            ucfirst($status).' incident report for '.$incident->employee_name,
            $incident,
            [
                'status' => $status,
                'review_notes' => $validated['review_notes'] ?? null,
            ],
        );

        return redirect()
            ->route('incident.approvals')
            ->with('success', 'Incident report '.$status.'.');
    }

    public function show(Request $request, Incident $incident): Response
    {
        abort_unless($this->permissions->userHas($request->user(), 'incident.view'), 403);
        abort_unless($this->canAccessIncident($request, $incident), 403);

        $incident->load([
            'incidentType:id,name',
            'reportedBy:id,name,email',
            'reviewer:id,name',
            'attachments',
        ]);

        $canManage = $this->permissions->userHas($request->user(), 'incident.manage');

        return Inertia::render('Incidents/Show', [
            'incident' => $this->mapIncident($incident, detailed: true),
            'canDelete' => $this->canDeleteIncident($request, $incident),
            'canApprove' => $canManage && $incident->status === 'pending',
        ]);
    }

    public function destroy(Request $request, Incident $incident): RedirectResponse
    {
        abort_unless($this->permissions->userHas($request->user(), 'incident.view'), 403);
        abort_unless($this->canDeleteIncident($request, $incident), 403);

        $employeeName = $incident->employee_name;
        $incidentId = $incident->id;

        DB::transaction(function () use ($incident) {
            $incident->load('attachments');

            foreach ($incident->attachments as $attachment) {
                Storage::disk('public')->delete($attachment->path);
            }

            $incident->delete();
        });

        ActivityLogger::log(
            'Incident',
            'deleted',
            'Deleted incident report for '.$employeeName,
            null,
            [
                'incident_id' => $incidentId,
                'employee_name' => $employeeName,
            ],
        );

        return redirect()
            ->route('incident.index')
            ->with('success', 'Incident report deleted successfully.');
    }

    private function canAccessIncident(Request $request, Incident $incident): bool
    {
        $user = $request->user();

        if ($this->permissions->userHas($user, 'incident.manage')) {
            return true;
        }

        if ((int) $incident->reported_by_user_id === (int) $user->id) {
            return true;
        }

        $ownEmployeeIds = $this->employeeIdsForUser($user);

        return $incident->employee_id
            && in_array((int) $incident->employee_id, $ownEmployeeIds, true);
    }

    private function canDeleteIncident(Request $request, Incident $incident): bool
    {
        // Approved records stay on the main list; managers can still delete.
        // Submitters may only delete their own pending reports.
        if ($this->permissions->userHas($request->user(), 'incident.manage')) {
            return true;
        }

        return (int) $incident->reported_by_user_id === (int) $request->user()->id
            && $incident->status === 'pending';
    }

    /**
     * @return list<int>
     */
    private function employeeIdsForUser($user): array
    {
        return Employee::query()
            ->whereRaw('LOWER(email) = ?', [Str::lower((string) $user->email)])
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function mapIncident(Incident $incident, bool $detailed = false): array
    {
        $data = [
            'id' => $incident->id,
            'reported_by_user_id' => $incident->reported_by_user_id,
            'company' => $incident->company,
            'employee_name' => $incident->employee_name,
            'submitted_by' => $incident->reportedBy?->name,
            'submitted_by_email' => $incident->reportedBy?->email,
            'location_area' => $incident->location_area,
            'incident_date' => $incident->incident_date?->format('Y-m-d'),
            'incident_time' => substr((string) $incident->incident_time, 0, 5),
            'incident_type' => $incident->incidentType?->name,
            'has_injury' => $incident->has_injury,
            'status' => $incident->status,
            'reviewed_by_name' => $incident->reviewer?->name,
            'reviewed_at' => $incident->reviewed_at?->toDateTimeString(),
            'review_notes' => $incident->review_notes,
            'created_at' => $incident->created_at?->toDateTimeString(),
        ];

        if ($detailed) {
            $data = array_merge($data, [
                'details' => $incident->details,
                'witness' => $incident->witness,
                'injury_types' => $incident->injury_types ?? [],
                'injury_details' => $incident->injury_details,
                'report_date' => $incident->report_date?->format('Y-m-d'),
                'report_time' => substr((string) $incident->report_time, 0, 5),
                'action_taken' => $incident->action_taken,
                'attachments' => ($incident->relationLoaded('attachments') ? $incident->attachments : collect())
                    ->map(fn ($attachment) => [
                        'id' => $attachment->id,
                        'original_name' => $attachment->original_name,
                        'url' => Storage::disk('public')->url($attachment->path),
                        'mime_type' => $attachment->mime_type,
                        'size' => $attachment->size,
                    ])
                    ->all(),
            ]);
        }

        return $data;
    }
}
