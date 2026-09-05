<?php

namespace App\Http\Requests;

use App\Support\PerformanceCompetencies;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePerformanceReviewRequest extends FormRequest
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
        $keys = PerformanceCompetencies::keys();

        return [
            'review_date' => ['required', 'date'],
            'supervisor_name' => ['required', 'string', 'max:150'],
            'employee_id' => ['required', 'integer', 'exists:employees,id'],
            'ratings' => ['required', 'array'],
            'ratings.*.competency_key' => ['required', 'string', Rule::in($keys)],
            'ratings.*.rating' => ['required', 'integer', 'min:1', 'max:5'],
            'ratings.*.explanation' => ['required', 'string', 'max:5000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ratings.required' => 'Please rate all competencies.',
            'ratings.*.rating.required' => 'Select a rating for each competency.',
            'ratings.*.explanation.required' => 'Add a brief explanation for each rating.',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $keys = PerformanceCompetencies::keys();
            $submitted = collect($this->input('ratings', []))
                ->pluck('competency_key')
                ->filter()
                ->unique()
                ->values()
                ->all();

            $missing = array_diff($keys, $submitted);

            if ($missing !== []) {
                $validator->errors()->add(
                    'ratings',
                    'Please complete all competency ratings and explanations.',
                );
            }
        });
    }
}
