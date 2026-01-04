<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cake;
use App\Models\Cookie;
use App\Models\Carousel;
use App\Models\Footer;
use App\Models\Marquee;

class DataController extends Controller
{
    public function getAll()
    {
        return response()->json([

            /* =========================
             * COOKIES
             * ========================= */
            'cookies' => Cookie::where('status', 'active')
                ->orderByRaw("CAST(SUBSTRING(id, 3) AS UNSIGNED)")
                ->get()
                ->map(function ($item) {
                    return [
                        'id'       => (string) $item->getAttributes()['id'],
                        'name'     => $item->name,
                        'category' => $item->category,
                        'price'    => $item->price,
                        'img'      => $item->image_url
                            ? asset('storage/' . $item->image_url)
                            : null,
                    ];
                }),

            /* =========================
             * CAKES
             * ========================= */
            'cakes' => Cake::where('status', 'active')
                ->orderByRaw("CAST(SUBSTRING(id, 3) AS UNSIGNED)")
                ->get()
                ->map(function ($x) {
                    return [
                        'id'    => (string) $x->getAttributes()['id'],
                        'name'  => $x->name,
                        'size'  => $x->size,
                        'price' => $x->price,
                        'img'   => $x->image_url
                            ? asset('storage/' . $x->image_url)
                            : null,
                    ];
                }),

            /* =========================
             * CAROUSEL
             * ========================= */
            'carousel' => Carousel::all()
                ->map(function ($x) {
                    return [
                        'id'   => (string) ($x->getAttributes()['id'] ?? $x->id),
                        'name' => $x->name,
                        'type' => $x->type,
                        'img'  => $x->image_url
                            ? asset('storage/' . $x->image_url)
                            : null,
                    ];
                }),

            /* =========================
             * MARQUEE
             * ========================= */
            'marquee' => Marquee::all()
                ->map(function ($x) {
                    return [
                        'id'   => (string) ($x->getAttributes()['id'] ?? $x->id),
                        'name' => $x->name,
                        'img'  => $x->image_url
                            ? asset('storage/' . $x->image_url)
                            : null,
                    ];
                }),

            /* =========================
             * FOOTER
             * ========================= */
            'footer' => Footer::all()
                ->mapWithKeys(function ($x) {
                    return [
                        $x->asset_id => $x->image_url
                            ? asset('storage/' . $x->image_url)
                            : null,
                    ];
                }),

        ]);
    }
}
