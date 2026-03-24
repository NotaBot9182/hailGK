<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'category',
        'branches',
        'is_active',
    ];

    protected $casts = [
        'branches' => 'array',
        'is_active' => 'boolean',
    ];

    public static function getCategories(): array
    {
        return [
            'B.Tech/Dual Degree (JEE Advanced)',
            'Integrated M.Tech (JEE Advanced)',
            'M.Tech GATE (2-year)',
            'M.Sc JAM (2-yr)',
            'M.Sc.Tech JAM (3-yr)',
            'MBA (CAT)',
            'Ph.D (GATE/NET)',
            'M.A. Digital Humanities & Social Sciences',
        ];
    }
}
