import React from 'react';
import { Building2, UserCheck, ShieldAlert, RotateCcw, Search, Sparkles } from 'lucide-react';

export default function Header({ persona, setPersona, searchQuery, setSearchQuery, onResetData, onQuickAction }) {
  return (
    <header className="main-header">
      <div className="brand-title">
        <div className="brand-icon-box">
          <Building2 size={24} />
        </div>
        <div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>AegisHostel</span>
          <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)', fontWeight: 500, marginTop: '-4px' }}>
            Campus Resident Management System
          </span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div style={{ flex: 1, maxW: '480px', margin: '0 2rem', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="input-field"
          style={{ paddingLeft: '2.5rem', background: 'rgba(30, 41, 59, 0.6)' }}
          placeholder="Search students, rooms (e.g. A-101), roll numbers, complaints..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Persona Switcher & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={onResetData} 
          className="btn btn-secondary btn-sm"
          title="Reset to default seed data"
        >
          <RotateCcw size={15} />
          <span>Reset Demo</span>
        </button>

        {/* Persona Toggle Pill */}
        <div style={{ background: 'rgba(30, 41, 59, 0.9)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '4px', display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setPersona('warden')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              background: persona === 'warden' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
              color: persona === 'warden' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <ShieldAlert size={14} />
            Warden / Admin
          </button>

          <button
            onClick={() => setPersona('student')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              background: persona === 'student' ? 'linear-gradient(135deg, #06b6d4, #0891b2)' : 'transparent',
              color: persona === 'student' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <UserCheck size={14} />
            Student View
          </button>
        </div>
      </div>
    </header>
  );
}
