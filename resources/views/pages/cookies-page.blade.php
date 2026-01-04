{{-- resources/views/pages/cookies-page.blade.php --}}

<div id="page-cookies" class="spa-view d-none">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="fw-bold text-pink mb-0"><i class="fas fa-cookie-bite me-2"></i>Cookies Management</h3>
            <p class="text-muted small mb-0">Manage your delicious inventory</p>
        </div>
        <button class="btn btn-pink rounded-pill shadow-sm px-4" onclick="window.cookieManager.openAddModal()">
            <i class="fas fa-plus me-2"></i>New Cookie
        </button>
    </div>

    {{-- Stats Row --}}
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-3 border-total-cookies stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-muted small text-uppercase fw-bold">Total Cookies</span>
                        <h4 class="fw-bold mb-0" id="cookie-stat-total">0</h4>
                    </div>
                    <div class="bg-light rounded-circle p-3 text-pink">
                        <i class="fas fa-cookie fa-lg"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-3 border-active-cookies stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-muted small text-uppercase fw-bold">Active</span>
                        <h4 class="fw-bold mb-0 text-success" id="cookie-stat-active">0</h4>
                    </div>
                    <div class="bg-light rounded-circle p-3 text-success">
                        <i class="fas fa-check-circle fa-lg"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-3 border-inactive-cookies stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-muted small text-uppercase fw-bold">Inactive</span>
                        <h4 class="fw-bold mb-0 text-secondary" id="cookie-stat-inactive">0</h4>
                    </div>
                    <div class="bg-light rounded-circle p-3 text-secondary">
                        <i class="fas fa-pause-circle fa-lg"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Table Card --}}
    <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4">ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="cookiesTableBody">
                        {{-- Data injected via cookies.js --}}
                        <tr><td colspan="7" class="text-center py-5 text-muted">Loading cookies...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</div>

{{-- ADD/EDIT MODAL --}}
<div class="modal fade" id="cookieModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header border-bottom-0">
                <h5 class="modal-title fw-bold text-pink" id="cookieModalTitle">Add New Cookie</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="cookieForm" enctype="multipart/form-data">
                    <input type="hidden" id="cookieId" name="id">

                    {{-- Image Preview Section --}}
                    <div class="text-center mb-4">
                        <div class="image-upload-wrapper">
                            <img id="cookiePreview" src="{{ asset('storage/footers/logo1.png') }}" class="cookie-preview-img shadow-sm">
                            <div class="upload-btn-wrapper mt-2">
                                <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill" onclick="document.getElementById('cookieImageInput').click()">
                                    <i class="fas fa-camera me-1"></i> Choose Image
                                </button>
                                <input type="file" id="cookieImageInput" name="image" class="d-none" accept="image/*">
                            </div>
                            <small class="text-muted d-block mt-1" id="imageHelpText">Upload will be saved as 1stname.jpg</small>
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label small text-muted text-uppercase fw-bold">Cookie Name</label>
                            <input type="text" class="form-control" id="cookieName" name="name" placeholder="e.g. Brownie Cookie" required>
                        </div>

                        <div class="col-6">
                            <label class="form-label small text-muted text-uppercase fw-bold">Category</label>
                            <select class="form-select" id="cookieCategory" name="category" required>
                                <option value="Best Seller">Best Seller</option>
                                <option value="Featured">Featured</option>
                                <option value="Classic">Classic</option>
                            </select>
                        </div>

                        <div class="col-6">
                            <label class="form-label small text-muted text-uppercase fw-bold">Price ($)</label>
                            <input type="number" step="0.01" class="form-control" id="cookiePrice" name="price" placeholder="0.00" required>
                        </div>

                        <div class="col-12">
                            <label class="form-label small text-muted text-uppercase fw-bold">Status</label>
                            <select class="form-select" id="cookieStatus" name="status">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-top-0 pt-0">
                <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-pink rounded-pill px-4" onclick="window.cookieManager.saveCookie()">
                    <i class="fas fa-save me-1"></i> Save Cookie
                </button>
            </div>
        </div>
    </div>
</div>