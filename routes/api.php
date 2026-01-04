<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\DataController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\DashboardController;
// ------------------------------
// PUBLIC API ROUTES
// ------------------------------

// This matches JS: /api/data/all
Route::get('/data/all', [DataController::class, 'getAll']);

// Customer order (public)
// SECURITY FIX: Added throttling to prevent spam orders (10 req/min)
Route::middleware('throttle:10,1')->post('/place-order', [OrderController::class, 'placeOrder']);
Route::post('/log-visitor', [App\Http\Controllers\Api\DashboardController::class, 'logVisitor']);