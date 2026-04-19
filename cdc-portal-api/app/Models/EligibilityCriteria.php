<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EligibilityCriteria extends Model
{
    use HasFactory;

    protected $table = 'eligibility_criteria';

    protected $fillable = [
        'notification_id',
        'min_cgpa',
        'backlogs_allowed',
        'hs_percentage',
        'gender_filter',
        'slp_requirement',
        'course_cpi_required',
        'course_cpi_mode',
        'course_cpi_default',
        'phd_allowed',
        'ma_dhss_allowed',
    ];

    protected $casts = [
        'min_cgpa' => 'decimal:2',
        'backlogs_allowed' => 'boolean',
        'hs_percentage' => 'decimal:2',
        'course_cpi_required' => 'boolean',
        'course_cpi_default' => 'decimal:2',
        'phd_allowed' => 'boolean',
        'ma_dhss_allowed' => 'boolean',
    ];

    public function notification(): BelongsTo
    {
        return $this->belongsTo(Notification::class);
    }

    public function programmes(): HasMany
    {
        return $this->hasMany(EligibleProgramme::class, 'eligibility_criteria_id');
    }
}
