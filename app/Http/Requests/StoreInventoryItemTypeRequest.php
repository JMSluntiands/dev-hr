<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInventoryItemTypeRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:150', 'unique:inventory_item_types,name'],
            'code_prefix' => [
                'required',
                'string',
                'max:20',
                'unique:inventory_item_types,code_prefix',
                'regex:/^[A-Za-z0-9]+-?$/',
            ],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code_prefix.regex' => 'Code must be letters/numbers, optionally ending with a dash (e.g. LAP-).',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('code_prefix')) {
            $prefix = strtoupper(trim((string) $this->input('code_prefix')));
            if ($prefix !== '' && ! str_ends_with($prefix, '-')) {
                $prefix .= '-';
            }
            $this->merge(['code_prefix' => $prefix]);
        }
    }
}
