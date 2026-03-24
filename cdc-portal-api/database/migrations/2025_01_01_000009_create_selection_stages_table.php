<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('selection_stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_id')->constrained()->cascadeOnDelete();
            $table->string('stage_type');
            $table->enum('stage_mode', ['online', 'offline', 'hybrid'])->default('offline');
            $table->string('test_type')->nullable()->comment('Aptitude/Technical/Written');
            $table->integer('duration_minutes')->nullable();
            $table->enum('interview_mode', ['on_campus', 'telephonic', 'video_conferencing'])->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('selection_stages');
    }
};
