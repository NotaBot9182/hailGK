<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'category' => fake()->randomElement(['PSU', 'Private', 'MNC', 'Startup', 'Govt', 'NGO']),
            'website' => fake()->url(),
            'postal_address' => fake()->address(),
            'sector' => fake()->word(),
            'nature_of_business' => fake()->jobTitle(),
            'no_of_employees' => fake()->randomElement(['1-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+']),
            'date_of_establishment' => fake()->date(),
            'annual_turnover' => fake()->randomElement(['Below 1 Cr', '1-10 Cr', '10-50 Cr', '50-100 Cr', '100-500 Cr', '500-1000 Cr', 'Above 1000 Cr']),
            'linkedin_url' => fake()->url(),
            'industry_sector_tags' => [],
            'parent_hq_country' => null,
            'parent_hq_city' => null,
            'logo_path' => null,
            'description' => fake()->paragraph(),
        ];
    }
}