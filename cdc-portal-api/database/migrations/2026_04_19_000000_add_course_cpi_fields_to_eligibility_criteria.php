<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('eligibility_criteria', function (Blueprint $table) {
            $table->boolean('course_cpi_required')->default(false)->after('slp_requirement');
            $table->enum('course_cpi_mode', ['all', 'individual'])->nullable()->after('course_cpi_required');
            $table->decimal('course_cpi_default', 3, 2)->nullable()->after('course_cpi_mode');
        });
    }

    public function down(): void
    {
        Schema::table('eligibility_criteria', function (Blueprint $table) {
            $table->dropColumn(['course_cpi_required', 'course_cpi_mode', 'course_cpi_default']);
        });
    }
};

