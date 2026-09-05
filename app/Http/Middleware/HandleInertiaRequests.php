<?php

namespace App\Http\Middleware;

use App\Models\DisciplineRecord;
use App\Models\Employee;
use App\Models\Incident;
use App\Models\InventoryRequest;
use App\Models\LeaveRequest;
use App\Models\Reimbursement;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Middleware;
use Inertia\SessionKey;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $permissions = [];
        $approvalCounts = [
            'leave' => 0,
            'incident' => 0,
            'reimburse' => 0,
            'reimburseReceipt' => 0,
            'inventory' => 0,
        ];
        $disciplineOwnCount = 0;

        if ($user) {
            try {
                $permissionService = app(PermissionService::class);
                $permissionService->grantMissingPermissionKey('discipline.view');
                $permissionService->grantMissingPermissionKey('inventory.approvals');
                $permissionService->grantMissingPermissionKey('inventory.summary');
                $permissionService->grantMissingPermissionKey('me.view');
                $permissions = $permissionService->keysForUser($user->fresh());

                if (in_array('leave.approvals', $permissions, true)) {
                    $approvalCounts['leave'] = LeaveRequest::query()
                        ->where('status', 'pending')
                        ->count();
                }

                if (in_array('incident.manage', $permissions, true)) {
                    $approvalCounts['incident'] = Incident::query()
                        ->where('status', 'pending')
                        ->count();
                }

                if (in_array('reimburse.review', $permissions, true)) {
                    $approvalCounts['reimburse'] = Reimbursement::query()
                        ->where('status', 'pending')
                        ->count();
                    $approvalCounts['reimburseReceipt'] = Reimbursement::query()
                        ->where('status', 'for_receipt')
                        ->count();
                }

                if (in_array('inventory.approvals', $permissions, true)) {
                    $approvalCounts['inventory'] = InventoryRequest::query()
                        ->where('status', 'pending')
                        ->count();
                }

                if (in_array('discipline.view', $permissions, true)) {
                    $ownEmployeeIds = Employee::query()
                        ->whereRaw('LOWER(email) = ?', [Str::lower((string) $user->email)])
                        ->pluck('id');

                    $disciplineOwnCount = DisciplineRecord::query()
                        ->whereIn('employee_id', $ownEmployeeIds)
                        ->count();
                }
            } catch (\Throwable) {
                $permissions = [];
            }
        }

        $success = $request->session()->get('success');
        $error = $request->session()->get('error');

        if ($success || $error) {
            $request->session()->flash(SessionKey::FlashData->value, array_filter([
                'success' => $success,
                'error' => $error,
            ]));
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'permissions' => $permissions,
            ],
            'approvalCounts' => $approvalCounts,
            'disciplineOwnCount' => $disciplineOwnCount,
            'flash' => [
                'success' => $success,
                'error' => $error,
            ],
        ];
    }
}
