<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('eligible_programmes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eligibility_criteria_id')->constrained()->cascadeOnDelete();
            $table->string('programme_code');
            $table->string('programme_name');
            $table->decimal('min_cpi', 3, 2)->nullable();
            $table->boolean('is_selected')->default(true);
            $table->timestamps();
            
            $table->unique(['eligibility_criteria_id', 'programme_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eligible_programmes');
    }
};
