import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const charts = {};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set default dates
    setDefaultDates();
    
    // 2. Load Stats
    loadDashboard();
    
    // 3. Load Notepad
    loadNotepad();

    document.getElementById('applyFilter')?.addEventListener('click', loadDashboard);
    document.getElementById('dashboardNote')?.addEventListener('blur', saveNotepad);
});

function setDefaultDates() {
    const fromEl = document.getElementById('fromDate');
    const toEl   = document.getElementById('toDate');

    if (fromEl && !fromEl.value) {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        fromEl.value = firstDay.toISOString().split('T')[0];
    }
    
    if (toEl && !toEl.value) {
        const date = new Date(); 
        toEl.value = date.toISOString().split('T')[0];
    }
}

async function loadDashboard() {
    const from = document.getElementById('fromDate')?.value;
    const to   = document.getElementById('toDate')?.value;

    const res = await fetch(`/dashboard/stats?from=${from}&to=${to}`);
    const data = await res.json();

    /* CARDS */
    if (data.cards) {
        document.getElementById('totalOrders').innerText = data.cards.orders;
        document.getElementById('totalRevenue').innerText = `$${data.cards.revenue.toFixed(2)}`;
        document.getElementById('pageVisitors').innerText = data.cards.visitors;
    }

    /* CHARTS */
    if (data.charts) {
        drawLineChart('ordersChart', 'Orders', data.charts.orders);
        drawLineChart('revenueChart', 'Revenue', data.charts.revenue, true);
        drawPieChart('cookiesChart', data.charts.cookies);
        drawPieChart('cakesChart', data.charts.cakes);
    }

    /* RECENT ORDERS */
    renderRecentOrders(data.recent_orders);
}

/* =============================
   NOTEPAD LOGIC
============================= */
async function loadNotepad() {
    try {
        const res = await fetch('/dashboard/note');
        const data = await res.json();
        const noteEl = document.getElementById('dashboardNote');
        if(noteEl) noteEl.value = data.content;
    } catch(e) { console.error("Note load error", e); }
}

async function saveNotepad() {
    const content = document.getElementById('dashboardNote')?.value;
    await fetch('/dashboard/note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ content })
    });
}

/* =============================
   CHART HELPERS
============================= */
function drawLineChart(id, label, rows, money = false) {
    destroyChart(id);
    const ctx = document.getElementById(id);
    if(!ctx) return;

    charts[id] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: rows.map(r => r.date),
            datasets: [{
                label,
                data: rows.map(r => r.total),
                borderColor: '#d63384',
                backgroundColor: '#d63384',
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: baseOptions(money)
    });
}

function drawPieChart(id, rows) {
    destroyChart(id);
    const ctx = document.getElementById(id);
    if(!ctx) return;

    const colors = generateColors(rows.length);

    charts[id] = new Chart(ctx, {
        type: 'pie', 
        data: {
            labels: rows.map(r => r.item_name),
            datasets: [{
                data: rows.map(r => r.total),
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right' } }
        }
    });
}

function baseOptions(money = false) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: {
            y: { ticks: { callback: value => money ? `$${value}` : value } }
        }
    };
}

function generateColors(count) {
    return Array.from({ length: count }, (_, i) => 
        `hsl(${(330 + (i * 20)) % 360}, 70%, ${50 + (i * 5)}%)`
    );
}

function destroyChart(id) {
    if (charts[id]) { charts[id].destroy(); }
}

/* =============================
   RECENT ORDERS (CLEANED UP)
============================= */

function renderRecentOrders(orders) {
    const container = document.getElementById('recentOrders');
    if(!container) return;
    
    container.innerHTML = '';

    if (!orders || orders.length === 0) {
        container.innerHTML = '<p class="text-center text-muted p-3">No recent orders found.</p>';
        return;
    }

    let html = `
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>`;

    orders.forEach(o => {
        const dateObj = new Date(o.created_at);
        const dateStr = dateObj.toLocaleDateString();
        
        html += `
            <tr>
                <td class="fw-bold text-danger">${o.order_id}</td>
                <td>${dateStr}</td>
                <td>${o.customer_name}</td>
                <td class="fw-bold">$${parseFloat(o.total_amount).toFixed(2)}</td>
            </tr>
        `;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

window.addEventListener('resize', () => {
    Object.values(charts).forEach(chart => chart.resize());
});