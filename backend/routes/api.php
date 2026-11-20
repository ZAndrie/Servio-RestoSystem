<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Public authentication endpoint
Route::post('/login', [AuthController::class, 'login']);

// Protected API endpoints (Sanctum token required)
Route::middleware('auth:sanctum')->group(function (): void {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Users (Admin only)
    Route::middleware('role:admin')->group(function (): void {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });

    // Categories (GET: all authenticated roles; write: Admin only)
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::middleware('role:admin')->group(function (): void {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });

    // Menu Items (GET: all authenticated roles; write & availability: Admin only)
    Route::get('/menu-items', [MenuItemController::class, 'index']);
    Route::get('/menu-items/{menuItem}', [MenuItemController::class, 'show']);
    Route::middleware('role:admin')->group(function (): void {
        Route::post('/menu-items', [MenuItemController::class, 'store']);
        Route::put('/menu-items/{menuItem}', [MenuItemController::class, 'update']);
        Route::delete('/menu-items/{menuItem}', [MenuItemController::class, 'destroy']);
        Route::patch('/menu-items/{menuItem}/availability', [MenuItemController::class, 'updateAvailability']);
    });

    // Tables (Waiter, Admin)
    Route::get('/tables', [TableController::class, 'index'])
        ->middleware('role:waiter,admin');

    // Orders
    Route::post('/orders', [OrderController::class, 'store'])
        ->middleware('role:waiter');
    Route::get('/orders', [OrderController::class, 'index'])
        ->middleware('role:waiter,kitchen,admin');
    Route::get('/orders/{order}', [OrderController::class, 'show'])
        ->middleware('role:waiter,kitchen,admin');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])
        ->middleware('role:kitchen,waiter');
    Route::post('/orders/{order}/pay', [OrderController::class, 'pay'])
        ->middleware('role:waiter');

    // Reports & Dashboard
    Route::get('/reports/daily', [ReportController::class, 'daily'])
        ->middleware('role:admin');
    Route::get('/dashboard', [ReportController::class, 'dashboard'])
        ->middleware('role:admin,waiter');
});
