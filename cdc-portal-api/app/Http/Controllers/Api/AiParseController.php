<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AiParseController extends Controller
{
    /**
     * Parse a PDF using Google Gemini and return structured form data.
     * POST /api/notifications/ai-parse-pdf
     *
     * Multipart fields:
     *   pdf  – the uploaded PDF file (max 10 MB)
     *   type – 'jnf' | 'inf' | 'company'
     */
    public function parse(Request $request): JsonResponse
    {
        $request->validate([
            'pdf'  => 'required|mimes:pdf|max:10240',
            'type' => 'required|in:jnf,inf,company',
        ]);

        $type = $request->input('type');

        // Read the PDF as base64 for Gemini's inline_data
        $pdfPath    = $request->file('pdf')->getRealPath();
        $pdfBase64  = base64_encode(file_get_contents($pdfPath));

        $prompt = $this->buildPrompt($type);

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return response()->json(['message' => 'Gemini API key not configured.'], 500);
        }

        $endpoint = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={$apiKey}";

        try {
            $response = Http::timeout(60)->post($endpoint, [
                'contents' => [
                    [
                        'parts' => [
                            [
                                'inline_data' => [
                                    'mime_type' => 'application/pdf',
                                    'data'      => $pdfBase64,
                                ],
                            ],
                            [
                                'text' => $prompt,
                            ],
                        ],
                    ],
                ],
                'generationConfig' => [
                    'temperature' => 0.1,
                ],
            ]);

            if (!$response->successful()) {
                $status = $response->status();
                $body   = $response->json();
                $errMsg = $body['error']['message'] ?? 'Unknown Gemini error';

                Log::error('Gemini API error', ['status' => $status, 'body' => $response->body()]);

                if ($status === 429) {
                    return response()->json([
                        'message' => 'Gemini API quota exceeded. Please generate a new API key at aistudio.google.com and update GEMINI_API_KEY in .env.',
                    ], 429);
                }

                if ($status === 404) {
                    return response()->json([
                        'message' => 'Gemini model not available. Please check your API key and endpoint.',
                    ], 502);
                }

                return response()->json([
                    'message' => 'AI service error: ' . Str::limit($errMsg, 120),
                ], 502);
            }

            $body = $response->json();

            // Extract the text content from Gemini response
            $rawText = $body['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if (!$rawText) {
                return response()->json(['message' => 'AI returned an empty response.'], 502);
            }

            // Strip markdown code fences if present
            $rawText = preg_replace('/^```(?:json)?\s*/i', '', trim($rawText));
            $rawText = preg_replace('/\s*```$/', '', $rawText);

            $parsed = json_decode($rawText, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Gemini JSON parse failed', ['raw' => $rawText]);
                return response()->json(['message' => 'AI could not parse the document. Please fill manually.'], 422);
            }

            return response()->json([
                'success' => true,
                'data'    => $parsed,
            ]);

        } catch (\Exception $e) {
            Log::error('AI parse exception', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'An error occurred while calling the AI service.'], 500);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Prompts
    // ─────────────────────────────────────────────────────────────────────────

    private function buildPrompt(string $type): string
    {
        return match ($type) {
            'jnf'     => $this->jnfPrompt(),
            'inf'     => $this->infPrompt(),
            'company' => $this->companyPrompt(),
            default   => $this->jnfPrompt(),
        };
    }

    private function jnfPrompt(): string
    {
        return <<<'PROMPT'
You are a data extraction assistant for an Indian institute's Career Development Cell (CDC) portal.
Read the attached PDF (a job description / company brochure) and extract the following fields.
Return ONLY a valid JSON object — no explanations, no markdown, no extra text.

For salary fields: look for CTC, package, compensation, stipend, pay-scale. Convert all values to LPA (Lakhs Per Annum).
If a single salary applies to all programmes, set it for every applicable programme field.
If different salaries are mentioned per degree (B.Tech, M.Tech, MBA, M.Sc), extract them separately.
For designation: look for "designation", "role", "position", "title", "job title". If the title and designation are the same, set designation to null.

Extract these fields:
{
  "job_title": "string or null — the advertised job / role title",
  "job_designation": "string or null — formal designation for the role (e.g. Software Engineer, Data Analyst, Graduate Trainee). Extract even if it looks similar to job_title",
  "target_programmes": ["array of degree types the company is targeting from this list ONLY: B.Tech, M.Tech, MBA, M.Sc, Ph.D. Look for eligibility section, who can apply, degree requirements. Include all that apply."],
  "place_of_posting": ["array of city/location strings, e.g. ['Bengaluru','Mumbai']"],
  "work_location_mode": "one of: On-site | Remote | Hybrid (or null)",
  "expected_hires": "integer or null — number of openings",
  "job_description": "string or null — full job responsibilities / description text",
  "required_skills": ["array of required skill strings"],
  "min_cpi": "float or null — minimum CGPA/CPI cutoff (0–10 scale)",
  "backlogs_allowed": "boolean or null",
  "gender_filter": "one of: all | male | female (or null)",
  "ctc_btech": "float or null — total CTC in LPA for B.Tech / B.E students",
  "ctc_mtech": "float or null — total CTC in LPA for M.Tech students",
  "ctc_mba": "float or null — total CTC in LPA for MBA students",
  "ctc_msc": "float or null — total CTC in LPA for M.Sc / M.A students",
  "ctc_phd": "float or null — total CTC in LPA for Ph.D students",
  "base_salary": "float or null — base / fixed pay component in LPA",
  "gross_salary": "float or null — gross salary in LPA",
  "take_home_monthly": "float or null — monthly take-home salary in INR",
  "joining_bonus": "float or null — one-time joining bonus in INR",
  "performance_bonus": "float or null — variable / performance bonus in INR or LPA",
  "retention_bonus": "float or null — retention bonus in INR",
  "relocation_allowance": "float or null — relocation allowance in INR",
  "bond_details": "string or null — bond/service agreement details",
  "tentative_joining_month": "string or null — format YYYY-MM if determinable"
}

Return null for any field not found or unclear. Always return valid JSON only.
PROMPT;
    }

    private function infPrompt(): string
    {
        return <<<'PROMPT'
You are a data extraction assistant for an Indian institute's Career Development Cell (CDC) portal.
Read the attached PDF (an internship description / company brochure) and extract the following fields.
Return ONLY a valid JSON object — no explanations, no markdown, no extra text.

For stipend fields: look for "stipend", "monthly pay", "compensation", "fellowship". Convert all to INR per month.
If a single stipend applies to all programmes, set it for every stipend field.
If different stipends per degree, extract separately.
For designation: look for "role", "designation", "position", "intern role". If same as title, return null.

Extract these fields:
{
  "intern_title": "string or null — the internship advertised title / role name",
  "intern_designation": "string or null — formal intern designation (e.g. Software Intern, Research Intern, Summer Analyst). Extract even if it looks similar to intern_title",
  "target_programmes": ["array of degree types the company is targeting from this list ONLY: B.Tech, M.Tech, MBA, M.Sc, Ph.D. Look for eligibility/who can apply sections. Include all that apply."],
  "place_of_posting": ["array of city/location strings"],
  "work_location_mode": "one of: On-site | Remote | Hybrid (or null)",
  "expected_hires": "integer or null — number of intern openings",
  "expected_duration_months": "integer or null — internship duration in months",
  "ppo_provision": "boolean or null — whether Pre-Placement Offer (PPO) is available",
  "internship_description": "string or null — full description of internship work / responsibilities",
  "required_skills": ["array of required skill strings"],
  "min_cpi": "float or null — minimum CGPA/CPI cutoff",
  "backlogs_allowed": "boolean or null",
  "gender_filter": "one of: all | male | female (or null)",
  "stipend_btech": "float or null — monthly stipend in INR for B.Tech students",
  "stipend_mtech": "float or null — monthly stipend in INR for M.Tech students",
  "stipend_mba": "float or null — monthly stipend in INR for MBA students",
  "stipend_msc": "float or null — monthly stipend in INR for M.Sc / M.A students",
  "stipend_phd": "float or null — monthly stipend in INR for Ph.D students"
}

Return null for any field not found. Always return valid JSON only.
PROMPT;
    }

    private function companyPrompt(): string
    {
        return <<<'PROMPT'
You are a data extraction assistant for an Indian institute's Career Development Cell (CDC) portal.
Read the attached PDF (a company brochure / about document) and extract company profile information.
Return ONLY a valid JSON object — no explanations, no markdown, no extra text.

Extract these fields:
{
  "name": "string or null — official company / organisation name",
  "category": "one of: PSU | Private | MNC | Startup | Govt | NGO  (or null)",
  "website": "string or null — company website URL (with https://)",
  "postal_address": "string or null — company registered / HQ address",
  "sector": "one of: IT/Software | Core Engineering | Consulting | Finance | FMCG | Analytics | Healthcare  (or null, pick closest)",
  "industry_sector_tags": ["array of relevant industry tags, e.g. ['Software','AI','Cloud']"],
  "nature_of_business": "string or null — brief description of what the company does",
  "no_of_employees": "one of: 1-50 | 51-200 | 201-500 | 501-1000 | 1001-5000 | 5001-10000 | 10000+  (or null)",
  "annual_turnover": "one of: Below 1 Cr | 1-10 Cr | 10-50 Cr | 50-100 Cr | 100-500 Cr | 500-1000 Cr | Above 1000 Cr  (or null)",
  "date_of_establishment": "string or null — year or date founded (YYYY or YYYY-MM-DD)",
  "linkedin_url": "string or null — LinkedIn company page URL",
  "parent_hq_country": "string or null — country of parent company HQ (for MNCs)",
  "parent_hq_city": "string or null — city of parent company HQ",
  "description": "string or null — 2–4 sentence company overview / about"
}

Return null for any field not found. Always return valid JSON.
PROMPT;
    }
}
