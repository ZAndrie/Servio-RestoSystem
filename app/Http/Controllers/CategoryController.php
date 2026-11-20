<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->withCount('menuItems')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = Category::query()->create($request->validated());

        return response()->json($category, Response::HTTP_CREATED);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json($category->load('menuItems'));
    }

    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $category->update($request->validated());

        return response()->json($category->fresh());
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->menuItems()->exists()) {
            return response()->json([
                'message' => 'Cannot delete category that still has menu items.',
            ], Response::HTTP_CONFLICT);
        }

        try {
            $category->delete();
        } catch (QueryException) {
            return response()->json([
                'message' => 'Cannot delete category because it is referenced by menu items.',
            ], Response::HTTP_CONFLICT);
        }

        return response()->json([
            'message' => 'Category deleted successfully.',
        ]);
    }
}
