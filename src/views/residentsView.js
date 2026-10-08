import { store } from '../data/store.js';
import { getIcon, formatINR } from '../icons.js';

export function renderResidentsView(searchQuery = '') {
  const data = store.getData();
  let residents = data.residents;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    residents = residents.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.rollNo.toLowerCase().includes(q) ||
      r.roomNo.toLowerCase().includes(q) ||
      r.branch.toLowerCase().includes(q)
    );
  }

  return `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      
      <!-- Header Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #fff;">Resident Student Registry</h1>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Directory of all admitted hostel students, room allocations, roll numbers, and contact details.</p>
        </div>

        <button class="btn btn-primary" onclick="window.app.openModal('registerStudent')">
          ${getIcon('residents', 16)} Register New Student
        </button>
      </div>

      <!-- Search & Quick Info Bar -->
      <div class="glass-panel" style="padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-main);">
          Total Registered Residents: <span style="color: var(--accent-secondary);">${residents.length}</span>
        </div>
        ${searchQuery ? `<div style="font-size: 0.85rem; color: var(--accent-warning);">Filtering by search query: "${searchQuery}"</div>` : ''}
      </div>

      <!-- Residents Table -->
      <div class="glass-panel" style="padding: 0; overflow: hidden;">
        <div class="table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Student Info</th>
                <th>Roll No</th>
                <th>Branch & Year</th>
                <th>Assigned Room</th>
                <th>Contact Info</th>
                <th>Caution Deposit</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${residents.map(res => {
                const feeRecord = data.fees.find(f => f.residentId === res.id);
                return `
                  <tr>
                    <td>
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 12px; background: ${res.avatarBg || 'var(--accent-primary)'}; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff; font-size: 1rem;">
                          ${res.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style="font-weight: 700; color: #fff;">${res.name}</div>
                          <div style="font-size: 0.78rem; color: var(--text-muted);">${res.gender} • ${res.bloodGroup || 'O+'}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style="font-family: monospace; font-size: 0.88rem; color: var(--accent-secondary); font-weight: 700;">${res.rollNo}</span>
                    </td>

                    <td>
                      <div style="font-size: 0.88rem; color: #fff; font-weight: 600;">${res.branch}</div>
                      <div style="font-size: 0.78rem; color: var(--text-muted);">${res.year}</div>
                    </td>

                    <td>
                      ${res.roomNo ? `
                        <div style="font-weight: 700; color: var(--accent-success);">${res.roomNo} <span style="font-weight: 400; color: var(--text-muted);">(${res.bedNo || 'Bed 1'})</span></div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Since ${res.checkInDate || '2023-08-01'}</div>
                      ` : `
                        <span class="badge badge-warning">Unassigned</span>
                      `}
                    </td>

                    <td>
                      <div style="font-size: 0.82rem; color: #fff;">${res.phone}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">Parent: ${res.parentPhone || 'N/A'}</div>
                    </td>

                    <td>
                      <span class="badge ${res.cautionDepositPaid ? 'badge-success' : 'badge-danger'}">
                        ${formatINR(res.cautionDepositAmount || 5000)} ${res.cautionDepositPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>

                    <td style="text-align: right;">
                      <div style="display: flex; gap: 6px; justify-content: flex-end;">
                        <button class="btn btn-secondary btn-sm" onclick="window.app.openModal('studentProfile', '${res.id}')">
                          Profile
                        </button>
                        ${res.roomNo ? `
                          <button class="btn btn-danger btn-sm" onclick="window.app.vacateResident('${res.id}')">
                            Vacate
                          </button>
                        ` : `
                          <button class="btn btn-primary btn-sm" onclick="window.app.openModal('allocate', '${res.id}')">
                            Allocate
                          </button>
                        `}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}
