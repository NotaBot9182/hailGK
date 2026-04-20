<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AlumniMentorship;
use Illuminate\Http\Request;

class AlumniMentorshipController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grad_year' => 'required|integer|min:1926|max:' . (date('Y') + 1),
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'industry' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'mentorship_areas' => 'nullable|array',
            'motivation' => 'nullable|string',
            'affiliated_degrees' => 'nullable|array',
        ]);

        $mentorship = AlumniMentorship::create($validated);

        return response()->json([
            'message' => 'Alumni Mentorship Application submitted successfully',
            'data' => $mentorship
        ], 201);
    }
}
