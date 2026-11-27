<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;

class ChangePasswordRequest extends FormRequest
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
        /** @var User|null $user */
        $user = $this->user();
        $requiresCurrentPassword = $user !== null && ! $user->must_change_password;

        $rules = [
            'password' => ['required', 'string', 'min:6', 'max:255'],
        ];

        if ($requiresCurrentPassword) {
            $rules['current_password'] = [
                'required',
                'string',
                function (string $attribute, mixed $value, Closure $fail) use ($user): void {
                    if (! is_string($value) || ! Hash::check($value, $user->password)) {
                        $fail('The current password is incorrect.');
                    }
                },
            ];
        }

        return $rules;
    }
}
