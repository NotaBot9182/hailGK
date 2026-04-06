<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;

class AuthController extends Controller
{
    public function __construct(
        private OtpService $otpService
    ) {}

    public function sendOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        if (RateLimiter::tooManyAttempts('otp:' . $request->email, 3)) {
            return response()->json([
                'message' => 'Too many OTP requests. Please try again later.',
            ], 429);
        }

        RateLimiter::hit('otp:' . $request->email, 300);

        $this->otpService->sendOtp($request->email);

        return response()->json([
            'message' => 'OTP sent successfully. Valid for 5 minutes.',
        ]);
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        if (!$this->otpService->verify($request->email, $request->otp)) {
            return response()->json([
                'message' => 'Invalid or expired OTP.',
            ], 422);
        }

        $this->otpService->invalidate($request->email);

        $token = Str::random(40);

        return response()->json([
            'message' => 'OTP verified successfully.',
            'verification_token' => $token,
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'verification_token' => 'required',
            'email' => 'required|email',
            'name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'mobile' => 'required|string|max:20',
            'alt_mobile' => 'nullable|string|max:20',
            'password' => 'required|confirmed|min:8',
            'company_name' => 'required|string|max:255',
            'company_category' => 'required|in:PSU,Private,MNC,Startup,Govt,NGO',
            'company_website' => 'nullable|url',
            'company_address' => 'nullable|string',
            'company_sector' => 'nullable|string',
            'company_nature' => 'nullable|string',
            'company_employees' => 'nullable|in:1-50,51-200,201-500,501-1000,1001-5000,5001-10000,10000+',
            'company_establishment' => 'nullable|date',
            'company_turnover' => 'nullable|in:Below 1 Cr,1-10 Cr,10-50 Cr,50-100 Cr,100-500 Cr,500-1000 Cr,Above 1000 Cr',
            'linkedin_url' => 'nullable|url',
            'industry_tags' => 'nullable|array',
            'parent_hq_country' => 'nullable|string|required_if:company_category,MNC',
            'parent_hq_city' => 'nullable|string|required_if:company_category,MNC',
        ]);

        $existingUser = User::where('email', $request->email)->first();
        if ($existingUser) {
            return response()->json([
                'message' => 'You are already registered. Please proceed to login.',
            ], 422);
        }

        $company = Company::create([
            'name' => $request->company_name,
            'category' => $request->company_category,
            'website' => $request->company_website,
            'postal_address' => $request->company_address,
            'sector' => $request->company_sector,
            'nature_of_business' => $request->company_nature,
            'no_of_employees' => $request->company_employees,
            'date_of_establishment' => $request->company_establishment,
            'annual_turnover' => $request->company_turnover,
            'linkedin_url' => $request->linkedin_url,
            'industry_sector_tags' => $request->industry_tags,
            'parent_hq_country' => $request->parent_hq_country,
            'parent_hq_city' => $request->parent_hq_city,
        ]);

        $user = User::create([
            'company_id' => $company->id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'recruiter',
            'email_verified_at' => now(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        \Illuminate\Support\Facades\Mail::to($user->email)->queue(new \App\Mail\RecruiterRegistrationSuccessEmail($user->name, $company->name));

        return response()->json([
            'message' => 'Registration successful.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
            ],
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (RateLimiter::tooManyAttempts('login:' . $request->email, 5)) {
            return response()->json([
                'message' => 'Too many login attempts. Please try again later.',
            ], 429);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            RateLimiter::hit('login:' . $request->email, 900);
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Your account has been deactivated. Contact CDC admin.',
            ], 403);
        }

        RateLimiter::clear('login:' . $request->email);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'company' => $user->company ? [
                'id' => $user->company->id,
                'name' => $user->company->name,
                'category' => $user->company->category,
                'logo_path' => $user->company->logo_path,
            ] : null,
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'If the email exists, a reset link has been sent.',
            ]);
        }

        return response()->json([
            'message' => 'If the email exists, a reset link has been sent.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        return response()->json([
            'message' => 'Password reset functionality to be implemented.',
        ]);
    }
}
