const loginForm = document.getElementById('login-form');
const loginScreen = document.getElementById('login-screen');
const app = document.getElementById('dashboard');
const saveBtn = document.getElementById('save-settings-btn');
let mainChart, detailChart;

// --- GİRİŞ ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (document.getElementById('email').value === "admin@gmail.com" && 
        document.getElementById('password').value === "123") {
        loginScreen.style.display = 'none';
        app.style.display = 'flex';
        loadSettings();
        initDashboard();
    } else { alert("Hatalı giriş!"); }
});

// --- AYARLAR VE HAFIZA ---
function saveSettings() {
    const newName = document.getElementById('set-name').value;
    const newTheme = document.getElementById('set-theme').value;

    if(newName.trim()) {
        document.querySelector('.user-profile strong').innerText = newName;
        localStorage.setItem('nazir_name', newName);
    }
    localStorage.setItem('nazir_theme', newTheme);
    applyTheme(newTheme);
    alert("Ayarlar güncellendi!");
}

function applyTheme(theme) {
    theme === 'dark' ? document.body.classList.add('dark') : document.body.classList.remove('dark');
    if(mainChart) {
        // Grafiği tema rengine göre güncelle
        mainChart.options.scales.y.grid.color = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
        mainChart.update();
    }
}

function loadSettings() {
    const n = localStorage.getItem('nazir_name');
    const t = localStorage.getItem('nazir_theme');
    if(n) { document.querySelector('.user-profile strong').innerText = n; document.getElementById('set-name').value = n; }
    if(t) { document.getElementById('set-theme').value = t; applyTheme(t); }
}

if(saveBtn) saveBtn.addEventListener('click', saveSettings);

// --- SAYFA GEÇİŞLERİ ---
document.querySelectorAll('#menu li[data-target]').forEach(item => {
    item.addEventListener('click', () => {
        const target = item.getAttribute('data-target');
        document.querySelector('#menu li.active').classList.remove('active');
        item.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(target).classList.add('active');
        document.getElementById('page-title').innerText = item.innerText.trim();

        if(target === 'page-dashboard') initDashboard();
        if(target === 'page-stats') initDetailChart();
    });
});

// --- GRAFİKLER ---
function initDashboard() {
    if(mainChart) mainChart.destroy();
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'],
            datasets: [{ 
                data: [20, 40, 35, 70, 50], 
                borderColor: '#38bdf8', 
                tension: 0.4, 
                fill: true, 
                backgroundColor: 'rgba(56, 189, 248, 0.1)' 
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    // SOLDAKİ SAYILARIN ÜST ÜSTE BİNMESİNİ ÖNLEYEN KOD:
                    ticks: { maxTicksLimit: 6, stepSize: 20 },
                    grid: { color: document.body.classList.contains('dark') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                },
                x: { grid: { display: false } }
            }
        }
    });
    animate('s1', 52000); animate('s2', 1500); animate('s3', 95);
}

function initDetailChart() {
    if(detailChart) detailChart.destroy();
    const ctx = document.getElementById('detailChart').getContext('2d');
    detailChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Oca', 'Şub', 'Mar', 'Nis'],
            datasets: [{ label: 'Verim', data: [300, 500, 400, 600], backgroundColor: '#38bdf8' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function animate(id, target) {
    let cur = 0;
    let el = document.getElementById(id);
    if(!el) return;
    let t = setInterval(() => {
        cur += Math.ceil(target/40);
        if(cur >= target) { cur = target; clearInterval(t); }
        el.innerText = cur.toLocaleString();
    }, 30);
}

document.getElementById('logout-btn').addEventListener('click', () => location.reload());