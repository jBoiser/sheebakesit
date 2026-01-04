{{-- resources/views/pages/gallery-page.blade.php --}}

<div id="page-gallery" class="spa-view d-none">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="fw-bold mb-0"  style="color: #e91e63;" ><i class="fas fa-images me-2"></i>Gallery Management</h3>
            <p class="text-muted small mb-0">Manage your visual portfolio</p>
        </div>
        <button class="btn rounded-pill shadow-sm px-4" style="background: #e91e63; color:white;" onclick="window.galleryManager.openAddModal()">
            <i class="fas fa-plus me-2"></i>Add Image
        </button>
    </div>

    {{-- Stats Row --}}
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-3 border-gallery-total stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-muted small text-uppercase fw-bold">Total Items</span>
                        <h4 class="fw-bold mb-0" id="gallery-stat-total">0</h4>
                    </div>
                    <div class="bg-light rounded-circle p-3 text-pink">
                        <i class="fas fa-layer-group fa-lg"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-3 border-gallery-active stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-muted small text-uppercase fw-bold">Active Public</span>
                        <h4 class="fw-bold mb-0" id="gallery-stat-active">0</h4>
                    </div>
                    <div class="bg-light rounded-circle p-3 text-success">
                        <i class="fas fa-eye fa-lg"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm p-3 border-gallery-inactive stat-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-muted small text-uppercase fw-bold">Inactive Items</span>
                        <h4 class="fw-bold mb-0" id="gallery-stat-inactive">0</h4>
                    </div>
                    <div class="bg-light rounded-circle p-3 text-secondary">
                        <i class="fas fa-eye-slash fa-lg"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Gallery Table --}}
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="table-responsive">
            <table class="table gallery-table mb-0">
                <thead class="bg-light text-muted small text-uppercase fw-bold">
                    <tr>
                        <th class="ps-4">ID</th>
                        <th>Photo</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Date Added</th>
                        <th>Status</th>
                        <th class="pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody id="gallery-table-body">
                    <!-- JS Content -->
                </tbody>
            </table>
        </div>
    </div>
</div>

{{-- Gallery Modal (Form) --}}
<div class="modal fade" id="galleryModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-header border-0 pb-0">
                <h5 class="fw-bold mb-0" id="galleryModalTitle">Add New Image</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="galleryForm" enctype="multipart/form-data">
                    <input type="hidden" id="galleryItemId" name="id">
                    <div class="mb-3 text-center">
                        <div class="gallery-upload-box" onclick="document.getElementById('galleryImageInput').click()">
                            <img id="galleryImagePreview" src="" class="img-fluid d-none">
                            <div id="galleryImagePlaceholder">
                                <i class="fas fa-cloud-upload-alt fa-3x text-muted mb-2"></i>
                                <p class="mb-0 text-muted small">Click to upload image</p>
                            </div>
                        </div>
                        <input type="file" id="galleryImageInput" name="image" class="d-none" accept="image/*">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small text-muted text-uppercase fw-bold">Title</label>
                        <input type="text" class="form-control" id="galleryTitle" name="title" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small text-muted text-uppercase fw-bold">Description</label>
                        <textarea class="form-control" id="galleryDescription" name="description" rows="2"></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small text-muted text-uppercase fw-bold">Status</label>
                        <select class="form-select" id="galleryStatus" name="status">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary rounded-pill px-4" onclick="window.galleryManager.saveItem()">
                    <i class="fas fa-save me-1"></i> Save Changes
                </button>
            </div>
        </div>
    </div>
</div>

{{-- View Photo Modal --}}
<div class="modal fade" id="viewPhotoModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 bg-transparent">
            <div class="modal-header border-0 pb-0 justify-content-end">
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
                <img id="viewPhotoContent" src="" class="rounded shadow-lg">
                <h5 class="text-white mt-3 fw-bold" id="viewPhotoTitle"></h5>
            </div>
        </div>
    </div>
</div>