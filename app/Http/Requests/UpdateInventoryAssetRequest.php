<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInventoryAssetRequest extends FormRequest
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
        $asset = $this->route('asset');

        return [
            'item_code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('inventory_assets', 'item_code')->ignore($asset?->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'type' => ['nullable', 'string', 'max:150'],
            'allocated_to_employee_id' => ['nullable', 'integer', 'exists:employees,id'],
            'condition' => ['nullable', 'string', 'max:100'],
            'remarks' => ['nullable', 'string', 'max:5000'],
            'date_arrived' => ['nullable', 'date'],
            'date_purchased' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'max:100'],
            'brand' => ['nullable', 'string', 'max:150'],
            'bought_through_request' => ['sometimes', 'boolean'],
            'inventory_request_id' => [
                'nullable',
                'integer',
                'exists:inventory_requests,id',
                'required_if:bought_through_request,1',
                'required_if:bought_through_request,true',
            ],
            'pictures' => ['nullable', 'array', 'max:10'],
            'pictures.*' => ['image', 'max:5120'],
            'remove_pictures' => ['sometimes', 'array'],
            'remove_pictures.*' => ['string', 'max:500'],
        ];
    }
}
