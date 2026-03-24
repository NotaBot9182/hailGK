<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['jnf', 'inf']);
            $table->string('reference_number')->unique();
            $table->integer('season')->comment('1=First Semester, 2=Second Semester');
            $table->year('year');
            $table->enum('status', [
                'draft', 'submitted', 'under_review', 'approved', 'rejected', 'changes_requested'
            ])->default('draft');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->timestamps();
            
            $table->index(['company_id', 'type', 'status']);
            $table->index(['year', 'season']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
