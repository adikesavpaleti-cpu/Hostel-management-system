import React, { useState } from 'react';
import { 
  KeyRound, 
  Building2, 
  Bed, 
  UserCheck, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CreditCard
} from 'lucide-react';

export default function AllocationsView({ data, onAllocateRoom, onToast }) {
  const { blocks, rooms, residents } = data;

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedBlockId, setSelectedBlockId] = useState(blocks[0]?.id || '');
  const [selectedRoomNo, setSelectedRoomNo] = useState('');
  const [bedNo, setBedNo] = useState('Bed 1');
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [cautionPaid, setCautionPaid] = useState(true);

  // Available vacant/partial rooms in selected block
  const availableRoomsInBlock = rooms.filter(r => 
    r.blockId === selectedBlockId && 
    (r.status === 'Vacant' || r.status === 'Partial')
  );

  const selectedRoomObj = rooms.find(r => r.roomNo === selectedRoomNo);

  const handleSubmitAllocation = (e) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedRoomNo) {
      alert('Please select both a student and an available room.');
      return;
    }

    const studentObj = residents.find(r => r.id === selectedStudentId);

    onAllocateRoom({
      residentId: selectedStudentId,
      blockId: selectedBlockId,
      roomNo: selectedRoomNo,
      bedNo: bedNo,
      checkInDate: checkInDate,
      cautionPaid: cautionPaid
    });

    onToast(`Allocated Room ${selectedRoomNo} (${bedNo}) to ${studentObj?.name}!`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <KeyRound color="var(--accent-primary)" /> Room Allocation & Assignment Wizard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Assign vacant beds to registered students or process room swap transfers.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmitAllocation} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Step 1: Select Resident */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              Step 1: Select Student Resident
            </label>
            <select 
              className="input-field"
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              required
            >
              <option value="">-- Choose Resident Student --</option>
              {residents.map(res => (
                <option key={res.id} value={res.id}>
                  {res.name} ({res.rollNo}) — Currently in Room {res.roomNo} [{res.branch}]
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Choose Hostel Block & Room */}
          <div className="grid-2">
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                Step 2: Choose Hostel Block
              </label>
              <select 
                className="input-field"
                value={selectedBlockId}
                onChange={e => {
                  setSelectedBlockId(e.target.value);
                  setSelectedRoomNo('');
                }}
              >
                {blocks.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.code} - {b.name} ({b.gender})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                Available Vacant Rooms ({availableRoomsInBlock.length} Available)
              </label>
              <select 
                className="input-field"
                value={selectedRoomNo}
                onChange={e => setSelectedRoomNo(e.target.value)}
                required
              >
                <option value="">-- Select Vacant Room --</option>
                {availableRoomsInBlock.map(r => {
                  const currentCount = residents.filter(res => res.roomNo === r.roomNo).length;
                  return (
                    <option key={r.id} value={r.roomNo}>
                      Room {r.roomNo} — {r.type} ({currentCount}/{r.capacity} Occupied) — ${r.rent}/sem {r.isAC ? '[AC]' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Room Summary Preview Card */}
          {selectedRoomObj && (
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color-active)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                    Selected Room {selectedRoomObj.roomNo} Details
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Type: {selectedRoomObj.type} • Floor: {selectedRoomObj.floor} • AC: {selectedRoomObj.isAC ? 'Yes' : 'No'}
                  </p>
                </div>
                <span className="badge badge-vacant">
                  ${selectedRoomObj.rent} / Semester
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {selectedRoomObj.amenities.map((am, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px', color: 'var(--text-sub)' }}>
                    ✓ {am}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Bed & Date Configuration */}
          <div className="grid-3">
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Bed Assignment Slot
              </label>
              <select className="input-field" value={bedNo} onChange={e => setBedNo(e.target.value)}>
                <option value="Bed 1">Bed 1 (Window Side)</option>
                <option value="Bed 2">Bed 2 (Door Side)</option>
                <option value="Bed 3">Bed 3 (Study Table Side)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Effective Check-In Date
              </label>
              <input 
                type="date"
                className="input-field"
                value={checkInDate}
                onChange={e => setCheckInDate(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1.5rem' }}>
              <input 
                type="checkbox" 
                id="cautionCheck"
                checked={cautionPaid}
                onChange={e => setCautionPaid(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="cautionCheck" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                Caution Deposit Paid ($200)
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem', fontSize: '1rem', marginTop: '1rem' }}>
            <CheckCircle2 size={18} /> Confirm & Issue Room Allocation
          </button>

        </form>
      </div>

    </div>
  );
}
