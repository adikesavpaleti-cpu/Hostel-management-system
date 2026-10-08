import { store } from '../data/store.js';
import { getIcon } from '../icons.js';

let activeDay = 'Monday';

export function renderMessView() {
  const data = store.getData();
  const { messMenu } = data;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const activeSchedule = messMenu.schedule.find(s => s.day === activeDay) || messMenu.schedule[0];

  window.app.setMessDay = (day) => {
    activeDay = day;
    window.app.render();
  };

  return `
    <div style="display: flex; flex-direction: column; gap: 1.75rem;">
      
      <!-- Top Title -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #fff;">Hostel Dining & Mess Schedule</h1>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Weekly 7-day meal menu schedule, special festival menu notices, and dining feedback.</p>
        </div>
      </div>

      <!-- Special Notice Banner -->
      ${messMenu.specialNotice ? `
        <div class="glass-panel" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.15)); border: 1px solid rgba(139, 92, 246, 0.4);">
          <div style="font-weight: 700; font-size: 1.05rem; color: #c084fc; display: flex; align-items: center; gap: 8px;">
            ${getIcon('mess', 20, '#c084fc')} Notice: ${messMenu.specialNotice}
          </div>
        </div>
      ` : ''}

      <!-- Days Tabs Bar -->
      <div class="glass-panel" style="padding: 0.85rem 1rem;">
        <div style="display: flex; gap: 0.5rem; overflow-x: auto;">
          ${days.map(day => `
            <button class="btn btn-sm ${activeDay === day ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.setMessDay('${day}')" style="min-width: 100px; justify-content: center;">
              ${day}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Meals Cards Breakdown for Selected Day -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
        
        <!-- Breakfast -->
        <div class="glass-panel" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; border-top: 4px solid var(--accent-secondary);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 1.2rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
              ${getIcon('mess', 18, 'var(--accent-secondary)')} Breakfast
            </h3>
            <span style="font-size: 0.78rem; color: var(--accent-secondary); font-weight: 700;">07:30 AM - 09:30 AM</span>
          </div>

          <p style="color: var(--text-main); font-size: 0.95rem; line-height: 1.6; background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            ${activeSchedule.breakfast}
          </p>
        </div>

        <!-- Lunch -->
        <div class="glass-panel" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; border-top: 4px solid var(--accent-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 1.2rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
              ${getIcon('mess', 18, 'var(--accent-primary)')} Lunch
            </h3>
            <span style="font-size: 0.78rem; color: var(--accent-primary); font-weight: 700;">12:30 PM - 02:30 PM</span>
          </div>

          <p style="color: var(--text-main); font-size: 0.95rem; line-height: 1.6; background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            ${activeSchedule.lunch}
          </p>
        </div>

        <!-- Evening Snacks -->
        <div class="glass-panel" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; border-top: 4px solid var(--accent-warning);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 1.2rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
              ${getIcon('mess', 18, 'var(--accent-warning)')} Snacks
            </h3>
            <span style="font-size: 0.78rem; color: var(--accent-warning); font-weight: 700;">05:00 PM - 06:15 PM</span>
          </div>

          <p style="color: var(--text-main); font-size: 0.95rem; line-height: 1.6; background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            ${activeSchedule.snacks}
          </p>
        </div>

        <!-- Dinner -->
        <div class="glass-panel" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; border-top: 4px solid var(--accent-purple);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 1.2rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
              ${getIcon('mess', 18, 'var(--accent-purple)')} Dinner
            </h3>
            <span style="font-size: 0.78rem; color: var(--accent-purple); font-weight: 700;">07:30 PM - 09:30 PM</span>
          </div>

          <p style="color: var(--text-main); font-size: 0.95rem; line-height: 1.6; background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            ${activeSchedule.dinner}
          </p>
        </div>

      </div>

    </div>
  `;
}
