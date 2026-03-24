<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JnfSalary extends Model
{
    use HasFactory;

    protected $fillable = [
        'notification_id',
        'programme',
        'ctc_annual',
        'base_fixed',
        'monthly_takehome',
        'joining_bonus',
        'retention_bonus',
        'variable_bonus',
        'esop_value',
        'esop_vest_period',
        'relocation_allowance',
        'medical_allowance',
        'deductions',
        'bond_amount',
        'bond_duration_months',
        'first_year_ctc',
        'stocks_options',
        'ctc_breakup',
        'gross_salary',
        'currency',
    ];

    protected $casts = [
        'ctc_annual' => 'decimal:2',
        'base_fixed' => 'decimal:2',
        'monthly_takehome' => 'decimal:2',
        'joining_bonus' => 'decimal:2',
        'retention_bonus' => 'decimal:2',
        'variable_bonus' => 'decimal:2',
        'esop_value' => 'decimal:2',
        'relocation_allowance' => 'decimal:2',
        'medical_allowance' => 'decimal:2',
        'bond_amount' => 'decimal:2',
        'first_year_ctc' => 'decimal:2',
        'stocks_options' => 'decimal:2',
        'gross_salary' => 'decimal:2',
    ];

    public function notification(): BelongsTo
    {
        return $this->belongsTo(Notification::class);
    }
}
