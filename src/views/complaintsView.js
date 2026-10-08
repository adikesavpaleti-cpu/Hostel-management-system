import { store } from '../data/store.js';
import { getIcon } from '../icons.js';

let categoryFilter = 'ALL';

export function renderComplaintsView() {
  const data = store.getData();
  let complaints = data.complaints;

  if (categoryFilter !== 'ALL') {
    complaints = complaints.filter(c => c.category === categoryFilter);
  }

  window.app.setCategoryFilter = (cat) => {
    categoryFilter = cat;
    window.app.render();
  };

  const categories = ['Wi-Fi / Internet', 'Plumbing', 'Electrical', 'Furniture', 'Cleaning'];

  return `
    <div style="display: flex; flex-direction: column; gap: 1.75rem;">
      
      <!-- Top Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #fff;">Maintenance & Complaints Portal</h1>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Resident complaint tracking, repair dispatches, priority ticketing, and resolution workflow.</p>
        </div>

        <button class="btn btn-primary" onclick="window.app.openModal('addComplaint')">
          ${getIcon('plus', 16)} Raise Maintenance Ticket
        </button>
      </div>

      <!-- Categories Filter -->
      <div class="glass-panel" style="padding: 1rem 1.25rem;">
        <div class="filter-bar" style="margin-bottom: 0;">
          <div class="filter-group">
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
              ${getIcon('filter', 14)} Category:
            </span>
            <button class="btn btn-sm ${categoryFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.setCategoryFilter('ALL')">All Categories</button>
            ${categories.map(cat => `
              <button class="btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.setCategoryFilter('${cat}')">${cat}</button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Complaints List Cards -->
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${complaints.map(cmp => {
          const statusBadge = cmp.status === 'Resolved' ? 'badge-success' : cmp.status === 'In Progress' ? 'badge-info' : 'badge-warning';
          const priorityColor = cmp.priority === 'Urgent' ? 'badge-danger' : cmp.priority === 'High' ? 'badge-warning' : 'badge-purple';

          return `
            <div class="glass-panel" style="padding: 1.35rem; display: flex; flex-direction: column; gap: 1rem; border-left: 4px solid ${cmp.status === 'Resolved' ? 'var(--accent-success)' : cmp.priority === 'Urgent' ? 'var(--accent-danger)' : 'var(--accent-warning)'};">
              
              <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="font-family: monospace; font-weight: 700; color: var(--accent-secondary); font-size: 0.82rem;">${cmp.id}</span>
                    <span class="badge ${priorityColor}">${cmp.priority} Priority</span>
                    <span class="badge badge-purple">${cmp.category}</span>
                  </div>
                  <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff;">${cmp.title}</h3>
                </div>

                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="badge ${statusBadge}" style="font-size: 0.85rem; padding: 6px 12px;">${cmp.status}</span>
                </div>
              </div>

              <p style="color: var(--text-sub); font-size: 0.92rem; background: rgba(15, 23, 42, 0.4); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                ${cmp.description}
              </p>

              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; font-size: 0.82rem; color: var(--text-muted);">
                <div>
                  <strong>Resident:</strong> ${cmp.residentName} (Room ${cmp.roomNo}) • Reported on ${cmp.dateReported}
                </div>

                <div>
                  <strong>Assigned Technician:</strong> <span style="color: var(--text-main); font-weight: 600;">${cmp.assignedTo || 'Pending Dispatch'}</span>
                </div>
              </div>

              ${cmp.resolutionNotes ? `
                <div style="font-size: 0.82rem; color: #34d399; background: rgba(16, 185, 129, 0.1); padding: 6px 12px; border-radius: 6px;">
                  <strong>Resolution Note:</strong> ${cmp.resolutionNotes}
                </div>
              ` : ''}

              <!-- Warden Workflow Actions -->
              <div style="border-top: 1px solid var(--border-color); padding-top: 0.75rem; display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                ${cmp.status !== 'In Progress' && cmp.status !== 'Resolved' ? `
                  <button class="btn btn-secondary btn-sm" onclick="window.app.updateComplaint('${cmp.id}', 'In Progress', 'Technician dispatched to inspect')">
                    Mark In Progress
                  </button>
                ` : ''}

                ${cmp.status !== 'Resolved' ? `
                  <button class="btn btn-success btn-sm" onclick="window.app.resolveComplaintModal('${cmp.id}')">
                    ${getIcon('check', 14)} Resolve Ticket
                  </button>
                ` : ''}
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}
