import { store } from '../data/store.js';
import { getIcon } from '../icons.js';

export function renderAllocationsView() {
  const data = store.getData();
  const { rooms, residents } = data;

  const unallocatedResidents = residents.filter(r => !r.roomNo);

  return `
    <div style="display: flex; flex-direction: column; gap: 1.75rem;">
      
      <!-- Top Title & Action -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #fff;">Interactive Bed Allocation Matrix</h1>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Visual bed map by room and block. Click available bed or room to allocate students immediately.</p>
        </div>

        <button class="btn btn-primary" onclick="window.app.openModal('allocate')">
          ${getIcon('key', 16)} Allocate Student to Room
        </button>
      </div>

      <!-- Unallocated Students Banner -->
      ${unallocatedResidents.length > 0 ? `
        <div class="glass-panel" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.15)); border: 1px solid rgba(245, 158, 11, 0.3);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 style="color: #fbbf24; font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                ${getIcon('alert-circle', 18, '#fbbf24')} ${unallocatedResidents.length} Student(s) Awaiting Room Allocation
              </h3>
              <p style="color: var(--text-sub); font-size: 0.88rem; margin-top: 2px;">
                Registered students without assigned rooms: ${unallocatedResidents.map(r => r.name).join(', ')}
              </p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.app.openModal('allocate', '${unallocatedResidents[0].id}')">
              Allocate ${unallocatedResidents[0].name}
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Visual Bed Matrix by Block -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${data.blocks.map(block => {
          const blockRooms = rooms.filter(r => r.blockId === block.id);

          return `
            <div class="glass-panel">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
                <div>
                  <h2 style="font-size: 1.25rem; font-weight: 800; color: #fff;">${block.name}</h2>
                  <div style="font-size: 0.82rem; color: var(--text-muted);">${block.gender} Hostel • Warden: ${block.warden}</div>
                </div>
                <div style="display: flex; gap: 12px; font-size: 0.8rem; font-weight: 700;">
                  <span style="display: flex; align-items: center; gap: 6px; color: #34d399;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981;"></span> Available Bed
                  </span>
                  <span style="display: flex; align-items: center; gap: 6px; color: #818cf8;">
                    <span style="width: 10px; height: 10px; border-radius: 50%; background: #6366f1;"></span> Occupied Bed
                  </span>
                </div>
              </div>

              <!-- Matrix Grid of Rooms -->
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
                ${blockRooms.map(room => {
                  const roomResidents = residents.filter(r => r.roomNo === room.roomNo);

                  return `
                    <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                        <span style="font-weight: 800; font-size: 1.05rem; color: #fff;">Room ${room.roomNo}</span>
                        <span style="font-size: 0.75rem; color: var(--accent-secondary); font-weight: 600;">${room.type}</span>
                      </div>

                      <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${Array.from({ length: room.capacity }).map((_, i) => {
                          const bedName = `Bed ${i + 1}`;
                          const resident = roomResidents.find(r => r.bedNo === bedName) || roomResidents[i];

                          if (resident) {
                            return `
                              <div style="padding: 8px 10px; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                  ${getIcon('bed', 16, '#818cf8')}
                                  <div>
                                    <div style="font-size: 0.85rem; font-weight: 700; color: #fff;">${bedName}: ${resident.name}</div>
                                    <div style="font-size: 0.72rem; color: var(--text-muted);">${resident.rollNo}</div>
                                  </div>
                                </div>
                                <button class="btn btn-secondary btn-sm" style="padding: 2px 6px; font-size: 0.7rem;" onclick="window.app.openModal('studentProfile', '${resident.id}')">View</button>
                              </div>
                            `;
                          } else {
                            return `
                              <div style="padding: 8px 10px; background: rgba(16, 185, 129, 0.1); border: 1px dashed rgba(16, 185, 129, 0.4); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between;">
                                <div style="display: flex; align-items: center; gap: 8px; color: #34d399;">
                                  ${getIcon('bed', 16, '#34d399')}
                                  <span style="font-size: 0.85rem; font-weight: 600;">${bedName}: Vacant</span>
                                </div>
                                <button class="btn btn-success btn-sm" style="padding: 2px 8px; font-size: 0.72rem;" onclick="window.app.openModal('allocateTargetRoom', '${room.roomNo}', '${block.id}', '${bedName}')">Allocate</button>
                              </div>
                            `;
                          }
                        }).join('')}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}
