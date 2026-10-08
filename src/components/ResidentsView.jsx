import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Printer, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Bed,
  QrCode
} from 'lucide-react';

export default function ResidentsView({ data, searchQuery, onSelectResident, onOpenRegisterModal }) {
  const { residents, blocks, fees, complaints } = data;

  const [genderFilter, setGenderFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [feeStatusFilter, setFeeStatusFilter] = useState('ALL');
  const [blockFilter, setBlockFilter] = useState('ALL');

  const filteredResidents = residents.filter(res => {
    if (genderFilter !== 'ALL' && res.gender !== genderFilter) return false;
    if (yearFilter !== 'ALL' && res.year !== yearFilter) return false;
    if (feeStatusFilter !== 'ALL' && res.feeStatus !== feeStatusFilter) return false;
    if (blockFilter !== 'ALL' && res.blockId !== blockFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = res.name.toLowerCase().includes(q);
      const matchRoll = res.rollNo.toLowerCase().includes(q);
      const matchRoom = res.roomNo.toLowerCase().includes(q);
      const matchBranch = res.branch.toLowerCase().includes(q);
      if (!matchName && !matchRoll && !matchRoom && !matchBranch) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Title & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Resident Students Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Comprehensive directory of hostel residents, contact cards, fee status, and emergency contacts.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenRegisterModal}>
          <UserPlus size={16} /> Register New Resident
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Gender Filter
          </label>
          <select className="input-field" value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
            <option value="ALL">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Year of Study
          </label>
          <select className="input-field" value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            <option value="ALL">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="PG 2nd Year">PG & Scholars</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Fee Clearance Status
          </label>
          <select className="input-field" value={feeStatusFilter} onChange={e => setFeeStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="Paid">Fee Paid</option>
            <option value="Pending">Payment Pending</option>
            <option value="Overdue">Overdue Notice</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Hostel Block
          </label>
          <select className="input-field" value={blockFilter} onChange={e => setBlockFilter(e.target.value)}>
            <option value="ALL">All Blocks</option>
            {blocks.map(b => (
              <option key={b.id} value={b.id}>{b.code} ({b.name})</option>
            ))}
          </select>
        </div>

      </div>

      {/* Student Cards Grid */}
      <div className="grid-3">
        {filteredResidents.map(res => {
          const blockObj = blocks.find(b => b.id === res.blockId);

          return (
            <div 
              key={res.id} 
              className="glass-panel card-interactive"
              onClick={() => onSelectResident(res)}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: res.avatarBg || 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: 'white',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {res.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {res.name}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Roll: {res.rollNo}
                  </span>
                  <p style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', marginTop: '2px' }}>
                    {res.branch} ({res.year})
                  </p>
                </div>
              </div>

              {/* Room Location Pill */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                  <Bed size={15} color="var(--accent-primary)" />
                  <span style={{ fontWeight: 700, color: '#fff' }}>Room {res.roomNo}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({res.bedNo})</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {blockObj?.code}
                </span>
              </div>

              {/* Footer info: Fee badge & phone */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <span className={`badge ${res.feeStatus === 'Paid' ? 'badge-paid' : res.feeStatus === 'Pending' ? 'badge-pending' : 'badge-overdue'}`}>
                  Fee: {res.feeStatus}
                </span>

                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={13} /> {res.phone.slice(0, 10)}...
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
