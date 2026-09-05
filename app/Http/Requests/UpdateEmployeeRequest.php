<?php

namespace App\Http\Requests;

use App\Models\Employee;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $sameAddress = filter_var(
            $this->input('emergency_contact_same_address'),
            FILTER_VALIDATE_BOOLEAN,
            FILTER_NULL_ON_FAILURE,
        ) ?? false;

        $this->merge([
            'emergency_contact_same_address' => $sameAddress,
            'emergency_contact_address' => $sameAddress
                ? $this->input('address')
                : $this->input('emergency_contact_address'),
            'remove_photo' => filter_var(
                $this->input('remove_photo'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE,
            ) ?? false,
        ]);

        if (! $this->hasFile('photo')) {
            $this->request->remove('photo');
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Employee $employee */
        $employee = $this->route('employee');

        return [
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('employees', 'email')->ignore($employee->id),
                'regex:/^[A-Za-z0-9._%+-]+@luntiands\.com$/i',
            ],
            'photo' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'remove_photo' => ['boolean'],
            'phone' => ['nullable', 'string', 'max:30'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => [
                'nullable',
                'string',
                'max:150',
                Rule::exists('form_options', 'name')->where(
                    fn ($query) => $query->where('category', 'gender')->where(function ($query) use ($employee) {
                        $query->where('is_active', true)
                            ->orWhere('name', $employee->gender);
                    }),
                ),
            ],
            'civil_status' => [
                'nullable',
                'string',
                'max:150',
                Rule::exists('form_options', 'name')->where(
                    fn ($query) => $query->where('category', 'civil_status')->where(function ($query) use ($employee) {
                        $query->where('is_active', true)
                            ->orWhere('name', $employee->civil_status);
                    }),
                ),
            ],
            'address' => ['nullable', 'string', 'max:1000'],
            'emergency_contact_name' => ['nullable', 'string', 'max:150'],
            'emergency_contact_relation' => [
                'nullable',
                'string',
                'max:150',
                Rule::exists('form_options', 'name')->where(
                    fn ($query) => $query->where('category', 'emergency_contact_relation')->where(function ($query) use ($employee) {
                        $query->where('is_active', true)
                            ->orWhere('name', $employee->emergency_contact_relation);
                    }),
                ),
            ],
            'emergency_contact_phone' => ['nullable', 'string', 'max:30'],
            'emergency_contact_same_address' => ['boolean'],
            'emergency_contact_address' => ['nullable', 'string', 'max:1000'],
            'department' => [
                'required',
                'string',
                'max:150',
                Rule::exists('form_options', 'name')->where(
                    fn ($query) => $query->where('category', 'department')->where(function ($query) use ($employee) {
                        $query->where('is_active', true)
                            ->orWhere('name', $employee->department);
                    }),
                ),
            ],
            'position' => ['nullable', 'string', 'max:150'],
            'employment_type' => [
                'nullable',
                'string',
                'max:150',
                Rule::exists('employment_types', 'name')->where(function ($query) use ($employee) {
                    $query->where('is_active', true)
                        ->orWhere('name', $employee->employment_type);
                }),
            ],
            'date_hired' => ['required', 'date'],
            'employment_status' => [
                'required',
                'string',
                'max:150',
                Rule::exists('employment_statuses', 'name')->where(function ($query) use ($employee) {
                    $query->where('is_active', true)
                        ->orWhere('name', $employee->employment_status);
                }),
            ],
            'work_location' => ['nullable', 'string', 'max:150'],
            'immediate_supervisor' => ['nullable', 'string', 'max:150'],
            'tin' => ['nullable', 'string', 'max:50'],
            'sss_number' => ['nullable', 'string', 'max:50'],
            'philhealth_number' => ['nullable', 'string', 'max:50'],
            'pagibig_number' => ['nullable', 'string', 'max:50'],
            'nbi_clearance' => ['nullable', 'string', 'max:100'],
            'police_clearance' => ['nullable', 'string', 'max:100'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.regex' => 'Only @luntiands.com Workspace emails can be used for employees.',
            'email.unique' => 'This employee email is already registered.',
        ];
    }
}
