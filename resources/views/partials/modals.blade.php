<!-- resources/views/partials/modals.blade.php -->

<!-- Order Details Modal -->
<div class="modal fade" id="orderModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow">
            <div class="modal-header border-bottom-0">
                <h5 class="modal-title fw-bold">Order Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="orderModalBody">
                <!-- Content injected via JS -->
            </div>
            <div class="modal-footer bg-light justify-content-between">
                <div>
                    <button class="btn btn-outline-danger btn-sm" onclick="spa.deleteCurrentOrder()">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <!-- <button class="btn btn-outline-dark btn-sm ms-2" onclick="spa.sendInvoice()">
                        <i class="fas fa-envelope"></i> Send Invoice
                    </button> -->
                </div>
                <div class="d-flex align-items-center">
                    <select id="updateStatusSelect" class="form-select form-select-sm me-2" style="width:140px;">
                        <option value="Pending">Pending</option>
                        <!-- <option value="Processing">Processing</option> -->
                        <option value="Completed">Completed</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <button class="btn btn-dark btn-sm" onclick="spa.updateOrderStatus()">Update Status</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Payment Proof Modal -->
<div class="modal fade" id="proofModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-transparent border-0">
            <div class="modal-body text-center p-0 position-relative">
                <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
                <img src="" id="proof-modal-img" class="img-fluid rounded shadow-lg" alt="Payment Proof">
            </div>
        </div>
    </div>
</div>