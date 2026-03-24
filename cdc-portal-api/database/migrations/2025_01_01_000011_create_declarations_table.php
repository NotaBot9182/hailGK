<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('declarations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_id')->constrained()->cascadeOnDelete();
            $table->boolean('aipc_guidelines')->default(false);
            $table->boolean('shortlisting_commitment')->default(false);
            $table->boolean('accuracy_profile')->default(false);
            $table->boolean('consent_ranking_agencies')->default(false);
            $table->boolean('adherence_toc')->default(false);
            $table->boolean('rti_nirf_consent')->default(false);
            $table->string('signatory_name')->nullable();
            $table->string('signatory_designation')->nullable();
            $table->date('signed_at')->nullable();
            $table->string('typed_signature')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('declarations');
    }
};
