<?php

namespace App\Http\Requests\MenuItem;

use App\Models\MenuItem;
use Closure;
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
            : ['nullable', 'string', 'max:255', $this->safeImageStringRule()];

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

    private function safeImageStringRule(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            if (! is_string($value) || $value === '') {
                return;
            }

            if (str_contains($value, '..')) {
                $fail('The image path is invalid.');

                return;
            }

            $normalized = strtolower($value);
            if (str_starts_with($normalized, '/storage/')) {
                $fail('Uploaded storage paths cannot be assigned directly. Upload an image file instead.');

                return;
            }

            if (str_starts_with($normalized, 'http://') || str_starts_with($normalized, 'https://')) {
                $path = strtolower((string) parse_url($value, PHP_URL_PATH));
                if (str_starts_with($path, '/storage/')) {
                    $fail('Uploaded storage paths cannot be assigned directly. Upload an image file instead.');
                }

                return;
            }

            if (! preg_match('#^/(Dishes|Desserts|Drinks)/[^\\\\]+$#i', $value)) {
                $fail('The image must be an uploaded file, an HTTP(S) URL, or a valid static menu asset path.');
            }
        };
    }
}
