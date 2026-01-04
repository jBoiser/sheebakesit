<x-guest-layout>

@push('styles')
@vite(['resources/css/login.css'])
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
<link href="https://fonts.googleapis.com/css2?family=Satisfy&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
@endpush

<!-- Loader -->
<div id="page-loader">
    <div class="text-center">
        <img src="{{ asset('storage/footers/logo1.png') }}" class="loader-logo pulse-anim" alt="SB">
        <h2 class="satisfy-font mt-3" style="color: var(--dark-pink);">Shee BakesIt</h2>
        <div class="spinner-border text-danger mt-2" role="status"></div>
    </div>
</div>

<div class="login-wrapper">
    <div class="login-container shadow-lg">

        <!-- Logo + Header -->
        <div class="text-center mb-4">
            <img src="{{ asset('storage/footers/logo1.png') }}" class="login-page-logo" alt="Logo">
            <h1 class="satisfy-font display-5" style="color: var(--dark-pink); margin-top: 10px;">
                Shee' BakesIt
            </h1>
            <p class="text-muted small">Admin Panel Access</p>
        </div>

        <!-- Login Form -->
        <form method="POST" action="{{ route('login') }}">
            @csrf

            <!-- Username or Email -->
            <div class="mb-3">
                <label class="form-label small fw-bold">Username or Email</label>
                <input type="text"
                       name="login"
                       class="form-control rounded-pill @error('login') is-invalid @enderror"
                       value="{{ old('login') }}"
                       required>
                @error('login')
                    <div class="text-danger small">{{ $message }}</div>
                @enderror
            </div>

            <!-- Password -->
            <div class="mb-4">
                <label class="form-label small fw-bold">Password</label>
                <input type="password"
                       name="password"
                       class="form-control rounded-pill @error('password') is-invalid @enderror"
                       required>
                @error('password')
                    <div class="text-danger small">{{ $message }}</div>
                @enderror
            </div>

            <!-- Button -->
            <button type="submit" class="btn btn-primary-custom w-100 rounded-pill py-2 mt-1">
                Log In
            </button>

            <!-- <p class="text-center mt-3 small">
                Don’t have an account?
                <a href="{{ route('register') }}" class="fw-bold text-decoration-none">Register here</a>
            </p> -->

        </form>

        <!-- Error Message -->
        @if ($errors->any())
            <div class="alert alert-danger mt-3 small">
                {{ $errors->first() }}
            </div>
        @endif

    </div>
</div>

@push('scripts')
<script>
window.addEventListener('load', function () {
    setTimeout(() => {
        let loader = document.getElementById("page-loader");
        loader.classList.add("fade-out");

        // ensures it fully disappears
        setTimeout(() => {
            loader.style.display = "none";
        }, 400);
    }, 400);
});
</script>
@endpush

</x-guest-layout>
