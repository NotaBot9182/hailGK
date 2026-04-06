<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use Illuminate\Http\Request;

class AlertController extends Controller
{
    public function index(Request $request)
    {
        $alerts = Alert::where('notifiable_id', $request->user()->id)
                       ->where('notifiable_type', \App\Models\User::class)
                       ->orderBy('created_at', 'desc')
                       ->get();
                       
        return response()->json(['alerts' => $alerts]);
    }
    
    public function markAsRead(Request $request, $id)
    {
        $alert = Alert::where('notifiable_id', $request->user()->id)
                      ->where('id', $id)
                      ->firstOrFail();
                      
        $alert->update(['read_at' => now()]);
        
        return response()->json(['message' => 'Marked as read', 'alert' => $alert]);
    }
}
