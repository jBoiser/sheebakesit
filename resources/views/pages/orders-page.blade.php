<!-- resources/views/pages/orders-page.blade.php -->
<div id="page-orders" class="spa-view d-none">

<!-- STAT CARDS -->
<div class="row g-3 mb-4">

    <!-- Total Orders -->
    <div class="col-12 col-md">
        <div class="card border-0 h-100 stat-card border-total-orders">
            <div class="card-body d-flex align-items-center">
                <div class="bg-light rounded-circle p-3 me-3 text-primary">
                    <i class="fas fa-shopping-bag fa-2x"></i>
                </div>
                <div>
                    <h6 class="text-muted mb-1">Total Orders</h6>
                    <h3 class="fw-bold mb-0 text-darkblue" id="stat-total-orders">0</h3>
                </div>
            </div>
        </div>
    </div>

    <!-- Total Revenue -->
    <div class="col-12 col-md">
        <div class="card border-0 h-100 stat-card border-total-revenue">
            <div class="card-body d-flex align-items-center">
                <div class="bg-light rounded-circle p-3 me-3 text-success">
                    <i class="fas fa-dollar-sign fa-2x"></i>
                </div>
                <div>
                    <h6 class="text-muted mb-1">Total Revenue</h6>
                    <h3 class="fw-bold mb-0 text-green" id="stat-total-revenue">$0.00</h3>
                </div>
            </div>
        </div>
    </div>

    <!-- Completed -->
    <div class="col-12 col-md">
        <div class="card border-0 h-100 stat-card border-completed">
            <div class="card-body d-flex align-items-center">
                <div class="bg-light rounded-circle p-3 me-3 text-success">
                    <i class="fas fa-check fa-2x"></i>
                </div>
                <div>
                    <h6 class="text-muted mb-1">Completed</h6>
                    <h3 class="fw-bold mb-0 text-success" id="stat-completed">0</h3>
                </div>
            </div>
        </div>
    </div>

    <!-- Delivered -->
    <div class="col-12 col-md">
        <div class="card border-0 h-100 stat-card border-delivered">
            <div class="card-body d-flex align-items-center">
                <div class="bg-light rounded-circle p-3 me-3 text-info">
                    <i class="fas fa-check-circle fa-2x"></i>
                </div>
                <div>
                    <h6 class="text-muted mb-1">Delivered</h6>
                    <h3 class="fw-bold mb-0 text-blue" id="stat-delivered">0</h3>
                </div>
            </div>
        </div>
    </div>

    <!-- Pending -->
    <div class="col-12 col-md">
        <div class="card border-0 h-100 stat-card border-pending">
            <div class="card-body d-flex align-items-center">
                <div class="bg-light rounded-circle p-3 me-3 text-warning">
                    <i class="fas fa-clock fa-2x"></i>
                </div>
                <div>
                    <h6 class="text-muted mb-1">Pending Orders</h6>
                    <h3 class="fw-bold mb-0 text-yellow" id="stat-pending">0</h3>
                </div>
            </div>
        </div>
    </div>

</div>

    <!-- Filters -->
    <div class="card border-0 mb-4">
        <div class="card-body p-3">
            <div class="row g-2">
                <div class="col-md-4">
                    <input type="text" id="searchInput" class="form-control" placeholder="Search order ID, name or ref..." oninput="spa.filterTable()">
                </div>
                <div class="col-md-3">
                    <select id="statusFilter" class="form-select" onchange="spa.filterTable()">
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <!-- <option value="Processing">Processing</option> -->
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div class="col-md-5 text-end">
                    <!-- Placeholder for future export buttons -->
                </div>
            </div>
        </div>
    </div>

    <!-- Orders Table -->
    <div class="card border-0">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-3">ID</th>
                            <th>Ref No.</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Proof</th>
                            <th>Status</th>
                            <th class="text-end pe-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="ordersTableBody">
                        <!-- JS renders rows here -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>