<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\SuperAdminMiddleware;

Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {
    Route::get('/notifications', [App\Http\Controllers\Api\AdminController::class, 'notifications']);
    Route::patch('/notifications/{id}/status', [App\Http\Controllers\Api\AdminController::class, 'updateStatus']);
    Route::get('/export', [App\Http\Controllers\Api\AdminController::class, 'export']);
    Route::get('/analytics', [App\Http\Controllers\Api\AdminController::class, 'analytics']);
});

Route::middleware(['auth:sanctum', SuperAdminMiddleware::class])->group(function () {
    Route::get('/users', [App\Http\Controllers\Api\AdminController::class, 'users']);
    Route::post('/users', [App\Http\Controllers\Api\AdminController::class, 'createUser']);
    Route::patch('/users/{id}', [App\Http\Controllers\Api\AdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [App\Http\Controllers\Api\AdminController::class, 'deleteUser']);
    Route::get('/audit-logs', [App\Http\Controllers\Api\AdminController::class, 'auditLogs']);
});
