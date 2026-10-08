import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  KeyRound, 
  CreditCard, 
  Wrench, 
  QrCode, 
  Utensils,
  UserCircle2
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, counts, persona }) {
  const adminNavs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms', label: 'Blocks & Rooms', icon: Building2 },
    { id: 'residents', label: 'Resident Students', icon: Users, badge: counts.residents },
    { id: 'allocations', label: 'Room Allocation', icon: KeyRound },
    { id: 'fees', label: 'Fees & Dues', icon: CreditCard, badge: counts.pendingFees, badgeColor: 'warning' },
    { id: 'complaints', label: 'Complaints Desk', icon: Wrench, badge: counts.pendingComplaints, badgeColor: 'danger' },
    { id: 'gatepass', label: 'Gate Pass & Visitors', icon: QrCode, badge: counts.pendingGatePasses, badgeColor: 'info' },
    { id: 'mess', label: 'Mess & Dining', icon: Utensils }
  ];

  const studentNavs = [
    { id: 'student_portal', label: 'My Student Portal', icon: UserCircle2 },
    { id: 'rooms', label: 'Hostel Rooms Map', icon: Building2 },
    { id: 'fees', label: 'My Fee Receipts', icon: CreditCard },
    { id: 'complaints', label: 'Raise Complaint', icon: Wrench, badge: counts.pendingComplaints },
    { id: 'gatepass', label: 'Apply Gate Pass', icon: QrCode },
    { id: 'mess', label: 'Mess Menu & Rating', icon: Utensils }
  ];

  const navItems = persona === 'student' ? studentNavs : adminNavs;

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '1rem', padding: '0 0.5rem' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          {persona === 'student' ? 'Student Workspace' : 'Main Menu'}
        </span>
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
          >
            <Icon className="nav-icon" />
            <span style={{ flex: 1 }}>{item.label}</span>

            {item.badge > 0 && (
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  background: item.badgeColor === 'danger' ? 'rgba(239, 68, 68, 0.25)' :
                              item.badgeColor === 'warning' ? 'rgba(245, 158, 11, 0.25)' :
                              'rgba(99, 102, 241, 0.25)',
                  color: item.badgeColor === 'danger' ? '#f87171' :
                         item.badgeColor === 'warning' ? '#fbbf24' :
                         '#818cf8',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Warden info or Student quick badge box */}
      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <div className="glass-panel" style={{ padding: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: persona === 'warden' ? 'linear-gradient(135deg, #6366f1, #3b82f6)' : 'linear-gradient(135deg, #ec4899, #f43f5e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem',
            color: 'white'
          }}>
            {persona === 'warden' ? 'RV' : 'AJ'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {persona === 'warden' ? 'Dr. Robert Vance' : 'Alex Johnson'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {persona === 'warden' ? 'Chief Warden (Block A)' : 'Roll: 2024-CS-042 | A-204'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
