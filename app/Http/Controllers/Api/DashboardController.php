<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage; // Added for good measure
use App\Models\Order;

class DashboardController extends Controller
{
    /* ==========================================
       VISITOR LOGGING (Limit: 1 entry per IP every 10 mins)
    ========================================== */
    public function logVisitor(Request $request)
    {
        $ip = $request->ip();

        // Check if this IP has visited in the last 10 minutes
        $exists = DB::table('visitors')
            ->where('ip_address', $ip)
            ->where('visit_date', '>=', now()->subMinutes(10))
            ->exists();

        if (!$exists) {
            DB::table('visitors')->insert([
                'ip_address' => $ip,
                'user_agent' => $request->header('User-Agent'),
                'visit_date' => now()
            ]);
            return response()->json(['status' => 'logged']);
        }

        return response()->json(['status' => 'skipped']);
    }

    /* ==========================================
       NOTEPAD LOGIC
    ========================================== */
    public function getNote()
    {
        $note = DB::table('dashboard_notes')->orderBy('id', 'desc')->first();
        return response()->json(['content' => $note ? $note->content : '']);
    }

    public function saveNote(Request $request)
    {
        $exists = DB::table('dashboard_notes')->first();
        
        if ($exists) {
            DB::table('dashboard_notes')->where('id', $exists->id)->update([
                'content' => $request->input('content'),
                'updated_at' => now()
            ]);
        } else {
            DB::table('dashboard_notes')->insert([
                'content' => $request->input('content'),
                'updated_at' => now()
            ]);
        }

        return response()->json(['status' => 'saved']);
    }

    /* ==========================================
       DASHBOARD STATS
    ========================================== */
    public function stats(Request $request)
    {
        $from = $request->input('from') ? $request->input('from') : now()->startOfMonth()->toDateString();
        $to   = $request->input('to')   ? $request->input('to')   : now()->endOfDay()->toDateString();

        /* =============================
           CARDS
        ============================== */
        $totalOrders = Order::whereBetween('created_at', [$from, $to])->count();
        $totalRevenue = (float) Order::whereBetween('created_at', [$from, $to])->sum('total_amount');
        $pageVisitors = DB::table('visitors')->count(); 

        /* =============================
           CHARTS
        ============================== */
        $ordersChart = Order::selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $revenueChart = Order::selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $bestCookies = DB::table('order_items')
            ->join('cookies', 'order_items.item_id', '=', 'cookies.id')
            ->select('order_items.item_name', DB::raw('SUM(order_items.quantity) as total'))
            ->whereBetween('order_items.created_at', [$from, $to])
            ->groupBy('order_items.item_name')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        $bestCakes = DB::table('order_items')
            ->join('cakes', 'order_items.item_id', '=', 'cakes.id')
            ->select('order_items.item_name', DB::raw('SUM(order_items.quantity) as total'))
            ->whereBetween('order_items.created_at', [$from, $to])
            ->groupBy('order_items.item_name')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        /* =============================
           RECENT ORDERS (With Relative Image URL)
        ============================== */
        $recentOrders = Order::latest()
            ->limit(10)
            ->get([
                'order_id',
                'customer_name',
                'created_at',
                'total_amount',
                'proof_image'
            ])
            ->map(function ($order) {
                // UPDATE: We use a relative path ('/storage/...') instead of asset().
                // This ensures the link works regardless of whether you are on localhost,
                // an IP address (192.168...), or a production domain.
                $order->proof_image_url = $order->proof_image 
                    ? '/storage/' . $order->proof_image 
                    : null;
                return $order;
            });

        return response()->json([
            'cards' => [
                'orders'   => $totalOrders,
                'revenue'  => $totalRevenue,
                'visitors' => $pageVisitors,
            ],
            'charts' => [
                'orders'  => $ordersChart,
                'revenue' => $revenueChart,
                'cookies' => $bestCookies,
                'cakes'   => $bestCakes,
            ],
            'recent_orders' => $recentOrders
        ]);
    }
}