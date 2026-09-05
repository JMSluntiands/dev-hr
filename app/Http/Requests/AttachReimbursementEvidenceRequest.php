<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AttachReimbursementEvidenceRequest extends FormRequest
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
            'evidence_receipt' => ['required', 'file', 'max:10240', 'mimes:jpg,jpeg,png,pdf,webp'],
        ];
    }
}
