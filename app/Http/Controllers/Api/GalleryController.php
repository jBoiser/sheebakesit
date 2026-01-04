<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class GalleryController extends Controller
{
    /**
     * Display a listing of the gallery items.
     */
    public function index()
    {
        $items = Gallery::orderBy('created_at', 'desc')->get()->map(function ($item) {
            return [
                'id'          => $item->id,
                'title'       => $item->title,
                'description' => $item->description,
                'status'      => $item->status,
                'image_url'   => $item->image_url 
                    ? asset('storage/' . $item->image_url) 
                    : asset('images/placeholder.jpg'),
                'created_at'  => $item->created_at->format('M d, Y'),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $items
        ]);
    }

    /**
     * Store a newly created gallery item.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'required|in:active,inactive',
            'image'       => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $item = Gallery::create([
            'title'       => $request->title,
            'description' => $request->description,
            'status'      => $request->status,
        ]);

        if ($request->hasFile('image')) {
            $item->image_url = $this->uploadImage($request->file('image'), $item->id);
            $item->save();
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Gallery item created successfully',
            'data'    => $item
        ]);
    }

    /**
     * Update the specified gallery item.
     */
    public function update(Request $request)
    {
        $item = Gallery::find($request->id);

        if (!$item) {
            return response()->json(['status' => 'error', 'message' => 'Item not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'required|in:active,inactive',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('image')) {
            // Delete old image
            if ($item->image_url && Storage::disk('public')->exists($item->image_url)) {
                Storage::disk('public')->delete($item->image_url);
            }
            $item->image_url = $this->uploadImage($request->file('image'), $item->id);
        }

        $item->update([
            'title'       => $request->title,
            'description' => $request->description,
            'status'      => $request->status,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Gallery item updated successfully'
        ]);
    }

    /**
     * Remove the specified gallery item.
     */
    public function destroy(Request $request)
    {
        $item = Gallery::find($request->id);

        if (!$item) {
            return response()->json(['status' => 'error', 'message' => 'Item not found'], 404);
        }

        if ($item->image_url && Storage::disk('public')->exists($item->image_url)) {
            Storage::disk('public')->delete($item->image_url);
        }

        $item->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Gallery item deleted successfully'
        ]);
    }

    /**
     * Helper to handle image naming and storage.
     */
    private function uploadImage($file, $id)
    {
        $extension = $file->getClientOriginalExtension();
        $filename = 'gallery_' . $id . '_' . time() . '.' . $extension;
        return $file->storeAs('gallery', $filename, 'public');
    }
}