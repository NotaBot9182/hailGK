<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jnf_salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_id')->constrained()->cascadeOnDelete();
            $table->enum('programme', [
                'btech_dual', 'mtech', 'mba', 'msc_msctech', 'phd', 'ma'
            ]);
            $table->decimal('ctc_annual', 15, 2)->nullable();
            $table->decimal('base_fixed', 15, 2)->nullable();
            $table->decimal('monthly_takehome', 15, 2)->nullable();
            $table->decimal('joining_bonus', 15, 2)->nullable();
            $table->decimal('retention_bonus', 15, 2)->nullable();
            $table->decimal('variable_bonus', 15, 2)->nullable();
            $table->decimal('esop_value', 15, 2)->nullable();
            $table->string('esop_vest_period')->nullable();
            $table->decimal('relocation_allowance', 15, 2)->nullable();
            $table->decimal('medical_allowance', 15, 2)->nullable();
            $table->text('deductions')->nullable();
            $table->decimal('bond_amount', 15, 2)->nullable();
            $table->integer('bond_duration_months')->nullable();
            $table->decimal('first_year_ctc', 15, 2)->nullable();
            $table->decimal('stocks_options', 15, 2)->nullable();
            $table->text('ctc_breakup')->nullable();
            $table->decimal('gross_salary', 15, 2)->nullable();
            $table->enum('currency', ['INR', 'USD', 'EUR'])->default('INR');
            $table->timestamps();
            
            $table->unique(['notification_id', 'programme']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jnf_salaries');
    }
};
