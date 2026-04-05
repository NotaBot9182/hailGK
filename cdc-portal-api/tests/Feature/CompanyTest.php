<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CompanyTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;
    protected Company $company;

    protected function setUp(): void
    {
        parent::setUp();
        $this->company = Company::factory()->create();
        $this->user = User::factory()->create([
            'company_id' => $this->company->id,
            'role' => 'recruiter',
        ]);
    }

    public function test_recruiter_can_view_company_profile()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/company/company');

        $response->assertOk()
            ->assertJsonPath('company.id', $this->company->id);
    }

    public function test_recruiter_can_update_company_profile()
    {
        $data = [
            'name' => 'Updated Company',
            'category' => 'MNC',
            'website' => 'https://example.com',
            'postal_address' => '123 Street',
            'sector' => 'IT',
            'nature_of_business' => 'Software',
            'no_of_employees' => '501-1000',
            'date_of_establishment' => '2020-01-01',
            'annual_turnover' => '10-50 Cr',
            'linkedin_url' => 'https://linkedin.com/company/example',
            'industry_sector_tags' => ['Tech', 'Finance'],
            'parent_hq_country' => 'USA',
            'parent_hq_city' => 'New York',
            'description' => 'A test company',
        ];

        $response = $this->actingAs($this->user)
            ->patchJson('/api/company/company', $data);

        $response->assertOk()
            ->assertJsonPath('company.name', 'Updated Company');
        $this->assertDatabaseHas(Company::class, [
            'id' => $this->company->id,
            'name' => 'Updated Company',
        ]);
    }

    public function test_recruiter_can_upload_logo()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->image('logo.jpg', 200, 200);

        $response = $this->actingAs($this->user)
            ->postJson('/api/company/logo', [
                'logo' => $file,
            ]);

        $response->assertOk()
            ->assertJsonStructure(['logo_path']);
        Storage::disk('public')->assertExists($response->json('logo_path'));
    }

    public function test_recruiter_can_view_contacts()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/company/contacts');

        $response->assertOk()
            ->assertJsonStructure(['contacts']);
    }

    public function test_recruiter_can_update_contacts()
    {
        $data = [
            'contacts' => [
                [
                    'type' => 'head_hr',
                    'name' => 'John Doe',
                    'designation' => 'HR Manager',
                    'email' => 'john@example.com',
                    'mobile' => '9876543210',
                    'landline' => '0123456789',
                ],
                [
                    'type' => 'poc1',
                    'name' => 'Jane Smith',
                    'designation' => 'Recruitment Lead',
                    'email' => 'jane@example.com',
                    'mobile' => '9876543211',
                ],
            ],
        ];

        $response = $this->actingAs($this->user)
            ->patchJson('/api/company/contacts', $data);

        $response->assertOk()
            ->assertJsonStructure(['contacts']);
        $this->assertDatabaseCount('company_contacts', 2);
    }
}