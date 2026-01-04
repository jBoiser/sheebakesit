// public/js/cookies.js

(function () {
    const api = {
        list: "/api/cookies",
        store: "/api/cookies/store",
        update: "/api/cookies/update",
        delete: "/api/cookies/delete",
    };

    // Safely get CSRF token
    const getCsrf = () =>
        document.querySelector('meta[name="csrf-token"]')?.content || "";

    let allCookies = [];
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
    const cookieManager = {

        init: function () {
            this.ensureModalsExist(); 

            const imgInput = document.getElementById('cookieImageInput');
            if (imgInput) {
                imgInput.removeEventListener('change', this.handleImagePreview);
                imgInput.addEventListener('change', this.handleImagePreview);
            }
            console.log("Cookie Manager Initialized");
        },

        /* --------------------------------------------------
         * MODAL INFRASTRUCTURE
         * -------------------------------------------------- */
        ensureModalsExist: function() {
            if (document.getElementById('spaAlertModal')) return;

            const modalsHtml = `
                <!-- Shared Alert Modal -->
                <div class="modal fade" id="spaAlertModal" tabindex="-1" aria-hidden="true" style="z-index: 1060;">
                    <div class="modal-dialog modal-dialog-centered modal-sm">
                        <div class="modal-content border-0 shadow">
                            <div class="modal-header border-bottom-0 pb-0">
                                <h5 class="modal-title fw-bold text-pink" id="spaAlertTitle">Notice</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center py-4" id="spaAlertBody">
                                <!-- Message -->
                            </div>
                            <div class="modal-footer border-top-0 justify-content-center pt-0">
                                <button type="button" class="btn btn-dark btn-sm px-4 rounded-pill" data-bs-dismiss="modal">OK</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Shared Confirm Modal -->
                <div class="modal fade" id="spaConfirmModal" tabindex="-1" aria-hidden="true" style="z-index: 1060;">
                    <div class="modal-dialog modal-dialog-centered modal-sm">
                        <div class="modal-content border-0 shadow">
                             <div class="modal-header border-bottom-0 pb-0">
                                <h5 class="modal-title fw-bold text-pink" id="spaConfirmTitle">Confirm</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center py-4" id="spaConfirmBody">
                                <!-- Message -->
                            </div>
                            <div class="modal-footer border-top-0 justify-content-center pt-0">
                                <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-3" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-danger btn-sm rounded-pill px-3" id="spaConfirmBtn">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalsHtml);

            document.getElementById('spaConfirmBtn').addEventListener('click', () => {
                if (typeof confirmCallback === 'function') {
                    confirmCallback();
                }
                const el = document.getElementById('spaConfirmModal');
                const modal = bootstrap.Modal.getInstance(el);
                modal.hide();
            });
        },

        /* --------------------------------------------------
         * DATA FETCHING
         * -------------------------------------------------- */
        fetchCookies: async function () {
            const tbody = document.getElementById("cookiesTableBody");
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
                    allCookies = json.data;
                    this.renderTable(allCookies);
                    this.updateStats(allCookies);
                }

            } catch (e) {
                console.error("Fetch Error:", e);
            } finally {
                this.toggleLoader(false);
            }
        },

        renderTable: function (cookies) {
            const tbody = document.getElementById("cookiesTableBody");
            tbody.innerHTML = "";

            if (cookies.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-5 text-muted">
                            No cookies found. Add some deliciousness!
                        </td>
                    </tr>`;
                return;
            }

            cookies.forEach(c => {
                const statusBadge = c.status === 'active'
                    ? '<span class="badge bg-success rounded-pill px-2">Active</span>'
                    : '<span class="badge bg-secondary rounded-pill px-2">Inactive</span>';

                // XSS FIX: Escape category
                const categoryBadge =
                    `<span class="badge bg-light text-dark border">${escapeHtml(c.category)}</span>`;

                const tr = document.createElement("tr");
                // XSS FIX: Escape id and name
                tr.innerHTML = `
                    <td class="ps-4 fw-bold text-pink">${escapeHtml(c.id)}</td>
                    <td>
                        <img src="${c.image_url || '/storage/footers/logo1.png'}"
                             class="rounded-3 shadow-sm"
                             style="width:50px;height:50px;object-fit:cover;">
                    </td>
                    <td class="fw-semibold">${escapeHtml(c.name)}</td>
                    <td>${categoryBadge}</td>
                    <td class="fw-bold">$${parseFloat(c.price).toFixed(2)}</td>
                    <td>${statusBadge}</td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-outline-secondary rounded-pill me-1"
                            onclick="window.cookieManager.openEditModal('${c.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger rounded-pill"
                            onclick="window.cookieManager.deleteCookie('${c.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        },

        updateStats: function (cookies) {
            const setVal = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.innerText = val;
            };

            setVal('cookie-stat-total', cookies.length);
            setVal('cookie-stat-active',
                cookies.filter(c => c.status === 'active').length);
            setVal('cookie-stat-inactive',
                cookies.filter(c => c.status === 'inactive').length);
        },

        /* --------------------------------------------------
         * MODALS (Add/Edit)
         * -------------------------------------------------- */
        openAddModal: function () {
            document.getElementById('cookieForm').reset();
            document.getElementById('cookieId').value = "";
            document.getElementById('cookieModalTitle').innerText = "Add New Cookie";

            const preview = document.getElementById('cookiePreview');
            if (preview) preview.src = "/storage/footers/logo1.png";

            new bootstrap.Modal(document.getElementById('cookieModal')).show();
        },

        openEditModal: function (id) {
            const cookie = allCookies.find(c => c.id === id);
            if (!cookie) return;

            document.getElementById('cookieId').value = cookie.id;
            document.getElementById('cookieName').value = cookie.name;
            document.getElementById('cookiePrice').value = cookie.price;
            document.getElementById('cookieCategory').value = cookie.category;
            document.getElementById('cookieStatus').value = cookie.status;
            document.getElementById('cookiePreview').src = cookie.image_url;

            document.getElementById('cookieModalTitle')
                .innerText = "Edit Cookie (" + cookie.id + ")";

            new bootstrap.Modal(document.getElementById('cookieModal')).show();
        },

        /* --------------------------------------------------
         * SAVE & DELETE
         * -------------------------------------------------- */
        saveCookie: async function () {
            const form = document.getElementById('cookieForm');
            const formData = new FormData(form);
            const id = document.getElementById('cookieId').value;
            const url = id ? api.update : api.store;

            if (!id && document.getElementById('cookieImageInput').files.length === 0) {
                this.safeAlert("Missing Image", "Please upload a cookie image.");
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
                        .getInstance(document.getElementById('cookieModal'))
                        .hide();
                    this.fetchCookies();
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

        deleteCookie: function (id) {
            if (window.spa && typeof window.spa.confirm === 'function') {
                window.spa.confirm(
                    "Delete Cookie", 
                    "Are you sure? This cannot be undone.", 
                    () => this.proceedDelete(id)
                );
                return;
            }

            if (document.getElementById('spaConfirmModal')) {
                document.getElementById('spaConfirmTitle').innerText = "Delete Cookie";
                document.getElementById('spaConfirmBody').innerText = "Are you sure? This cannot be undone.";
                
                confirmCallback = () => this.proceedDelete(id);
                
                new bootstrap.Modal(document.getElementById('spaConfirmModal')).show();
            } else {
                if (confirm("Delete this cookie?")) this.proceedDelete(id);
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
                    this.fetchCookies();
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
                document.getElementById('cookiePreview').src = ev.target.result;
            };
            reader.readAsDataURL(file);
        },

        toggleLoader: function (show) {
            const page = document.getElementById("page-cookies");
            if (!page) return;

            let loader = document.getElementById("cookies-local-loader");

            if (!loader) {
                loader = document.createElement("div");
                loader.id = "cookies-local-loader";
                
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
            if (window.spa && typeof window.spa.alert === 'function') {
                window.spa.alert(title, message);
                return;
            }

            const modalEl = document.getElementById('spaAlertModal');
            if (modalEl) {
                document.getElementById('spaAlertTitle').innerText = title || "Notice";
                document.getElementById('spaAlertBody').innerText = message;
                new bootstrap.Modal(modalEl).show();
            } else {
                alert(`${title}: ${message}`);
            }
        }
    };

    window.cookieManager = cookieManager;

    document.addEventListener("DOMContentLoaded", () => {
        cookieManager.init();
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (
                    mutation.target.id === 'page-cookies' &&
                    !mutation.target.classList.contains('d-none')
                ) {
                    cookieManager.fetchCookies();
                }
            });
        });

        const page = document.getElementById('page-cookies');
        if (page) {
            observer.observe(page, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    });

})();