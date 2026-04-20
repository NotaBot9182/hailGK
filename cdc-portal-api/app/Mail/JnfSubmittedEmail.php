<?php

namespace App\Mail;

use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class JnfSubmittedEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $notification;

    public function __construct(Notification $notification)
    {
        $this->notification = $notification;
    }

    public function build()
    {
        $type = strtoupper($this->notification->type);
        $companyName = $this->notification->company ? $this->notification->company->name : 'Company';
        
        return $this->subject("New CDC {$type} Submission - {$companyName}")
                    ->html('
                        <div style="font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; background-color: #f4f7f6; padding: 40px 20px; color: #333;">
                            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                                <div style="background-color: #0A1628; padding: 30px; text-align: center; border-bottom: 4px solid #C8922A;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 500; letter-spacing: 1px;">IIT (ISM) Dhanbad</h1>
                                    <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Career Development Centre</p>
                                </div>
                                <div style="padding: 40px 30px;">
                                    <h2 style="margin-top: 0; color: #0A1628; font-size: 20px;">Submission Received</h2>
                                    <p style="font-size: 15px; line-height: 1.6; color: #5A6478;">
                                        Hello,<br><br>
                                        This is to confirm that we have successfully received the <strong>' . $type . '</strong> submission from <strong>' . htmlspecialchars($companyName) . '</strong>.
                                    </p>
                                    
                                    <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-left: 4px solid #1B5E6B; border-radius: 0 4px 4px 0;">
                                        <p style="margin: 0 0 5px 0; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Reference Number</p>
                                        <div style="font-size: 18px; font-weight: 600; color: #1B5E6B; font-family: monospace;">
                                            ' . $this->notification->reference_number . '
                                        </div>
                                    </div>
                                    
                                    <p style="font-size: 15px; line-height: 1.6; color: #5A6478;">
                                        The CDC administrative team will review your submission shortly. You will be notified via email once the status gets updated or if any changes are required.
                                    </p>
                                    
                                    <div style="margin: 35px 0; text-align: center;">
                                        <a href="' . config('app.frontend_url', 'https://cdc.iitism.ac.in') . '" style="display: inline-block; padding: 14px 32px; background-color: #1B5E6B; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 4px; box-shadow: 0 2px 4px rgba(27,94,107,0.3);">
                                            Access Recruiter Portal
                                        </a>
                                    </div>
                                    
                                    <p style="font-size: 13px; line-height: 1.5; color: #94a3b8; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                                        This is an automated message. Please do not reply directly to this email.
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
