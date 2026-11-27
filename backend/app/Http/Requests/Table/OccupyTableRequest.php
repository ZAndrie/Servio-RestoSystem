<?php

namespace App\Http\Requests\Table;

use Illuminate\Foundation\Http\FormRequest;

class OccupyTableRequest extends FormRequest
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
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'order_ref' => ['nullable', 'string', 'max:20'],
        ];
    }
}
