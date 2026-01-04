// public/js/cakes.js

(function () {
    const api = {
        list: "/api/cakes",
        store: "/api/cakes/store",
        update: "/api/cakes/update",
        delete: "/api/cakes/delete",
    };

    // Safely get CSRF token
    const getCsrf = () =>
        document.querySelector('meta[name="csrf-token"]')?.content || "";

    let allCakes = [];
    let confirmCallback = null;

    /* --------------------------------------------------
     * SECURITY HELPER: Prevent XSS
     * -------------------------------------------------- */
    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* --------------------------------------------------
     * ACTIONS
     * -------------------------------------------------- */
    const cakeManager = {

        init: function () {
            this.ensureModalsExist(); 

            const imgInput = document.getElementById('cakeImageInput');
            if (imgInput) {
                imgInput.removeEventListener('change', this.handleImagePreview);
                imgInput.addEventListener('change', this.handleImagePreview);
            }
            console.log("Cake Manager Initialized");
        },

        /* --------------------------------------------------
         * MODAL INFRASTRUCTURE (Unique to Cakes)
         * -------------------------------------------------- */
        ensureModalsExist: function() {
            if (document.getElementById('cakeAlertModal')) return;

            const modalsHtml = `
                <!-- Cake Alert Modal -->
                <div class="modal fade" id="cakeAlertModal" tabindex="-1" aria-hidden="true" style="z-index: 1060;">
                    <div class="modal-dialog modal-dialog-centered modal-sm">
                        <div class="modal-content border-0 shadow">
                            <div class="modal-header border-bottom-0 pb-0">
                                <h5 class="modal-title fw-bold text-pink" id="cakeAlertTitle">Notice</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center py-4" id="cakeAlertBody">
                                <!-- Message -->
                            </div>
                            <div class="modal-footer border-top-0 justify-content-center pt-0">
                                <button type="button" class="btn btn-dark btn-sm px-4 rounded-pill" data-bs-dismiss="modal">OK</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cake Confirm Modal -->
                <div class="modal fade" id="cakeConfirmModal" tabindex="-1" aria-hidden="true" style="z-index: 1060;">
                    <div class="modal-dialog modal-dialog-centered modal-sm">
                        <div class="modal-content border-0 shadow">
                             <div class="modal-header border-bottom-0 pb-0">
                                <h5 class="modal-title fw-bold text-pink" id="cakeConfirmTitle">Confirm</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center py-4" id="cakeConfirmBody">
                                <!-- Message -->
                            </div>
                            <div class="modal-footer border-top-0 justify-content-center pt-0">
                                <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-3" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-danger btn-sm rounded-pill px-3" id="cakeConfirmBtn">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalsHtml);

            document.getElementById('cakeConfirmBtn').addEventListener('click', () => {
                if (typeof confirmCallback === 'function') {
                    confirmCallback();
                }
                const el = document.getElementById('cakeConfirmModal');
                const modal = bootstrap.Modal.getInstance(el);
                modal.hide();
            });
        },

        /* --------------------------------------------------
         * DATA FETCHING
         * -------------------------------------------------- */
        fetchCakes: async function () {
            const tbody = document.getElementById("cakesTableBody");
            if (!tbody) return;

            this.toggleLoader(true);

            try {
                const res = await fetch(api.list, {
                    credentials: "same-origin"
                });

                if (res.redirected) {
                    window.location.href = res.url;
                    return;
                }

                if (!res.ok) throw new Error("Server Error");

                const json = await res.json();

                if (json.status === "success") {
                    allCakes = json.data;
                    this.renderTable(allCakes);
                    this.updateStats(allCakes);
                }

            } catch (e) {
                console.error("Fetch Error:", e);
            } finally {
                this.toggleLoader(false);
            }
        },

        renderTable: function (cakes) {
            const tbody = document.getElementById("cakesTableBody");
            tbody.innerHTML = "";

            if (cakes.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-5 text-muted">
                            No cakes found. Add some sweetness!
                        </td>
                    </tr>`;
                return;
            }

            cakes.forEach(c => {
                const statusBadge = c.status === 'active'
                    ? '<span class="badge bg-success rounded-pill px-2">Active</span>'
                    : '<span class="badge bg-secondary rounded-pill px-2">Inactive</span>';

                // XSS FIX: Escape size
                const sizeBadge =
                    `<span class="badge bg-light text-dark border">${escapeHtml(c.size)}</span>`;

                const tr = document.createElement("tr");
                // XSS FIX: Escape name and ID (just in case)
                tr.innerHTML = `
                    <td class="ps-4 fw-bold text-pink">${escapeHtml(c.id)}</td>
                    <td>
                        <img src="${c.image_url || '/assets/footers/logo1.png'}"
                             class="rounded-3 shadow-sm"
                             style="width:50px;height:50px;object-fit:cover;">
                    </td>
                    <td class="fw-semibold">${escapeHtml(c.name)}</td>
                    <td>${sizeBadge}</td> 
                    <td class="fw-bold">$${parseFloat(c.price).toFixed(2)}</td>
                    <td>${statusBadge}</td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-outline-secondary rounded-pill me-1"
                            onclick="window.cakeManager.openEditModal('${c.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger rounded-pill"
                            onclick="window.cakeManager.deleteCake('${c.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        },

        updateStats: function (cakes) {
            const setVal = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.innerText = val;
            };

            setVal('cake-stat-total', cakes.length);
            setVal('cake-stat-active',
                cakes.filter(c => c.status === 'active').length);
            setVal('cake-stat-inactive',
                cakes.filter(c => c.status === 'inactive').length);
        },

        /* --------------------------------------------------
         * MODALS (Add/Edit)
         * -------------------------------------------------- */
        openAddModal: function () {
            document.getElementById('cakeForm').reset();
            document.getElementById('cakeId').value = "";
            document.getElementById('cakeModalTitle').innerText = "Add New Cake";

            const preview = document.getElementById('cakePreview');
            if (preview) preview.src = "/assets/footers/logo1.png";

            new bootstrap.Modal(document.getElementById('cakeModal')).show();
        },

        openEditModal: function (id) {
            const cake = allCakes.find(c => c.id === id);
            if (!cake) return;

            document.getElementById('cakeId').value = cake.id;
            document.getElementById('cakeName').value = cake.name;
            document.getElementById('cakePrice').value = cake.price;
            document.getElementById('cakeSize').value = cake.size; 
            document.getElementById('cakeStatus').value = cake.status;
            document.getElementById('cakePreview').src = cake.image_url;

            document.getElementById('cakeModalTitle')
                .innerText = "Edit Cake (" + cake.id + ")";

            new bootstrap.Modal(document.getElementById('cakeModal')).show();
        },

        /* --------------------------------------------------
         * SAVE & DELETE
         * -------------------------------------------------- */
        saveCake: async function () {
            const form = document.getElementById('cakeForm');
            const formData = new FormData(form);
            const id = document.getElementById('cakeId').value;
            const url = id ? api.update : api.store;

            if (!id && document.getElementById('cakeImageInput').files.length === 0) {
                this.safeAlert("Missing Image", "Please upload a cake image.");
                return;
            }

            this.toggleLoader(true);

            try {
                const res = await fetch(url, {
                    method: "POST",
                    credentials: "same-origin",
                    headers: { "X-CSRF-TOKEN": getCsrf() },
                    body: formData
                });

                const json = await res.json();

                if (json.status === "success") {
                    this.safeAlert("Success", json.message);
                    bootstrap.Modal
                        .getInstance(document.getElementById('cakeModal'))
                        .hide();
                    this.fetchCakes();
                } else {
                    let msg = json.message || "An error occurred";
                    if (json.errors) {
                        msg = Object.values(json.errors).flat().join('\n');
                    }
                    this.safeAlert("Error", msg);
                }
            } catch (e) {
                console.error(e);
                this.safeAlert("Error", "Server connection error.");
            } finally {
                this.toggleLoader(false);
            }
        },

        deleteCake: function (id) {
            // Priority - Use Local Unique Modal (Fixes conflict)
            if (document.getElementById('cakeConfirmModal')) {
                document.getElementById('cakeConfirmTitle').innerText = "Delete Cake";
                document.getElementById('cakeConfirmBody').innerText = "Are you sure? This cannot be undone.";
                
                confirmCallback = () => this.proceedDelete(id);
                
                new bootstrap.Modal(document.getElementById('cakeConfirmModal')).show();
            } else {
                // Absolute fallback
                if (confirm("Delete this cake?")) this.proceedDelete(id);
            }
        },

        proceedDelete: async function (id) {
            this.toggleLoader(true);

            try {
                const formData = new FormData();
                formData.append('id', id);

                const res = await fetch(api.delete, {
                    method: "POST",
                    credentials: "same-origin",
                    headers: { "X-CSRF-TOKEN": getCsrf() },
                    body: formData
                });

                const json = await res.json();

                if (json.status === "success") {
                    this.safeAlert("Deleted", json.message);
                    this.fetchCakes();
                } else {
                    this.safeAlert("Error", json.message);
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.toggleLoader(false);
            }
        },

        /* --------------------------------------------------
         * HELPERS & UI
         * -------------------------------------------------- */
        handleImagePreview: function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (ev) {
                document.getElementById('cakePreview').src = ev.target.result;
            };
            reader.readAsDataURL(file);
        },

        toggleLoader: function (show) {
            const page = document.getElementById("page-cakes");
            
            if (!page) return;

            let loader = document.getElementById("cakes-local-loader");

            if (!loader) {
                loader = document.createElement("div");
                loader.id = "cakes-local-loader";
                
                loader.style.cssText = `
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(255, 255, 255, 0.85); z-index: 50; 
                    display: flex; justify-content: center; align-items: center;
                    backdrop-filter: blur(1px); border-radius: inherit;
                `;
                
                loader.innerHTML = `
                    <div class="spinner-border text-pink" role="status" style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                `;

                if (getComputedStyle(page).position === 'static') {
                    page.style.position = 'relative';
                }

                page.appendChild(loader);
            }

            if (show) {
                loader.classList.remove("d-none");
                loader.style.display = "flex";
            } else {
                loader.classList.add("d-none");
                loader.style.display = "none";
            }
        },

        safeAlert: function (title, message) {
            const modalEl = document.getElementById('cakeAlertModal');
            if (modalEl) {
                document.getElementById('cakeAlertTitle').innerText = title || "Notice";
                document.getElementById('cakeAlertBody').innerText = message;
                new bootstrap.Modal(modalEl).show();
            } else {
                alert(`${title}: ${message}`);
            }
        }
    };

    window.cakeManager = cakeManager;

    document.addEventListener("DOMContentLoaded", () => {
        cakeManager.init();
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (
                    mutation.target.id === 'page-cakes' &&
                    !mutation.target.classList.contains('d-none')
                ) {
                    cakeManager.fetchCakes();
                }
            });
        });

        const page = document.getElementById('page-cakes');
        if (page) {
            observer.observe(page, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    });

})();