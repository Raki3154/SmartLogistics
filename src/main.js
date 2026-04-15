import './style.css'

// --- Extended Initial State ---
const state = {
  currentPage: 'dashboard',
  shipments: [
    { id: 'SH-1001', status: 'On Time', route: 'Route A', eta: '2 hrs', location: { lat: 12.91, lng: 80.22 }, slot: 'A-22', x: 20, y: 30 },
    { id: 'SH-1002', status: 'Delayed', route: 'Route B', eta: '4 hrs', location: { lat: 13.08, lng: 80.27 }, slot: 'B-10', x: 45, y: 60 },
    { id: 'SH-1003', status: 'Rerouted', route: 'Path-X', eta: '3 hrs', location: { lat: 12.97, lng: 80.18 }, slot: 'C-05', x: 70, y: 15 },
    { id: 'SH-1004', status: 'On Time', route: 'Route C', eta: '5 hrs', location: { lat: 12.85, lng: 80.21 }, slot: 'A-12', x: 30, y: 80 },
  ],
  logs: [
    { time: '21:00:15', msg: 'System initialized. AI Hub active.' },
    { time: '21:00:18', msg: 'Scanning active shipment routes...' }
  ],
  stats: {
    total: 12,
    onTime: 9,
    delayed: 2,
    healed: 1,
    efficiency: 92
  },
  hubs: [
    { name: 'Hub A', status: 'Active', load: '45%' },
    { name: 'Hub B', status: 'High Load', load: '88%' },
    { name: 'Hub C', status: 'Available', load: '12%' },
  ],
  insights: [
    "⚠️ High risk of delay on Route A detected by predictive model",
    "✅ Optimal performance detected in Southern Corridor",
    "📊 20% efficiency improvement after SH-1003 rerouting"
  ],
  notifications: []
};

// --- DOM References ---
const pageContent = document.getElementById('page-content');
const logContainer = document.getElementById('activity-logs');
const viewTitle = document.getElementById('view-title');
const viewSubtitle = document.getElementById('view-subtitle');
const navItems = document.querySelectorAll('.nav-item');
const voiceBtn = document.getElementById('voice-cmd-btn');
const voiceOverlay = document.getElementById('voice-overlay');
const voiceTranscript = document.getElementById('voice-transcript');
const notificationTray = document.getElementById('notification-tray');

// --- Navigation Logic ---
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const page = item.getAttribute('data-page');
    navigate(page);
  });
});

function navigate(page) {
  state.currentPage = page;
  navItems.forEach(i => {
    i.classList.toggle('active', i.getAttribute('data-page') === page);
  });
  render();
}

// --- Simulation Engine (Real-time Feel) ---
setInterval(() => {
  state.shipments.forEach(s => {
    // Dynamically update coordinates slightly
    s.location.lat += (Math.random() - 0.5) * 0.001;
    s.location.lng += (Math.random() - 0.5) * 0.001;
    
    // Move on digital twin grid
    s.x += (Math.random() - 0.5) * 2;
    s.y += (Math.random() - 0.5) * 2;
    if (s.x < 0) s.x = 0; if (s.x > 95) s.x = 95;
    if (s.y < 0) s.y = 0; if (s.y > 90) s.y = 90;
  });

  // Randomly add insights or alerts
  if (Math.random() > 0.98) {
    showAlert("⚠️ Possible delay detected in Zone 4", "warning");
  }

  // Update relevant views if currently active
  if (state.currentPage === 'tracking' || state.currentPage === 'digital-twin' || state.currentPage === 'dashboard') {
    render();
  }
}, 3000);

// --- Alert System ---
function showAlert(msg, type) {
  const id = Date.now();
  const alert = document.createElement('div');
  alert.className = `alert-card ${type}`;
  alert.innerHTML = `
    <i data-lucide="${type === 'warning' ? 'alert-triangle' : 'info'}" size="20"></i>
    <span>${msg}</span>
  `;
  notificationTray.appendChild(alert);
  if (window.lucide) window.lucide.createIcons();
  
  setTimeout(() => {
    alert.style.opacity = '0';
    setTimeout(() => alert.remove(), 500);
  }, 5000);
}

