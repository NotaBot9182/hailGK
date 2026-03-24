<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('intern_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_id')->constrained()->cascadeOnDelete();
            $table->string('title')->comment('Internship Title');
            $table->string('designation')->nullable();
            $table->json('place_of_posting')->comment('Array of cities/locations');
            $table->enum('work_mode', ['on_site', 'remote', 'hybrid'])->default('on_site');
            $table->integer('expected_hires')->nullable();
            $table->integer('min_hires')->nullable();
            $table->integer('expected_duration_months')->comment('Duration in months');
            $table->boolean('ppo_provision')->default(false)->comment('PPO Provision on Performance');
            $table->json('required_skills')->comment('Chip-style tags');
            $table->longText('internship_description')->nullable();
            $table->string('jd_pdf_path')->nullable();
            $table->text('additional_info')->nullable();
            $table->string('registration_link')->nullable();
            $table->text('onboarding_procedure')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('intern_profiles');
    }
};
