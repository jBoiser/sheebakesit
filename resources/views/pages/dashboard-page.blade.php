<div id="page-dashboard" class="spa-view">

    <!-- DATE FILTER -->
    <div class="row mb-4">
        <div class="col-md-3">
            <input type="date" id="fromDate" class="form-control">
        </div>
        <div class="col-md-3">
            <input type="date" id="toDate" class="form-control">
        </div>
        <div class="col-md-3">
            <button class="btn btn-pink-outline" id="applyFilter">Apply</button>
        </div>
    </div>

    <!-- CARDS -->
    <div class="row g-3 mb-4">
        <div class="col-md">
            <div class="card stat-card border-total-orders">
                <div class="card-body">
                    <h6>Total Orders</h6>
                    <h3 id="totalOrders">0</h3>
                </div>
            </div>
        </div>

        <div class="col-md">
            <div class="card stat-card border-total-revenue">
                <div class="card-body">
                    <h6>Total Revenue</h6>
                    <h3 id="totalRevenue">$0.00</h3>
                </div>
            </div>
        </div>

        <div class="col-md">
            <div class="card stat-card border-delivered">
                <div class="card-body">
                    <h6>Page Visitors</h6>
                    <h3 id="pageVisitors">0</h3>
                </div>
            </div>
        </div>
    </div>

    <!-- CHARTS -->
    <div class="row g-4 mb-4">
        <div class="col-md-6">
            <div class="chart-card">
                <canvas id="ordersChart"></canvas>
            </div>
        </div>

        <div class="col-md-6">
            <div class="chart-card">
                <canvas id="revenueChart"></canvas>
            </div>
        </div>

        <div class="col-md-6">
            <div class="chart-card">
                <canvas id="cookiesChart"></canvas>
            </div>
        </div>

        <div class="col-md-6">
            <div class="chart-card">
                <canvas id="cakesChart"></canvas>
            </div>
        </div>
    </div>

    <!-- BOTTOM SECTION -->
    <div class="row mt-4">
        <!-- Recent Orders -->
        <div class="col-md-6">
            <div class="card">
                <div class="card-header fw-bold">Recent Orders</div>
                <div class="card-body" id="recentOrders"></div>
            </div>
        </div>

        <!-- Notepad -->
        <div class="col-md-6">
            <div class="card">
                <div class="card-header fw-bold">Notepad</div>
                <div class="card-body">
                    <textarea id="dashboardNote" class="form-control" rows="6"></textarea>
                    <button class="btn btn-dark mt-3" id="saveNote">Save</button>
                </div>
            </div>
        </div>
    </div>

</div>
