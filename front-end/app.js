const API_URL = 'https://sales-dash-api.onrender.com';

// Global variables for Chart instances
let revenueChart = null;
let categoryChart = null;

// Format utilities
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
};

const formatDate = (dateString) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
};

// Fetch data logic
async function fetchKPIs() {
    try {
        const res = await fetch(`${API_URL}/analytics/kpis`);
        const data = await res.json();
        
        document.getElementById('kpi-sales').innerText = formatNumber(data.total_sales);
        document.getElementById('kpi-revenue').innerText = formatCurrency(data.total_revenue);
        document.getElementById('kpi-avg').innerText = formatCurrency(data.avg_ticket);
    } catch (err) {
        console.error("Error fetching KPIs", err);
        document.getElementById('kpi-sales').innerText = "Erro";
        document.getElementById('kpi-revenue').innerText = "Erro";
        document.getElementById('kpi-avg').innerText = "Erro";
    }
}

async function fetchCharts() {
    try {
        // Fetch Revenue by Month
        const revRes = await fetch(`${API_URL}/analytics/sales-by-month`);
        const revData = await revRes.json();
        
        const labels = revData.map(d => d.label);
        const revenues = revData.map(d => d.revenue);

        // Fetch Sales by Category
        const catRes = await fetch(`${API_URL}/analytics/sales-by-category`);
        const catData = await catRes.json();
        
        const catLabels = catData.map(d => d.category);
        const catRevenues = catData.map(d => d.revenue);

        initCharts(labels, revenues, catLabels, catRevenues);
    } catch (err) {
        console.error("Error fetching chart data", err);
    }
}

async function fetchSales() {
    // Simple table population
    try {
        const res = await fetch(`${API_URL}/sales`);
        const data = await res.json();
        
        const tbody = document.querySelector('#salesTable tbody');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhuma venda encontrada.</td></tr>';
            return;
        }

        // Sort descending by id temporarily or handle if backend doesn't sort
        data.sort((a,b) => b.id - a.id);
        const recentData = data.slice(0, 10); // Show top 10

        window._salesData = data; // Store globally for easy access in edit

        recentData.forEach(sale => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${sale.id}</td>
                <td>${formatDate(sale.sale_date)}</td>
                <td><strong>${sale.product}</strong></td>
                <td><span class="category-tag">${sale.category}</span></td>
                <td>${sale.quantity}</td>
                <td>${formatCurrency(sale.unit_price)}</td>
                <td><strong>${formatCurrency(sale.total)}</strong></td>
                <td>
                    <div class="action-buttons">
                        <button class="icon-btn edit-btn" onclick="openEditModal(${sale.id})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                        <button class="icon-btn delete-btn" onclick="deleteSale(${sale.id})" title="Remover"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
    } catch(err) {
        console.error("Error fetching sales", err);
    }
}

// Chart.js Configuration
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Outfit', sans-serif";

function initCharts(labels, revenues, catLabels, catRevenues) {
    const ctxRevenue = document.getElementById('revenueByMonthChart').getContext('2d');
    const ctxCategory = document.getElementById('salesByCategoryChart').getContext('2d');

    // Destroy existing if re-initializing
    if (revenueChart) revenueChart.destroy();
    if (categoryChart) categoryChart.destroy();

    // Gradient for bar chart
    const gradientBar = ctxRevenue.createLinearGradient(0, 0, 0, 400);
    gradientBar.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
    gradientBar.addColorStop(1, 'rgba(6, 182, 212, 0.2)');

    revenueChart = new Chart(ctxRevenue, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Receita (R$)',
                data: revenues,
                backgroundColor: gradientBar,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    border: { display: false }
                },
                x: {
                    grid: { display: false },
                    border: { display: false }
                }
            }
        }
    });

    categoryChart = new Chart(ctxCategory, {
        type: 'doughnut',
        data: {
            labels: catLabels,
            datasets: [{
                data: catRevenues,
                backgroundColor: [
                    '#8b5cf6', // purple
                    '#06b6d4', // cyan
                    '#ec4899', // pink
                    '#10b981', // green
                    '#f59e0b'  // amber
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                }
            }
        }
    });
}

