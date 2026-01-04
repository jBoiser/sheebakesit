{{-- resources/views/pages/cakes-page.blade.php --}}

<div id="page-cakes" class="spa-view d-none">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="fw-bold text-pink mb-0"><i class="fas fa-birthday-cake me-2"></i>Cakes Management</h3>
            <p class="text-muted small mb-0">Manage your sweet inventory</p>
        </div>
        <button class="btn btn-pink rounded-pill shadow-sm px-4" onclick="window.cakeManager.openAddModal()">
            <i class="fas fa-plus me-2"></i>New Cake
        </button>
    </div>

    {{-- Stats Row --}}
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-3 border-total-cakes stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-muted small text-uppercase fw-bold">Total Cakes</span>
                        <h4 class="fw-bold mb-0" id="cake-stat-total">0</h4>
                    </div>
                    <div class="bg-light rounded-circle p-3 text-pink">
                        <i class="fas fa-birthday-cake fa-lg"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-3 border-active-cakes stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-muted small text-uppercase fw-bold">Active</span>
                        <h4 class="fw-bold mb-0 text-success" id="cake-stat-active">0</h4>
                    </div>
                    <div class="bg-light rounded-circle p-3 text-success">
                        <i class="fas fa-check-circle fa-lg"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-3 border-inactive-cakes stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-muted small text-uppercase fw-bold">Inactive</span>
                        <h4 class="fw-bold mb-0 text-secondary" id="cake-stat-inactive">0</h4>
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
                            <th>Size</th> {{-- Changed from Category --}}
                            <th>Price</th>
                            <th>Status</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="cakesTableBody">
                        {{-- Data injected via cakes.js --}}
                        <tr><td colspan="7" class="text-center py-5 text-muted">Loading cakes...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</div>

{{-- ADD/EDIT MODAL --}}
<div class="modal fade" id="cakeModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header border-bottom-0">
                <h5 class="modal-title fw-bold text-pink" id="cakeModalTitle">Add New Cake</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="cakeForm" enctype="multipart/form-data">
                    <input type="hidden" id="cakeId" name="id">

                    {{-- Image Preview Section --}}
                    <div class="text-center mb-4">
                        <div class="image-upload-wrapper">
                            <img id="cakePreview" src="{{ asset('storage/footers/logo1.png') }}" class="cake-preview-img shadow-sm">
                            <div class="upload-btn-wrapper mt-2">
                                <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill" onclick="document.getElementById('cakeImageInput').click()">
                                    <i class="fas fa-camera me-1"></i> Choose Image
                                </button>
                                <input type="file" id="cakeImageInput" name="image" class="d-none" accept="image/*">
                            </div>
                            <small class="text-muted d-block mt-1" id="imageHelpText">Upload will be saved as ca1.jpg</small>
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label small text-muted text-uppercase fw-bold">Cake Name</label>
                            <input type="text" class="form-control" id="cakeName" name="name" placeholder="e.g. Chocolate Cake" required>
                        </div>

                        {{-- Changed from Category Select to Size Input --}}
                        <div class="col-6">
                            <label class="form-label small text-muted text-uppercase fw-bold">Size</label>
                            <input type="text" class="form-control" id="cakeSize" name="size" placeholder="e.g. 8&quot;" required>
                        </div>

                        <div class="col-6">
                            <label class="form-label small text-muted text-uppercase fw-bold">Price ($)</label>
                            <input type="number" step="0.01" class="form-control" id="cakePrice" name="price" placeholder="0.00" required>
                        </div>

                        <div class="col-12">
                            <label class="form-label small text-muted text-uppercase fw-bold">Status</label>
                            <select class="form-select" id="cakeStatus" name="status">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-top-0 pt-0">
                <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-pink rounded-pill px-4" onclick="window.cakeManager.saveCake()">
                    <i class="fas fa-save me-1"></i> Save Cake
                </button>
            </div>
        </div>
    </div>
</div>