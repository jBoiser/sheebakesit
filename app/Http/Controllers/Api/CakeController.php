<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cake;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CakeController extends Controller
{
    public function index()
    {
        // Sort by the numeric part of ID (ca1, ca2, etc.)
        $cakes = Cake::orderByRaw(
            "CAST(SUBSTRING(id, 3) AS UNSIGNED) ASC"
        )->get()->map(function ($cake) {
            return [
                'id'        => (string) $cake->id,
                'name'      => $cake->name,
                'price'     => $cake->price,
                'size'      => $cake->size, 
                'status'    => $cake->status,
                'image_url' => asset('storage/' . $cake->image_url),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $cakes
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'price'    => 'required|numeric',
            'size'     => 'required|string|max:50',
            'status'   => 'required|in:active,inactive',
            // SECURITY FIX: Prohibit SVG to prevent XSS
            'image'    => 'required|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $last = Cake::orderByRaw("CAST(SUBSTRING(id, 3) AS UNSIGNED) DESC")->first();
        $next = $last ? ((int) substr($last->id, 2) + 1) : 1;
        $newId = 'ca' . $next;

        $imagePath = $this->uploadImage($request->file('image'), $newId);

        Cake::create([
            'id'        => $newId,
            'name'      => $request->name,
            'price'     => $request->price,
            'size'      => $request->size,
            'status'    => $request->status,
            'image_url' => $imagePath,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Cake added successfully'
        ]);
    }

    public function update(Request $request)
    {
        $cake = Cake::where('id', $request->id)->first();

        if (!$cake) {
            return response()->json(['status' => 'error', 'message' => 'Cake not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'price'    => 'required|numeric',
            'size'     => 'required|string|max:50',
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
            if ($cake->image_url && Storage::disk('public')->exists($cake->image_url)) {
                Storage::disk('public')->delete($cake->image_url);
            }
            $cake->image_url = $this->uploadImage($request->file('image'), $cake->id);
        }

        $cake->update([
            'name'     => $request->name,
            'price'    => $request->price,
            'size'     => $request->size,
            'status'   => $request->status,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Cake updated successfully'
        ]);
    }

    public function destroy(Request $request)
    {
        $cake = Cake::where('id', $request->id)->first();

        if (!$cake) {
            return response()->json(['status' => 'error', 'message' => 'Cake not found'], 404);
        }

        if ($cake->image_url && Storage::disk('public')->exists($cake->image_url)) {
            Storage::disk('public')->delete($cake->image_url);
        }

        $cake->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Cake deleted successfully'
        ]);
    }

    private function uploadImage($file, $id)
    {
        $extension = $file->getClientOriginalExtension();
        $fileName = $id . '.' . $extension; 
        $directory = 'cakes';

        return Storage::disk('public')->putFileAs(
            $directory,
            $file,
            $fileName
        );
    }
}