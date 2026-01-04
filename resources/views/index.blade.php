<!DOCTYPE html>
<html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="referrer" content="no-referrer">

  <!-- PRIMARY SEO -->
  <title>Shee Bakes It</title>
  <meta name="description" content="Shee Bakes It offers the best homemade cookies and cakes in Brooklyn, New York. Freshly baked cookies, cakes, and sweet treats made from scratch with love. Order today!">

  <!-- CANONICAL -->
  <link rel="canonical" href="{{ rtrim(config('app.url'), '/') . request()->getPathInfo() }}">

  <!-- LOCAL BUSINESS SCHEMA -->
  <script type="application/ld+json">
  {!! json_encode([
    '@context' => 'https://schema.org',
    '@type' => 'Bakery',
    'name' => 'Shee Bakes It',
    'url' => url('/'),
    'logo' => asset('storage/footers/logo1.png'),
    'address' => [
      '@type' => 'PostalAddress',
      'streetAddress' => '194 Buffalo Ave.',
      'addressLocality' => 'Brooklyn',
      'addressRegion' => 'NY',
      'postalCode' => '11213',
      'addressCountry' => 'US'
    ],
    'areaServed' => 'Brooklyn New York',
    'sameAs' => [
      'https://www.facebook.com/sheebakesit',
      'https://www.instagram.com/sheebakesit'
    ]
  ], JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE) !!}
  </script>

  <!-- OPEN GRAPH (Facebook / Instagram) -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Shee Bakes It | Best Cookies and cakes in Brooklyn New York ">
  <meta property="og:description" content="Looking for the best cookies and cakes in Brooklyn, NY? Shee Bakes It bakes fresh homemade cookies, cakes and sweet treats made from scratch with love. Order today!">
  <meta property="og:image" content="{{ asset('storage/footers/logo1.png') }}">
  <meta property="og:url" content="{{ url('/') }}">

  <!-- TWITTER CARD -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Best Cookies and cakes in Brooklyn New York | Shee Bakes It">
  <meta name="twitter:description" content="Homemade cookies and cakes in Brooklyn, NY. Discover why locals love Shee Bakes It.">
  <meta name="twitter:image" content="{{ asset('storage/footers/logo1.png') }}">

  <!-- FAVICON -->
  <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">

  <!-- STYLES -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Satisfy&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  
  <!-- Swiper CSS (Added for Gallery) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
  
  @vite(['resources/css/style.css', 'resources/css/gallerysection.css', 'resources/js/script.js', 'resources/js/gallerysection.js'])
