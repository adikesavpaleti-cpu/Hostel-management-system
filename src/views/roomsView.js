import { store } from '../data/store.js';
import { getIcon, formatINR } from '../icons.js';

let selectedBlock = 'ALL';
let selectedStatus = 'ALL';
let selectedType = 'ALL';

export function renderRoomsView() {
  const data = store.getData();
  let rooms = data.rooms;

  // Filter application
  if (selectedBlock !== 'ALL') {
    rooms = rooms.filter(r => r.blockId === selectedBlock);
  }
  if (selectedStatus !== 'ALL') {
    rooms = rooms.filter(r => r.status === selectedStatus);
  }
  if (selectedType !== 'ALL') {
    rooms = rooms.filter(r => r.type === selectedType);
  }

  // Bind filter handlers to global window.app
  window.app.setRoomBlockFilter = (block) => { selectedBlock = block; window.app.render(); };
  window.app.setRoomStatusFilter = (status) => { selectedStatus = status; window.app.render(); };
  window.app.setRoomTypeFilter = (type) => { selectedType = type; window.app.render(); };

  return `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      
      <!-- Top Title & Filter Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #fff;">Hostel Blocks & Room Directory</h1>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Browse room capacities, bed availability, amenities, and fee rates per semester (₹ INR).</p>
        </div>

        <button class="btn btn-primary" onclick="window.app.openModal('allocate')">
          ${getIcon('key', 16)} Allocate Student to Room
        </button>
      </div>

      <!-- Filter Controls -->
      <div class="glass-panel" style="padding: 1rem 1.25rem;">
        <div class="filter-bar" style="margin-bottom: 0;">
          <div class="filter-group">
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
              ${getIcon('filter', 14)} Block:
            </span>
            <button class="btn btn-sm ${selectedBlock === 'ALL' ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.setRoomBlockFilter('ALL')">All Blocks</button>
            ${data.blocks.map(b => `
              <button class="btn btn-sm ${selectedBlock === b.id ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.setRoomBlockFilter('${b.id}')">${b.name.split('-')[0].trim()}</button>
            `).join('')}
          </div>

          <div class="filter-group">
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">Status:</span>
            <select class="form-control" style="width: auto; padding: 0.35rem 0.75rem; font-size: 0.82rem;" onchange="window.app.setRoomStatusFilter(this.value)">
              <option value="ALL" ${selectedStatus === 'ALL' ? 'selected' : ''}>All Statuses</option>
              <option value="Occupied" ${selectedStatus === 'Occupied' ? 'selected' : ''}>Occupied</option>
              <option value="Partial" ${selectedStatus === 'Partial' ? 'selected' : ''}>Partial</option>
              <option value="Vacant" ${selectedStatus === 'Vacant' ? 'selected' : ''}>Vacant</option>
              <option value="Under Maintenance" ${selectedStatus === 'Under Maintenance' ? 'selected' : ''}>Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Room Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem;">
        ${rooms.map(room => {
          const roomResidents = data.residents.filter(r => r.roomNo === room.roomNo);
          const occupiedCount = roomResidents.length;
          const statusBadge = room.status === 'Occupied' ? 'badge-danger' : room.status === 'Partial' ? 'badge-warning' : room.status === 'Vacant' ? 'badge-success' : 'badge-purple';

          return `
            <div class="glass-panel" style="padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; gap: 1rem; border-top: 4px solid ${room.status === 'Occupied' ? 'var(--accent-danger)' : room.status === 'Partial' ? 'var(--accent-warning)' : 'var(--accent-success)'};">
              
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                  <h3 style="font-size: 1.3rem; font-weight: 800; color: #fff;">Room ${room.roomNo}</h3>
                  <span class="badge ${statusBadge}">${room.status}</span>
                </div>

                <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--accent-secondary); font-weight: 600; margin-bottom: 0.75rem;">
                  <span>${room.blockId}</span> • <span>${room.floor} Floor</span> • <span>${room.type}</span>
                </div>

                <!-- Price in Indian Rupees ₹ -->
                <div style="padding: 8px 12px; background: rgba(15, 23, 42, 0.6); border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem;">
                  <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Semester Fee:</span>
                  <span style="font-size: 1.05rem; font-weight: 800; color: var(--accent-success);">${formatINR(room.feePerSemester)}</span>
                </div>

                <!-- Bed Occupancy Pills -->
                <div style="margin-bottom: 0.85rem;">
                  <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">
                    Bed Occupancy (${occupiedCount} / ${room.capacity})
                  </div>
                  <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    ${Array.from({ length: room.capacity }).map((_, i) => {
                      const res = roomResidents[i];
                      return `
                        <div style="padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; background: ${res ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)'}; color: ${res ? '#a5b4fc' : 'var(--text-muted)'}; border: 1px solid ${res ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.1)'};">
                          Bed ${i + 1}: ${res ? res.name : 'Available'}
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <!-- Amenities Tags -->
                <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                  ${room.amenities.map(a => `
                    <span style="font-size: 0.7rem; padding: 2px 6px; background: rgba(255,255,255,0.05); border-radius: 4px; color: var(--text-sub);">
                      ${a}
                    </span>
                  `).join('')}
                </div>
              </div>

              <!-- Card Footer Action -->
              <div style="border-top: 1px solid var(--border-color); padding-top: 0.75rem; display: flex; justify-content: flex-end;">
                <button class="btn btn-secondary btn-sm" onclick="window.app.openModal('roomDetails', '${room.roomNo}')">
                  View Room Details
                </button>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}
