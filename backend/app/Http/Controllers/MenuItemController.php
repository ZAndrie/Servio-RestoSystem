<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuItem\StoreMenuItemRequest;
use App\Http\Requests\MenuItem\UpdateMenuItemAvailabilityRequest;
use App\Http\Requests\MenuItem\UpdateMenuItemRequest;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

        $items = $query->orderBy('category_id')->orderBy('id')->get();

        return response()->json($items);
    }

    public function store(StoreMenuItemRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['is_available'] = array_key_exists('is_available', $data)
            ? (bool) $data['is_available']
            : true;
        $data['is_popular'] = array_key_exists('is_popular', $data)
            ? (bool) $data['is_popular']
            : false;
        $data['artwork'] = $data['artwork'] ?? $this->defaultArtworkForCategory((int) $data['category_id']);

        if ($request->hasFile('image')) {
            $storedPath = $request->file('image')->store('menu', 'public');
            $data['image'] = '/storage/'.$storedPath;
        }

        $menuItem = MenuItem::query()->create($data)->load('category');

        return response()->json($menuItem, Response::HTTP_CREATED);
    }

    public function show(MenuItem $menuItem): JsonResponse
    {
        return response()->json($menuItem->load('category'));
    }

    public function update(UpdateMenuItemRequest $request, MenuItem $menuItem): JsonResponse
    {
        $data = $request->validated();
        $removeImage = (bool) ($data['remove_image'] ?? false);
        unset($data['remove_image']);

        if ($request->hasFile('image')) {
            $oldRawImage = $menuItem->getRawImagePath();
            $storedPath = $request->file('image')->store('menu', 'public');
            $data['image'] = '/storage/'.$storedPath;
            $menuItem->update($data);
            $this->deleteStoredPathIfOwned($oldRawImage);

            return response()->json($menuItem->fresh('category'));
        }

        if ($removeImage) {
            $oldRawImage = $menuItem->getRawImagePath();
            $data['image'] = null;
            $menuItem->update($data);
            $this->deleteStoredPathIfOwned($oldRawImage);

            return response()->json($menuItem->fresh('category'));
        }

        // Preserve raw /storage/... path when frontend echoes back the resolved image URL unchanged.
        if (
            array_key_exists('image', $data)
            && is_string($data['image'])
            && ($data['image'] === $menuItem->image || $data['image'] === $menuItem->getRawImagePath())
        ) {
            unset($data['image']);
        }

        $menuItem->update($data);

        return response()->json($menuItem->fresh('category'));
    }

    public function destroy(MenuItem $menuItem): JsonResponse
    {
        if ($menuItem->orderItems()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a menu item that appears in existing orders. Mark it as Sold Out instead.',
            ], Response::HTTP_CONFLICT);
        }

        $oldRawImage = $menuItem->getRawImagePath();

        try {
            $menuItem->delete();
        } catch (QueryException) {
            return response()->json([
                'message' => 'Cannot delete menu item because it is referenced by existing orders.',
            ], Response::HTTP_CONFLICT);
        }

        $this->deleteStoredPathIfOwned($oldRawImage);

        return response()->json([
            'message' => 'Menu item deleted successfully.',
        ]);
    }

    public function updateAvailability(UpdateMenuItemAvailabilityRequest $request, MenuItem $menuItem): JsonResponse
    {
        $nextAvailable = $request->has('is_available')
            ? $request->boolean('is_available')
            : ! $menuItem->is_available;

        $menuItem->update([
            'is_available' => $nextAvailable,
        ]);

        return response()->json($menuItem->fresh('category'));
    }

    private function defaultArtworkForCategory(int $categoryId): string
    {
        $slug = strtolower((string) (Category::query()->whereKey($categoryId)->value('slug') ?? ''));

        return match ($slug) {
            'drinks' => 'glass',
            'desserts' => 'dessert',
            default => 'bowl',
        };
    }

    private function deleteStoredPathIfOwned(?string $raw): void
    {
        if ($raw && str_starts_with($raw, '/storage/')) {
            $relative = substr($raw, strlen('/storage/'));
            if ($relative !== '') {
                Storage::disk('public')->delete($relative);
            }
        }
    }
}
