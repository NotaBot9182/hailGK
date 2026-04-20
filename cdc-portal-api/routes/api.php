<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()]);
});

Route::prefix('auth')->group(base_path('routes/api/auth.php'));
Route::prefix('company')->group(base_path('routes/api/company.php'));
Route::prefix('notifications')->group(base_path('routes/api/notifications.php'));
Route::prefix('admin')->group(base_path('routes/api/admin.php'));
Route::prefix('alumni')->group(base_path('routes/api/alumni.php'));

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/alerts', [App\Http\Controllers\Api\AlertController::class, 'index']);
    Route::patch('/alerts/{id}/read', [App\Http\Controllers\Api\AlertController::class, 'markAsRead']);
});
