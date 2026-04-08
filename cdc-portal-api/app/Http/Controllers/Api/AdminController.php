<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function notifications(Request $request): JsonResponse
    {
        $query = Notification::with(['company', 'user', 'reviewer']);

        if ($request->has('company')) {
            $query->whereHas('company', fn($q) => $q->where('name', 'like', "%{$request->company}%"));
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        if ($request->has('season')) {
            $query->where('season', $request->season);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $notifications = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($notifications);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $notification = Notification::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:under_review,approved,rejected,changes_requested',
            'review_notes' => 'nullable|string',
        ]);

        $oldStatus = $notification->status;
        $newStatus = $validated['status'];

        $notification->update([
            'status' => $newStatus,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'review_notes' => $validated['review_notes'] ?? null,
        ]);

        if ($oldStatus !== $newStatus && in_array($newStatus, ['approved', 'changes_requested', 'rejected'])) {
            try {
                $userEmail = $notification->user->email ?? null;
                if ($userEmail) {
                    \Illuminate\Support\Facades\Mail::to($userEmail)
                        ->queue(new \App\Mail\JnfVerifiedEmail($notification));
                }

                \App\Models\Alert::create([
                    'type' => 'App\Notifications\JnfStatusUpdated',
                    'notifiable_type' => \App\Models\User::class,
                    'notifiable_id' => $notification->user_id,
                    'data' => [
                        'status' => $newStatus,
                        'reference_number' => $notification->reference_number,
                        'message' => "Your " . strtoupper($notification->type) . " submission status was updated to " . str_replace('_', ' ', $newStatus),
                    ],
                ]);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Verification notification failed: ' . $e->getMessage());
            }
        }

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'status_update',
            'entity_type' => 'notification',
            'entity_id' => $notification->id,
            'metadata' => [
                'old_status' => $oldStatus,
                'new_status' => $validated['status'],
                'reference_number' => $notification->reference_number,
                'notification_type' => strtoupper($notification->type),
                'company_name' => $notification->company?->name ?? 'Unknown',
                'review_notes' => $validated['review_notes'] ?? null,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'message' => 'Status updated.',
            'notification' => $notification->fresh(['company', 'reviewer']),
        ]);
    }

    public function export(Request $request)
    {
        $type = $request->get('type');
        if (empty($type)) {
            $type = 'all';
        }
        $format = $request->get('format', 'csv');

        $query = Notification::with([
            'company.contacts', 'user', 'eligibilityCriteria.programmes', 
            'jobProfile', 'internProfile', 'salaries', 
            'selectionStages', 'selectionInfra', 'declaration'
        ]);

        // Filter by specific IDs (for selected export)
        if ($request->has('ids')) {
            $ids = is_array($request->ids) ? $request->ids : explode(',', $request->ids);
            $query->whereIn('id', $ids);
        }

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('company')) {
            $query->whereHas('company', fn($q) => $q->where('name', 'like', "%{$request->company}%"));
        }

        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        if ($request->has('season')) {
            $query->where('season', $request->season);
        }

        $notifications = $query->orderBy('created_at', 'desc')->get();

        $data = $notifications->map(function ($n) {
            $profile = $n->type === 'jnf' ? $n->jobProfile : $n->internProfile;
            $topSalary = $n->salaries->first();
            $eligibility = $n->eligibilityCriteria;
            $infra = $n->selectionInfra;
            $declaration = $n->declaration;
            
            // Format places of posting
            $locations = $profile?->place_of_posting ?? '—';
            if (is_string($locations)) {
                $locationsDecoded = json_decode($locations, true);
                if (is_array($locationsDecoded)) {
                    $locations = $locationsDecoded;
                }
            }
            if (is_array($locations)) {
                // flatten and filter strings
                $flat = [];
                array_walk_recursive($locations, function($val) use (&$flat) {
                    if (is_scalar($val) && $val !== '') $flat[] = $val;
                });
                $locations = empty($flat) ? '—' : implode('; ', $flat);
            }

            // Format programs allowed
            $programs = '—';
            if ($eligibility && $eligibility->programmes) {
                $programs = $eligibility->programmes->map(fn($p) => "{$p->programme_name} ({$p->course_name})")->implode('; ');
            }

            // Format selection stages
            $stages = '—';
            if ($n->selectionStages && $n->selectionStages->isNotEmpty()) {
                $stages = $n->selectionStages->map(fn($s) => $s->stage_type . ($s->mode ? " ({$s->mode})" : ""))->implode(' -> ');
            }

            // Format HR contacts
            $hrContacts = '—';
            if ($n->company && $n->company->contacts) {
                $hrContacts = $n->company->contacts->map(fn($c) => "{$c->name} ({$c->email})")->implode(' | ');
            }

            return [
                'Reference' => $n->reference_number,
                'Type' => strtoupper($n->type),
                'Status' => ucfirst(str_replace('_', ' ', $n->status)),
                'Season' => "{$n->year} - " . ($n->season === 1 ? 'First' : 'Second'),
                'Company' => $n->company?->name ?? '—',
                'Sector' => $n->company?->sector ?? '—',
                'Website' => $n->company?->website ?? '—',
                'HR Contacts' => $hrContacts,
                'Submitted By' => $n->user?->name ?? '—',
                'Email' => $n->user?->email ?? '—',
                'Profile Title' => $profile?->title ?? ($profile?->profile_name ?? '—'),
                'Designation' => $profile?->designation ?? '—',
                'Description' => $profile?->description ?? '—',
                'Location' => $locations,
                'CTC/Stipend' => $topSalary?->ctc_annual ?? ($topSalary?->stipend ?? '—'),
                'Additional Salary Info' => is_array($topSalary?->additional_salary_components) ? json_encode($topSalary->additional_salary_components) : '—',
                'Currency' => $topSalary?->currency ?? '—',
                'Eligible Programs' => $programs,
                'CGPA Cutoff' => $eligibility?->cgpa_cutoff ?? '—',
                'Class 10 Cutoff' => $eligibility?->tenth_marks_cutoff ?? '—',
                'Class 12 Cutoff' => $eligibility?->twelfth_marks_cutoff ?? '—',
                'Selection Flow' => $stages,
                'Rooms Required' => $infra?->rooms_required ?? '0',
                'Team Members Expected' => $infra?->team_members_required ?? '0',
                'Signatory Name' => $declaration?->signatory_name ?? '—',
                'Signatory Designation' => $declaration?->signatory_designation ?? '—',
                'Submitted At' => $n->submitted_at?->format('Y-m-d H:i:s') ?? '—',
                'Reviewed At' => $n->reviewed_at?->format('Y-m-d H:i:s') ?? '—',
                'Review Notes' => $n->review_notes ?? '',
            ];
        });

        if ($format === 'json') {
            return response()->json(['data' => $data]);
        }

        // Proper CSV with quoting
        $csvQuote = fn($val) => '"' . str_replace('"', '""', (string)$val) . '"';
        $csv = implode("\n", [
            implode(',', array_map($csvQuote, array_keys($data->first() ?? []))),
            ...$data->map(fn($row) => implode(',', array_map($csvQuote, $row))),
        ]);

        return response()->streamDownload(
            fn() => print($csv),
            "notifications-export.{$format}",
            ['Content-Type' => 'text/csv']
        );
    }

    public function users(Request $request): JsonResponse
    {
        $query = User::with('company')->where('role', 'recruiter');

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
        }

        if ($request->has('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $users = $query->paginate(20);

        return response()->json($users);
    }

    public function updateUser(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'is_active' => 'boolean',
            'role' => 'in:recruiter,admin,super_admin',
        ]);

        if (isset($validated['role']) && $validated['role'] !== $user->role) {
            if (!$request->user()->isSuperAdmin()) {
                return response()->json([
                    'message' => 'Only Super Admin can change user roles.'
                ], 403);
            }
        }

        if ($user->id === $request->user()->id && isset($validated['role']) && $validated['role'] !== 'super_admin') {
            return response()->json([
                'message' => 'Cannot change your own role.'
            ], 422);
        }

        $user->update($validated);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'user_update',
            'entity_type' => 'user',
            'entity_id' => $user->id,
            'metadata' => $validated,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'message' => 'User updated.',
            'user' => $user->fresh(),
        ]);
    }

    public function deleteUser(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'message' => 'Only Super Admin can delete users.'
            ], 403);
        }

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot delete yourself.'], 422);
        }

        $user->delete();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'user_delete',
            'entity_type' => 'user',
            'entity_id' => $user->id,
            'metadata' => ['deleted_user_email' => $user->email],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['message' => 'User deleted.']);
    }

    public function createUser(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:recruiter,admin',
            'company_id' => 'nullable|exists:companies,id',
            'designation' => 'nullable|string|max:255',
            'mobile' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            ...$validated,
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'user_create',
            'entity_type' => 'user',
            'entity_id' => $user->id,
            'metadata' => ['email' => $user->email, 'role' => $user->role],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'message' => 'User created.',
            'user' => $user,
        ], 201);
    }

    public function analytics(Request $request): JsonResponse
    {
        $year = $request->get('year', date('Y'));

        $totalSubmissions = Notification::where('year', $year)->count();

        $byType = Notification::where('year', $year)
            ->select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->pluck('count', 'type');

        $byStatus = Notification::where('year', $year)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $bySector = Notification::where('year', $year)
            ->whereNotNull('company_id')
            ->with('company')
            ->get()
            ->groupBy(fn($n) => $n->company?->sector ?? 'Unknown')
            ->map->count();

        return response()->json([
            'total_submissions' => $totalSubmissions,
            'by_type' => $byType,
            'by_status' => $byStatus,
            'by_sector' => $bySector,
        ]);
    }

    public function auditLogs(Request $request): JsonResponse
    {
        $query = AuditLog::with('user');

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        if ($request->has('entity_type')) {
            $query->where('entity_type', $request->entity_type);
        }

        if ($request->has('from')) {
            $query->where('created_at', '>=', $request->from);
        }

        if ($request->has('to')) {
            $query->where('created_at', '<=', $request->to);
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate(50);

        // Enrich notification logs with current status
        $notificationIds = $logs->getCollection()
            ->where('entity_type', 'notification')
            ->pluck('entity_id')
            ->unique()
            ->values();

        if ($notificationIds->isNotEmpty()) {
            $notifications = Notification::with('company')
                ->whereIn('id', $notificationIds)
                ->get()
                ->keyBy('id');

            $logs->getCollection()->transform(function ($log) use ($notifications) {
                if ($log->entity_type === 'notification' && isset($notifications[$log->entity_id])) {
                    $notification = $notifications[$log->entity_id];
                    $log->notification_current_status = $notification->status;
                    $log->notification_reference = $notification->reference_number;
                    $log->notification_type_label = strtoupper($notification->type);
                    $log->notification_company = $notification->company?->name ?? null;
                }
                return $log;
            });
        }

        return response()->json($logs);
    }
}
