<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InternProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'notification_id',
        'title',
        'designation',
        'place_of_posting',
        'work_mode',
        'expected_hires',
        'min_hires',
        'expected_duration_months',
        'ppo_provision',
        'required_skills',
        'internship_description',
        'jd_pdf_path',
        'additional_info',
        'registration_link',
        'onboarding_procedure',
    ];

    protected $casts = [
        'place_of_posting' => 'array',
        'required_skills' => 'array',
        'ppo_provision' => 'boolean',
    ];

    public function notification(): BelongsTo
    {
        return $this->belongsTo(Notification::class);
    }
}
