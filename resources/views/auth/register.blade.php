<x-guest-layout>

@push('styles')
<link rel="stylesheet" href="{{ asset('css/login.css') }}">
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

        <div class="text-center mb-4">
            <img src="{{ asset('storage/footers/logo1.png') }}" class="login-page-logo" alt="Logo">
            <h1 class="satisfy-font display-4" style="color: var(--dark-pink);">Shee' BakesIt</h1>
            <p class="text-muted small">Admin Account Registration</p>
        </div>

        <form method="POST" action="{{ route('register') }}">
            @csrf

            <div class="mb-3">
                <label class="form-label small fw-bold">Full Name</label>
                <input type="text" name="name" class="form-control rounded-pill" required>
            </div>

            <div class="mb-3">
                <label class="form-label small fw-bold">Username</label>
                <input type="text" name="username" class="form-control rounded-pill" required>
            </div>

            <div class="mb-3">
                <label class="form-label small fw-bold">Email Address</label>
                <input type="email" name="email" class="form-control rounded-pill" required>
            </div>

            <div class="mb-3">
                <label class="form-label small fw-bold">Password</label>
                <input type="password" name="password" class="form-control rounded-pill" required>
            </div>

            <div class="mb-3">
                <label class="form-label small fw-bold">Confirm Password</label>
                <input type="password" name="password_confirmation" class="form-control rounded-pill" required>
            </div>

            <button type="submit" class="btn btn-primary-custom w-100 rounded-pill py-2">
                Register
            </button>

            <p class="text-center mt-3 small">
                Already registered?
                <a href="{{ route('login') }}" class="fw-bold text-decoration-none">Login here</a>
            </p>

        </form>

    </div>
</div>

@push('scripts')
<script>
window.addEventListener('load', function() {
    setTimeout(() => {
        document.getElementById("page-loader").classList.add("fade-out");
    }, 500);
});
</script>
@endpush

</x-guest-layout>
