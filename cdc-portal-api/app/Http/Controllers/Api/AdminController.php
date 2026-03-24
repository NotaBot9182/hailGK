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

        $notification->update([
            'status' => $validated['status'],
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'review_notes' => $validated['review_notes'] ?? null,
        ]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'status_update',
            'entity_type' => 'notification',
            'entity_id' => $notification->id,
            'metadata' => ['new_status' => $validated['status']],
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
        $type = $request->get('type', 'all');
        $format = $request->get('format', 'csv');

        $query = Notification::with(['company', 'eligibilityCriteria.programmes']);

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        if ($request->has('season')) {
            $query->where('season', $request->season);
        }

        $notifications = $query->get();

        $data = $notifications->map(function ($n) {
            return [
                'Reference' => $n->reference_number,
                'Type' => strtoupper($n->type),
                'Company' => $n->company?->name,
                'Status' => ucfirst(str_replace('_', ' ', $n->status)),
                'Season' => "{$n->year} - " . ($n->season === 1 ? 'First' : 'Second'),
                'Submitted At' => $n->submitted_at?->format('Y-m-d H:i:s'),
                'Reviewed At' => $n->reviewed_at?->format('Y-m-d H:i:s'),
            ];
        });

        if ($format === 'json') {
            return response()->json(['data' => $data]);
        }

        $csv = implode("\n", [
            implode(',', array_keys($data->first() ?? [])),
            ...$data->map(fn($row) => implode(',', $row)),
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
        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot delete yourself.'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted.']);
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
}
