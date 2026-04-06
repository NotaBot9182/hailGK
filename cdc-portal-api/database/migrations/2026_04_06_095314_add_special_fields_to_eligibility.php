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
        Schema::table('eligibility_criteria', function (Blueprint $table) {
            $table->boolean('phd_allowed')->default(false);
            $table->boolean('ma_dhss_allowed')->default(false);
        });

        Schema::table('eligible_programmes', function (Blueprint $table) {
            $table->json('courses')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('eligible_programmes', function (Blueprint $table) {
            $table->dropColumn('courses');
        });

        Schema::table('eligibility_criteria', function (Blueprint $table) {
            $table->dropColumn(['phd_allowed', 'ma_dhss_allowed']);
        });
    }
};
