<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuItem\StoreMenuItemRequest;
use App\Http\Requests\MenuItem\UpdateMenuItemAvailabilityRequest;
use App\Http\Requests\MenuItem\UpdateMenuItemRequest;
use App\Models\MenuItem;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MenuItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = MenuItem::query()->with('category');

        if ($request->filled('category_id')) {
            $query->where('category_id', (int) $request->query('category_id'));
        }

        if ($request->has('is_available') && $request->query('is_available') !== '') {
            $isAvailable = filter_var(
                $request->query('is_available'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            );

            if ($isAvailable !== null) {
                $query->where('is_available', $isAvailable);
            }
        }

        $items = $query->orderBy('category_id')->orderBy('name')->get();

        return response()->json($items);
    }

    public function store(StoreMenuItemRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['is_available'] = $data['is_available'] ?? true;

        $menuItem = MenuItem::query()->create($data)->load('category');

        return response()->json($menuItem, Response::HTTP_CREATED);
    }

    public function show(MenuItem $menuItem): JsonResponse
    {
        return response()->json($menuItem->load('category'));
    }

    public function update(UpdateMenuItemRequest $request, MenuItem $menuItem): JsonResponse
    {
        $menuItem->update($request->validated());

        return response()->json($menuItem->fresh('category'));
    }

    public function destroy(MenuItem $menuItem): JsonResponse
    {
        if ($menuItem->orderItems()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a menu item that appears in existing orders. Mark it as Sold Out instead.',
            ], Response::HTTP_CONFLICT);
        }

        try {
            $menuItem->delete();
        } catch (QueryException) {
            return response()->json([
                'message' => 'Cannot delete menu item because it is referenced by existing orders.',
            ], Response::HTTP_CONFLICT);
        }

        return response()->json([
            'message' => 'Menu item deleted successfully.',
        ]);
    }

    public function updateAvailability(UpdateMenuItemAvailabilityRequest $request, MenuItem $menuItem): JsonResponse
    {
        $menuItem->update([
            'is_available' => $request->boolean('is_available'),
        ]);

        return response()->json($menuItem->fresh('category'));
    }
}
