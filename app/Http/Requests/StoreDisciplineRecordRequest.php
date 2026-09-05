<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDisciplineRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'employee_id' => ['required', 'integer', 'exists:employees,id'],
            'incident_date' => ['required', 'date'],
            'offense_type' => ['required', 'string', 'max:255'],
            'discipline_level' => [
                'required',
                'string',
                'max:150',
                Rule::exists('form_options', 'name')->where(
                    fn ($query) => $query->where('category', 'discipline_level')->where('is_active', true),
                ),
            ],
            'incident_description' => ['required', 'string', 'max:5000'],
            'action_taken' => ['nullable', 'string', 'max:5000'],
            'next_review_date' => ['nullable', 'date', 'after_or_equal:incident_date'],
        ];
    }
}
