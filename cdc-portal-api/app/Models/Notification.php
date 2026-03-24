<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'user_id',
        'type',
        'reference_number',
        'season',
        'year',
        'status',
        'reviewed_by',
        'submitted_at',
        'reviewed_at',
        'review_notes',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($notification) {
            if (empty($notification->reference_number)) {
                $prefix = $notification->type === 'jnf' ? 'JNF' : 'INF';
                $year = date('Y');
                $month = date('m');
                $random = strtoupper(substr(md5(uniqid()), 0, 6));
                $notification->reference_number = "{$prefix}-{$year}{$month}-{$random}";
            }
        });
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function jobProfile(): HasOne
    {
        return $this->hasOne(JobProfile::class);
    }

    public function internProfile(): HasOne
    {
        return $this->hasOne(InternProfile::class);
    }

    public function salaries(): HasMany
    {
        return $this->hasMany(JnfSalary::class);
    }

    public function eligibilityCriteria(): HasOne
    {
        return $this->hasOne(EligibilityCriteria::class);
    }

    public function selectionStages(): HasMany
    {
        return $this->hasMany(SelectionStage::class)->orderBy('sort_order');
    }

    public function selectionInfra(): HasOne
    {
        return $this->hasOne(SelectionInfra::class);
    }

    public function declaration(): HasOne
    {
        return $this->hasOne(Declaration::class);
    }

    public function isComplete(): bool
    {
        if ($this->type === 'jnf' && !$this->jobProfile) {
            return false;
        }

        if ($this->type === 'inf' && !$this->internProfile) {
            return false;
        }

        if (!$this->eligibilityCriteria) {
            return false;
        }

        if (!$this->declaration) {
            return false;
        }

        return true;
    }
}
