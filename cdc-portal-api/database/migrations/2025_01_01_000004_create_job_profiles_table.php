<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_id')->constrained()->cascadeOnDelete();
            $table->string('profile_name')->comment('Job Title / Display Name');
            $table->string('designation')->comment('Formal Job Designation');
            $table->json('place_of_posting')->comment('Array of cities/locations');
            $table->enum('work_mode', ['on_site', 'remote', 'hybrid'])->default('on_site');
            $table->integer('expected_hires')->nullable();
            $table->integer('min_hires')->nullable();
            $table->date('tentative_joining_month')->comment('Month/Year picker');
            $table->json('required_skills')->comment('Chip-style tags');
            $table->longText('job_description')->nullable();
            $table->string('jd_pdf_path')->nullable();
            $table->text('additional_job_info')->nullable()->comment('1000 char limit');
            $table->text('bond_details')->nullable();
            $table->string('registration_link')->nullable();
            $table->text('onboarding_procedure')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_profiles');
    }
};
