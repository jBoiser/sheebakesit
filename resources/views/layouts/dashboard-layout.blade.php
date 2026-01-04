<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Shee' BakesIt - Dashboard</title>

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Satisfy&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    
    <link rel="icon" type="image/png" href="{{ asset('/storage/footers/logo1.png') }}">

    @vite([
        'resources/css/dashboard.css',
        'resources/css/orders.css', 
        'resources/css/cookies.css', 
        'resources/css/cakes.css',
        'resources/css/gallery.css',
        'resources/js/dashboard.js',
        'resources/js/orders.js', 
        'resources/js/cookies.js', 
        'resources/js/cakes.js',
        'resources/js/gallery.js'
    ])
</head>
<body>

    @yield('content')

    <div class="modal fade" id="proofModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">Proof of Payment</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center p-0">
            <img src="" id="proofModalImg" class="img-fluid" alt="Proof Image" style="max-height: 80vh; width: 100%; object-fit: contain; background: #f8f9fa;">
          </div>
          <div class="modal-footer justify-content-center border-0">
             <a href="#" id="proofModalLink" target="_blank" class="btn btn-primary rounded-pill px-4">Open Full Image</a>
             <button type="button" class="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>