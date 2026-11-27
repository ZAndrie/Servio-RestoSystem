<?php

namespace App\Http\Requests\MenuItem;

use App\Models\MenuItem;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMenuItemRequest extends FormRequest
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
        /** @var MenuItem|null $menuItem */
        $menuItem = $this->route('menuItem');

        $imageRules = $this->hasFile('image')
            ? ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120']
            : ['sometimes', 'nullable', 'string', 'max:255', $this->safeImageStringRule($menuItem)];

        return [
            'category_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0', 'max:999999.99'],
            'is_available' => ['sometimes', 'boolean'],
            'is_popular' => ['sometimes', 'boolean'],
            'artwork' => ['sometimes', 'nullable', Rule::in(MenuItem::ARTWORKS)],
            'image' => $imageRules,
            'remove_image' => ['sometimes', 'boolean'],
        ];
    }

    private function safeImageStringRule(?MenuItem $menuItem): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail) use ($menuItem): void {
            if (! is_string($value) || $value === '') {
                return;
            }

            // Allow unchanged echo of the item's own existing image URL/path from frontend edits.
            if ($menuItem !== null && ($value === $menuItem->image || $value === $menuItem->getRawImagePath())) {
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
