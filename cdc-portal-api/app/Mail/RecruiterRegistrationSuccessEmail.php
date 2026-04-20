<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RecruiterRegistrationSuccessEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public string $name;
    public string $companyName;

    /**
     * Create a new message instance.
     */
    public function __construct(string $name, string $companyName)
    {
        $this->name = $name;
        $this->companyName = $companyName;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $content = '
                        <div style="font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; background-color: #f4f7f6; padding: 40px 20px; color: #333;">
                            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                                <div style="background-color: #0A1628; padding: 30px; text-align: center; border-bottom: 4px solid #C8922A;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 500; letter-spacing: 1px;">IIT (ISM) Dhanbad</h1>
                                    <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Career Development Centre</p>
                                </div>
                                <div style="padding: 40px 30px;">
                                    <h2 style="margin-top: 0; color: #0A1628; font-size: 20px;">Registration Successful</h2>
                                    <p style="font-size: 15px; line-height: 1.6; color: #5A6478;">
                                        Dear <strong>' . htmlspecialchars($this->name) . '</strong>,<br><br>
                                        Thank you for registering <strong>' . htmlspecialchars($this->companyName) . '</strong> on the CDC Portal.
                                    </p>
                                    <p style="font-size: 15px; line-height: 1.6; color: #5A6478;">
                                        Your account has been successfully created. You can now log in to the portal to manage your job notifications, internship notifications, and recruitment processes.
                                    </p>
                                    
                                    <div style="margin: 35px 0; text-align: center;">
                                        <a href="' . config('app.frontend_url', 'https://cdc.iitism.ac.in') . '/login" style="display: inline-block; padding: 14px 32px; background-color: #C8922A; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 4px; box-shadow: 0 2px 4px rgba(200,146,42,0.3);">
                                            Login to Portal
                                        </a>
                                    </div>
                                    
                                </div>
                                <div style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                                        &copy; ' . date('Y') . ' Career Development Centre, IIT (ISM) Dhanbad.<br>All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ';

        return $this->subject('Welcome to CDC Portal - Registration Successful')
                    ->html($content);
    }
}
