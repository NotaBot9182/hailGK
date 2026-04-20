<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlumniMentorship extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'grad_year',
        'email',
        'phone',
        'company',
        'designation',
        'industry',
        'linkedin',
        'mentorship_areas',
        'motivation',
        'affiliated_degrees',
    ];

    protected $casts = [
        'mentorship_areas' => 'array',
        'affiliated_degrees' => 'array',
    ];
}
