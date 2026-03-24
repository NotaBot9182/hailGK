<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('selection_infra', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_id')->constrained()->cascadeOnDelete();
            $table->integer('team_members_required')->nullable();
            $table->integer('rooms_required')->nullable();
            $table->boolean('psychometric_test')->default(false);
            $table->boolean('medical_test')->default(false);
            $table->text('other_screening')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('selection_infra');
    }
};
