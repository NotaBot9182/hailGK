<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public string $resetUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(string $resetUrl)
    {
        $this->resetUrl = $resetUrl;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('CDC Portal - Password Reset')
                    ->html('
                        <div style="font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; background-color: #f4f7f6; padding: 40px 20px; color: #333;">
                            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                                <div style="background-color: #0A1628; padding: 30px; text-align: center; border-bottom: 4px solid #C8922A;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 500; letter-spacing: 1px;">IIT (ISM) Dhanbad</h1>
                                    <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Career Development Centre</p>
                                </div>
                                <div style="padding: 40px 30px;">
                                    <h2 style="margin-top: 0; color: #0A1628; font-size: 20px;">Password Reset Request</h2>
                                    <p style="font-size: 15px; line-height: 1.6; color: #5A6478;">
                                        Hello,<br><br>
                                        We received a request to reset your password for the CDC Portal. Click the button below to establish a new, secure password.
                                    </p>
                                    
                                    <div style="margin: 35px 0; text-align: center;">
                                        <a href="' . $this->resetUrl . '" style="display: inline-block; padding: 14px 32px; background-color: #C8922A; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 4px; box-shadow: 0 2px 4px rgba(200,146,42,0.3);">
                                            Reset Password
                                        </a>
                                    </div>
                                    
                                    <p style="font-size: 14px; background-color: #f8fafc; padding: 15px; border-radius: 4px; border-left: 3px solid #cbd5e1; word-break: break-all;">
                                        <strong style="color: #475569;">Button not working?</strong><br>
                                        <span style="color: #64748b;">Copy and paste this URL into your browser:</span><br>
                                        <a href="' . $this->resetUrl . '" style="color: #2563eb; font-size: 13px;">' . $this->resetUrl . '</a>
                                    </p>
                                    
                                    <p style="font-size: 15px; line-height: 1.6; color: #5A6478; margin-top: 30px;">
                                        If you did not request a password reset, no further action is required. Your account remains secure.
                                    </p>
                                </div>
                                <div style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                                        &copy; ' . date('Y') . ' Career Development Centre, IIT (ISM) Dhanbad.<br>All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ');
    }
}
