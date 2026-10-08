import { store } from '../data/store.js';
import { getIcon, formatINR } from '../icons.js';

export function renderDashboardView() {
  const data = store.getData();
  const { rooms, residents, fees, complaints, gatePasses } = data;

  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalOccupiedBeds = residents.filter(r => r.roomNo).length;
  const occupancyRate = Math.round((totalOccupiedBeds / totalBeds) * 100);

  const pendingFeesINR = fees
    .filter(f => f.status !== 'Paid')
    .reduce((acc, f) => acc + (f.balanceDue || (f.totalAmount - f.amountPaid)), 0);

  const openComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;
  const pendingPassesCount = gatePasses.filter(g => g.status === 'Pending').length;

  return `
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      
      <!-- Top Welcome Banner -->
      <div class="glass-panel" style="padding: 2rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.15)); border: 1px solid rgba(99, 102, 241, 0.3); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
        <div>
          <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: rgba(99, 102, 241, 0.25); border-radius: 20px; color: #818cf8; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.5rem;">
            ${getIcon('gatepass', 14)} Campus Hostel Operations Desk
          </div>
          <h1 style="font-size: 1.85rem; font-weight: 800; color: #fff;">Hostel Management Dashboard</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 4px;">
            Managing 4 Hostel Blocks, ${totalBeds} total capacity beds across ${rooms.length} registered rooms.
          </p>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="window.app.openModal('allocate')">
            ${getIcon('key', 16)} Allocate Room
          </button>
          <button class="btn btn-secondary" onclick="window.app.openModal('registerStudent')">
            ${getIcon('residents', 16)} Add Resident
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="glass-panel stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #6366f1, #4f46e5);">
            ${getIcon('home', 24)}
          </div>
          <div>
            <div class="stat-val">${totalOccupiedBeds} / ${totalBeds}</div>
            <div class="stat-label">Beds Occupied (${occupancyRate}%)</div>
          </div>
        </div>

        <div class="glass-panel stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">
            ${getIcon('residents', 24)}
          </div>
          <div>
            <div class="stat-val">${residents.length}</div>
            <div class="stat-label">Active Residents</div>
          </div>
        </div>

        <div class="glass-panel stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
            ${getIcon('rupee', 24)}
          </div>
          <div>
            <div class="stat-val">${formatINR(pendingFeesINR)}</div>
            <div class="stat-label">Pending Fees Due</div>
          </div>
        </div>

        <div class="glass-panel stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #ef4444, #b91c1c);">
            ${getIcon('complaints', 24)}
          </div>
          <div>
            <div class="stat-val">${openComplaintsCount}</div>
            <div class="stat-label">Open Maintenance Tickets</div>
          </div>
        </div>
      </div>

      <!-- Hostel Blocks Overview Grid -->
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700;">Hostel Blocks Summary</h2>
          <button class="btn btn-secondary btn-sm" onclick="window.app.switchTab('rooms')">View All Rooms ${getIcon('arrow-right', 14)}</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          ${data.blocks.map(block => {
            const blockRooms = rooms.filter(r => r.blockId === block.id);
            const blockResidents = residents.filter(r => r.blockId === block.id);
            const blockBeds = blockRooms.reduce((acc, r) => acc + r.capacity, 0);
            const occPct = blockBeds > 0 ? Math.round((blockResidents.length / blockBeds) * 100) : 0;

            return `
              <div class="glass-panel" style="padding: 1.25rem; position: relative;">
                <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.75rem;">
                  <div>
                    <h3 style="font-size: 1.1rem; font-weight: 800; color: #fff;">${block.name}</h3>
                    <span class="badge ${block.gender === 'Boys' ? 'badge-info' : block.gender === 'Girls' ? 'badge-purple' : 'badge-success'}" style="margin-top: 4px;">
                      ${block.gender} Hostel
                    </span>
                  </div>
                  <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center;">
                    ${getIcon('rooms', 18)}
                  </div>
                </div>

                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; display: flex; flex-direction: column; gap: 4px;">
                  <div><strong>Warden:</strong> ${block.warden}</div>
                  <div><strong>Contact:</strong> ${block.contact}</div>
                </div>

                <!-- Progress Bar -->
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 4px;">
                    <span>Occupancy</span>
                    <span style="color: var(--accent-secondary);">${blockResidents.length} / ${blockBeds} Beds (${occPct}%)</span>
                  </div>
                  <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${occPct}%; height: 100%; background: linear-gradient(90deg, #6366f1, #06b6d4); border-radius: 4px;"></div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Recent Gate Passes & Complaints -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
        
        <!-- Gate Passes Pending -->
        <div class="glass-panel">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              ${getIcon('gatepass', 18, '#38bdf8')} Gate Pass Requests (${pendingPassesCount} Pending)
            </h3>
            <button class="btn btn-secondary btn-sm" onclick="window.app.switchTab('gatepass')">Manage Passes</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${gatePasses.slice(0, 3).map(pass => `
              <div style="padding: 0.85rem; background: rgba(15, 23, 42, 0.5); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">${pass.residentName} <span style="font-weight: 400; color: var(--text-muted);">(${pass.roomNo})</span></div>
                  <div style="font-size: 0.78rem; color: var(--accent-secondary); margin-top: 2px;">${pass.passType} • Destination: ${pass.destination}</div>
                </div>
                <div>
                  <span class="badge ${pass.status === 'Approved' ? 'badge-success' : pass.status === 'Pending' ? 'badge-warning' : 'badge-danger'}">
                    ${pass.status}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recent Maintenance Complaints -->
        <div class="glass-panel">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              ${getIcon('complaints', 18, '#fbbf24')} Maintenance Issues (${openComplaintsCount} Active)
            </h3>
            <button class="btn btn-secondary btn-sm" onclick="window.app.switchTab('complaints')">View Complaints</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${complaints.slice(0, 3).map(cmp => `
              <div style="padding: 0.85rem; background: rgba(15, 23, 42, 0.5); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">${cmp.title}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
                    Room: ${cmp.roomNo} • Category: ${cmp.category}
                  </div>
                </div>
                <div>
                  <span class="badge ${cmp.status === 'Resolved' ? 'badge-success' : cmp.status === 'In Progress' ? 'badge-info' : 'badge-warning'}">
                    ${cmp.status}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

    </div>
  `;
}
