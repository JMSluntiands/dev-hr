<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\EmploymentStatus;
use App\Models\EmploymentType;
use App\Models\FormOption;
use App\Models\User;
use App\Services\ActivityLogger;
use App\Services\PermissionService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function __construct(private PermissionService $permissions)
    {
    }

    public function index(Request $request): Response
    {
        $this->permissions->grantMissingPermissionKey('employees.edit');

        $search = trim((string) $request->string('search'));
        $sort = $request->string('sort')->toString() ?: 'created_at';
        $direction = $request->string('direction')->toString() === 'asc' ? 'asc' : 'desc';
        $perPage = (int) $request->integer('per_page', 10);

        if (! in_array($perPage, [10, 25, 50], true)) {
            $perPage = 10;
        }

        $allowedSorts = [
            'employee_number',
            'first_name',
            'email',
            'department',
            'position',
            'date_hired',
            'employment_status',
            'created_at',
        ];

        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'created_at';
        }

        $employees = Employee::query()
            ->when($search !== '', function ($query) use ($search) {
                $like = '%'.$search.'%';

                $query->where(function ($query) use ($like) {
                    $query->where('employee_number', 'like', $like)
                        ->orWhere('first_name', 'like', $like)
                        ->orWhere('middle_name', 'like', $like)
                        ->orWhere('last_name', 'like', $like)
                        ->orWhere('email', 'like', $like)
                        ->orWhere('department', 'like', $like)
                        ->orWhere('position', 'like', $like)
                        ->orWhere('employment_status', 'like', $like);
                });
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (Employee $employee) => [
                'id' => $employee->id,
                'full_name' => $employee->full_name,
                'email' => $employee->email,
                'phone' => $employee->phone,
                'photo_url' => $this->photoUrl($employee),
                'employee_number' => $employee->employee_number,
                'department' => $employee->department,
                'position' => $employee->position,
                'employment_status' => $employee->employment_status,
                'date_hired' => optional($employee->date_hired)->format('Y-m-d'),
            ]);

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Employees/Create', $this->formOptions());
    }

    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['employee_number'] = Employee::generateEmployeeNumber(
            Carbon::parse($validated['date_hired']),
        );

        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('employees', 'public');
        }

        $employee = Employee::query()->create($validated);

        $this->ensureEmployeeUserAccount($employee);

        ActivityLogger::log(
            'Employees',
            'created',
            'Added employee '.$employee->full_name,
            $employee,
            ['email' => $employee->email, 'employee_number' => $employee->employee_number],
        );

        return redirect()
            ->route('employees.index')
            ->with('success', 'Employee saved successfully. Account created with Employee role.');
    }

    public function show(Employee $employee): Response
    {
        abort_unless($this->permissions->userHas(request()->user(), 'employees.view'), 403);

        return Inertia::render('Employees/Show', [
            'employee' => [
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
            ],
            'canEdit' => $this->permissions->userHas(request()->user(), 'employees.edit'),
        ]);
    }

    public function edit(Employee $employee): Response
    {
        abort_unless($this->permissions->userHas(request()->user(), 'employees.edit'), 403);

        return Inertia::render('Employees/Edit', [
            ...$this->formOptions($employee),
            'employee' => [
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
            ],
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee): RedirectResponse
    {
        abort_unless($this->permissions->userHas($request->user(), 'employees.edit'), 403);

        $validated = $request->validated();

        if ($request->boolean('remove_photo')) {
            $this->deletePhoto($employee);
            $validated['photo_path'] = null;
        }

        if ($request->hasFile('photo')) {
            $this->deletePhoto($employee);
            $validated['photo_path'] = $request->file('photo')->store('employees', 'public');
        }

        unset($validated['remove_photo']);

        $employee->update($validated);
        $employee->refresh();

        $this->ensureEmployeeUserAccount($employee);

        ActivityLogger::log(
            'Employees',
            'updated',
            'Updated employee '.$employee->full_name,
            $employee,
            ['email' => $employee->email, 'employee_number' => $employee->employee_number],
        );

        return redirect()
            ->route('employees.index')
            ->with('success', 'Employee updated successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(?Employee $employee = null): array
    {
        return [
            'employmentTypes' => $this->withCurrentOption(
                EmploymentType::query()
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->get(['id', 'name'])
                    ->map(fn (EmploymentType $type) => ['id' => $type->id, 'name' => $type->name])
                    ->all(),
                $employee?->employment_type,
            ),
            'employmentStatuses' => $this->withCurrentOption(
                EmploymentStatus::query()
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->get(['id', 'name'])
                    ->map(fn (EmploymentStatus $status) => ['id' => $status->id, 'name' => $status->name])
                    ->all(),
                $employee?->employment_status,
            ),
            'genders' => $this->withCurrentOption(FormOption::activeOptions('gender'), $employee?->gender),
            'civilStatuses' => $this->withCurrentOption(FormOption::activeOptions('civil_status'), $employee?->civil_status),
            'departments' => $this->withCurrentOption(FormOption::activeOptions('department'), $employee?->department),
            'emergencyContactRelations' => $this->withCurrentOption(
                FormOption::activeOptions('emergency_contact_relation'),
                $employee?->emergency_contact_relation,
            ),
            'supervisors' => $this->supervisorOptions($employee),
        ];
    }

    /**
     * @return list<array{id: int|string, name: string, employee_number: ?string, department: ?string, position: ?string}>
     */
    private function supervisorOptions(?Employee $employee = null): array
    {
        $supervisors = Employee::query()
            ->when($employee, fn ($query) => $query->whereKeyNot($employee->id))
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->get(['id', 'first_name', 'middle_name', 'last_name', 'employee_number', 'department', 'position'])
            ->map(fn (Employee $item) => [
                'id' => $item->id,
                'name' => $item->full_name,
                'employee_number' => $item->employee_number,
                'department' => $item->department,
                'position' => $item->position,
            ])
            ->all();

        return $this->withCurrentSupervisor($supervisors, $employee?->immediate_supervisor);
    }

    /**
     * @param  list<array{id: int|string, name: string, employee_number: ?string, department: ?string, position: ?string}>  $supervisors
     * @return list<array{id: int|string, name: string, employee_number: ?string, department: ?string, position: ?string}>
     */
    private function withCurrentSupervisor(array $supervisors, ?string $current): array
    {
        if (! filled($current)) {
            return $supervisors;
        }

        foreach ($supervisors as $supervisor) {
            if ($supervisor['name'] === $current) {
                return $supervisors;
            }
        }

        array_unshift($supervisors, [
            'id' => 'current-'.$current,
            'name' => $current,
            'employee_number' => null,
            'department' => null,
            'position' => null,
        ]);

        return $supervisors;
    }

    /**
     * @param  list<array{id: int|string, name: string}>  $options
     * @return list<array{id: int|string, name: string}>
     */
    private function withCurrentOption(array $options, ?string $current): array
    {
        if (! filled($current)) {
            return $options;
        }

        foreach ($options as $option) {
            if ($option['name'] === $current) {
                return $options;
            }
        }

        array_unshift($options, [
            'id' => 'current-'.$current,
            'name' => $current,
        ]);

        return $options;
    }

    private function photoUrl(Employee $employee): ?string
    {
        if (! $employee->photo_path) {
            return null;
        }

        return Storage::disk('public')->url($employee->photo_path);
    }

    private function deletePhoto(Employee $employee): void
    {
        if (! $employee->photo_path) {
            return;
        }

        Storage::disk('public')->delete($employee->photo_path);
    }

    /**
     * Create a portal account for the employee with the default Employee role.
     * Existing accounts are left as-is (role is not overwritten).
     */
    private function ensureEmployeeUserAccount(Employee $employee): void
    {
        $email = Str::lower((string) $employee->email);

        if ($email === '') {
            return;
        }

        $user = User::query()->where('email', $email)->first();

        if ($user) {
            $user->forceFill([
                'name' => $employee->full_name ?: $user->name,
            ])->save();

            return;
        }

        $user = User::query()->create([
            'name' => $employee->full_name,
            'email' => $email,
            'password' => Hash::make(Str::random(40)),
            'email_verified_at' => now(),
            'role' => 'employee',
        ]);

        $this->permissions->resetUserToRoleDefaults($user->fresh());
    }
}
