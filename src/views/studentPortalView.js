import { store } from '../data/store.js';
import { getIcon, formatINR } from '../icons.js';

export function renderStudentPortalView() {
  const data = store.getData();
  // Default to Alex Johnson (RES-101)
  const student = data.residents.find(r => r.id === 'RES-101') || data.residents[0];
  const room = data.rooms.find(r => r.roomNo === student.roomNo);
  const feeRecord = data.fees.find(f => f.residentId === student.id);
  const studentPasses = data.gatePasses.filter(g => g.residentId === student.id);
  const studentComplaints = data.complaints.filter(c => c.residentId === student.id);

  return `
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      
      <!-- Top Banner / Persona Greeting -->
      <div class="glass-panel" style="padding: 2rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.2)); border: 1px solid var(--border-color-active);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
          
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div style="width: 72px; height: 72px; border-radius: 20px; background: ${student.avatarBg || 'var(--accent-primary)'}; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800; color: #fff; box-shadow: var(--shadow-md);">
              ${student.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div>
              <div style="display: inline-flex; align-items: center; gap: 6px; padding: 2px 10px; background: rgba(16, 185, 129, 0.2); border-radius: 12px; color: #34d399; font-size: 0.75rem; font-weight: 700; margin-bottom: 4px;">
                ${getIcon('student', 14)} Resident Student Portal View
              </div>
              <h1 style="font-size: 1.85rem; font-weight: 800; color: #fff;">Welcome back, ${student.name}!</h1>
              <p style="color: var(--text-muted); font-size: 0.95rem;">
                Roll No: <strong style="color: var(--accent-secondary);">${student.rollNo}</strong> • ${student.branch} (${student.year})
              </p>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="window.app.openModal('addPass')">
              ${getIcon('gatepass', 16)} Apply Gate Pass
            </button>
            <button class="btn btn-secondary" onclick="window.app.openModal('addComplaint')">
              ${getIcon('complaints', 16)} Raise Complaint
            </button>
          </div>

        </div>
      </div>

      <!-- Quick Status Cards -->
      <div class="stats-grid">
        <div class="glass-panel stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #6366f1, #4f46e5);">
            ${getIcon('home', 24)}
          </div>
          <div>
            <div class="stat-val">Room ${student.roomNo || 'N/A'}</div>
            <div class="stat-label">${student.blockId} • ${student.bedNo || 'Bed 1'}</div>
          </div>
        </div>

        <div class="glass-panel stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, ${feeRecord && feeRecord.balanceDue > 0 ? '#ef4444, #dc2626' : '#10b981, #059669'});">
            ${getIcon('rupee', 24)}
          </div>
          <div>
            <div class="stat-val" style="color: ${feeRecord && feeRecord.balanceDue > 0 ? '#f87171' : '#34d399'};">
              ${feeRecord ? formatINR(feeRecord.balanceDue) : '₹0'}
            </div>
            <div class="stat-label">Fee Balance Due (₹)</div>
          </div>
        </div>

        <div class="glass-panel stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">
            ${getIcon('gatepass', 24)}
          </div>
          <div>
            <div class="stat-val">${studentPasses.length}</div>
            <div class="stat-label">Gate Passes Applied</div>
          </div>
        </div>

        <div class="glass-panel stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
            ${getIcon('complaints', 24)}
          </div>
          <div>
            <div class="stat-val">${studentComplaints.length}</div>
            <div class="stat-label">Tickets Submitted</div>
          </div>
        </div>
      </div>

      <!-- Main Portal Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
        
        <!-- Digital Hostel ID Card -->
        <div class="glass-panel">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
            ${getIcon('student', 18, 'var(--accent-secondary)')} Digital Resident Identity Pass
          </h3>

          <div style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95)); border: 1px solid var(--border-color-active); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="font-size: 0.8rem; font-weight: 800; color: var(--accent-secondary); text-transform: uppercase;">
                CAMPUS HOSTEL ID
              </div>
              <span class="badge badge-success">ACTIVE RESIDENT</span>
            </div>

            <div style="display: flex; gap: 1rem; align-items: center;">
              <div style="width: 64px; height: 64px; border-radius: 16px; background: ${student.avatarBg}; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; color: white;">
                ${student.name.split(' ').map(n => n[0]).join('')}
              </div>

              <div>
                <h4 style="font-size: 1.2rem; font-weight: 800; color: #fff;">${student.name}</h4>
                <div style="font-size: 0.85rem; color: var(--accent-secondary); font-weight: 700;">${student.rollNo}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${student.branch} • ${student.year}</div>
              </div>
            </div>

            <div style="border-top: 1px dashed var(--border-color); padding-top: 0.75rem; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem;">
              <div><strong>Block & Room:</strong> ${student.blockId} (${student.roomNo})</div>
              <div><strong>Blood Group:</strong> ${student.bloodGroup}</div>
              <div><strong>Phone:</strong> ${student.phone}</div>
              <div><strong>Parent Contact:</strong> ${student.parentPhone}</div>
            </div>
          </div>
        </div>

        <!-- Student Fee Summary in Indian Rupees ₹ -->
        <div class="glass-panel">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              ${getIcon('rupee', 18, 'var(--accent-success)')} Semester Fee Statement
            </h3>
            ${feeRecord ? `
              <button class="btn btn-secondary btn-sm" onclick="window.app.openModal('printReceipt', '${feeRecord.id}')">
                ${getIcon('print', 14)} View Invoice
              </button>
            ` : ''}
          </div>

          ${feeRecord ? `
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="padding: 0.85rem; background: rgba(15, 23, 42, 0.5); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted); font-size: 0.88rem;">Hostel Room Fee:</span>
                <span style="font-weight: 700; color: #fff;">${formatINR(feeRecord.hostelFee)}</span>
              </div>
              <div style="padding: 0.85rem; background: rgba(15, 23, 42, 0.5); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted); font-size: 0.88rem;">Mess & Dining Charges:</span>
                <span style="font-weight: 700; color: #fff;">${formatINR(feeRecord.messFee)}</span>
              </div>
              <div style="padding: 0.85rem; background: rgba(15, 23, 42, 0.5); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted); font-size: 0.88rem;">Caution Deposit:</span>
                <span style="font-weight: 700; color: #fff;">${formatINR(feeRecord.cautionDeposit)}</span>
              </div>
              <div style="padding: 0.85rem; background: rgba(16, 185, 129, 0.1); border-radius: var(--radius-md); border: 1px solid rgba(16, 185, 129, 0.3); display: flex; justify-content: space-between; font-weight: 800;">
                <span style="color: #34d399;">Total Fee Paid (₹):</span>
                <span style="color: #34d399; font-size: 1.05rem;">${formatINR(feeRecord.amountPaid)}</span>
              </div>
            </div>
          ` : `
            <p style="color: var(--text-muted);">No active fee record found for current term.</p>
          `}
        </div>

      </div>

    </div>
  `;
}
