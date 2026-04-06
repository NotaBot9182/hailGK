<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EligibleProgramme extends Model
{
    use HasFactory;

    protected $fillable = [
        'eligibility_criteria_id',
        'programme_code',
        'programme_name',
        'min_cpi',
        'is_selected',
        'courses',
    ];

    protected $casts = [
        'min_cpi' => 'decimal:2',
        'is_selected' => 'boolean',
        'courses' => 'array',
    ];

    public function eligibilityCriteria(): BelongsTo
    {
        return $this->belongsTo(EligibilityCriteria::class, 'eligibility_criteria_id');
    }
}
