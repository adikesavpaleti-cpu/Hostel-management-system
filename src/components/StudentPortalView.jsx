import React from 'react';
import { 
  UserCircle2, 
  Bed, 
  CreditCard, 
  Wrench, 
  QrCode, 
  Utensils, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  PlusCircle, 
  ArrowRight,
  Wind,
  Wifi
} from 'lucide-react';

export default function StudentPortalView({ data, onOpenModal, onSelectReceipt, onToggleMealOptOut, mealOptOuts }) {
  const { residents, rooms, blocks, fees, complaints, gatePasses, messMenu } = data;

  // Currently logged in demo student: Alex Johnson (RES-1001)
  const currentStudent = residents.find(r => r.id === 'RES-1001') || residents[0];
  const currentRoom = rooms.find(r => r.roomNo === currentStudent?.roomNo);
  const currentBlock = blocks.find(b => b.id === currentStudent?.blockId);
  const studentFee = fees.find(f => f.residentId === currentStudent?.id);
  const studentComplaints = complaints.filter(c => c.residentId === currentStudent?.id);
  const studentGatePasses = gatePasses.filter(g => g.residentId === currentStudent?.id);

  const roommates = residents.filter(r => r.roomNo === currentStudent?.roomNo && r.id !== currentStudent?.id);

  const todayMenu = messMenu['Thursday'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Student Welcome Header Banner */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '2rem', 
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.15))', 
          border: '1px solid rgba(6, 182, 212, 0.3)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: currentStudent?.avatarBg || 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: 'white',
            boxShadow: 'var(--shadow-glow)'
          }}>
            {currentStudent?.name.split(' ').map(n => n[0]).join('')}
          </div>

          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'rgba(6, 182, 212, 0.2)', borderRadius: '20px', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>
              <ShieldCheck size={14} /> Verified Campus Resident
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
              Welcome, {currentStudent?.name}!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {currentStudent?.branch} • {currentStudent?.year} • Roll No: {currentStudent?.rollNo}
            </p>
          </div>
        </div>

        {/* Room badge */}
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Allocated Room
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
            {currentStudent?.roomNo} ({currentStudent?.bedNo})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
            {currentBlock?.name} • Floor {currentRoom?.floor}
          </span>
        </div>
      </div>

      {/* Grid Section: My Room & Roommate vs Fee Dues */}
      <div className="grid-2">
        
        {/* Room & Roommates Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bed color="var(--accent-primary)" size={20} /> My Room & Roommates
          </h3>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Room Type:</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>{currentRoom?.type} ({currentRoom?.isAC ? 'Air Conditioned' : 'Non-AC'})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Warden:</span>
              <span style={{ fontWeight: 600 }}>{currentBlock?.warden} ({currentBlock?.wardenContact})</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
              Roommates
            </h4>
            {roommates.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Single occupant room.</p>
            ) : (
              roommates.map(rm => (
                <div key={rm.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: rm.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                    {rm.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{rm.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rm.branch} • {rm.bedNo}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Fee Clearance Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard color="#34d399" size={20} /> Semester Fee Clearance
            </h3>
            <span className={`badge ${studentFee?.status === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>
              {studentFee?.status}
            </span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Total Semester Fee:</span>
              <span style={{ fontWeight: 800, color: '#fff' }}>${studentFee?.totalAmount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Amount Paid:</span>
              <span style={{ fontWeight: 800, color: '#34d399' }}>${studentFee?.amountPaid}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Balance Due:</span>
              <span style={{ fontWeight: 800, color: studentFee?.balanceDue > 0 ? '#fbbf24' : 'var(--text-muted)' }}>${studentFee?.balanceDue}</span>
            </div>
          </div>

          {studentFee && (
            <button className="btn btn-secondary" onClick={() => onSelectReceipt(studentFee)}>
              <Printer size={16} /> View & Print Payment Receipt
            </button>
          )}
        </div>

      </div>

      {/* Grid Section: My Gate Passes vs My Complaints */}
      <div className="grid-2">
        
        {/* Outing Gate Passes */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <QrCode color="var(--accent-secondary)" size={18} /> Outing & Night Gate Passes
            </h3>
            <button className="btn btn-primary btn-sm" onClick={() => onOpenModal('addPass')}>
              <PlusCircle size={14} /> Apply Gate Pass
            </button>
          </div>

          {studentGatePasses.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No active gate passes requested.</p>
          ) : (
            studentGatePasses.map(gp => (
              <div key={gp.id} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{gp.type}: {gp.destination}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Return by: {gp.expectedReturnDate}</p>
                </div>
                <span className={`badge ${gp.status === 'Approved' ? 'badge-approved' : 'badge-pending'}`}>
                  {gp.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* My Reported Complaints */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wrench color="#fbbf24" size={18} /> My Reported Tickets
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => onOpenModal('addComplaint')}>
              <PlusCircle size={14} /> Raise Complaint
            </button>
          </div>

          {studentComplaints.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No maintenance tickets reported.</p>
          ) : (
            studentComplaints.map(c => (
              <div key={c.id} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{c.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.category} • {c.reportedDate}</p>
                </div>
                <span className={`badge ${c.status === 'Resolved' ? 'badge-resolved' : 'badge-partial'}`}>
                  {c.status}
                </span>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
