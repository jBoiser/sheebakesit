<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cake;
use App\Models\Cookie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator; // Added Validator
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    /* ================================
     * HELPER: PUBLIC URL FOR STORAGE FILE
     * ================================ */
    private function storageUrl($path)
    {
        return $path ? asset('storage/' . $path) : null;
    }

    /* ================================
     * HELPER: ABSOLUTE PATH FOR PDF IMAGES
     * (DomPDF needs real file paths)
     * ================================ */
    private function storagePath($path)
    {
        return $path
            ? storage_path('app/public/' . $path)
            : null;
    }

    /* ================================
     * GENERATE ORDER ID (SBI-001)
     * ================================ */
    private function generateOrderId()
    {
        $last = Order::orderBy('id', 'DESC')->first();
        $next = $last ? $last->id + 1 : 1;

        return 'SBI-' . str_pad($next, 3, '0', STR_PAD_LEFT);
    }

    /* ================================
     * PREPARE INVOICE DATA (PDF + EMAIL)
     * ================================ */
    private function getInvoiceData($orderId)
    {
        $order = Order::where('order_id', $orderId)->first();
        if (!$order) return null;

        $items = OrderItem::where('order_id', $order->order_id)->get();

        foreach ($items as $item) {
            $item->image_path = null;

            // Cakes
            if (str_starts_with($item->item_id, 'ca')) {
                $cake = Cake::find($item->item_id);
                if ($cake && $cake->image_url) {
                    $path = $this->storagePath($cake->image_url);
                    if (file_exists($path)) {
                        $item->image_path = $path;
                    }
                }
            }

            // Cookies
            if (str_starts_with($item->item_id, 'co')) {
                $cookie = Cookie::find($item->item_id);
                if ($cookie && $cookie->image_url) {
                    $path = $this->storagePath($cookie->image_url);
                    if (file_exists($path)) {
                        $item->image_path = $path;
                    }
                }
            }
        }

        return compact('order', 'items');
    }

    /* ================================
     * PLACE ORDER
     * ================================ */
    public function placeOrder(Request $req)
    {
        // SECURITY FIX: Validate inputs before processing
        $validator = Validator::make($req->all(), [
            'name'        => 'required|string|max:255',
            'address'     => 'required|string|max:500',
            'contact'     => 'required|string|max:50',
            'email'       => 'required|email|max:255',
            'proof_image' => 'nullable|mimes:jpeg,png,jpg,webp|max:5120', // Max 5MB, strict types
            'items'       => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Invalid data provided.'], 422);
        }

        try {
            $proof = null;
            if ($req->hasFile('proof_image')) {
                $proof = $req->file('proof_image')->store('orders', 'public');
            }

            // SECURITY FIX: strip_tags() removes HTML/Scripts from input
            $order = Order::create([
                'order_id'      => $this->generateOrderId(),
                'reference_no'  => 'REF-' . date('Ymd') . '-' . rand(10000, 99999),
                'customer_name' => strip_tags($req->name),
                'address'       => strip_tags($req->address),
                'contact'       => strip_tags($req->contact),
                'email'         => strip_tags($req->email), // Emails shouldn't have tags anyway
                'payment_mode'  => strip_tags($req->payment_mode),
                'delivery_mode' => strip_tags($req->delivery_mode),
                'comments'      => strip_tags($req->comments),
                'proof_image'   => $proof,
                'total_amount'  => $req->total,
            ]);

            if (is_array($req->items)) {
                DB::table('order_items')->insert(
                    collect($req->items)->map(function ($i) use ($order) {
                        return [
                            'order_id'  => $order->order_id,
                            'item_name' => strip_tags($i['item_name']), // Sanitize item name too
                            'item_id'   => $i['item_id'],
                            'price'     => $i['price'],
                            'quantity'  => $i['quantity'],
                            'total'     => $i['total'],
                        ];
                    })->toArray()
                );
            }

            return response()->json([
                'status'       => 'success',
                'order_id'     => $order->order_id,
                'reference_no' => $order->reference_no,
            ]);

        } catch (\Exception $e) {
            Log::error('Order Failed: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Order failed'], 500);
        }
    }

    /* ================================
     * GET ALL ORDERS (ADMIN)
     * ================================ */
    public function getOrders()
    {
        try {
            $orders = Order::orderBy('id', 'DESC')->get();
            $data = [];

            foreach ($orders as $o) {
                $items = OrderItem::where('order_id', $o->order_id)->get();

                $itemData = $items->map(function ($i) {
                    $img = null;

                    if (str_starts_with($i->item_id, 'ca')) {
                        $cake = Cake::find($i->item_id);
                        $img = $cake?->image_url;
                    }

                    if (str_starts_with($i->item_id, 'co')) {
                        $cookie = Cookie::find($i->item_id);
                        $img = $cookie?->image_url;
                    }

                    return [
                        'name'  => $i->item_name,
                        'price' => $i->price,
                        'qty'   => $i->quantity,
                        'total' => $i->total,
                        'image' => $img
                            ? asset('storage/' . $img)
                            : asset('storage/no-image.png'),
                    ];
                });

                $data[] = [
                    'order_id'      => $o->order_id,
                    'reference_no'  => $o->reference_no,
                    'customer_name' => $o->customer_name,
                    'address'       => $o->address,
                    'contact'       => $o->contact,
                    'email'         => $o->email,
                    'payment_mode'  => $o->payment_mode,
                    'delivery_mode' => $o->delivery_mode,
                    'proof_image'   => $this->storageUrl($o->proof_image),
                    'comments'      => $o->comments,
                    'total_amount'  => $o->total_amount,
                    'status'        => $o->status,
                    'created_at'    => $o->created_at,
                    'items'         => $itemData,
                ];
            }

            return response()->json(['status' => 'success', 'data' => $data]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Fetch failed'], 500);
        }
    }

    /* ================================
     * UPDATE / DELETE ORDER
     * ================================ */
    public function updateOrder(Request $req)
    {
        $req->validate([
            'order_id' => 'required|string',
            'status'   => 'required|string'
        ]);

        $order = Order::where('order_id', $req->order_id)->first();
        if (!$order) {
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        }

        $order->update(['status' => $req->status]);
        return response()->json(['status' => 'success']);
    }

    public function deleteOrder(Request $req)
    {
        $req->validate(['order_id' => 'required|string']);

        $order = Order::where('order_id', $req->order_id)->first();
        if (!$order) {
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        }

        OrderItem::where('order_id', $order->order_id)->delete();

        if ($order->proof_image) {
            Storage::disk('public')->delete($order->proof_image);
        }

        $order->delete();
        return response()->json(['status' => 'success']);
    }

    /* ================================
     * SEND INVOICE EMAIL (PDF)
     * ================================ */
    public function sendInvoice(Request $req)
    {
        $req->validate(['order_id' => 'required|string']);

        $data = $this->getInvoiceData($req->order_id);
        if (!$data) {
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        }

        try {
            $pdf = Pdf::loadView('pdfs.receipt', $data)
                ->setPaper('A4', 'portrait');

            Mail::send('emails.invoice', ['order' => $data['order']], function ($msg) use ($data, $pdf) {
                $msg->to($data['order']->email)
                    ->bcc('admin@sheebakesit.com')
                    ->subject('Order Confirmation: ' . $data['order']->reference_no)
                    ->attachData(
                        $pdf->output(),
                        'Invoice-' . $data['order']->reference_no . '.pdf'
                    );
            });

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            Log::error('Invoice Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Email failed'], 500);
        }
    }

    /* ================================
     * DOWNLOAD INVOICE PDF
     * ================================ */
    public function downloadInvoice($id)
    {
        $data = $this->getInvoiceData($id);
        if (!$data) abort(404);

        return Pdf::loadView('pdfs.receipt', $data)
            ->setPaper('A4', 'portrait')
            ->download('Invoice-' . $data['order']->reference_no . '.pdf');
    }
}