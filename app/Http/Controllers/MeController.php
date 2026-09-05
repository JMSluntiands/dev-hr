<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MeController extends Controller
{
    public function __construct(private PermissionService $permissions)
    {
    }

    public function show(Request $request): Response
    {
        $this->permissions->grantMissingPermissionKey('me.view');

        $user = $request->user();
        abort_unless($this->permissions->userHas($user, 'me.view'), 403);

        $employee = Employee::query()
            ->whereRaw('LOWER(email) = ?', [strtolower((string) $user->email)])
            ->first();

        return Inertia::render('Me/Show', [
            'employee' => $employee ? $this->serializeEmployee($employee) : null,
            'userName' => $user->name,
            'userEmail' => $user->email,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeEmployee(Employee $employee): array
    {
        return [
            'id' => $employee->id,
            'full_name' => $employee->full_name,
            'first_name' => $employee->first_name,
            'middle_name' => $employee->middle_name,
            'last_name' => $employee->last_name,
            'email' => $employee->email,
            'photo_url' => $this->photoUrl($employee),
            'phone' => $employee->phone,
            'date_of_birth' => optional($employee->date_of_birth)->format('Y-m-d'),
            'gender' => $employee->gender,
            'civil_status' => $employee->civil_status,
            'address' => $employee->address,
            'emergency_contact_name' => $employee->emergency_contact_name,
            'emergency_contact_relation' => $employee->emergency_contact_relation,
            'emergency_contact_phone' => $employee->emergency_contact_phone,
            'emergency_contact_same_address' => (bool) $employee->emergency_contact_same_address,
            'emergency_contact_address' => $employee->emergency_contact_address,
            'employee_number' => $employee->employee_number,
            'department' => $employee->department,
            'position' => $employee->position,
            'employment_type' => $employee->employment_type,
            'date_hired' => optional($employee->date_hired)->format('Y-m-d'),
            'employment_status' => $employee->employment_status,
            'work_location' => $employee->work_location,
            'immediate_supervisor' => $employee->immediate_supervisor,
            'tin' => $employee->tin,
            'sss_number' => $employee->sss_number,
            'philhealth_number' => $employee->philhealth_number,
            'pagibig_number' => $employee->pagibig_number,
            'nbi_clearance' => $employee->nbi_clearance,
            'police_clearance' => $employee->police_clearance,
        ];
    }

    private function photoUrl(Employee $employee): ?string
    {
        if (! $employee->photo_path) {
            return null;
        }

        return Storage::disk('public')->url($employee->photo_path);
    }
}
