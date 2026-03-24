<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'store']);
    Route::get('/notifications/{id}', [App\Http\Controllers\Api\NotificationController::class, 'show']);
    Route::patch('/notifications/{id}/job-profile', [App\Http\Controllers\Api\NotificationController::class, 'updateJobProfile']);
    Route::patch('/notifications/{id}/intern-profile', [App\Http\Controllers\Api\NotificationController::class, 'updateInternProfile']);
    Route::patch('/notifications/{id}/eligibility', [App\Http\Controllers\Api\NotificationController::class, 'updateEligibility']);
    Route::patch('/notifications/{id}/salary', [App\Http\Controllers\Api\NotificationController::class, 'updateSalary']);
    Route::patch('/notifications/{id}/stipend', [App\Http\Controllers\Api\NotificationController::class, 'updateStipend']);
    Route::patch('/notifications/{id}/selection', [App\Http\Controllers\Api\NotificationController::class, 'updateSelection']);
    Route::post('/notifications/{id}/jd-pdf', [App\Http\Controllers\Api\NotificationController::class, 'uploadJdPdf']);
    Route::post('/notifications/{id}/submit', [App\Http\Controllers\Api\NotificationController::class, 'submit']);
    Route::get('/notifications/{id}/preview', [App\Http\Controllers\Api\NotificationController::class, 'preview']);
    Route::patch('/notifications/{id}/declaration', [App\Http\Controllers\Api\NotificationController::class, 'updateDeclaration']);
});
