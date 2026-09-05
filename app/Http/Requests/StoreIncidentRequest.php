<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreIncidentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'has_injury' => filter_var($this->input('has_injury'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            'company' => $this->input('company') ?: 'Luntian',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $canChooseEmployee = $this->userCanChooseEmployee();

        return [
            'company' => ['required', 'string', 'max:150'],
            'employee_id' => [
                Rule::requiredIf($canChooseEmployee),
                'nullable',
                'integer',
                Rule::exists('employees', 'id'),
            ],
            'location_area' => ['required', 'string', 'max:255'],
            'incident_date' => ['required', 'date'],
            'incident_time' => ['required', 'date_format:H:i'],
            'incident_type_id' => [
                'required',
                'integer',
                Rule::exists('incident_types', 'id')->where(fn ($query) => $query->where('is_active', true)),
            ],
            'details' => ['required', 'string', 'max:5000'],
            'witness' => ['nullable', 'string', 'max:255'],
            'has_injury' => ['required', 'boolean'],
            'injury_types' => ['nullable', 'array'],
            'injury_types.*' => [
                'string',
                'max:150',
                Rule::exists('form_options', 'name')->where(
                    fn ($query) => $query->where('category', 'injury_type')->where('is_active', true),
                ),
            ],
            'injury_details' => [
                Rule::requiredIf(fn () => $this->boolean('has_injury')),
                'nullable',
                'string',
                'max:2000',
            ],
            'report_date' => ['required', 'date'],
            'report_time' => ['required', 'date_format:H:i'],
            'action_taken' => ['nullable', 'string', 'max:5000'],
            'attachments' => ['nullable', 'array', 'max:10'],
            'attachments.*' => ['file', 'mimes:jpg,jpeg,png,pdf,doc,docx', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'employee_id.required' => 'Please select an employee.',
            'injury_details.required' => 'Please provide additional injury details.',
        ];
    }

    private function userCanChooseEmployee(): bool
    {
        $keys = app(\App\Services\PermissionService::class)->keysForUser($this->user());

        return in_array('incident.manage', $keys, true);
    }
}
