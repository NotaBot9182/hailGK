<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'type',
        'name',
        'designation',
        'email',
        'mobile',
        'landline',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
