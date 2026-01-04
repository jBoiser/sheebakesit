// public/js/dashboard.js

const spa = (function () {

    let allOrders = [];
    let currentOrder = null;
    let currentPage = "orders";
    let confirmCallback = null; // Store function for confirm modal

    const api = {
        orders: "/api/orders",
        getAllData: "/api/data/all",
        update: "/api/orders/update",
        delete: "/api/orders/delete",
        sendInvoice: "/api/orders/send-invoice",
        printInvoiceUrl: "/download-invoice/" 
    };

    const csrf = document.querySelector('meta[name="csrf-token"]')?.content || "";

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
     * HELPER: Fix Image Paths (Hostinger/Storage)
     * -------------------------------------------------- */
    function fixStoragePath(url) {
        if (!url) return null;
        if (url.startsWith("http") || url.startsWith("/storage")) {
            return url;
        }
        // If it's a relative path like "orders/abc.jpg", prepend /storage/
        return "/storage/" + url.replace(/^\/+/, "");
    }

    /* --------------------------------------------------
     * INIT
     * -------------------------------------------------- */
    async function init() {
        createGlobalModals(); // Inject global modals into DOM
        showPage("dashboard");
        await fetchOrders();
        await fetchSiteAssets();
    }

    /* --------------------------------------------------
     * CREATE GLOBAL MODALS (Alert & Confirm)
     * -------------------------------------------------- */
    function createGlobalModals() {
        if (document.getElementById('spaAlertModal')) return;

        const modalsHtml = `
            <!-- Alert Modal -->
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

            <!-- Confirm Modal -->
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

        // Bind Confirm Action
        document.getElementById('spaConfirmBtn').addEventListener('click', () => {
            if (confirmCallback) confirmCallback();
            const el = document.getElementById('spaConfirmModal');
            const modal = bootstrap.Modal.getInstance(el);
            modal.hide();
        });
    }

    /* --------------------------------------------------
     * CUSTOM ALERT / CONFIRM
     * -------------------------------------------------- */
    function showAlert(title, message) {
        document.getElementById('spaAlertTitle').innerText = title || "Notice";
        document.getElementById('spaAlertBody').innerText = message;
        new bootstrap.Modal(document.getElementById('spaAlertModal')).show();
    }

    function showConfirm(title, message, callback) {
        document.getElementById('spaConfirmTitle').innerText = title || "Confirm";
        document.getElementById('spaConfirmBody').innerText = message;
        confirmCallback = callback;
        new bootstrap.Modal(document.getElementById('spaConfirmModal')).show();
    }


    /* --------------------------------------------------
     * SUBMENU TOGGLE (fixed chevron)
     * -------------------------------------------------- */
    window.toggleSubmenu = function (id, link) {
        const el = document.getElementById(id);
        const chevron = link.querySelector(".chevron-icon");

        if (el.classList.contains("d-none")) {
            el.classList.remove("d-none");
            chevron?.classList.replace("fa-chevron-right", "fa-chevron-down");
        } else {
            el.classList.add("d-none");
            chevron?.classList.replace("fa-chevron-down", "fa-chevron-right");
        }
    };


    /* --------------------------------------------------
     * PAGE SWITCH
     * -------------------------------------------------- */
    function showPage(pageId, linkElement = null) {
        currentPage = pageId;

        document.querySelectorAll(".spa-view").forEach(p => p.classList.add("d-none"));
        document.getElementById("page-" + pageId)?.classList.remove("d-none");

        document.querySelectorAll(".sidebar .nav-link").forEach(n => n.classList.remove("active"));
        linkElement?.classList.add("active");

        if (pageId === "orders") {
            document.getElementById("refresh-btn")?.classList.remove("d-none");
        } else {
            document.getElementById("refresh-btn")?.classList.add("d-none");
        }

        if (pageId === "customers") renderCustomers();
    }


    /* --------------------------------------------------
     * LOAD LOGO
     * -------------------------------------------------- */
    async function fetchSiteAssets() {
        try {
            const res = await fetch(api.getAllData);
            const data = await res.json();
            if (data.footer) {
                const sidebarLogo = document.getElementById("sidebar-logo");
                const first = Object.values(data.footer)[0];
                if (sidebarLogo && first) sidebarLogo.src = first;
            }
        } catch (e) {
            console.error(e);
        }
    }


    /* --------------------------------------------------
     * FETCH ORDERS
     * -------------------------------------------------- */
    async function fetchOrders() {
        try {
            toggleLoader(true);

            const res = await fetch(api.orders + "?t=" + Date.now());
            const json = await res.json();

            if (json.status === "success") {
                allOrders = json.data;
                renderTable(allOrders);
                updateStats(allOrders);
            }
        } catch (e) {
            console.error(e);
        } finally {
            toggleLoader(false);
        }
    }


    /* --------------------------------------------------
     * RENDER TABLE
     * -------------------------------------------------- */
    function renderTable(orders) {
        const tbody = document.getElementById("ordersTableBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">No orders found.</td></tr>`;
            return;
        }

        orders.forEach(o => {
            const status = o.status || "Pending";

            let badgeClass = "badge-pending";
            if (status === "Delivered" || status === "Completed") badgeClass = "badge-delivered";
            if (status === "Cancelled") badgeClass = "badge-cancelled";

            let proofBtn = `<span class="text-muted small">-</span>`;
            if (o.proof_image) {
                // Ensure the proof image has the correct path logic
                const rawUrl = o.proof_image.replace(/'/g, "%27");
                // We don't apply fixStoragePath here because openProofModal handles it, 
                // but we could. For now, we pass rawUrl.
                proofBtn = `
                    <button class="btn btn-sm btn-outline-primary rounded-pill px-3"
                        onclick="spa.openProofModal('${rawUrl}')">
                        <i class="fas fa-image"></i> View
                    </button>
                `;
            }

            const tr = document.createElement("tr");
            
            // XSS FIX: Use escapeHtml() on all user-supplied data
            tr.innerHTML = `
                <td class="fw-bold small">#${escapeHtml(o.order_id)}</td>
                <td class="fw-bold text-danger">${escapeHtml(o.reference_no)}</td>
                <td class="small text-muted">${escapeHtml(formatDate(o.created_at))}</td>
                <td><div class="fw-semibold">${escapeHtml(o.customer_name)}</div></td>
                <td class="fw-bold">$${parseFloat(o.total_amount).toFixed(2)}</td>
                <td>${proofBtn}</td>
                <td><span class="${badgeClass} rounded-pill px-2">${escapeHtml(status)}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light border rounded-pill"
                        onclick="spa.viewOrder('${o.order_id}')"> <!-- IDs are usually safe but ideally escape them too if untrusted -->
                        <i class="fas fa-cog"></i> Manage
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }


    /* --------------------------------------------------
     * FORMAT DATE
     * -------------------------------------------------- */
    function formatDate(d) {
        if (!d) return "N/A";
        const date = new Date(d);
        return (
            date.toLocaleDateString() +
            " " +
            date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
    }


    /* --------------------------------------------------
     * FILTER TABLE
     * -------------------------------------------------- */
    function filterTable() {
        const q = document.getElementById("searchInput").value.toLowerCase();
        const status = document.getElementById("statusFilter").value;

        const filtered = allOrders.filter(o => {
            const matchesQuery =
                o.order_id.toLowerCase().includes(q) ||
                (o.reference_no || "").toLowerCase().includes(q) ||
                (o.customer_name || "").toLowerCase().includes(q);

            const matchesStatus = !status || o.status === status;

            return matchesQuery && matchesStatus;
        });

        renderTable(filtered);
    }


    /* Make public */
    window.spa = {
        showPage,
        refreshCurrent: fetchOrders,
        filterTable,
        viewOrder,
        openProofModal,
        updateOrderStatus,
        deleteCurrentOrder,
        sendInvoice,
        printInvoice,
        confirm: showConfirm, // Expose for cookies.js
        alert: showAlert
    };


    /* --------------------------------------------------
     * VIEW ORDER (UPDATED TO FIX IMAGE PATHS)
     * -------------------------------------------------- */
    function viewOrder(orderId) {
        currentOrder = allOrders.find(x => x.order_id === orderId);
        if (!currentOrder) return;

        document.getElementById("updateStatusSelect").value =
            currentOrder.status || "Pending";

        const modalBody = document.getElementById("orderModalBody");

        let itemsHtml = '<ul class="list-group list-group-flush">';
        (currentOrder.items || []).forEach(item => {
            // FIX: Run the image path through the helper
            const fixedSrc = fixStoragePath(item.image);

            const img = fixedSrc
                ? `<img src="${fixedSrc}" class="item-thumb">`
                : `<div class="item-thumb bg-light"></div>`;

            itemsHtml += `
                <li class="list-group-item d-flex align-items-center">
                    ${img}
                    <div class="flex-grow-1 ms-2">
                        <div class="fw-bold">${escapeHtml(item.name)}</div>
                        <div class="small text-muted">Qty: ${item.qty}</div>
                    </div>
                    <div class="fw-bold">$${parseFloat(item.total).toFixed(2)}</div>
                </li>
            `;
        });
        itemsHtml += "</ul>";

        // XSS FIX: Escape data in the modal as well
        modalBody.innerHTML = `
            <div class="row mb-3">
                <div class="col-6">
                    <small class="text-uppercase text-muted">Customer</small>
                    <div class="fw-bold">${escapeHtml(currentOrder.customer_name)}</div>
                    <div class="small"><i class="fas fa-phone-alt me-1"></i> ${escapeHtml(currentOrder.contact)}</div>
                    <div class="small"><i class="fas fa-envelope me-1"></i> ${escapeHtml(currentOrder.email || "No Email")}</div>
                    <div class="small"><i class="fas fa-map-marker-alt me-1"></i> ${escapeHtml(currentOrder.address)}</div>
                </div>

                <div class="col-6 text-end">
                    <small class="text-uppercase text-muted">Order Info</small>
                    <div class="fw-bold text-danger">${escapeHtml(currentOrder.reference_no)}</div>
                    <div class="small">Pay: ${escapeHtml(currentOrder.payment_mode)}</div>
                    <div class="small">Deliver: ${escapeHtml(currentOrder.delivery_mode)}</div>
                    <div class="mt-2 d-flex justify-content-end gap-2">
                        <button class="btn btn-sm btn-outline-dark" onclick="spa.sendInvoice()">
                            <i class="fas fa-envelope"></i> Email PDF
                        </button>
                        <button class="btn btn-sm btn-pink-outline" onclick="spa.printInvoice('${currentOrder.order_id}')">
                            <i class="fas fa-file-pdf"></i> Download PDF
                        </button>
                    </div>
                </div>
            </div>

            <h6 class="border-bottom pb-2">Items</h6>
            ${itemsHtml}

            <div class="d-flex justify-content-between align-items-center mt-3">
                <span class="text-muted small">Comments: ${escapeHtml(currentOrder.comments || "None")}</span>
                <h4 class="text-danger fw-bold m-0">$${parseFloat(
                    currentOrder.total_amount
                ).toFixed(2)}</h4>
            </div>
        `;

        new bootstrap.Modal(document.getElementById("orderModal")).show();
    }


    /* --------------------------------------------------
     * FIXED: OPEN PROOF MODAL
     * (Normalizes URL so /storage/... always works)
     * -------------------------------------------------- */
    function openProofModal(url) {
        if (!url) return;
        
        console.log("Opening proof image:", url);

        // FIX: Use the helper here too
        const finalUrl = fixStoragePath(url);
        
        const img = document.getElementById("proof-modal-img");
        img.src = finalUrl;
        
        // Reset previous error messages if any
        const parent = img.parentElement;
        const oldMsg = parent.querySelector(".error-msg");
        if(oldMsg) oldMsg.remove();
        img.style.display = 'inline-block';

        new bootstrap.Modal(document.getElementById("proofModal")).show();
    }


    /* --------------------------------------------------
     * UPDATE STATUS
     * -------------------------------------------------- */
    async function updateOrderStatus() {
        if (!currentOrder) return;

        const newStatus = document.getElementById("updateStatusSelect").value;

        showConfirm("Update Status", `Change status to ${newStatus}?`, async () => {
            toggleLoader(true);

            try {
                const form = new FormData();
                form.append("order_id", currentOrder.order_id);
                form.append("status", newStatus);

                const res = await fetch(api.update, {
                    method: "POST",
                    headers: { "X-CSRF-TOKEN": csrf },
                    body: form
                });

                const json = await res.json();

                if (json.status === "success") {
                    currentOrder.status = newStatus;

                    const idx = allOrders.findIndex(
                        o => o.order_id === currentOrder.order_id
                    );
                    if (idx !== -1) allOrders[idx].status = newStatus;

                    renderTable(allOrders);
                    updateStats(allOrders);

                    bootstrap.Modal.getInstance(
                        document.getElementById("orderModal")
                    ).hide();

                    showAlert("Success", "Order updated successfully");
                } else {
                    showAlert("Error", json.message || "Error");
                }
            } catch (e) {
                console.error(e);
                showAlert("Error", "Connection error");
            } finally {
                toggleLoader(false);
            }
        });
    }


    /* --------------------------------------------------
     * DELETE ORDER
     * -------------------------------------------------- */
    async function deleteCurrentOrder() {
        if (!currentOrder) return;

        showConfirm("Delete Order", "Delete this order? This will remove proof + items.", async () => {
             toggleLoader(true);

            try {
                const form = new FormData();
                form.append("order_id", currentOrder.order_id);

                const res = await fetch(api.delete, {
                    method: "POST",
                    headers: { "X-CSRF-TOKEN": csrf },
                    body: form
                });

                const json = await res.json();

                if (json.status === "success") {
                    allOrders = allOrders.filter(
                        o => o.order_id !== currentOrder.order_id
                    );

                    renderTable(allOrders);
                    updateStats(allOrders);

                    bootstrap.Modal.getInstance(
                        document.getElementById("orderModal")
                    ).hide();

                    showAlert("Deleted", "Order deleted successfully");
                } else {
                    showAlert("Error", json.message || "Error");
                }
            } catch (e) {
                console.error(e);
                showAlert("Error", "Connection error");
            } finally {
                toggleLoader(false);
            }
        });
    }


    /* --------------------------------------------------
     * SEND INVOICE
     * -------------------------------------------------- */
    async function sendInvoice() {
        if (!currentOrder) return;
        
        showConfirm("Send Invoice", "Send invoice PDF to customer email?", async () => {
             toggleLoader(true);

            try {
                const form = new FormData();
                form.append("order_id", currentOrder.order_id);

                const res = await fetch(api.sendInvoice, {
                    method: "POST",
                    headers: { "X-CSRF-TOKEN": csrf },
                    body: form
                });

                const json = await res.json();

                if (json.status === "success") {
                    showAlert("Success", "Invoice PDF sent successfully!");
                } else {
                    showAlert("Error", json.message || "Error sending invoice");
                }
            } catch (e) {
                console.error(e);
                showAlert("Error", "Connection error");
            } finally {
                toggleLoader(false);
            }
        });
    }

    /* --------------------------------------------------
     * PRINT INVOICE
     * -------------------------------------------------- */
    function printInvoice(orderId) {
        if(!orderId) return;
        const url = api.printInvoiceUrl + orderId;
        window.open(url, '_blank');
    }

    /* --------------------------------------------------
     * UPDATE STAT CARDS
     * -------------------------------------------------- */
    function updateStats(orders) {
        document.getElementById("stat-total-orders").innerText = orders.length;

        const totalRevenue = orders.reduce(
            (acc, o) => acc + (parseFloat(o.total_amount) || 0),
            0
        );
        document.getElementById("stat-total-revenue").innerText =
            "$" + totalRevenue.toFixed(2);

        document.getElementById("stat-pending").innerText = orders.filter(
            o => !o.status || o.status === "Pending"
        ).length;

        document.getElementById("stat-delivered").innerText = orders.filter(
            o => o.status === "Delivered"
        ).length;

        document.getElementById("stat-completed").innerText = orders.filter(
            o => o.status === "Completed"
        ).length;
    }


    /* --------------------------------------------------
     * CUSTOMERS (AGGREGATE)
     * -------------------------------------------------- */
    function renderCustomers() {
        const area = document.getElementById("customers-area");
        if (!area) return;

        const groups = {};

        allOrders.forEach(o => {
            // Fix: ensure undefined values don't break key generation
            const key =
                (o.customer_name || "Unknown") + "|" + (o.contact || "");
            if (!groups[key]) {
                groups[key] = {
                    name: o.customer_name || "Unknown",
                    contact: o.contact || "",
                    email: o.email || "",
                    orders: 0
                };
            }
            groups[key].orders++;
        });

        let html = '<div class="list-group">';
        Object.values(groups).forEach(g => {
            // XSS Fix in customers loop
            html += `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">${escapeHtml(g.name)}</div>
                        <div class="small text-muted">${escapeHtml(g.contact)} • ${escapeHtml(g.email || "No email")}</div>
                    </div>
                    <div class="small text-muted">Orders: ${g.orders}</div>
                </div>
            `;
        });
        html += "</div>";

        area.innerHTML = html;
    }


    /* --------------------------------------------------
     * LOADER (SCOPED TO ACTIVE PAGE)
     * -------------------------------------------------- */
    function toggleLoader(show) {
        // Try to find the active page container
        const pageId = "page-" + currentPage;
        const page = document.getElementById(pageId);

        if (!page) {
            // Fallback to global loader if page container not found
            const el = document.getElementById("loader-overlay");
            if (el) el.classList.toggle("d-none", !show);
            return;
        }

        let loader = document.getElementById("orders-local-loader");

        if (!loader) {
            loader = document.createElement("div");
            loader.id = "orders-local-loader";
            
            // Scoped overlay styles
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

            // Ensure parent has relative positioning
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
    }

    return {
        init,
        showPage,
        refreshCurrent: fetchOrders,
        filterTable,
        viewOrder,
        openProofModal,
        updateOrderStatus,
        deleteCurrentOrder,
        sendInvoice,
        printInvoice,
        alert: showAlert,
        confirm: showConfirm
    };
})();


document.addEventListener("DOMContentLoaded", () => {
    spa.init();
    window.spaFilter = spa.filterTable;
});