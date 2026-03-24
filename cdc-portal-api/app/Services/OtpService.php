<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class OtpService
{
    private const OTP_LENGTH = 6;
    private const OTP_TTL_SECONDS = 300;

    public function generate(string $email): string
    {
        $otp = str_pad((string) random_int(0, 999999), self::OTP_LENGTH, '0', STR_PAD_LEFT);

        Cache::put($this->getCacheKey($email), [
            'otp' => $otp,
            'attempts' => 0,
            'created_at' => now()->timestamp,
        ], self::OTP_TTL_SECONDS);

        return $otp;
    }

    public function send(string $email): void
    {
        $otp = $this->generate($email);

        Mail::raw("Your CDC Portal OTP is: {$otp}. It is valid for 5 minutes.", function ($message) use ($email) {
            $message->to($email)
                ->subject('CDC Portal - OTP Verification');
        });
    }

    public function sendOtp(string $email): void
    {
        $this->send($email);
    }

    public function verify(string $email, string $otp): bool
    {
        $cacheKey = $this->getCacheKey($email);
        $data = Cache::get($cacheKey);

        if (!$data) {
            return false;
        }

        $storedOtp = $data['otp'];
        $attempts = $data['attempts'];

        if ($attempts >= 5) {
            Cache::forget($cacheKey);
            return false;
        }

        if ($storedOtp !== $otp) {
            Cache::put($cacheKey, [
                'otp' => $storedOtp,
                'attempts' => $attempts + 1,
                'created_at' => $data['created_at'],
            ], self::OTP_TTL_SECONDS);
            return false;
        }

        return true;
    }

    public function invalidate(string $email): void
    {
        Cache::forget($this->getCacheKey($email));
    }

    private function getCacheKey(string $email): string
    {
        return 'otp:' . strtolower($email);
    }
}
