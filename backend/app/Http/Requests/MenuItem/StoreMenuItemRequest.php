<?php

namespace App\Http\Requests\MenuItem;

use App\Models\MenuItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMenuItemRequest extends FormRequest
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
        $imageRules = $this->hasFile('image')
            ? ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120']
            : ['nullable', 'string', 'max:255'];

        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'is_available' => ['sometimes', 'boolean'],
            'is_popular' => ['sometimes', 'boolean'],
            'artwork' => ['sometimes', 'nullable', Rule::in(MenuItem::ARTWORKS)],
            'image' => $imageRules,
        ];
    }
}
