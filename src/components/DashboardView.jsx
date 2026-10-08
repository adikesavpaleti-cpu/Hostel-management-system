import React from 'react';
import { 
  Building2, 
  Users, 
  Bed, 
  CreditCard, 
  Wrench, 
  QrCode, 
  ArrowUpRight, 
  ShieldCheck, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  KeyRound,
  UserPlus,
  PlusCircle
} from 'lucide-react';

export default function DashboardView({ data, setActiveTab, onOpenModal }) {
  const { blocks, rooms, residents, complaints, fees, gatePasses } = data;

  // Compute metrics
  const totalBeds = blocks.reduce((acc, b) => acc + b.totalBeds, 0);
  const occupiedBeds = residents.filter(r => r.status === 'Active').length;
  const occupancyPct = Math.round((occupiedBeds / totalBeds) * 100) || 0;
  const vacantBeds = totalBeds - occupiedBeds;

  const totalUnpaidAmount = fees
    .filter(f => f.status !== 'Paid')
    .reduce((acc, f) => acc + (f.balanceDue || (f.totalAmount - f.amountPaid)), 0);

  const pendingComplaintsCount = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const pendingGatePassCount = gatePasses.filter(g => g.status === 'Pending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Banner / Welcome */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '2rem', 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.15))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '20px', color: '#818cf8', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <ShieldCheck size={14} /> Campus Resident Operations Center
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            Hostel Management Overview
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Managing 4 Hostel Blocks, {totalBeds} Total Capacity Beds across {rooms.length} Rooms.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => onOpenModal('allocate')}>
            <KeyRound size={16} /> Quick Allocate Room
          </button>
          <button className="btn btn-secondary" onClick={() => onOpenModal('registerStudent')}>
            <UserPlus size={16} /> Register Resident
          </button>
          <button className="btn btn-secondary" onClick={() => onOpenModal('addComplaint')}>
            <PlusCircle size={16} /> Report Complaint
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-4">
        
        {/* Occupancy Card */}
        <div className="glass-panel card-interactive" onClick={() => setActiveTab('rooms')} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Occupancy Rate
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: '#fff' }}>
                {occupancyPct}%
              </h2>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Bed size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: '#34d399', fontWeight: 700 }}>{occupiedBeds} Beds Occupied</span>
            <span style={{ color: 'var(--text-muted)' }}>{vacantBeds} Vacant</span>
          </div>
          {/* Progress bar */}
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${occupancyPct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }}></div>
          </div>
        </div>

        {/* Total Residents Card */}
        <div className="glass-panel card-interactive" onClick={() => setActiveTab('residents')} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Active Residents
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: '#fff' }}>
                {residents.length}
              </h2>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <Users size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={14} color="#34d399" />
            <span>100% Student Profiles Verified</span>
          </div>
        </div>

        {/* Pending Dues Card */}
        <div className="glass-panel card-interactive" onClick={() => setActiveTab('fees')} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Pending Fee Dues
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: '#fbbf24' }}>
                ${totalUnpaidAmount.toLocaleString()}
              </h2>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <CreditCard size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>
              {fees.filter(f => f.status !== 'Paid').length} Unpaid Records
            </span>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              Review <ArrowUpRight size={14} />
            </span>
          </div>
        </div>

        {/* Complaints Desk Card */}
        <div className="glass-panel card-interactive" onClick={() => setActiveTab('complaints')} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Open Maintenance
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: pendingComplaintsCount > 0 ? '#f87171' : '#34d399' }}>
                {pendingComplaintsCount}
              </h2>
            </div>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
              <Wrench size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: pendingComplaintsCount > 0 ? '#f87171' : '#34d399', fontWeight: 700 }}>
              {complaints.filter(c => c.priority === 'High' || c.priority === 'Urgent').length} High Priority
            </span>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              Manage <ArrowUpRight size={14} />
            </span>
          </div>
        </div>

      </div>

      {/* Block Occupancy Breakdown Section */}
      <div className="grid-2">
        
        {/* Hostel Blocks Breakdown */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} color="var(--accent-primary)" />
              Hostel Blocks Occupancy Status
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('rooms')}>
              View Room Map
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {blocks.map(block => {
              const blockResidents = residents.filter(r => r.blockId === block.id);
              const bOccupancyPct = Math.round((blockResidents.length / block.totalBeds) * 100);
              const bVacant = block.totalBeds - blockResidents.length;

              return (
                <div key={block.id} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
                        {block.code} - {block.name}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                        ({block.type})
                      </span>
                    </div>
                    <span className="badge badge-occupied">
                      {bOccupancyPct}% Occupied
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    <span>Warden: {block.warden}</span>
                    <span style={{ color: bVacant > 0 ? '#34d399' : 'var(--text-muted)', fontWeight: 600 }}>
                      {bVacant} Beds Available
                    </span>
                  </div>

                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${bOccupancyPct}%`, height: '100%', background: block.accentColor || 'var(--accent-primary)' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Pending Items & Action Log */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Pending Gate Passes Notice */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <QrCode size={18} color="var(--accent-secondary)" />
                Outing & Gate Pass Approvals
              </h3>
              <span className="badge badge-partial">{pendingGatePassCount} Pending</span>
            </div>

            {gatePasses.filter(g => g.status === 'Pending').length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px' }}>
                No pending gate pass requests.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {gatePasses.filter(g => g.status === 'Pending').map(gp => (
                  <div key={gp.id} style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.88rem', fontWeight: 700 }}>{gp.residentName} ({gp.roomNo})</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{gp.type}: {gp.destination}</p>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('gatepass')}>
                      Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Complaints Stream */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wrench size={18} color="var(--accent-warning)" />
              Recent Maintenance Requests
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {complaints.slice(0, 3).map(c => (
                <div key={c.id} style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`badge ${c.status === 'Resolved' ? 'badge-resolved' : c.priority === 'High' ? 'badge-overdue' : 'badge-pending'}`}>
                        {c.priority} Priority
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{c.title}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                      Room {c.roomNo} • {c.category}
                    </span>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('complaints')}>
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