// --- Log Management ---
function addLog(msg) {
  const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
  state.logs.unshift({ time, msg });
  renderLogs();
}

function renderLogs() {
  logContainer.innerHTML = state.logs.map(log => `
    <div class="log-entry">
      <span class="log-time">${log.time}</span>
      <p class="log-msg">${log.msg}</p>
    </div>
  `).join('');
}

// --- View Rendering ---
function render() {
  switch (state.currentPage) {
    case 'dashboard': renderDashboard(); break;
    case 'add-shipment': renderAddShipment(); break;
    case 'tracking': renderTracking(); break;
    case 'digital-twin': renderDigitalTwin(); break;
    case 'analytics': renderAnalytics(); break;
  }
  if (window.lucide) window.lucide.createIcons();
}

function renderDashboard() {
  viewTitle.textContent = 'Autonomous Command Center';
  viewSubtitle.textContent = 'Predictive logistics and self-healing network monitoring';
  
  pageContent.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon"><i data-lucide="package"></i></div>
          <span style="color: var(--success); font-size: 0.8rem;">+12%</span>
        </div>
        <div class="stat-value">${state.stats.total}</div>
        <div class="stat-label">Total Shipments</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon" style="color: var(--success)"><i data-lucide="zap"></i></div>
        </div>
        <div class="stat-value">${state.stats.efficiency}%</div>
        <div class="stat-label">Efficiency Score</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon" style="color: var(--primary)"><i data-lucide="activity"></i></div>
        </div>
        <div class="stat-value" style="color: var(--primary)">${state.stats.healed}</div>
        <div class="stat-label">Auto-Healed Units</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon" style="color: var(--warning)"><i data-lucide="shield-check"></i></div>
        </div>
        <div class="stat-value">Active</div>
        <div class="stat-label">Autonomous Protection</div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
      <div class="data-card">
        <div class="card-title">Live Fleet Status</div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Assignment</th>
              <th>Warehouse Slot</th>
            </tr>
          </thead>
          <tbody>
            ${state.shipments.map(s => `
              <tr class="${s.status === 'Rerouted' ? 'glow-rerouted' : ''}">
                <td style="font-weight: 600;">${s.id}</td>
                <td><span class="badge badge-${s.status.toLowerCase().replace(' ', '-')}">${s.status}</span></td>
                <td>${s.route}</td>
                <td style="font-family: monospace; color: var(--primary);">${s.slot}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="data-card" style="padding: 1rem;">
        <div class="card-title" style="padding: 0 0 1rem 0; font-size: 1rem;">🧠 AI INSIGHTS</div>
        ${state.insights.map(insight => `<div class="insight-tag">${insight}</div>`).join('')}
        
        <div class="card-title" style="padding: 1.5rem 0 1rem 0; font-size: 1rem;">🌐 HUB CLUSTER STATUS</div>
        ${state.hubs.map(h => `
           <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.85rem;">
             <span>${h.name}</span>
             <span style="color: ${h.status === 'High Load' ? 'var(--warning)' : 'var(--success)'}">${h.load}</span>
           </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderDigitalTwin() {
  viewTitle.textContent = 'Digital Twin Simulation';
  viewSubtitle.textContent = 'High-fidelity virtual model of the smart hub infrastructure';

  pageContent.innerHTML = `
    <div class="digital-twin-container">
      <div class="dt-grid"></div>
      ${state.shipments.map(s => `
        <div class="dt-unit ${s.status.toLowerCase()}" 
             style="top: ${s.y}%; left: ${s.x}%;" 
             title="${s.id}: ${s.status}">
          <div style="position: absolute; top: -25px; left: -10px; font-size: 0.6rem; background: rgba(0,0,0,0.5); padding: 2px 4px; border-radius: 4px; white-space: nowrap;">
            ${s.id}
          </div>
        </div>
      `).join('')}
      
      <div style="position: absolute; bottom: 2rem; right: 2rem; background: var(--glass); backdrop-filter: blur(10px); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border-color);">
         <h4 style="margin-bottom: 1rem;">Legend</h4>
         <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.8rem;">
           <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 10px; height: 10px; background: var(--success); border-radius: 2px;"></div> Optimal</div>
           <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 10px; height: 10px; background: var(--danger); border-radius: 2px;"></div> Disruption</div>
           <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 10px; height: 10px; background: var(--primary); border-radius: 2px;"></div> Rerouted</div>
         </div>
      </div>
    </div>
  `;
}

function renderAnalytics() {
  viewTitle.textContent = 'Predictive Analytics';
  viewSubtitle.textContent = 'Performance metrics and autonomous efficiency visualization';

  pageContent.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 2rem;">
      <div class="data-card" style="padding: 1.5rem;">
        <h3 style="margin-bottom: 2rem;">Status Distribution</h3>
        <div style="display: flex; align-items: center; justify-content: center; height: 250px;">
          <!-- Simple CSS pie chart representation -->
          <div style="width: 200px; height: 200px; border-radius: 50%; background: conic-gradient(var(--success) 0% 70%, var(--danger) 70% 85%, var(--primary) 85% 100%); position: relative;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 120px; height: 120px; background: var(--bg-card); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.5rem;">92%</div>
          </div>
        </div>
        <div style="margin-top: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
           <div class="insight-tag" style="border-color: var(--success)">On-Time: 70%</div>
           <div class="insight-tag" style="border-color: var(--danger)">Delayed: 15%</div>
           <div class="insight-tag" style="border-color: var(--primary)">Rerouted: 15%</div>
        </div>
      </div>

      <div class="data-card" style="padding: 1.5rem;">
        <h3 style="margin-bottom: 2rem;">Shipments Per Route</h3>
        <div class="chart-container">
          <div class="bar" style="height: 80%"><span class="bar-label">Route A</span></div>
          <div class="bar" style="height: 45%"><span class="bar-label">Route B</span></div>
          <div class="bar" style="height: 95%"><span class="bar-label">Route C</span></div>
          <div class="bar" style="height: 30%"><span class="bar-label">Route D</span></div>
          <div class="bar" style="height: 60%"><span class="bar-label">Hub X</span></div>
        </div>
        <p style="margin-top: 3rem; color: var(--text-secondary); font-size: 0.9rem;">
          Historical data shows a 15% reduction in bottleneck frequency since the autonomous rerouting algorithm version 4.2 was deployed.
        </p>
      </div>
    </div>
  `;
}

function renderAddShipment() {
  viewTitle.textContent = 'Add New Shipment';
  viewSubtitle.textContent = 'Register a new unit with Smart Warehouse Allocation';

  pageContent.innerHTML = `
    <div class="data-card form-container" style="padding: 2rem;">
      <form id="add-shipment-form">
        <div class="form-group">
          <label>Shipment ID</label>
          <input type="text" id="ship-id" placeholder="e.g. SH-2005" required>
        </div>
        <div class="form-group">
          <label>Target Hub</label>
          <input type="text" id="ship-source" placeholder="Western Corridor Hub" required>
        </div>
        <div class="form-group">
          <label>Destination</label>
          <input type="text" id="ship-dest" placeholder="Regional Center 04" required>
        </div>
        <button type="submit" class="btn btn-primary">
          <i data-lucide="plus" size="18"></i>
          Initialize Registry
        </button>
      </form>
    </div>
  `;

  document.getElementById('add-shipment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('ship-id').value;
    const source = document.getElementById('ship-source').value;
    const dest = document.getElementById('ship-dest').value;

    // Smart Allocation
    const slots = ['A-15', 'B-12', 'C-08', 'D-22', 'A-05'];
    const randomSlot = slots[Math.floor(Math.random() * slots.length)];

    state.shipments.unshift({
      id,
      status: 'On Time',
      route: source,
      eta: '4.5 hrs',
      location: { lat: 12.91 + Math.random() * 0.1, lng: 80.22 + Math.random() * 0.1 },
      slot: randomSlot,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80
    });
    state.stats.total++;
    
    addLog(`📦 Registry: ${id} initialized. AI allocated warehouse slot: ${randomSlot}.`);
    showAlert(`Successfully allocated slot ${randomSlot} for unit ${id}`, "info");

    setTimeout(() => navigate('dashboard'), 1000);
  });
}

function renderTracking() {
  viewTitle.textContent = 'Live Unit Tracking';
  viewSubtitle.textContent = 'Simulate disruptions and monitor autonomous healing in the wild';

  const selectedShip = state.shipments[0];

  pageContent.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 350px; gap: 2rem;">
      <div>
        <div id="map-placeholder">
          <div class="location-marker" style="top: 40%; left: 50%;"></div>
        </div>
      </div>

      <div class="data-card" style="padding: 1.5rem;">
        <h3 style="margin-bottom: 1.5rem;">Unit Telemetry</h3>
        <div class="mb-2">
          <p style="font-size: 0.75rem; color: var(--text-secondary);">SHIPMENT ID</p>
          <p style="font-weight: 700; font-size: 1.25rem;">${selectedShip.id}</p>
        </div>
        <div class="mb-2">
          <p style="font-size: 0.75rem; color: var(--text-secondary);">STATUS / SLOT</p>
          <div style="display: flex; align-items:center; gap: 0.5rem;">
             <span class="badge badge-${selectedShip.status.toLowerCase().replace(' ', '-')}">${selectedShip.status}</span>
             <span style="font-family: monospace; font-size: 0.8rem; color: var(--primary)">[SLOT ${selectedShip.slot}]</span>
          </div>
        </div>
        <div class="mb-2">
          <p style="font-size: 0.75rem; color: var(--text-secondary);">AI ROUTE</p>
          <p style="font-weight: 600;">${selectedShip.route}</p>
        </div>
        <div class="mb-2">
          <p style="font-size: 0.75rem; color: var(--text-secondary);">LAT / LNG</p>
          <p style="font-family: monospace; font-size: 0.9rem;">${selectedShip.location.lat.toFixed(4)}, ${selectedShip.location.lng.toFixed(4)}</p>
        </div>
        <div class="mb-2">
          <p style="font-size: 0.75rem; color: var(--text-secondary);">LIVE ETA</p>
          <p style="font-weight: 700; color: var(--primary); font-size: 1.1rem;">${selectedShip.eta}</p>
        </div>

        <button class="btn btn-warning mt-4" style="width: 100%;" id="sim-delay">
          <i data-lucide="alert-triangle" size="18"></i>
          Inject Network Disruption
        </button>
      </div>
    </div>
  `;

  document.getElementById('sim-delay').addEventListener('click', () => {
    handleDelaySimulation(selectedShip);
  });
}

function handleDelaySimulation(ship) {
  if (ship.status === 'Rerouted') return;
  addLog(`⚠️ Disruption detected on ${ship.route} affecting ${ship.id}`);
  showAlert(`Disruption warning for ${ship.id}`, "warning");
  
  ship.status = 'Delayed';
  render();

  setTimeout(() => {
    addLog(`🧠 AI Engine: Calculating trajectory optimization for ${ship.id}...`);
  }, 1500);

  setTimeout(() => {
    addLog(`⚡ Healing complete: Alternative path confirmed for ${ship.id}.`);
    ship.status = 'Rerouted';
    ship.route = 'Optimized Path X';
    ship.eta = (parseFloat(ship.eta) + 0.5) + ' hrs';
    state.stats.healed++;
    state.stats.onTime--;
    render();
    showAlert(`Autonomous healing applied to ${ship.id}`, "info");
  }, 3500);
}

// --- Voice Command Emulation ---
voiceBtn.addEventListener('click', () => {
  voiceOverlay.className = 'voice-overlay-active';
  voiceTranscript.textContent = '';
  
  setTimeout(() => {
    voiceTranscript.textContent = '"Track Shipment SH-1001"';
    setTimeout(() => {
      voiceOverlay.className = 'voice-overlay-hidden';
      navigate('tracking');
      showAlert("Voice Command Recognized: Navigating to Tracking", "info");
    }, 2000);
  }, 1500);
});

// --- Final Init ---
render();
renderLogs();
