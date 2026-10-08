import React, { useState } from 'react';
import { 
  Wrench, 
  PlusCircle, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Wifi, 
  Zap, 
  Droplet, 
  Armchair, 
  Sparkles, 
  Utensils
} from 'lucide-react';

export default function ComplaintsView({ data, onOpenRaiseModal, onUpdateComplaint }) {
  const { complaints } = data;

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusTab, setStatusTab] = useState('ALL');

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Wi-Fi & Network': return <Wifi size={16} color="#38bdf8" />;
      case 'Electrical': return <Zap size={16} color="#fbbf24" />;
      case 'Plumbing': return <Droplet size={16} color="#60a5fa" />;
      case 'Furniture': return <Armchair size={16} color="#a78bfa" />;
      case 'Mess Food': return <Utensils size={16} color="#f472b6" />;
      default: return <Wrench size={16} color="#94a3b8" />;
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
    if (statusTab === 'PENDING' && (c.status === 'Resolved' || c.status === 'Closed')) return false;
    if (statusTab === 'RESOLVED' && (c.status !== 'Resolved' && c.status !== 'Closed')) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* View Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Maintenance & Complaints Desk</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Report issues, track maintenance ticket resolutions, and assign technicians.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenRaiseModal}>
          <PlusCircle size={16} /> File New Complaint
        </button>
      </div>

      {/* Tabs & Filter Header */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'ALL', label: 'All Tickets' },
            { id: 'PENDING', label: 'Active & Pending' },
            { id: 'RESOLVED', label: 'Resolved Tickets' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              className="btn btn-secondary btn-sm"
              style={{
                background: statusTab === tab.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                color: statusTab === tab.id ? '#fff' : 'var(--text-muted)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category:</label>
          <select 
            className="input-field" 
            style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 0.8rem', fontSize: '0.85rem' }}
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="Wi-Fi & Network">Wi-Fi & Network</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Furniture">Furniture</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Mess Food">Mess Food</option>
          </select>
        </div>

      </div>

      {/* Complaint Cards Grid */}
      <div className="grid-2">
        {filteredComplaints.map(c => (
          <div key={c.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Header: Ticket ID & Priority */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>
                  {getCategoryIcon(c.category)}
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{c.id}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{c.title}</h3>
                </div>
              </div>

              <span className={`badge ${c.priority === 'High' || c.priority === 'Urgent' ? 'badge-overdue' : 'badge-pending'}`}>
                {c.priority} Priority
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.88rem', color: 'var(--text-sub)', background: 'rgba(15, 23, 42, 0.5)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              "{c.description}"
            </p>

            {/* Location & Reported Date */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Room {c.roomNo} ({c.residentName})</span>
              <span>📅 {c.reportedDate}</span>
            </div>

            {/* Status & Resolution Info */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className={`badge ${c.status === 'Resolved' ? 'badge-resolved' : c.status === 'In Progress' ? 'badge-partial' : 'badge-pending'}`}>
                  {c.status}
                </span>
                {c.assignedTo && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                    Assigned: {c.assignedTo}
                  </span>
                )}
              </div>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onUpdateComplaint(c)}
              >
                Update Ticket
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
