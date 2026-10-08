import { store } from '../data/store.js';
import { getIcon } from '../icons.js';

let activeSubTab = 'passes'; // 'passes' or 'visitors'

export function renderGatePassView() {
  const data = store.getData();
  const { gatePasses, visitors } = data;

  window.app.setGatePassSubTab = (tab) => {
    activeSubTab = tab;
    window.app.render();
  };

  return `
    <div style="display: flex; flex-direction: column; gap: 1.75rem;">
      
      <!-- Top Title Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #fff;">Campus Security & Gate Pass Management</h1>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Issue student outing passes, verify digital QR passes, and log visitor campus entries.</p>
        </div>

        <div style="display: flex; gap: 8px;">
          <button class="btn btn-primary" onclick="window.app.openModal('addPass')">
            ${getIcon('plus', 16)} New Gate Pass Request
          </button>
          <button class="btn btn-secondary" onclick="window.app.openModal('addVisitor')">
            ${getIcon('residents', 16)} Log Visitor Entry
          </button>
        </div>
      </div>

      <!-- Sub Tabs Toggle -->
      <div class="glass-panel" style="padding: 0.75rem 1rem;">
        <div style="display: flex; gap: 1rem;">
          <button class="btn btn-sm ${activeSubTab === 'passes' ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.setGatePassSubTab('passes')">
            ${getIcon('gatepass', 14)} Student Gate Passes (${gatePasses.length})
          </button>
          <button class="btn btn-sm ${activeSubTab === 'visitors' ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.setGatePassSubTab('visitors')">
            ${getIcon('residents', 14)} Visitor Log Entry (${visitors.length})
          </button>
        </div>
      </div>

      ${activeSubTab === 'passes' ? `
        <!-- Gate Passes Cards / Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.25rem;">
          ${gatePasses.map(pass => {
            const statusBadge = pass.status === 'Approved' ? 'badge-success' : pass.status === 'Pending' ? 'badge-warning' : 'badge-danger';

            return `
              <div class="glass-panel" style="padding: 1.35rem; display: flex; flex-direction: column; justify-content: space-between; gap: 1rem; border-top: 4px solid ${pass.status === 'Approved' ? 'var(--accent-success)' : pass.status === 'Pending' ? 'var(--accent-warning)' : 'var(--accent-danger)'};">
                
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                    <div>
                      <span style="font-family: monospace; font-weight: 700; color: var(--accent-secondary); font-size: 0.85rem;">${pass.id}</span>
                      <h3 style="font-size: 1.2rem; font-weight: 800; color: #fff; margin-top: 2px;">${pass.residentName}</h3>
                      <div style="font-size: 0.8rem; color: var(--text-muted);">Roll: ${pass.rollNo} • Room ${pass.roomNo}</div>
                    </div>
                    <span class="badge ${statusBadge}">${pass.status}</span>
                  </div>

                  <div style="background: rgba(15, 23, 42, 0.5); padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 6px; font-size: 0.82rem;">
                    <div><strong style="color: var(--text-sub);">Pass Type:</strong> ${pass.passType}</div>
                    <div><strong style="color: var(--text-sub);">Destination:</strong> ${pass.destination}</div>
                    <div><strong style="color: var(--text-sub);">Out Date:</strong> ${pass.outDate}</div>
                    <div><strong style="color: var(--text-sub);">Expected Return:</strong> ${pass.expectedInDate}</div>
                    <div><strong style="color: var(--text-sub);">Reason:</strong> ${pass.reason}</div>
                  </div>
                </div>

                <!-- Footer Actions -->
                <div style="border-top: 1px solid var(--border-color); padding-top: 0.75rem; display: flex; align-items: center; justify-content: space-between;">
                  <button class="btn btn-secondary btn-sm" onclick="window.app.openModal('viewPassQR', '${pass.id}')">
                    ${getIcon('qr', 14)} Digital Pass QR
                  </button>

                  ${pass.status === 'Pending' ? `
                    <div style="display: flex; gap: 6px;">
                      <button class="btn btn-success btn-sm" onclick="window.app.updateGatePass('${pass.id}', 'Approved')">Approve</button>
                      <button class="btn btn-danger btn-sm" onclick="window.app.updateGatePass('${pass.id}', 'Rejected')">Reject</button>
                    </div>
                  ` : `
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${pass.approvedBy || 'Warden Verified'}</span>
                  `}
                </div>

              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <!-- Visitor Log Table -->
        <div class="glass-panel" style="padding: 0; overflow: hidden;">
          <div class="table-wrapper">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Visitor Ref</th>
                  <th>Visitor Name</th>
                  <th>Visiting Student</th>
                  <th>Relation</th>
                  <th>ID Proof</th>
                  <th>Check In Time</th>
                  <th>Status</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${visitors.map(vis => `
                  <tr>
                    <td><span style="font-family: monospace; font-weight: 700; color: var(--accent-secondary);">${vis.id}</span></td>
                    <td>
                      <div style="font-weight: 700; color: #fff;">${vis.visitorName}</div>
                      <div style="font-size: 0.78rem; color: var(--text-muted);">${vis.phone}</div>
                    </td>
                    <td>
                      <div style="font-weight: 700; color: #fff;">${vis.residentName}</div>
                      <div style="font-size: 0.78rem; color: var(--text-muted);">Room ${vis.roomNo}</div>
                    </td>
                    <td>${vis.relation}</td>
                    <td><span style="font-size: 0.8rem; color: var(--text-sub);">${vis.idProof}</span></td>
                    <td><span style="font-size: 0.82rem; color: var(--text-muted);">${vis.checkInTime}</span></td>
                    <td>
                      <span class="badge ${vis.status === 'Inside Campus' ? 'badge-warning' : 'badge-success'}">
                        ${vis.status}
                      </span>
                    </td>
                    <td style="text-align: right;">
                      ${vis.status === 'Inside Campus' ? `
                        <button class="btn btn-secondary btn-sm" onclick="window.app.checkoutVisitor('${vis.id}')">
                          Mark Exit
                        </button>
                      ` : `
                        <span style="font-size: 0.75rem; color: var(--text-muted);">${vis.checkOutTime}</span>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `}

    </div>
  `;
}
