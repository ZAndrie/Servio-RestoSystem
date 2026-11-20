<?php

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
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
        /** @var User|null $targetUser */
        $targetUser = $this->route('user');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'username' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                'alpha_dash',
                Rule::unique('users', 'username')->ignore($targetUser?->id),
            ],
            'password' => ['sometimes', 'nullable', 'string', 'min:6', 'max:255'],
            'role' => ['sometimes', 'required', Rule::in(User::ROLES)],
        ];
    }
}
