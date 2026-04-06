<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('intern_profiles', function (Blueprint $table) {
            $table->decimal('stipend_amount', 15, 2)->nullable();
            $table->enum('currency', ['INR', 'USD', 'EUR'])->default('INR');
            $table->text('ctc_breakup')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('intern_profiles', function (Blueprint $table) {
            $table->dropColumn(['stipend_amount', 'currency', 'ctc_breakup']);
        });
    }
};