</head>

  <body>
    <h1 class="visually-hidden">Shee Bakes It – Best Cookies in Brooklyn New York</h1>
    <div id="loader-overlay">
       <img src="" id="loader-logo-img" class="loader-logo d-none" alt="Loading...">
       <div id="loader-spinner" class="spinner-border text-danger" style="width: 3rem; height: 3rem;" role="status"></div>
       <div class="loader-text">Shee Bakes It...</div>
    </div>

    <nav class="navbar navbar-expand-lg sticky-top">
      <div class="container d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
            <a class="navbar-brand" href="#" onclick="scrollToSection('home')">
              <img src="" id="nav-logo" class="nav-logo-img d-none" alt="Logo">
              <img src="" id="nav-brand-img" class="nav-brand-text-img d-none" alt="Shee Bakes It">
              <span id="nav-brand-text" class="ms-1 navbar-brand2">Shee Bakes It</span>
            </a>
        </div>
        <div class="d-flex align-items-center order-lg-last ms-2">
            <button class="btn text-danger rounded-pill px-3 fw-bold shadow-sm" style="background-color:#e9ddce;" onclick="openCart()">
                <i class="fa-solid fa-cart-arrow-down"></i> <span id="cartCount" class="badge bg-danger rounded-circle">0</span>
            </button>
        </div>
        <div class="collapse navbar-collapse d-none d-lg-block" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item"><a class="nav-link" href="#" onclick="scrollToSection('home')">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#" onclick="scrollToSection('best-seller-section')">Cookies</a></li>
            <li class="nav-item"><a class="nav-link" href="#" onclick="scrollToSection('cakes')">Cakes</a></li>
            <!-- Added Gallery Link -->
            <li class="nav-item"><a class="nav-link" href="#" onclick="scrollToSection('gallery-section')">Gallery</a></li>
            <li class="nav-item"><a class="nav-link" href="#" onclick="scrollToSection('about')">About</a></li>
          </ul>
        </div>
      </div>
    </nav>
  <div class="carousel-wrapper">
      <div id="home" class="container">
        <div class="carousel-container">
            <!-- Fixed Bootstrap Carousel: Added data-bs-ride and data-bs-interval for immediate animation -->
            <div id="desktopCarousel" class="carousel slide d-none d-md-block" data-bs-ride="carousel" data-bs-interval="3000">
              <div class="carousel-inner" id="desktop-carousel-items"></div>
            </div>
            
            <div id="mobileCarousel" class="carousel slide d-block d-md-none" data-bs-ride="carousel" data-bs-interval="3000">
              <div class="carousel-inner" id="mobile-carousel-items"></div>
            </div>
        </div>
      </div>
  </div>
    <div class="marquee-section">
      <div class="marquee-track-right" id="marquee-track-top"></div>
    </div>

    <section id="best-seller-section" class="container mt-5">
      <div class="text-center"><h2 class="section-title">Best Seller</h2></div>
      <div class="row g-2 justify-content-center" id="best-seller-container"></div>
    </section>

    <section id="featured-section" class="container mt-5">
      <div class="text-center"><h2 class="section-title">Featured</h2></div>
      <div class="row g-2 justify-content-center" id="featured-container"></div>
    </section>

     <section id="classic-section" class="container mt-5">
      <div class="text-center"><h2 class="section-title">Classic</h2></div>
      <div class="row g-2 justify-content-center" id="classic-container"></div>
    </section>

    <section id="cakes" class="container mt-5">
      <div class="text-center"><h2 class="section-title">Delicious Cakes</h2></div>
      <div class="row g-2 justify-content-center" id="cake-container"></div>
    </section>
    
    <div class="marquee-section">
      <div class="marquee-track" id="marquee-track-bottom"></div>
    </div>

    <!-- ADDED: ELEGANT GALLERY SECTION -->
    <section id="gallery-section" class="py-5">
        <div class="container-fluid p-0">
            <div class="text-center mb-5">
                <h2 class="section-title">Our Sweet Gallery</h2>
                <p class="text-muted">Explore our favorite bakes and moments</p>
            </div>
            
            <div class="swiper gallery-swiper">
                <div class="swiper-wrapper" id="gallery-wrapper">
                    <!-- Fetched dynamically via gallerysection.js -->
                    <div class="text-center w-100 py-5">
                        <div class="spinner-border text-danger" role="status"></div>
                    </div>
                </div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-pagination"></div>
            </div>
        </div>
    </section>
    
    <section id="about" class="container my-5 pt-3">
      <div class="text-center"><h3 class="section-title">About Us</h3></div>
      <div class="about-row">
        <div class="about-text-col">
          <h4 class="text-danger" style="font-family: 'Satisfy', cursive;">Simply</h4>
          <p>Shee, a full-time nurse and devoted mom, turned to flour, sugar, and butter to navigate life’s hardest chapters. What started in a quiet kitchen became a way to translate loneliness into comfort</p>
        </div>
        <div class="about-img-col"><img id="about-img-1" src="" alt="Simply"></div>
      </div>
      <div class="about-row">
        <div class="about-img-col"><img id="about-img-2" src="" alt="Delicious"></div>
        <div class="about-text-col">
          <h4 class="text-danger" style="font-family: 'Satisfy', cursive;">Delicious</h4>
          <p>Every treat is crafted from scratch, blending the discipline of a nurse with the heart of a mother. It is a craft shaped by love and heritage to create pure joy, one bake at a time.</p>
        </div>
      </div>
      <div class="about-row">
        <div class="about-text-col">
          <h4 class="text-danger" style="font-family: 'Satisfy', cursive;">Home Bakes</h4>
          <p>More than just a business, this is a story of resilience. Shee Bakes It is a home bakery offering the taste of hope, healing, and homemade goodness that grows from difficult seasons.</p>
        </div>
        <div class="about-img-col"><img id="about-img-3" src="" alt="Home Bakes"></div>
      </div>
    </section>

    <footer class="footer">
      <div class="container text-center text-md-start">
        <div class="row">
          <div class="col-md-3 text-center mb-2 mb-md-4 d-flex align-items-center justify-content-center">
             <img src="" id="footer-logo" class="footer-logo d-none" alt="Logo">
             <span id="footer-logo-placeholder" class="text-footer-muted fst-italic">Logo Loading...</span>
          </div>
          <div class="col-md-6 mb-2 mb-md-4 mt-3 mt-md-5">
              <div class="row">
                  <div class="col-6 text-center text-md-start">
                     <h5>Contact Us</h5>
                     <p class="mb-1"><i class="fas fa-phone-alt me-2"></i> 718 374 1706</p>
                     <div class="d-flex align-items-center justify-content-center justify-content-md-start mb-3">
                         <i class="fas fa-envelope me-2"></i> <span>sales@sheebakesit.com</span>
                     </div>
                  </div>
                  <div class="col-6 text-center text-md-start">
                     <h5>Location</h5>
                     <p class="mb-1"><i class="fas fa-map-marker-alt me-2"></i> 194 Buffalo Ave.,</p>
                     <p class="mb-3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Brooklyn, 11213</p>
                  </div>
              </div>
          </div>
          <div class="col-md-3 text-center mt-2 mt-md-4">
            <h5>Social Media</h5>
            <div class="d-flex justify-content-center">
               <img src="" id="footer-qr1" class="qr-code d-none" alt="QR 1">
               <img src="" id="footer-qr2" class="qr-code d-none" alt="QR 2">
            </div>
          </div>
        </div>
        <div class="text-center mt-4 pt-3 border-top border-danger-subtle">
          <p class="mb-0 small">&copy; 2025 Shee Bakes It. Simply | Delicious | Home | Bakes.</p>
        </div>
      </div>
    </footer>

    <!-- CART MODAL -->
    <div class="modal fade" id="cartModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Your Sweet Cart</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr><th>Item</th><th>Name</th><th class="col-price">Price</th><th style="min-width: 80px;">Quantity</th><th>Total</th><th>Cancel</th></tr>
                </thead>
                <tbody id="cartTableBody"></tbody>
              </table>
            </div>
            <div class="text-end mt-3"><h4 style="color: var(--dark-pink)">Total: $<span id="grandTotal">0.00</span></h4></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary rounded-pill" data-bs-dismiss="modal">Add More</button>
            <button type="button" class="btn btn-custom btn-custom-lg px-5 rounded-pill" onclick="openCheckout()">Checkout</button>
          </div>
        </div>
      </div>
    </div>

    <!-- CHECKOUT MODAL -->
    <div class="modal fade" id="checkoutModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Checkout</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="checkoutForm">
              <div class="mb-3"><label class="form-label">Name</label><input type="text" class="form-control" name="name" required></div>
              <div class="mb-3"><label class="form-label">Address</label><input type="text" class="form-control" name="address" required></div>
              <div class="mb-3"><label class="form-label">Contact</label><input type="text" class="form-control" name="contact" required></div>
              <div class="mb-3"><label class="form-label">Email</label><input type="email" class="form-control" name="email" required></div>
              
              <div class="bg-light p-3 rounded mb-3 text-center border border-danger-subtle">
                 <h5 class="m-0" style="color: var(--dark-pink);">Total: <span class="fw-bold fs-4">$<span id="checkoutTotalAmount">0.00</span></span></h5>
              </div>
              <div class="mb-3">
                <label class="form-label">Mode of Payment</label><br>
                <small class="text-secondary">
                  <div><strong>Zelle</strong></div>
                  <div>Account Name: Sheedy Fave Boiser</div>
                  <div>Account Number: 347-319-7316</div>
                  <div class="mt-2"><strong>PayPal</strong></div>
                  <div>sheedyboiser18@yahoo.com</div>
                </small>
                <select class="form-select mt-1" name="payment_mode" required>
                  <option value="Zelle">Zelle</option>
                  <option value="Paypal">Paypal</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Proof of Payment</label>
                <input type="file" class="form-control" id="proofFile" name="proofFile" accept="image/*" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Delivery Method</label>
                <select class="form-select" name="delivery_mode">
                  <option value="Pick up">Pick up (Maimo)</option>
                  <option value="Deliver">Deliver (Brooklyn/Queens - for Scheduling)</option>
                </select>
              </div>
              <div class="mb-3">
                  <label class="form-label">Notes</label>
                  <input type="text" class="form-control" name="comments">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-custom btn-custom-lg w-100 rounded-pill" onclick="submitOrder()">Place Order</button>
          </div>
        </div>
      </div>
    </div>

    <!-- LOADING MODAL -->
    <div class="modal fade" id="loadingModal" data-bs-backdrop="static" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content text-center py-4">
          <div class="modal-body">
            <div class="spinner-border text-danger mb-3" role="status"></div>
            <h5 class="text-secondary">Processing... <br> Please wait...</h5>
          </div>
        </div>
      </div>
    </div>
    
   <!-- SUCCESS MODAL -->
   <div class="modal fade" id="successModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center border-0"> 
          <div class="modal-body p-5">
            <div style="font-size: 4rem; color: #28a745;" class="mb-3">✓</div>
    
            <h2 class="mb-3">Thank You for Your Order!</h2>
            <p class="text-muted mb-4">
              A confirmation email will be sent shortly.
            </p>
    
            <div class="alert alert-light border">
              Reference No: <br> <span id="successReference" class="text-danger fw-bold"></span>
            </div>
    
            <button type="button" class="btn btn-custom rounded-pill px-5 mt-3" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- GENERIC MESSAGE MODAL -->
    <div class="modal fade" id="messageModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title text-danger" id="messageModalTitle">Message</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center py-4">
            <p id="messageModalBody" class="fs-5 text-secondary"></p>
            <button type="button" class="btn btn-secondary rounded-pill px-4 mt-3" data-bs-dismiss="modal">Okay</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ADDED: GALLERY VIEW MODAL -->
    <div class="modal fade" id="galleryModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content border-0 bg-transparent">
          <div class="gallery-modal-body">
             <button type="button" class="gallery-close-btn" data-bs-dismiss="modal">
                 <i class="fa-solid fa-xmark"></i>
             </button>
             <div class="gallery-modal-left">
                 <img src="" id="modal-img" alt="Gallery Image">
             </div>
             <div class="gallery-modal-right">
                 <h2 id="modal-title" class="gallery-modal-title"></h2>
                 <p id="modal-desc" class="gallery-modal-desc"></p>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Swiper JS (Added for Gallery) -->
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

    <script>
      document.addEventListener("DOMContentLoaded", function() {
          fetch('/api/log-visitor', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') 
              }
          }).catch(err => console.log('Visitor logging skipped: ' + err));
          
          // Force Hero Carousels to start immediately on page load
          const deskCarousel = new bootstrap.Carousel('#desktopCarousel', { interval: 3000, ride: 'carousel' });
          const mobCarousel = new bootstrap.Carousel('#mobileCarousel', { interval: 3000, ride: 'carousel' });
      });
      
      // Simple helper for nav links
      function scrollToSection(id) {
          const element = document.getElementById(id);
          if (element) {
              const offset = 80;
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - offset;
              window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          }
      }
    </script>

  </body>
</html>