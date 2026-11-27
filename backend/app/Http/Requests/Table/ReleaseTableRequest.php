<?php

namespace App\Http\Requests\Table;

use Illuminate\Foundation\Http\FormRequest;

class ReleaseTableRequest extends FormRequest
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
            'force' => ['sometimes', 'boolean'],
        ];
    }
}
