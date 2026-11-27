<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\ResetPasswordRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::query()->orderBy('id')->get();

        return response()->json($users);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['is_active'] = true;
        $data['must_change_password'] = true;

        $user = User::query()->create($data);

        return response()->json($user->fresh(), Response::HTTP_CREATED);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json($user);
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();

        if (array_key_exists('password', $data) && ($data['password'] === null || $data['password'] === '')) {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json($user->fresh());
    }

    public function toggleActive(Request $request, User $user): JsonResponse
    {
        if ($request->user()?->id === $user->id && $user->is_active) {
            return response()->json([
                'message' => 'You cannot deactivate your own account.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $nextActive = ! $user->is_active;
        $user->update(['is_active' => $nextActive]);

        if (! $nextActive) {
            $user->tokens()->delete();
        }

        return response()->json($user->fresh());
    }

    public function resetPassword(ResetPasswordRequest $request, User $user): JsonResponse
    {
        $user->update([
            'password' => $request->validated('password'),
            'must_change_password' => true,
        ]);

        // Revoke active sessions so the user must sign in with the temporary password.
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Temporary password set. The staff member must change it on next sign-in.',
            'user' => $user->fresh(),
        ]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()?->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $user->tokens()->delete();
            $user->delete();
        } catch (QueryException) {
            return response()->json([
                'message' => 'Cannot delete user because they are associated with existing orders.',
            ], Response::HTTP_CONFLICT);
        }

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }
}
