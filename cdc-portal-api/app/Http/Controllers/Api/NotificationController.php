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
        $user = $request->user();

        // Admins can view any notification; recruiters can only view their own
        if (in_array($user->role, ['admin', 'super_admin'])) {
            $notification = Notification::with([
                'company.contacts',
                'jobProfile',
                'internProfile',
                'salaries',
                'eligibilityCriteria.programmes',
                'selectionStages',
                'selectionInfra',
                'declaration',
            ])->findOrFail($id);
        } else {
            $notification = $user->notifications()
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
        }

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
            'phd_allowed' => 'boolean',
            'phd_departments' => 'nullable|string',
            'ma_dhss_allowed' => 'boolean',
            'programmes' => 'nullable|array',
            'programmes.*.code' => 'required|string',
            'programmes.*.name' => 'required|string',
            'programmes.*.min_cpi' => 'nullable|numeric|min:0|max:10',
            'programmes.*.is_selected' => 'boolean',
            'programmes.*.courses' => 'nullable|array',
        ]);

        $eligibility = $notification->eligibilityCriteria()->updateOrCreate(
            ['notification_id' => $notification->id],
            [
                'min_cgpa' => $validated['min_cgpa'] ?? null,
                'backlogs_allowed' => $validated['backlogs_allowed'] ?? true,
                'hs_percentage' => $validated['hs_percentage'] ?? null,
                'gender_filter' => $validated['gender_filter'] ?? 'all',
                'slp_requirement' => $validated['slp_requirement'] ?? null,
                'phd_allowed' => $validated['phd_allowed'] ?? false,
                'ma_dhss_allowed' => $validated['ma_dhss_allowed'] ?? false,
            ]
        );

        if (isset($validated['programmes'])) {
            $submittedCodes = [];
            foreach ($validated['programmes'] as $prog) {
                $eligibility->programmes()->updateOrCreate(
                    ['programme_code' => $prog['code']],
                    [
                        'programme_name' => $prog['name'],
                        'min_cpi' => $prog['min_cpi'] ?? null,
                        'is_selected' => $prog['is_selected'] ?? true,
                        'courses' => $prog['courses'] ?? [],
                    ]
                );
                $submittedCodes[] = $prog['code'];
            }
            // Remove programmes no longer in the submission
            $eligibility->programmes()->whereNotIn('programme_code', $submittedCodes)->delete();
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

        if (!$notification->internProfile) {
            return response()->json([
                'message' => 'Please fill out and save the Intern Profile tab first.',
            ], 422);
        }

        $notification->internProfile->update($validated);

        return response()->json([
            'message' => 'Stipend details saved.',
            'intern_profile' => $notification->internProfile,
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

    public function uploadSelectionPdf(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        $request->validate([
            'selection_pdf' => 'required|mimes:pdf|max:5120',
        ]);

        $infra = $notification->selectionInfra()->first();

        if (!$infra) {
            $infra = $notification->selectionInfra()->create([
                'notification_id' => $id,
            ]);
        }

        $oldPath = $infra->selection_process_pdf_path;

        if ($oldPath) {
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('selection_pdf')->store('selection-pdfs', 'public');
        $infra->update(['selection_process_pdf_path' => $path]);

        return response()->json([
            'message' => 'Selection process PDF uploaded.',
            'selection_process_pdf_path' => $path,
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
            'aipc_guidelines' => 'boolean',
            'shortlisting_commitment' => 'boolean',
            'accuracy_profile' => 'boolean',
            'consent_ranking_agencies' => 'boolean',
            'adherence_toc' => 'boolean',
            'rti_nirf_consent' => 'boolean',
            'signatory_name' => 'nullable|string|max:255',
            'signatory_designation' => 'nullable|string|max:255',
            'typed_signature' => 'nullable|string|max:255',
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

    public function duplicate(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()->notifications()
            ->with(['jobProfile', 'internProfile', 'salaries', 'eligibilityCriteria.programmes', 'selectionStages', 'selectionInfra'])
            ->findOrFail($id);

        $newNotification = $notification->replicate();
        $newNotification->status = 'draft';
        $newNotification->reference_number = null;
        $newNotification->submitted_at = null;
        $newNotification->reviewed_at = null;
        $newNotification->reviewed_by = null;
        $newNotification->review_notes = null;
        $newNotification->save();

        if ($notification->jobProfile) {
            $newProfile = $notification->jobProfile->replicate();
            $newProfile->notification_id = $newNotification->id;
            $newProfile->save();
        }

        if ($notification->internProfile) {
            $newProfile = $notification->internProfile->replicate();
            $newProfile->notification_id = $newNotification->id;
            $newProfile->save();
        }

        foreach ($notification->salaries as $salary) {
            $newSalary = $salary->replicate();
            $newSalary->notification_id = $newNotification->id;
            $newSalary->save();
        }

        if ($notification->eligibilityCriteria) {
            $newEligibility = $notification->eligibilityCriteria->replicate();
            $newEligibility->notification_id = $newNotification->id;
            $newEligibility->save();

            foreach ($notification->eligibilityCriteria->programmes as $programme) {
                $newProgramme = $programme->replicate();
                $newProgramme->eligibility_criteria_id = $newEligibility->id;
                $newProgramme->save();
            }
        }

        foreach ($notification->selectionStages as $stage) {
            $newStage = $stage->replicate();
            $newStage->notification_id = $newNotification->id;
            $newStage->save();
        }

        if ($notification->selectionInfra) {
            $newInfra = $notification->selectionInfra->replicate();
            $newInfra->notification_id = $newNotification->id;
            $newInfra->selection_process_pdf_path = null;
            $newInfra->save();
        }

        return response()->json([
            'message' => 'Submission duplicated successfully.',
            'notification' => $newNotification->fresh(),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);

        if ($notification->status !== 'draft') {
            return response()->json([
                'message' => 'Only drafts can be deleted.',
            ], 422);
        }

        if ($notification->jobProfile) $notification->jobProfile->delete();
        if ($notification->internProfile) $notification->internProfile->delete();
        if ($notification->selectionInfra) $notification->selectionInfra->delete();
        if ($notification->declaration) $notification->declaration->delete();
        $notification->selectionStages()->delete();
        $notification->salaries()->delete();
        
        if ($notification->eligibilityCriteria) {
            $notification->eligibilityCriteria->programmes()->delete();
            $notification->eligibilityCriteria->delete();
        }

        $notification->delete();

        return response()->json([
            'message' => 'Draft deleted successfully.',
        ]);
    }
}
