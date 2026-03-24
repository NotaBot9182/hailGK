<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'website',
        'postal_address',
        'sector',
        'nature_of_business',
        'no_of_employees',
        'date_of_establishment',
        'annual_turnover',
        'linkedin_url',
        'industry_sector_tags',
        'parent_hq_country',
        'parent_hq_city',
        'logo_path',
        'description',
    ];

    protected $casts = [
        'date_of_establishment' => 'date',
        'industry_sector_tags' => 'array',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(CompanyContact::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function headHr(): HasOne
    {
        return $this->hasOne(CompanyContact::class)->where('type', 'head_hr');
    }

    public function primaryPoc(): HasOne
    {
        return $this->hasOne(CompanyContact::class)->where('type', 'poc1');
    }

    public function secondaryPoc(): HasOne
    {
        return $this->hasOne(CompanyContact::class)->where('type', 'poc2');
    }
}
