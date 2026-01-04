<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Safety Check: If user is somehow not logged in, send to login.
        // (The 'auth' middleware usually catches this first, but this is a fail-safe)
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        // 2. If user IS logged in but is NOT an admin
        if (!auth()->user()->is_admin) {
            // Redirect to Home instead of showing abort(403)
            return redirect()->route('home');
        }

        return $next($request);
    }
}