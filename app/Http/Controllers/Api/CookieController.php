<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cookie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CookieController extends Controller
{
    public function index()
    {
        $cookies = Cookie::orderByRaw(
            "CAST(SUBSTRING(id, 3) AS UNSIGNED) ASC"
        )->get()->map(function ($cookie) {
            return [
                'id'        => (string) $cookie->id,
                'name'      => $cookie->name,
                'price'     => $cookie->price,
                'category'  => $cookie->category,
                'status'    => $cookie->status,
                'image_url' => $cookie->image_url
                    ? asset('storage/' . $cookie->image_url)
                    : null,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $cookies
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'price'    => 'required|numeric',
            'category' => 'required|in:Best Seller,Featured,Classic',
            'status'   => 'required|in:active,inactive',
            // SECURITY FIX: Prohibit SVG
            'image'    => 'required|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $last = Cookie::orderByRaw(
            "CAST(SUBSTRING(id, 3) AS UNSIGNED) DESC"
        )->first();

        $next  = $last ? ((int) substr($last->id, 2) + 1) : 1;
        $newId = 'co' . $next;

        $imagePath = $this->uploadImage($request->file('image'), $newId);

        Cookie::create([
            'id'        => $newId,
            'name'      => $request->name,
            'price'     => $request->price,
            'category'  => $request->category,
            'status'    => $request->status,
            'image_url' => $imagePath,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Cookie added successfully'
        ]);
    }

    public function update(Request $request)
    {
        $cookie = Cookie::where('id', $request->id)->first();

        if (!$cookie) {
            return response()->json(['status'  => 'error', 'message' => 'Cookie not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'price'    => 'required|numeric',
            'category' => 'required|in:Best Seller,Featured,Classic',
            'status'   => 'required|in:active,inactive',
            // SECURITY FIX: Prohibit SVG
            'image'    => 'nullable|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->hasFile('image')) {
            if ($cookie->image_url && Storage::disk('public')->exists($cookie->image_url)) {
                Storage::disk('public')->delete($cookie->image_url);
            }
            $cookie->image_url = $this->uploadImage($request->file('image'), $cookie->id);
        }

        $cookie->update([
            'name'     => $request->name,
            'price'    => $request->price,
            'category' => $request->category,
            'status'   => $request->status,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Cookie updated successfully'
        ]);
    }

    public function destroy(Request $request)
    {
        $cookie = Cookie::where('id', $request->id)->first();

        if (!$cookie) {
            return response()->json(['status' => 'error', 'message' => 'Cookie not found'], 404);
        }

        if ($cookie->image_url && Storage::disk('public')->exists($cookie->image_url)) {
            Storage::disk('public')->delete($cookie->image_url);
        }

        $cookie->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Cookie deleted successfully'
        ]);
    }

    private function uploadImage($file, $id)
    {
        $extension = $file->getClientOriginalExtension();
        $fileName  = $id . '.' . $extension;

        return $file->storeAs(
            'cookies',
            $fileName,
            'public'
        );
    }
}