// Modal Logic
const modal = document.getElementById('saleModal');
const newSaleBtn = document.getElementById('newSaleBtn');
const closeBtn = document.querySelector('.close');
const saleForm = document.getElementById('saleForm');
const modalTitle = document.getElementById('modalTitle');

newSaleBtn.addEventListener('click', () => {
    saleForm.reset();
    document.getElementById('saleId').value = '';
    modalTitle.innerText = 'Registrar Nova Venda';
    modal.classList.add('show');
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Edit & Delete Window Actions
window.openEditModal = (id) => {
    const sale = window._salesData?.find(s => s.id === id);
    if (!sale) return;

    document.getElementById('saleId').value = sale.id;
    document.getElementById('saleProduct').value = sale.product;
    document.getElementById('saleCategory').value = sale.category;
    document.getElementById('saleQuantity').value = sale.quantity;
    document.getElementById('salePrice').value = sale.unit_price;

    modalTitle.innerText = 'Editar Venda #' + sale.id;
    modal.classList.add('show');
};

window.deleteSale = async (id) => {
    if (!confirm(`Tem certeza que deseja apagar a venda #${id}? Essa ação não poderá ser desfeita.`)) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/sales/${id}`, {
            method: 'DELETE'
        });

        if (res.ok || res.status === 204) {
            await fetchKPIs();
            await fetchCharts();
            await fetchSales();
        } else {
            alert('Não foi possível remover a venda.');
        }
    } catch (err) {
        console.error("Erro ao remover", err);
        alert('Erro de conexão ao remover.');
    }
};

// Form Submission
saleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('saleId').value;
    const product = document.getElementById('saleProduct').value;
    const category = document.getElementById('saleCategory').value;
    const quantity = parseInt(document.getElementById('saleQuantity').value);
    const price = parseFloat(document.getElementById('salePrice').value);
    
    const payload = {
        product: product,
        category: category,
        quantity: quantity,
        unit_price: price,
        sale_date: new Date().toISOString().split('T')[0] // Use current date
    };

    try {
        const btn = saleForm.querySelector('.submit-btn');
        const originalText = btn.innerText;
        btn.innerText = 'Salvando...';
        btn.disabled = true;

        const url = id ? `${API_URL}/sales/${id}` : `${API_URL}/sales`;
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            // refresh data
            await fetchKPIs();
            await fetchCharts();
            await fetchSales();
            
            // clear form and close
            saleForm.reset();
            modal.classList.remove('show');
        } else {
            alert('Erro ao salvar venda. Verifique os dados.');
        }

        btn.innerText = originalText;
        btn.disabled = false;
    } catch(err) {
        console.error("Erro ao salvar", err);
        alert('Erro de conexão.');
    }
});

// Init Dashboard
document.addEventListener('DOMContentLoaded', () => {
    fetchKPIs();
    fetchCharts();
    fetchSales();
});

// Database Reset
const resetDbBtn = document.getElementById('resetDbBtn');
if (resetDbBtn) {
    resetDbBtn.addEventListener('click', async () => {
        if (!confirm('ATENÇÃO: Deseja apagar todos os dados do banco de dados? Esta ação é irreversível.')) {
            return;
        }
        
        try {
            const originalText = resetDbBtn.innerHTML;
            resetDbBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Limpando...';
            resetDbBtn.disabled = true;

            const res = await fetch(`${API_URL}/sales/reset/all`, {
                method: 'DELETE'
            });

            if (res.ok || res.status === 204) {
                await fetchKPIs();
                await fetchCharts();
                await fetchSales();
                alert('Banco de dados limpo com sucesso!');
            } else {
                alert('Erro ao limpar os dados do banco.');
            }

            resetDbBtn.innerHTML = originalText;
            resetDbBtn.disabled = false;
        } catch (err) {
            console.error('Erro ao resetar DB', err);
            alert('Erro de conexão ao tentar limpar o banco de dados.');
        }
    });
}
