<?php

use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/company', [App\Http\Controllers\Api\CompanyController::class, 'show']);
    Route::patch('/company', [App\Http\Controllers\Api\CompanyController::class, 'update']);
    Route::post('/company/logo', [App\Http\Controllers\Api\CompanyController::class, 'uploadLogo']);
    Route::get('/company/contacts', [App\Http\Controllers\Api\CompanyController::class, 'getContacts']);
    Route::patch('/company/contacts', [App\Http\Controllers\Api\CompanyController::class, 'updateContacts']);
});
