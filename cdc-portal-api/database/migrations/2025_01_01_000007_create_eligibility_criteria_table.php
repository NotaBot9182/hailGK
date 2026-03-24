<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('eligibility_criteria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_id')->constrained()->cascadeOnDelete();
            $table->decimal('min_cgpa', 3, 2)->nullable();
            $table->boolean('backlogs_allowed')->default(true);
            $table->decimal('hs_percentage', 5, 2)->nullable()->comment('High School % criterion');
            $table->enum('gender_filter', ['all', 'male', 'female', 'others'])->default('all');
            $table->text('slp_requirement')->nullable()->comment('Specific requirement regarding SLP');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eligibility_criteria');
    }
};
