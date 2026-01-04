(function () {
    const api = {
        list: "/api/gallery",
        store: "/api/gallery/store",
        update: "/api/gallery/update",
        delete: "/api/gallery/delete",
    };

    const getCsrf = () => document.querySelector('meta[name="csrf-token"]')?.content || "";

    let allGalleryItems = [];

    const galleryManager = {
        init: function () {
            this.setupEventListeners();
        },

        setupEventListeners: function() {
            const imgInput = document.getElementById('galleryImageInput');
            if (imgInput) {
                imgInput.addEventListener('change', (e) => this.handleImagePreview(e));
            }
        },

        handleImagePreview: function (e) {
            const file = e.target.files[0];
            const preview = document.getElementById('galleryImagePreview');
            const placeholder = document.getElementById('galleryImagePlaceholder');

            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    preview.src = event.target.result;
                    preview.classList.remove('d-none');
                    if (placeholder) placeholder.classList.add('d-none');
                };
                reader.readAsDataURL(file);
            }
        },

        fetchItems: async function () {
            const loader = document.getElementById('loader-overlay');
            if (loader) loader.classList.remove('d-none');

            try {
                const response = await fetch(api.list);
                const result = await response.json();

                if (result.status === "success") {
                    allGalleryItems = result.data;
                    this.renderTable();
                    this.updateStats();
                }
            } catch (error) {
                console.error("Gallery fetch error:", error);
            } finally {
                if (loader) loader.classList.add('d-none');
            }
        },

        renderTable: function () {
            const container = document.getElementById('gallery-table-body');
            if (!container) return;

            if (allGalleryItems.length === 0) {
                container.innerHTML = `<tr><td colspan="6" class="text-center py-4">No gallery items found.</td></tr>`;
                return;
            }

            container.innerHTML = allGalleryItems.map(item => `
                <tr class="align-middle">
                    <td class="fw-bold text-muted ps-4">#${item.id}</td>
                    <td>
                        <img src="${item.image_url}" class="rounded shadow-sm" style="width: 50px; height: 50px; object-fit: cover; cursor: pointer;" 
                            onclick="galleryManager.viewPhoto('${item.image_url}', '${item.title}')">
                    </td>
                    <td><div class="fw-bold">${item.title}</div></td>
                    <td><div class="text-truncate text-muted small" style="max-width: 150px;">${item.description || '---'}</div></td>
                    <td><div class="text-muted small">${item.created_at}</div></td>
                    <td>
                        <span class="badge rounded-pill ${item.status === 'active' ? 'bg-success' : 'bg-secondary'}">
                            ${item.status}
                        </span>
                    </td>
                    <td class="pe-4">
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary rounded-pill me-2" onclick="galleryManager.openEditModal(${item.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="galleryManager.deleteItem(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        },

        updateStats: function () {
            const total = allGalleryItems.length;
            const active = allGalleryItems.filter(i => i.status === 'active').length;
            const inactive = total - active;
            
            document.getElementById('gallery-stat-total').innerText = total;
            document.getElementById('gallery-stat-active').innerText = active;
            document.getElementById('gallery-stat-inactive').innerText = inactive;
        },

        viewPhoto: function(url, title) {
            document.getElementById('viewPhotoTitle').innerText = title;
            document.getElementById('viewPhotoContent').src = url;
            new bootstrap.Modal(document.getElementById('viewPhotoModal')).show();
        },

        openAddModal: function () {
            const form = document.getElementById('galleryForm');
            form.reset();
            document.getElementById('galleryItemId').value = '';
            document.getElementById('galleryModalTitle').innerText = 'Add New Image';
            document.getElementById('galleryImagePreview').classList.add('d-none');
            document.getElementById('galleryImagePlaceholder').classList.remove('d-none');
            new bootstrap.Modal(document.getElementById('galleryModal')).show();
        },

        openEditModal: function (id) {
            const item = allGalleryItems.find(i => i.id == id);
            if (!item) return;

            document.getElementById('galleryItemId').value = item.id;
            document.getElementById('galleryTitle').value = item.title;
            document.getElementById('galleryDescription').value = item.description || '';
            document.getElementById('galleryStatus').value = item.status;
            document.getElementById('galleryModalTitle').innerText = 'Edit Image';

            const preview = document.getElementById('galleryImagePreview');
            const placeholder = document.getElementById('galleryImagePlaceholder');
            preview.src = item.image_url;
            preview.classList.remove('d-none');
            placeholder.classList.add('d-none');

            new bootstrap.Modal(document.getElementById('galleryModal')).show();
        },

        saveItem: async function () {
            const form = document.getElementById('galleryForm');
            const formData = new FormData(form);
            const id = document.getElementById('galleryItemId').value;
            const url = id ? api.update : api.store;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'X-CSRF-TOKEN': getCsrf() },
                    body: formData
                });
                const result = await response.json();

                if (result.status === 'success') {
                    bootstrap.Modal.getInstance(document.getElementById('galleryModal')).hide();
                    this.fetchItems();
                }
            } catch (error) {
                console.error("Save error:", error);
            }
        },

        deleteItem: async function (id) {
            if (!confirm("Are you sure you want to delete this gallery item?")) return;

            try {
                const response = await fetch(api.delete, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': getCsrf() 
                    },
                    body: JSON.stringify({ id: id })
                });
                const result = await response.json();
                if (result.status === 'success') this.fetchItems();
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    window.galleryManager = galleryManager;

    document.addEventListener("DOMContentLoaded", () => {
        galleryManager.init();
        const page = document.getElementById('page-gallery');
        if (page) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.target.id === 'page-gallery' && !mutation.target.classList.contains('d-none')) {
                        galleryManager.fetchItems();
                    }
                });
            });
            observer.observe(page, { attributes: true, attributeFilter: ['class'] });
        }
    });
})();