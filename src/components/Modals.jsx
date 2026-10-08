import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Building2, 
  UserCheck, 
  Bed, 
  Phone, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  QrCode, 
  Wrench,
  AlertTriangle,
  FileText
} from 'lucide-react';

/* ============================================================
   1. ROOM DETAILS MODAL
   ============================================================ */
export function RoomDetailsModal({ room, block, residents, onClose, onOpenAllocate, onToggleMaintenance }) {
  if (!room) return null;
  const roomResidents = residents.filter(r => r.roomNo === room.roomNo);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Room {room.roomNo} Management</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {block?.name} ({block?.code}) • Floor {room.floor}
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Status & Specs */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Room Type</span>
              <p style={{ fontWeight: 700, color: '#fff' }}>{room.type}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Capacity</span>
              <p style={{ fontWeight: 700, color: '#fff' }}>{roomResidents.length} / {room.capacity} Beds</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Semester Rent</span>
              <p style={{ fontWeight: 700, color: '#38bdf8' }}>${room.rent}</p>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>Included Amenities</h4>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {room.amenities.map((am, i) => (
                <span key={i} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                  ✓ {am}
                </span>
              ))}
            </div>
          </div>

          {/* Assigned Residents */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              Occupying Resident Students ({roomResidents.length})
            </h4>
            {roomResidents.length === 0 ? (
              <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px', fontSize: '0.85rem' }}>
                This room is currently vacant. No students assigned.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {roomResidents.map(res => (
                  <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: res.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>
                        {res.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{res.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Roll: {res.rollNo} • {res.bedNo}</p>
                      </div>
                    </div>
                    <span className={`badge ${res.feeStatus === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>
                      {res.feeStatus}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            {roomResidents.length < room.capacity && (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { onClose(); onOpenAllocate(room); }}>
                Allocate Vacant Bed
              </button>
            )}
            <button 
              className={`btn ${room.status === 'Maintenance' ? 'btn-secondary' : 'btn-danger'}`}
              onClick={() => onToggleMaintenance(room.id)}
            >
              {room.status === 'Maintenance' ? 'Mark Operational' : 'Mark Maintenance'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ============================================================
   2. STUDENT PROFILE & DIGITAL ID BADGE MODAL
   ============================================================ */
export function StudentProfileModal({ resident, block, fee, onClose }) {
  if (!resident) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Resident Student Profile</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Printable ID Badge */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))', border: '1px solid var(--border-color-active)', borderRadius: '16px', position: 'relative' }}>
          
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: resident.avatarBg || 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'white',
              boxShadow: 'var(--shadow-md)'
            }}>
              {resident.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>{resident.name}</h3>
              <p style={{ color: 'var(--accent-secondary)', fontWeight: 700, fontSize: '0.88rem' }}>
                Roll No: {resident.rollNo}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {resident.branch} • {resident.year}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', gridTemplateColumns: 'repeat(2, 1fr)', display: 'grid', gap: '0.85rem', background: 'rgba(15, 23, 42, 0.7)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Hostel Block & Room</span>
              <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{block?.code} — Room {resident.roomNo} ({resident.bedNo})</p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Fee Clearance</span>
              <span className={`badge ${resident.feeStatus === 'Paid' ? 'badge-paid' : 'badge-pending'}`} style={{ marginTop: '2px' }}>
                {resident.feeStatus}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Student Phone</span>
              <p style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>{resident.phone}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Guardian Emergency Contact</span>
              <p style={{ fontWeight: 600, color: '#fbbf24', fontSize: '0.85rem' }}>{resident.guardianName} ({resident.guardianPhone})</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-success)', fontSize: '0.8rem', fontWeight: 700 }}>
              <ShieldCheck size={16} /> Official AegisHostel Resident
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
              <Printer size={14} /> Print Student Pass
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ============================================================
   3. REGISTER RESIDENT MODAL
   ============================================================ */
export function RegisterStudentModal({ blocks, rooms, onClose, onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    gender: 'Male',
    branch: 'Computer Science & Eng.',
    year: '1st Year',
    phone: '',
    guardianName: '',
    guardianPhone: '',
    blockId: blocks[0]?.id || '',
    roomNo: '',
    bedNo: 'Bed 1'
  });

  const availableRooms = rooms.filter(r => r.blockId === formData.blockId && r.status !== 'Occupied');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Register New Resident Student</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-2">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name *</label>
              <input type="text" className="input-field" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. John Doe" />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Roll Number *</label>
              <input type="text" className="input-field" required value={formData.rollNo} onChange={e => setFormData({ ...formData, rollNo: e.target.value })} placeholder="2026-CS-099" />
            </div>
          </div>

          <div className="grid-3">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Gender</label>
              <select className="input-field" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Branch / Major</label>
              <input type="text" className="input-field" value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Year of Study</label>
              <select className="input-field" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })}>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="PG 2nd Year">PG / Scholar</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Student Phone *</label>
              <input type="tel" className="input-field" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Guardian Contact Name & Phone *</label>
              <input type="text" className="input-field" required value={formData.guardianName} onChange={e => setFormData({ ...formData, guardianName: e.target.value })} placeholder="Guardian Name & Phone" />
            </div>
          </div>

          <div className="grid-3">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Select Hostel Block</label>
              <select className="input-field" value={formData.blockId} onChange={e => setFormData({ ...formData, blockId: e.target.value })}>
                {blocks.map(b => (
                  <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Assign Room</label>
              <select className="input-field" value={formData.roomNo} onChange={e => setFormData({ ...formData, roomNo: e.target.value })} required>
                <option value="">-- Choose Room --</option>
                {availableRooms.map(r => (
                  <option key={r.id} value={r.roomNo}>Room {r.roomNo} ({r.type})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Bed Slot</label>
              <select className="input-field" value={formData.bedNo} onChange={e => setFormData({ ...formData, bedNo: e.target.value })}>
                <option value="Bed 1">Bed 1</option>
                <option value="Bed 2">Bed 2</option>
                <option value="Bed 3">Bed 3</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', marginTop: '1rem' }}>
            Complete Student Registration & Allocation
          </button>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   4. PRINT OFFICIAL RECEIPT MODAL
   ============================================================ */
export function PrintReceiptModal({ receipt, onClose }) {
  if (!receipt) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', background: '#fff', color: '#0f172a' }}>
        
        {/* Printable Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4f46e5', textTransform: 'uppercase' }}>AEGIS HOSTEL RESIDENCE</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Official Hostel Rent & Mess Fee Tax Receipt</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{receipt.id}</span>
            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Date: {receipt.paymentDate || '2026-10-08'}</p>
          </div>
        </div>

        {/* Student & Room Meta */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Student Name</span>
            <p style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{receipt.residentName}</p>
            <p style={{ fontSize: '0.8rem', color: '#475569' }}>Roll No: {receipt.rollNo}</p>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Hostel Room</span>
            <p style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Room {receipt.roomNo}</p>
            <p style={{ fontSize: '0.8rem', color: '#475569' }}>Term: {receipt.term}</p>
          </div>
        </div>

        {/* Items Breakdown Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#e2e8f0', color: '#334155' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Item Description</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px 12px' }}>Semester Room Rent ({receipt.roomNo})</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>${receipt.roomRent}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px 12px' }}>Mess & Dining Food Charges</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>${receipt.messFee}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px 12px' }}>High-Speed Wi-Fi & Maintenance</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>${receipt.wifiFee || 100}</td>
            </tr>
            <tr style={{ borderBottom: '2px solid #0f172a', fontWeight: 800 }}>
              <td style={{ padding: '12px 12px', fontSize: '1rem' }}>Total Amount Paid</td>
              <td style={{ padding: '12px 12px', textAlign: 'right', fontSize: '1.1rem', color: '#16a34a' }}>${receipt.amountPaid}</td>
            </tr>
          </tbody>
        </table>

        {/* Footer controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }} className="no-print">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={16} /> Print Official Receipt
          </button>
        </div>

      </div>
    </div>
  );
}

/* ============================================================
   5. RAISE COMPLAINT MODAL
   ============================================================ */
export function RaiseComplaintModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    residentName: 'Alex Johnson',
    roomNo: 'A-204',
    category: 'Wi-Fi & Network',
    priority: 'Medium',
    title: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>File Maintenance Ticket</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-2">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Resident & Room</label>
              <input type="text" className="input-field" value={`${formData.residentName} (Room ${formData.roomNo})`} disabled />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category</label>
              <select className="input-field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                <option value="Wi-Fi & Network">Wi-Fi & Network</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Furniture">Furniture</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Mess Food">Mess Food</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Priority Level</label>
            <select className="input-field" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Urgent">Urgent (Immediate attention)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Issue Title *</label>
            <input type="text" className="input-field" required placeholder="e.g. AC leaking water onto desk" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Detailed Description *</label>
            <textarea className="input-field" rows={4} required placeholder="Describe what is broken or needs repair..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
            Submit Maintenance Ticket
          </button>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   6. REQUEST GATE PASS MODAL
   ============================================================ */
export function RequestGatePassModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    residentName: 'Alex Johnson',
    rollNo: '2024-CS-042',
    roomNo: 'A-204',
    type: 'Night Out',
    destination: 'Home Visit',
    departureDate: new Date().toISOString().slice(0, 16),
    expectedReturnDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
    purpose: 'Weekend family visit'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Apply Outing / Night Gate Pass</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-2">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Pass Type</label>
              <select className="input-field" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                <option value="Day Outing">Day Outing</option>
                <option value="Night Out">Night Out</option>
                <option value="Home Visit">Home Visit</option>
                <option value="Emergency Leave">Emergency Leave</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Destination City / Address *</label>
              <input type="text" className="input-field" required value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Departure Time</label>
              <input type="datetime-local" className="input-field" value={formData.departureDate} onChange={e => setFormData({ ...formData, departureDate: e.target.value })} required />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Expected Return Time</label>
              <input type="datetime-local" className="input-field" value={formData.expectedReturnDate} onChange={e => setFormData({ ...formData, expectedReturnDate: e.target.value })} required />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Reason / Purpose *</label>
            <input type="text" className="input-field" required value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} placeholder="State purpose for warden approval..." />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
            Submit Gate Pass for Warden Approval
          </button>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   7. REGISTER VISITOR MODAL
   ============================================================ */
export function RegisterVisitorModal({ residents, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorPhone: '',
    relation: 'Parent',
    residentId: residents[0]?.id || '',
    gateNo: 'Gate 1 (Main Security)',
    purpose: 'Visiting student'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const resObj = residents.find(r => r.id === formData.residentId);
    onSubmit({
      ...formData,
      residentName: resObj?.name || 'Resident',
      roomNo: resObj?.roomNo || 'N/A'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Security Gate Visitor Logging</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-2">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Visitor Full Name *</label>
              <input type="text" className="input-field" required value={formData.visitorName} onChange={e => setFormData({ ...formData, visitorName: e.target.value })} placeholder="e.g. Mark Johnson" />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Visitor Phone Number *</label>
              <input type="tel" className="input-field" required value={formData.visitorPhone} onChange={e => setFormData({ ...formData, visitorPhone: e.target.value })} placeholder="+1 (555) 000-0000" />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Relationship</label>
              <select className="input-field" value={formData.relation} onChange={e => setFormData({ ...formData, relation: e.target.value })}>
                <option value="Parent">Parent / Guardian</option>
                <option value="Sibling">Sibling</option>
                <option value="Relative">Relative</option>
                <option value="Friend">Friend</option>
                <option value="Vendor / Delivery">Vendor / Delivery</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Resident Student Visited</label>
              <select className="input-field" value={formData.residentId} onChange={e => setFormData({ ...formData, residentId: e.target.value })}>
                {residents.map(r => (
                  <option key={r.id} value={r.id}>{r.name} (Room {r.roomNo})</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
            Record Security Gate Log Entry
          </button>
        </form>
      </div>
    </div>
  );
}
