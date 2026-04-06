<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SelectionInfra extends Model
{
    use HasFactory;

    protected $table = 'selection_infra';

    protected $fillable = [
        'notification_id',
        'team_members_required',
        'rooms_required',
        'psychometric_test',
        'medical_test',
        'other_screening',
        'selection_process_pdf_path',
    ];

    protected $casts = [
        'psychometric_test' => 'boolean',
        'medical_test' => 'boolean',
        'team_members_required' => 'integer',
        'rooms_required' => 'integer',
    ];

    public function notification(): BelongsTo
    {
        return $this->belongsTo(Notification::class);
    }
}
