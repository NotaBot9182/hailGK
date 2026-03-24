<?php

use Illuminate\Support\Facades\Route;

Route::post('/send-otp', [App\Http\Controllers\Api\AuthController::class, 'sendOtp']);
Route::post('/verify-otp', [App\Http\Controllers\Api\AuthController::class, 'verifyOtp']);
Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/forgot-password', [App\Http\Controllers\Api\AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [App\Http\Controllers\Api\AuthController::class, 'resetPassword']);
