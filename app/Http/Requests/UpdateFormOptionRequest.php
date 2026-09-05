<?php

namespace App\Http\Requests;

use App\Support\FormOptionRegistry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFormOptionRequest extends FormRequest
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
        $category = $this->route('category');
        $formOption = $this->route('formOption');

        return [
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('form_options', 'name')
                    ->where(fn ($query) => $query->where('category', $category))
                    ->ignore($formOption),
            ],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (! in_array($this->route('category'), FormOptionRegistry::keys(), true)) {
                $validator->errors()->add('category', 'Invalid form option category.');
            }
        });
    }
}
