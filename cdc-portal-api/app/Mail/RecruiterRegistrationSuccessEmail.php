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
        $content = "
            <p>Dear <strong>{$this->name}</strong>,</p>
            <p>Thank you for registering <strong>{$this->companyName}</strong> on the CDC Portal.</p>
            <p>Your account has been successfully created. You can now log in to the portal to manage your job notifications, internship notifications, and recruitment processes.</p>
            <p>Best regards,<br>CDC Portal Team</p>
        ";

        return $this->subject('Welcome to CDC Portal - Registration Successful')
                    ->html($content);
    }
}
