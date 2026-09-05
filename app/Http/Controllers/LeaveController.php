<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaveRequestRequest;
use App\Http\Requests\UpdateLeaveRequestStatusRequest;
use App\Models\FormOption;
use App\Models\LeaveRequest;
use App\Models\LeaveRequestActivity;
use App\Services\ActivityLogger;
use App\Services\PermissionService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LeaveController extends Controller
{
    public function __construct(private PermissionService $permissions)
    {
    }

    public function requestForm(Request $request): Response
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'leave.request'), 403);

        $myRequests = LeaveRequest::query()
            ->with(['activities.user:id,name'])
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(fn (LeaveRequest $leave) => $this->mapLeave($leave, includeActivities: true));

        return Inertia::render('Leave/Request', [
            'myRequests' => $myRequests,
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($this->permissions->userHas($request->user(), 'leave.request'), 403);

        return Inertia::render('Leave/Create', [
            'leaveTypes' => FormOption::activeNames('leave_type'),
        ]);
    }

    public function store(StoreLeaveRequestRequest $request): RedirectResponse
    {
        abort_unless($this->permissions->userHas($request->user(), 'leave.request'), 403);

        $validated = $request->validated();
        $start = Carbon::parse($validated['start_date'])->startOfDay();
        $end = Carbon::parse($validated['end_date'])->startOfDay();
        $days = $start->diffInDays($end) + 1;

        DB::transaction(function () use ($request, $validated, $days) {
            $leave = LeaveRequest::query()->create([
                'user_id' => $request->user()->id,
                'leave_type' => $validated['leave_type'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'days' => $days,
                'reason' => $validated['reason'],
                'status' => 'pending',
            ]);

            LeaveRequestActivity::query()->create([
                'leave_request_id' => $leave->id,
                'user_id' => $request->user()->id,
                'action' => 'submitted',
                'notes' => 'Leave request submitted.',
            ]);

            ActivityLogger::log(
                'Leave',
                'submitted',
                'Submitted '.$leave->leave_type.' ('.$leave->days.' day'.($leave->days > 1 ? 's' : '').')',
                $leave,
                [
                    'leave_type' => $leave->leave_type,
                    'start_date' => $leave->start_date?->format('Y-m-d'),
                    'end_date' => $leave->end_date?->format('Y-m-d'),
                ],
            );
        });

        return redirect()
            ->route('leave.request')
            ->with('success', 'Leave request submitted.');
    }

    public function approvals(Request $request): Response
    {
        abort_unless($this->permissions->userHas($request->user(), 'leave.approvals'), 403);

        $leaves = LeaveRequest::query()
            ->with(['user:id,name,email', 'activities.user:id,name'])
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(fn (LeaveRequest $leave) => $this->mapLeave($leave, includeActivities: true, includeEmployee: true));

        return Inertia::render('Leave/Approvals', [
            'leaves' => $leaves,
        ]);
    }

    public function history(Request $request): Response
    {
        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'leave.history'), 403);
        $canApprove = $this->permissions->userHas($user, 'leave.approvals');

        $leaves = LeaveRequest::query()
            ->with(['user:id,name,email', 'reviewer:id,name', 'activities.user:id,name'])
            ->when(! $canApprove, fn ($query) => $query->where('user_id', $user->id))
            ->whereIn('status', ['approved', 'rejected', 'cancelled'])
            ->latest()
            ->get()
            ->map(fn (LeaveRequest $leave) => $this->mapLeave(
                $leave,
                includeActivities: true,
                includeEmployee: $canApprove,
            ));

        return Inertia::render('Leave/History', [
            'leaves' => $leaves,
            'canApprove' => $canApprove,
        ]);
    }

    public function updateStatus(
        UpdateLeaveRequestStatusRequest $request,
        LeaveRequest $leaveRequest,
    ): RedirectResponse {
        abort_unless($this->permissions->userHas($request->user(), 'leave.approvals'), 403);

        if ($leaveRequest->status !== 'pending') {
            return back()->with('error', 'Only pending leave requests can be reviewed.');
        }

        $validated = $request->validated();
        $status = $validated['status'];

        DB::transaction(function () use ($request, $leaveRequest, $validated, $status) {
            $leaveRequest->update([
                'status' => $status,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'review_notes' => $validated['review_notes'] ?? null,
            ]);

            LeaveRequestActivity::query()->create([
                'leave_request_id' => $leaveRequest->id,
                'user_id' => $request->user()->id,
                'action' => $status,
                'notes' => $validated['review_notes']
                    ?? ('Leave request '.$status.'.'),
            ]);

            ActivityLogger::log(
                'Leave',
                $status,
                ucfirst($status).' leave request #'.$leaveRequest->id.' ('.$leaveRequest->leave_type.')',
                $leaveRequest,
                [
                    'status' => $status,
                    'review_notes' => $validated['review_notes'] ?? null,
                ],
            );
        });

        return redirect()
            ->route('leave.approvals')
            ->with('success', 'Leave request '.$status.'.');
    }

    public function cancel(Request $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        abort_unless($this->permissions->userHas($request->user(), 'leave.request'), 403);

        if ($leaveRequest->user_id !== $request->user()->id) {
            abort(403);
        }

        if ($leaveRequest->status !== 'pending') {
            return back()->with('error', 'Only pending requests can be cancelled.');
        }

        DB::transaction(function () use ($request, $leaveRequest) {
            $leaveRequest->update([
                'status' => 'cancelled',
                'reviewed_at' => now(),
            ]);

            LeaveRequestActivity::query()->create([
                'leave_request_id' => $leaveRequest->id,
                'user_id' => $request->user()->id,
                'action' => 'cancelled',
                'notes' => 'Leave request cancelled by employee.',
            ]);

            ActivityLogger::log(
                'Leave',
                'cancelled',
                'Cancelled leave request #'.$leaveRequest->id.' ('.$leaveRequest->leave_type.')',
                $leaveRequest,
            );
        });

        return redirect()
            ->route('leave.request')
            ->with('success', 'Leave request cancelled.');
    }

    /**
     * @return array<string, mixed>
     */
    private function mapLeave(
        LeaveRequest $leave,
        bool $includeActivities = false,
        bool $includeEmployee = false,
    ): array {
        $data = [
            'id' => $leave->id,
            'leave_type' => $leave->leave_type,
            'start_date' => $leave->start_date?->format('Y-m-d'),
            'end_date' => $leave->end_date?->format('Y-m-d'),
            'days' => $leave->days,
            'reason' => $leave->reason,
            'status' => $leave->status,
            'review_notes' => $leave->review_notes,
            'reviewed_at' => $leave->reviewed_at?->toDateTimeString(),
            'reviewer_name' => $leave->reviewer?->name,
            'created_at' => $leave->created_at?->toDateTimeString(),
        ];

        if ($includeEmployee) {
            $data['employee_name'] = $leave->user?->name;
            $data['employee_email'] = $leave->user?->email;
        }

        if ($includeActivities) {
            $data['activities'] = $leave->activities->map(fn (LeaveRequestActivity $activity) => [
                'id' => $activity->id,
                'action' => $activity->action,
                'notes' => $activity->notes,
                'user_name' => $activity->user?->name ?? 'System',
                'created_at' => $activity->created_at?->toDateTimeString(),
            ])->values();
        }

        return $data;
    }
}
