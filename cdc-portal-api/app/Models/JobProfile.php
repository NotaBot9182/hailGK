<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'notification_id',
        'profile_name',
        'designation',
        'place_of_posting',
        'work_mode',
        'expected_hires',
        'min_hires',
        'tentative_joining_month',
        'required_skills',
        'job_description',
        'jd_pdf_path',
        'additional_job_info',
        'bond_details',
        'registration_link',
        'onboarding_procedure',
    ];

    protected $casts = [
        'place_of_posting' => 'array',
        'required_skills' => 'array',
        'tentative_joining_month' => 'date',
    ];

    public function notification(): BelongsTo
    {
        return $this->belongsTo(Notification::class);
    }
}
