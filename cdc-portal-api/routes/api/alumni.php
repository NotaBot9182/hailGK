<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AlumniMentorshipController;

Route::post('/mentorship', [AlumniMentorshipController::class, 'store']);
