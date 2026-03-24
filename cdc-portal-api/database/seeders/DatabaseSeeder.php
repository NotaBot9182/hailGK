<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ProgrammeSeeder::class,
        ]);

        $company = Company::create([
            'name' => 'IIT (ISM) Dhanbad - Demo',
            'category' => 'Govt',
            'website' => 'https://www.iitism.ac.in',
            'description' => 'Career Development Centre',
        ]);

        User::create([
            'company_id' => $company->id,
            'name' => 'CDC Admin',
            'email' => 'admin@cdc.iitism.ac.in',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'email_verified_at' => now(),
        ]);

        User::create([
            'company_id' => $company->id,
            'name' => 'Test Recruiter',
            'email' => 'recruiter@example.com',
            'password' => Hash::make('password'),
            'role' => 'recruiter',
            'email_verified_at' => now(),
        ]);
    }
}
