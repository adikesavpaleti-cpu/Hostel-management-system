import React, { useState } from 'react';
import { 
  Utensils, 
  Calendar, 
  Coffee, 
  Sun, 
  Moon, 
  ThumbsUp, 
  AlertCircle, 
  Check, 
  PieChart
} from 'lucide-react';

export default function MessView({ data, onToggleMealOptOut, mealOptOuts }) {
  const { messMenu } = data;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const todayName = 'Thursday'; // Default highlight day
  const [activeDay, setActiveDay] = useState(todayName);

  const isOptedOut = mealOptOuts.includes(activeDay);

  const menuObj = messMenu[activeDay] || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Mess & Dining Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Weekly mess schedule menu, meal headcount predictor, and food wastage opt-out tracker.
          </p>
        </div>

        {/* Meal Opt Out Action for current user */}
        <button
          onClick={() => onToggleMealOptOut(activeDay)}
          className={`btn ${isOptedOut ? 'btn-danger' : 'btn-secondary'}`}
        >
          <Utensils size={16} />
          {isOptedOut ? `Opted Out for ${activeDay}` : `Skip Meal for ${activeDay} (Opt Out)`}
        </button>
      </div>

      {/* Day Selector Pills */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {days.map(d => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className="btn btn-secondary btn-sm"
            style={{
              background: activeDay === d ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover))' : 'rgba(255,255,255,0.05)',
              color: activeDay === d ? '#fff' : 'var(--text-muted)',
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {d} {d === todayName ? '(Today)' : ''}
          </button>
        ))}
      </div>

      {/* Mess Headcount Waste Reduction Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            <PieChart size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
              Headcount Predictor ({activeDay})
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              108 Students Dining • {mealOptOuts.length} Student Opt-Outs Registered. Food waste saved: ~14 kg.
            </p>
          </div>
        </div>

        <div className="badge badge-paid" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          Mess Rating: 4.6 / 5.0 ★
        </div>
      </div>

      {/* Menu Meals Breakdown Grid */}
      <div className="grid-4">
        
        {/* Breakfast */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
            <Sun size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Breakfast</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Timing: 07:30 AM - 09:30 AM</p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', minHeight: '90px' }}>
            {menuObj.breakfast || 'Not specified'}
          </p>
        </div>

        {/* Lunch */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8' }}>
            <Sun size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Lunch</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Timing: 12:30 PM - 02:30 PM</p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', minHeight: '90px' }}>
            {menuObj.lunch || 'Not specified'}
          </p>
        </div>

        {/* Snacks */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f472b6' }}>
            <Coffee size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Evening Snacks</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Timing: 05:00 PM - 06:00 PM</p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', minHeight: '90px' }}>
            {menuObj.snacks || 'Not specified'}
          </p>
        </div>

        {/* Dinner */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8' }}>
            <Moon size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Dinner</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Timing: 07:45 PM - 09:45 PM</p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', minHeight: '90px' }}>
            {menuObj.dinner || 'Not specified'}
          </p>
        </div>

      </div>

    </div>
  );
}
