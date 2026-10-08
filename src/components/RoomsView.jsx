import React, { useState } from 'react';
import { 
  Building2, 
  Grid, 
  List, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Bed, 
  Wind, 
  Wifi, 
  Tv, 
  ShieldAlert,
  UserPlus,
  X,
  UserCheck
} from 'lucide-react';

export default function RoomsView({ data, searchQuery, onSelectRoom, onOpenAllocateModal, onToggleMaintenance }) {
  const { blocks, rooms, residents } = data;

  const [selectedBlock, setSelectedBlock] = useState('ALL');
  const [selectedFloor, setSelectedFloor] = useState('ALL');
  const [selectedAC, setSelectedAC] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    // Block filter
    if (selectedBlock !== 'ALL' && room.blockId !== selectedBlock) return false;
    // Floor filter
    if (selectedFloor !== 'ALL' && room.floor !== Number(selectedFloor)) return false;
    // AC filter
    if (selectedAC === 'AC' && !room.isAC) return false;
    if (selectedAC === 'NON_AC' && room.isAC) return false;
    // Status filter
    if (selectedStatus !== 'ALL' && room.status !== selectedStatus) return false;
    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchRoom = room.roomNo.toLowerCase().includes(q);
      const matchResident = residents.some(r => r.roomNo === room.roomNo && r.name.toLowerCase().includes(q));
      if (!matchRoom && !matchResident) return false;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Occupied': return <span className="badge badge-occupied">Full</span>;
      case 'Vacant': return <span className="badge badge-vacant">Vacant</span>;
      case 'Partial': return <span className="badge badge-partial">Partial</span>;
      case 'Maintenance': return <span className="badge badge-maintenance">Maintenance</span>;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* View Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Hostel Blocks & Rooms Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Interactive room layout map, floor planning, bed capacity, and amenities.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* View Toggle */}
          <div style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '3px', display: 'flex' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                background: viewMode === 'grid' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              <Grid size={15} /> Grid Layout
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                background: viewMode === 'list' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'list' ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              <List size={15} /> Table List
            </button>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Hostel Block
          </label>
          <select className="input-field" value={selectedBlock} onChange={e => setSelectedBlock(e.target.value)}>
            <option value="ALL">All Blocks (A, B, C, D)</option>
            {blocks.map(b => (
              <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Floor
          </label>
          <select className="input-field" value={selectedFloor} onChange={e => setSelectedFloor(e.target.value)}>
            <option value="ALL">All Floors</option>
            <option value="1">Floor 1</option>
            <option value="2">Floor 2</option>
            <option value="3">Floor 3</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Air Conditioning
          </label>
          <select className="input-field" value={selectedAC} onChange={e => setSelectedAC(e.target.value)}>
            <option value="ALL">All (AC & Non-AC)</option>
            <option value="AC">AC Rooms Only</option>
            <option value="NON_AC">Non-AC Rooms Only</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Occupancy Status
          </label>
          <select className="input-field" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="Vacant">Vacant Beds Available</option>
            <option value="Partial">Partially Occupied</option>
            <option value="Occupied">Fully Occupied</option>
            <option value="Maintenance">Under Maintenance</option>
          </select>
        </div>

      </div>

      {/* Grid Layout Mode */}
      {viewMode === 'grid' ? (
        <div className="grid-3">
          {filteredRooms.map(room => {
            const blockObj = blocks.find(b => b.id === room.blockId);
            const roomResidents = residents.filter(r => r.roomNo === room.roomNo);
            const occupiedCount = roomResidents.length;
            const isFull = occupiedCount >= room.capacity;

            return (
              <div 
                key={room.id}
                className="glass-panel card-interactive"
                onClick={() => onSelectRoom(room)}
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeft: `4px solid ${blockObj?.accentColor || 'var(--accent-primary)'}`
                }}
              >
                {/* Top Row: Room No & Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{room.roomNo}</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {blockObj?.name} • Floor {room.floor}
                    </span>
                  </div>
                  {getStatusBadge(room.status)}
                </div>

                {/* Capacity & AC info */}
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Bed size={14} color="var(--accent-primary)" /> {room.type} ({occupiedCount}/{room.capacity} beds)
                  </span>

                  {room.isAC && (
                    <span style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Wind size={14} /> AC Suite
                    </span>
                  )}
                </div>

                {/* Resident Avatars occupying room */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '-6px' }}>
                    {roomResidents.length > 0 ? (
                      roomResidents.map((res, i) => (
                        <div 
                          key={res.id} 
                          title={`${res.name} (${res.rollNo})`}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: res.avatarBg || 'var(--accent-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: 'white',
                            border: '2px solid var(--bg-card)',
                            marginLeft: i > 0 ? '-8px' : 0
                          }}
                        >
                          {res.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No assigned residents</span>
                    )}
                  </div>

                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                    ${room.rent}/sem
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table List Mode */
        <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Room No</th>
                <th style={{ padding: '1rem 1.25rem' }}>Block & Floor</th>
                <th style={{ padding: '1rem 1.25rem' }}>Type & AC</th>
                <th style={{ padding: '1rem 1.25rem' }}>Occupancy</th>
                <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                <th style={{ padding: '1rem 1.25rem' }}>Rent/Sem</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map(room => {
                const blockObj = blocks.find(b => b.id === room.blockId);
                const roomResidents = residents.filter(r => r.roomNo === room.roomNo);

                return (
                  <tr key={room.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 800, color: '#fff' }}>
                      {room.roomNo}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {blockObj?.code} • Floor {room.floor}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {room.type} {room.isAC ? '(AC)' : '(Non-AC)'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {roomResidents.length} / {room.capacity} Beds
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {getStatusBadge(room.status)}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#38bdf8' }}>
                      ${room.rent}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => onSelectRoom(room)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
