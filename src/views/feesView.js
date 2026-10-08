import { store } from '../data/store.js';
import { getIcon, formatINR } from '../icons.js';

let statusFilter = 'ALL';

export function renderFeesView() {
  const data = store.getData();
  let fees = data.fees;

  if (statusFilter !== 'ALL') {
    fees = fees.filter(f => f.status === statusFilter);
  }

  const totalBilledINR = data.fees.reduce((acc, f) => acc + f.totalAmount, 0);
  const totalCollectedINR = data.fees.reduce((acc, f) => acc + f.amountPaid, 0);
  const totalPendingINR = data.fees.reduce((acc, f) => acc + f.balanceDue, 0);

  window.app.setFeeStatusFilter = (status) => {
    statusFilter = status;
    window.app.render();
  };

  return `
    <div style="display: flex; flex-direction: column; gap: 1.75rem;">
      
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #fff;">Hostel Fees & Payments Ledger</h1>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Track hostel room fees, mess charges, caution deposits, and collect dues in Indian Rupees (₹ INR).</p>
        </div>
      </div>

      <!-- Financial Statistics Cards (in ₹ INR) -->
      <div class="stats-grid">
        <div class="glass-panel stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #6366f1, #4f46e5);">
            ${getIcon('rupee', 24)}
          </div>
          <div>
            <div class="stat-val">${formatINR(totalBilledINR)}</div>
            <div class="stat-label">Total Fee Billed (Semester)</div>
          </div>
        </div>

        <div class="glass-panel stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
            ${getIcon('check', 24)}
          </div>
          <div>
            <div class="stat-val" style="color: #34d399;">${formatINR(totalCollectedINR)}</div>
            <div class="stat-label">Total Fee Collected (₹)</div>
          </div>
        </div>

        <div class="glass-panel stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
            ${getIcon('alert-circle', 24)}
          </div>
          <div>
            <div class="stat-val" style="color: #f87171;">${formatINR(totalPendingINR)}</div>
            <div class="stat-label">Outstanding Balance (₹)</div>
          </div>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="glass-panel" style="padding: 1rem 1.25rem;">
        <div class="filter-bar" style="margin-bottom: 0;">
          <div class="filter-group">
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
              ${getIcon('filter', 14)} Payment Status:
            </span>
            <button class="btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.setFeeStatusFilter('ALL')">All Records</button>
            <button class="btn btn-sm ${statusFilter === 'Paid' ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.setFeeStatusFilter('Paid')">Fully Paid</button>
            <button class="btn btn-sm ${statusFilter === 'Pending' ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.setFeeStatusFilter('Pending')">Pending</button>
            <button class="btn btn-sm ${statusFilter === 'Overdue' ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.setFeeStatusFilter('Overdue')">Overdue</button>
          </div>
        </div>
      </div>

      <!-- Fees Ledger Table -->
      <div class="glass-panel" style="padding: 0; overflow: hidden;">
        <div class="table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Invoice Ref</th>
                <th>Student & Room</th>
                <th>Fee Breakdown (₹)</th>
                <th>Total Billed</th>
                <th>Paid Amount</th>
                <th>Balance Due</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${fees.map(fee => {
                const statusBadge = fee.status === 'Paid' ? 'badge-success' : fee.status === 'Pending' ? 'badge-warning' : 'badge-danger';
                return `
                  <tr>
                    <td>
                      <span style="font-family: monospace; font-weight: 700; color: var(--accent-secondary); font-size: 0.85rem;">${fee.id}</span>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${fee.academicTerm}</div>
                    </td>

                    <td>
                      <div style="font-weight: 700; color: #fff;">${fee.residentName}</div>
                      <div style="font-size: 0.78rem; color: var(--text-muted);">Roll: ${fee.rollNo} • Room ${fee.roomNo}</div>
                    </td>

                    <td>
                      <div style="font-size: 0.78rem; color: var(--text-sub);">
                        Hostel: ${formatINR(fee.hostelFee)} | Mess: ${formatINR(fee.messFee)} | Deposit: ${formatINR(fee.cautionDeposit)}
                      </div>
                    </td>

                    <td>
                      <span style="font-weight: 700; color: #fff;">${formatINR(fee.totalAmount)}</span>
                    </td>

                    <td>
                      <span style="font-weight: 700; color: #34d399;">${formatINR(fee.amountPaid)}</span>
                    </td>

                    <td>
                      <span style="font-weight: 800; color: ${fee.balanceDue > 0 ? '#f87171' : 'var(--text-muted)'};">
                        ${formatINR(fee.balanceDue)}
                      </span>
                    </td>

                    <td>
                      <span class="badge ${statusBadge}">${fee.status}</span>
                    </td>

                    <td style="text-align: right;">
                      <div style="display: flex; gap: 6px; justify-content: flex-end;">
                        ${fee.balanceDue > 0 ? `
                          <button class="btn btn-success btn-sm" onclick="window.app.openModal('collectFee', '${fee.id}')">
                            Collect Payment
                          </button>
                        ` : ''}
                        <button class="btn btn-secondary btn-sm" onclick="window.app.openModal('printReceipt', '${fee.id}')">
                          ${getIcon('print', 14)} Receipt
                        </button>
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
