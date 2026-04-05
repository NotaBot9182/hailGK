<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('selection_infra', function (Blueprint $table) {
            $table->string('selection_process_pdf_path')->nullable()->after('other_screening');
        });
    }

    public function down(): void
    {
        Schema::table('selection_infra', function (Blueprint $table) {
            $table->dropColumn('selection_process_pdf_path');
        });
    }
};
