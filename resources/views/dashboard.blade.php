{{-- resources/views/dashboard.blade.php --}}
@extends('layouts.dashboard-layout')

@section('content')

<div class="dashboard-wrapper">

    {{-- SIDEBAR --}}
    <aside id="sidebar" class="sidebar">

        <!-- Brand -->
        <a href="#" class="sidebar-brand" onclick="spa.showPage('dashboard'); return false;">
            <img src="{{ asset('storage/footers/logo1.png') }}" class="sidebar-logo-img">
            <span>Shee' BakesIt</span>
            <span>Test from local via git</span>
        </a>

        <hr class="sidebar-divider">

        <ul class="sidebar-menu">

            <li><a href="#" onclick="spa.showPage('dashboard', this)" class="nav-link">
                <i class="fas fa-home"></i> Dashboard</a></li>

            <li><a href="#" onclick="spa.showPage('orders', this)" class="nav-link">
                <i class="fas fa-receipt"></i> Orders</a></li>

            <!-- Management -->
            <li>
                <a href="#" class="nav-link d-flex justify-content-between"
                onclick="toggleSubmenu('management-submenu', this); return false;">
                    <span><i class="fas fa-cogs"></i> Management</span>
                    <i class="fas fa-chevron-right small chevron-icon"></i>
                </a>

                <ul id="management-submenu" class="submenu d-none list-unstyled ps-4">
                    <li><a href="#" onclick="spa.showPage('cookies');" class="nav-link small"><i class="fa-solid fa-cookie-bite"></i>Cookies</a></li>
                    <li><a href="#" onclick="spa.showPage('cakes');" class="nav-link small"><i class="fa-solid fa-cake-candles"></i>Cakes</a></li>
                    <li><a href="#" onclick="spa.showPage('gallery', this)" class="nav-link"><i class="fas fa-images"></i> Gallery</a></li>

                    <li><a href="#" onclick="spa.showPage('testimonial');" class="nav-link small"><i class="fa-solid fa-comments"></i>Testimonial</a></li>
                    <li><a href="#" onclick="spa.showPage('blog');" class="nav-link small"><i class="fa-solid fa-pen-to-square"></i>Blog</a></li>
                </ul>
            </li>


            <li><a href="#" onclick="spa.showPage('customers', this)" class="nav-link">
                <i class="fas fa-users"></i> Customers</a></li>

            <li><a href="#" onclick="spa.showPage('reports', this)" class="nav-link">
                <i class="fas fa-chart-bar"></i> Reports</a></li>
        </ul>

       <!-- Bottom Section -->
    <div class="sidebar-bottom mt-auto text-center">
        
        <hr class="sidebar-divider">

        <a href="/" target="_blank" class="nav-link sidebar-bottom-link mt-3">
            <i class="fas fa-globe me-1"></i> View Live Site
        </a>

        <form method="POST" action="{{ route('logout') }}" class="mt-2">
            @csrf
            <button type="submit" class="btn btn-link sidebar-bottom-link">
                <i class="fas fa-sign-out-alt me-1"></i> Log Out
            </button>
        </form>

    </div>


    </aside>

    {{-- MAIN CONTENT --}}
    <main class="main-content">

        <div class="page-header d-flex justify-content-end mb-3">
            <button id="refresh-btn"
                class="btn btn-sm btn-outline-danger rounded-pill d-none"
                onclick="spa.refreshCurrent()">
                <i class="fas fa-sync-alt me-1"></i> Refresh
            </button>
        </div>

        {{-- Loader --}}
        <div id="loader-overlay" class="d-none">
            <div class="spinner-custom spinner-border"></div>
        </div>

        {{-- SPA Content --}}
        <div id="content-area">
            @include('pages.dashboard-page')
            @include('pages.orders-page')
            @include('pages.customers-page')
            @include('pages.cookies-page')
            @include('pages.cakes-page')
            @include('pages.gallery-page')
            @include('pages.testimonial-page')
            @include('pages.blog-page')
            @include('pages.reports-page')
        </div>

    </main>
</div>

@include('partials.modals')

@endsection
