<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\JobProfile;
use App\Models\InternProfile;
use App\Models\JnfSalary;
use App\Models\EligibilityCriteria;
use App\Models\EligibleProgramme;
use App\Models\SelectionStage;
use App\Models\SelectionInfra;
use App\Models\Declaration;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->with(['company', 'jobProfile', 'internProfile', 'declaration'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'notifications' => $notifications,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:jnf,inf',
            'season' => 'required|integer|min:1|max:2',
            'year' => 'required|integer|min:2020|max:2030',
        ]);

        $notification = Notification::create([
            'company_id' => $request->user()->company_id,
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'season' => $validated['season'],
            'year' => $validated['year'],
            'status' => 'draft',
        ]);

        return response()->json([
            'message' => 'Notification created.',
            'notification' => $notification,
        ], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()
            ->notifications()
            ->with([
                'company.contacts',
                'jobProfile',
                'internProfile',
                'salaries',
                'eligibilityCriteria.programmes',
                'selectionStages',
                'selectionInfra',
                'declaration',
            ])
            ->findOrFail($id);

        return response()->json([
            'notification' => $notification,
        ]);
    }

    public function updateJobProfile(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        $validated = $request->validate([
            'profile_name' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'place_of_posting' => 'required|array',
            'work_mode' => 'required|in:on_site,remote,hybrid',
            'expected_hires' => 'nullable|integer|min:1',
            'min_hires' => 'nullable|integer|min:1',
            'tentative_joining_month' => 'required|date',
            'required_skills' => 'nullable|array',
            'job_description' => 'nullable|string',
            'additional_job_info' => 'nullable|string|max:1000',
            'bond_details' => 'nullable|string',
            'registration_link' => 'nullable|url',
            'onboarding_procedure' => 'nullable|string',
        ]);

        $notification->jobProfile()->updateOrCreate(
            ['notification_id' => $notification->id],
            $validated
        );

        return response()->json([
            'message' => 'Job profile saved.',
            'job_profile' => $notification->fresh()->jobProfile,
        ]);
    }

    public function updateInternProfile(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'place_of_posting' => 'required|array',
            'work_mode' => 'required|in:on_site,remote,hybrid',
            'expected_hires' => 'nullable|integer|min:1',
            'min_hires' => 'nullable|integer|min:1',
            'expected_duration_months' => 'required|integer|min:1',
            'ppo_provision' => 'boolean',
            'required_skills' => 'nullable|array',
            'internship_description' => 'nullable|string',
            'additional_info' => 'nullable|string',
            'registration_link' => 'nullable|url',
            'onboarding_procedure' => 'nullable|string',
        ]);

        $notification->internProfile()->updateOrCreate(
            ['notification_id' => $notification->id],
            $validated
        );

        return response()->json([
            'message' => 'Intern profile saved.',
            'intern_profile' => $notification->fresh()->internProfile,
        ]);
    }

    public function updateEligibility(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        $validated = $request->validate([
            'min_cgpa' => 'nullable|numeric|min:0|max:10',
            'backlogs_allowed' => 'boolean',
            'hs_percentage' => 'nullable|numeric|min:0|max:100',
            'gender_filter' => 'in:all,male,female,others',
            'slp_requirement' => 'nullable|string',
            'programmes' => 'nullable|array',
            'programmes.*.code' => 'required|string',
            'programmes.*.name' => 'required|string',
            'programmes.*.min_cpi' => 'nullable|numeric|min:0|max:10',
            'programmes.*.is_selected' => 'boolean',
        ]);

        $eligibility = $notification->eligibilityCriteria()->updateOrCreate(
            ['notification_id' => $notification->id],
            [
                'min_cgpa' => $validated['min_cgpa'] ?? null,
                'backlogs_allowed' => $validated['backlogs_allowed'] ?? true,
                'hs_percentage' => $validated['hs_percentage'] ?? null,
                'gender_filter' => $validated['gender_filter'] ?? 'all',
                'slp_requirement' => $validated['slp_requirement'] ?? null,
            ]
        );

        if (isset($validated['programmes'])) {
            $eligibility->programmes()->delete();
            foreach ($validated['programmes'] as $prog) {
                $eligibility->programmes()->create([
                    'programme_code' => $prog['code'],
                    'programme_name' => $prog['name'],
                    'min_cpi' => $prog['min_cpi'] ?? null,
                    'is_selected' => $prog['is_selected'] ?? true,
                ]);
            }
        }

        return response()->json([
            'message' => 'Eligibility saved.',
            'eligibility' => $notification->fresh()->eligibilityCriteria->load('programmes'),
        ]);
    }

    public function updateSalary(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        $validated = $request->validate([
            'salaries' => 'required|array',
            'salaries.*.programme' => 'required|in:btech_dual,mtech,mba,msc_msctech,phd,ma',
            'salaries.*.ctc_annual' => 'nullable|numeric|min:0',
            'salaries.*.base_fixed' => 'nullable|numeric|min:0',
            'salaries.*.monthly_takehome' => 'nullable|numeric|min:0',
            'salaries.*.joining_bonus' => 'nullable|numeric|min:0',
            'salaries.*.retention_bonus' => 'nullable|numeric|min:0',
            'salaries.*.variable_bonus' => 'nullable|numeric|min:0',
            'salaries.*.esop_value' => 'nullable|numeric|min:0',
            'salaries.*.esop_vest_period' => 'nullable|string',
            'salaries.*.relocation_allowance' => 'nullable|numeric|min:0',
            'salaries.*.medical_allowance' => 'nullable|numeric|min:0',
            'salaries.*.deductions' => 'nullable|string',
            'salaries.*.bond_amount' => 'nullable|numeric|min:0',
            'salaries.*.bond_duration_months' => 'nullable|integer',
            'salaries.*.first_year_ctc' => 'nullable|numeric|min:0',
            'salaries.*.stocks_options' => 'nullable|numeric|min:0',
            'salaries.*.ctc_breakup' => 'nullable|string',
            'salaries.*.gross_salary' => 'nullable|numeric|min:0',
            'salaries.*.currency' => 'in:INR,USD,EUR',
        ]);

        foreach ($validated['salaries'] as $salaryData) {
            $notification->salaries()->updateOrCreate(
                ['notification_id' => $notification->id, 'programme' => $salaryData['programme']],
                $salaryData
            );
        }

        return response()->json([
            'message' => 'Salary details saved.',
            'salaries' => $notification->fresh()->salaries,
        ]);
    }

    public function updateStipend(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        $validated = $request->validate([
            'stipend_amount' => 'required|numeric|min:0',
            'currency' => 'in:INR,USD,EUR',
            'ctc_breakup' => 'nullable|string',
        ]);

        return response()->json([
            'message' => 'Stipend details saved.',
        ]);
    }

    public function updateSelection(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        $validated = $request->validate([
            'stages' => 'nullable|array',
            'stages.*.stage_type' => 'required|string',
            'stages.*.stage_mode' => 'in:online,offline,hybrid',
            'stages.*.test_type' => 'nullable|string',
            'stages.*.duration_minutes' => 'nullable|integer',
            'stages.*.interview_mode' => 'nullable|in:on_campus,telephonic,video_conferencing',
            'stages.*.sort_order' => 'integer',
            'stages.*.is_enabled' => 'boolean',
            'infra' => 'nullable|array',
            'infra.team_members_required' => 'nullable|integer',
            'infra.rooms_required' => 'nullable|integer',
            'infra.psychometric_test' => 'boolean',
            'infra.medical_test' => 'boolean',
            'infra.other_screening' => 'nullable|string',
        ]);

        if (isset($validated['stages'])) {
            $notification->selectionStages()->delete();
            foreach ($validated['stages'] as $index => $stageData) {
                $notification->selectionStages()->create(array_merge($stageData, [
                    'sort_order' => $stageData['sort_order'] ?? $index,
                ]));
            }
        }

        if (isset($validated['infra'])) {
            $notification->selectionInfra()->updateOrCreate(
                ['notification_id' => $notification->id],
                $validated['infra']
            );
        }

        return response()->json([
            'message' => 'Selection process saved.',
            'selection' => [
                'stages' => $notification->fresh()->selectionStages,
                'infra' => $notification->fresh()->selectionInfra,
            ],
        ]);
    }

    public function uploadJdPdf(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        $request->validate([
            'jd_pdf' => 'required|mimes:pdf|max:5120',
        ]);

        $profile = $notification->type === 'jnf' 
            ? $notification->jobProfile 
            : $notification->internProfile;

        if (!$profile) {
            return response()->json(['message' => 'Profile not found.'], 404);
        }

        $field = $notification->type === 'jnf' ? 'jd_pdf_path' : 'jd_pdf_path';
        $oldPath = $profile->{$field};

        if ($oldPath) {
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('jd_pdf')->store('jd-pdfs', 'public');
        $profile->update([$field => $path]);

        return response()->json([
            'message' => 'JD PDF uploaded.',
            'jd_pdf_path' => $path,
        ]);
    }

    public function submit(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        if ($notification->status !== 'draft') {
            return response()->json([
                'message' => 'Notification already submitted.',
            ], 422);
        }

        if (!$notification->isComplete()) {
            return response()->json([
                'message' => 'Please complete all required sections before submitting.',
            ], 422);
        }

        $notification->update([
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        return response()->json([
            'message' => 'Notification submitted successfully.',
            'notification' => $notification->fresh(),
        ]);
    }

    public function preview(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()
            ->notifications()
            ->with([
                'company.contacts',
                'jobProfile',
                'internProfile',
                'salaries',
                'eligibilityCriteria.programmes',
                'selectionStages',
                'selectionInfra',
                'declaration',
            ])
            ->findOrFail($id);

        return response()->json([
            'preview' => $notification,
        ]);
    }

    public function updateDeclaration(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        $validated = $request->validate([
            'aipc_guidelines' => 'accepted',
            'shortlisting_commitment' => 'accepted',
            'accuracy_profile' => 'accepted',
            'consent_ranking_agencies' => 'accepted',
            'adherence_toc' => 'accepted',
            'rti_nirf_consent' => 'accepted',
            'signatory_name' => 'required|string|max:255',
            'signatory_designation' => 'required|string|max:255',
            'typed_signature' => 'required|string|max:255',
        ]);

        $notification->declaration()->updateOrCreate(
            ['notification_id' => $notification->id],
            array_merge($validated, ['signed_at' => now()])
        );

        return response()->json([
            'message' => 'Declaration saved.',
            'declaration' => $notification->fresh()->declaration,
        ]);
    }
}
