<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CookieController;
use App\Http\Controllers\Api\CakeController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\GalleryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Public Home Page
Route::get('/', function () {
    return view('index');
})->name('home');

Route::get('/api/public-gallery', [GalleryController::class, 'index']);
// -----------------------------------------------------------------------------
//  ADMIN DASHBOARD & API ROUTES
//  Protected by 'auth', 'verified', and 'is_admin'
// -----------------------------------------------------------------------------
Route::middleware(['auth', 'verified', 'is_admin'])->group(function () {

    // 1. Dashboard Page (The "Admin Page")
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');

    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    // Dashboard Notes
    Route::get('/dashboard/note', [App\Http\Controllers\Api\DashboardController::class, 'getNote']);
    Route::post('/dashboard/note', [App\Http\Controllers\Api\DashboardController::class, 'saveNote']);


    // 2. Order Management API
    Route::get('/api/orders', [OrderController::class, 'getOrders']);
    Route::post('/api/orders/update', [OrderController::class, 'updateOrder']);
    Route::post('/api/orders/delete', [OrderController::class, 'deleteOrder']);
    Route::post('/api/orders/send-invoice', [OrderController::class, 'sendInvoice']);
    Route::get('/download-invoice/{order_id}', [OrderController::class, 'downloadInvoice']);

    // 3. Cookie Management API
    Route::get('/api/cookies', [CookieController::class, 'index']);
    Route::post('/api/cookies/store', [CookieController::class, 'store']);
    Route::post('/api/cookies/update', [CookieController::class, 'update']);
    Route::post('/api/cookies/delete', [CookieController::class, 'destroy']);

    // 4. Cake Management API
    Route::get('/api/cakes', [CakeController::class, 'index']);
    Route::post('/api/cakes/store', [CakeController::class, 'store']);
    Route::post('/api/cakes/update', [CakeController::class, 'update']);
    Route::post('/api/cakes/delete', [CakeController::class, 'destroy']);

    Route::get('/api/gallery', [GalleryController::class, 'index']);
    Route::post('/api/gallery/store', [GalleryController::class, 'store']);
    Route::post('/api/gallery/update', [GalleryController::class, 'update']);
    Route::post('/api/gallery/delete', [GalleryController::class, 'destroy']);
});

// -----------------------------------------------------------------------------
//  USER PROFILE ROUTES (Standard Auth)
// -----------------------------------------------------------------------------
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Breeze Auth Routes
require __DIR__.'/auth.php';

// -----------------------------------------------------------------------------
//  FALLBACK ROUTE (Handles 404 Not Found)
// -----------------------------------------------------------------------------
// This must be the very last route in the file.
// If a URL does not match any route above, redirect to Home.
Route::fallback(function () {
    return redirect()->route('home');
});