<?php

namespace App\Mail;

use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class JnfVerifiedEmail extends Mailable implements ShouldQueue
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
        $status = $this->notification->status === 'approved' ? 'Verified & Approved' : 'Requires Changes';
        
        return $this->subject("Your CDC {$type} Submission has been {$status}")
                    ->html('
                        <div style="font-family: sans-serif; padding: 20px;">
                            <h2>CDC Submission Update</h2>
                            <p>Hello,</p>
                            <p>Your <strong>' . $type . '</strong> submission (Ref: ' . $this->notification->reference_number . ') status has been updated to: <strong>' . $status . '</strong>.</p>
                            ' . ($this->notification->review_notes ? '<p><strong>Review Notes from CDC Admin:</strong><br/>' . nl2br(e($this->notification->review_notes)) . '</p>' : '') . '
                            <p>Please log in to the <a href="' . config('app.frontend_url', 'https://cdc.iitism.ac.in') . '">CDC Recruiter Portal</a> to view the details.</p>
                            <br>
                            <p>Best regards,<br>Career Development Centre, IIT (ISM) Dhanbad</p>
                        </div>
                    ');
    }
}
