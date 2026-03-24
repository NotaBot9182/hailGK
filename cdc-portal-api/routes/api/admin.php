<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AdminMiddleware;

Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {
    Route::get('/notifications', [App\Http\Controllers\Api\AdminController::class, 'notifications']);
    Route::patch('/notifications/{id}/status', [App\Http\Controllers\Api\AdminController::class, 'updateStatus']);
    Route::get('/export', [App\Http\Controllers\Api\AdminController::class, 'export']);
    Route::get('/users', [App\Http\Controllers\Api\AdminController::class, 'users']);
    Route::patch('/users/{id}', [App\Http\Controllers\Api\AdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [App\Http\Controllers\Api\AdminController::class, 'deleteUser']);
    Route::get('/analytics', [App\Http\Controllers\Api\AdminController::class, 'analytics']);
});
