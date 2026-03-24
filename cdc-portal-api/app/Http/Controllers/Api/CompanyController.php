<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\CompanyContact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $company = $request->user()->company;

        if (!$company) {
            return response()->json(['message' => 'Company not found.'], 404);
        }

        return response()->json([
            'company' => $company,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $company = $request->user()->company;

        if (!$company) {
            return response()->json(['message' => 'Company not found.'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|in:PSU,Private,MNC,Startup,Govt,NGO',
            'website' => 'nullable|url',
            'postal_address' => 'nullable|string',
            'sector' => 'nullable|string',
            'nature_of_business' => 'nullable|string',
            'no_of_employees' => 'nullable|in:1-50,51-200,201-500,501-1000,1001-5000,5001-10000,10000+',
            'date_of_establishment' => 'nullable|date',
            'annual_turnover' => 'nullable|in:Below 1 Cr,1-10 Cr,10-50 Cr,50-100 Cr,100-500 Cr,500-1000 Cr,Above 1000 Cr',
            'linkedin_url' => 'nullable|url',
            'industry_sector_tags' => 'nullable|array',
            'parent_hq_country' => 'nullable|string',
            'parent_hq_city' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $company->update($validated);

        return response()->json([
            'message' => 'Company profile updated.',
            'company' => $company->fresh(),
        ]);
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $company = $request->user()->company;

        if (!$company) {
            return response()->json(['message' => 'Company not found.'], 404);
        }

        if ($company->logo_path) {
            Storage::disk('public')->delete($company->logo_path);
        }

        $path = $request->file('logo')->store('company-logos', 'public');
        $company->update(['logo_path' => $path]);

        return response()->json([
            'message' => 'Logo uploaded successfully.',
            'logo_path' => $path,
        ]);
    }

    public function getContacts(Request $request): JsonResponse
    {
        $company = $request->user()->company;

        if (!$company) {
            return response()->json(['message' => 'Company not found.'], 404);
        }

        return response()->json([
            'contacts' => $company->contacts,
        ]);
    }

    public function updateContacts(Request $request): JsonResponse
    {
        $company = $request->user()->company;

        if (!$company) {
            return response()->json(['message' => 'Company not found.'], 404);
        }

        $validated = $request->validate([
            'contacts' => 'required|array|min:2',
            'contacts.*.type' => 'required|in:head_hr,poc1,poc2',
            'contacts.*.name' => 'required|string|max:255',
            'contacts.*.designation' => 'required|string|max:255',
            'contacts.*.email' => 'required|email',
            'contacts.*.mobile' => 'required|string|max:20',
            'contacts.*.landline' => 'nullable|string|max:20',
        ]);

        foreach ($validated['contacts'] as $contactData) {
            CompanyContact::updateOrCreate(
                [
                    'company_id' => $company->id,
                    'type' => $contactData['type'],
                ],
                $contactData
            );
        }

        return response()->json([
            'message' => 'Contacts updated successfully.',
            'contacts' => $company->fresh()->contacts,
        ]);
    }
}
