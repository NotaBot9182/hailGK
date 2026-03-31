<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['PSU', 'Private', 'MNC', 'Startup', 'Govt', 'NGO'])->default('Private');
            $table->string('website')->nullable();
            $table->text('postal_address')->nullable();
            $table->string('sector')->nullable();
            $table->string('nature_of_business')->nullable();
            $table->enum('no_of_employees', [
                '1-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+'
            ])->nullable();
            $table->date('date_of_establishment')->nullable();
            $table->enum('annual_turnover', [
                'Below 1 Cr', '1-10 Cr', '10-50 Cr', '50-100 Cr', '100-500 Cr', '500-1000 Cr', 'Above 1000 Cr'
            ])->nullable();
            $table->string('linkedin_url')->nullable();
            $table->json('industry_sector_tags')->nullable();
            $table->string('parent_hq_country')->nullable();
            $table->string('parent_hq_city')->nullable();
            $table->string('logo_path')->nullable();
            $table->longText('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
