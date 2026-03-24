<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Declaration extends Model
{
    use HasFactory;

    protected $fillable = [
        'notification_id',
        'aipc_guidelines',
        'shortlisting_commitment',
        'accuracy_profile',
        'consent_ranking_agencies',
        'adherence_toc',
        'rti_nirf_consent',
        'signatory_name',
        'signatory_designation',
        'signed_at',
        'typed_signature',
    ];

    protected $casts = [
        'aipc_guidelines' => 'boolean',
        'shortlisting_commitment' => 'boolean',
        'accuracy_profile' => 'boolean',
        'consent_ranking_agencies' => 'boolean',
        'adherence_toc' => 'boolean',
        'rti_nirf_consent' => 'boolean',
        'signed_at' => 'date',
    ];

    public function notification(): BelongsTo
    {
        return $this->belongsTo(Notification::class);
    }

    public function isComplete(): bool
    {
        return $this->aipc_guidelines 
            && $this->shortlisting_commitment 
            && $this->accuracy_profile 
            && $this->consent_ranking_agencies 
            && $this->adherence_toc 
            && $this->rti_nirf_consent 
            && !empty($this->signatory_name)
            && !empty($this->signatory_designation)
            && !empty($this->typed_signature);
    }
}
