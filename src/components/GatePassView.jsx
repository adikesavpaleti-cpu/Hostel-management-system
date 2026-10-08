import React, { useState } from 'react';
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserCheck, 
  Printer, 
  PlusCircle, 
  Shield, 
  Calendar,
  MapPin
} from 'lucide-react';

export default function GatePassView({ data, onApprovePass, onRejectPass, onOpenPassModal, onOpenVisitorModal }) {
  const { gatePasses, visitors } = data;

  const [activeSubTab, setActiveSubTab] = useState('passes'); // 'passes' or 'visitors'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Gate Pass & Visitor Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Digital outing gate passes, warden approvals, QR code generation, and security gate visitor logs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onOpenVisitorModal}>
            <Shield size={16} /> Log New Visitor
          </button>
          <button className="btn btn-primary" onClick={onOpenPassModal}>
            <PlusCircle size={16} /> Request Outing Pass
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setActiveSubTab('passes')}
          className="btn btn-secondary btn-sm"
          style={{
            background: activeSubTab === 'passes' ? 'var(--accent-primary)' : 'transparent',
            color: activeSubTab === 'passes' ? '#fff' : 'var(--text-muted)'
          }}
        >
          <QrCode size={15} /> Student Outing Gate Passes ({gatePasses.length})
        </button>

        <button
          onClick={() => setActiveSubTab('visitors')}
          className="btn btn-secondary btn-sm"
          style={{
            background: activeSubTab === 'visitors' ? 'var(--accent-primary)' : 'transparent',
            color: activeSubTab === 'visitors' ? '#fff' : 'var(--text-muted)'
          }}
        >
          <Shield size={15} /> Security Gate Visitors Log ({visitors.length})
        </button>
      </div>

      {/* Passes Tab */}
      {activeSubTab === 'passes' ? (
        <div className="grid-2">
          {gatePasses.map(gp => (
            <div key={gp.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{gp.id}</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>{gp.residentName}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Roll: {gp.rollNo} • Room {gp.roomNo}</p>
                </div>

                <span className={`badge ${gp.status === 'Approved' ? 'badge-approved' : gp.status === 'Pending' ? 'badge-pending' : 'badge-rejected'}`}>
                  {gp.status}
                </span>
              </div>

              {/* Pass details */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Leave Type:</span>
                  <span style={{ fontWeight: 700, color: '#818cf8' }}>{gp.type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Destination:</span>
                  <span style={{ fontWeight: 600 }}>{gp.destination}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Departure:</span>
                  <span>{gp.departureDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Return By:</span>
                  <span>{gp.expectedReturnDate}</span>
                </div>
              </div>

              {/* Purpose */}
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <strong>Purpose:</strong> "{gp.purpose}"
              </p>

              {/* Action buttons or Warden endorsement */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  By: {gp.approvedBy || 'Pending Warden Review'}
                </span>

                {gp.status === 'Pending' ? (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-secondary btn-sm" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }} onClick={() => onRejectPass(gp.id)}>
                      <XCircle size={14} /> Reject
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => onApprovePass(gp.id)}>
                      <CheckCircle2 size={14} /> Approve Pass
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-secondary btn-sm" onClick={() => alert(`Digital QR Pass Code: ${gp.qrCodeVal}`)}>
                    <QrCode size={14} /> View QR Pass
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Visitors Log Tab */
        <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Log ID</th>
                <th style={{ padding: '1rem 1.25rem' }}>Visitor Name</th>
                <th style={{ padding: '1rem 1.25rem' }}>Relation</th>
                <th style={{ padding: '1rem 1.25rem' }}>Resident Visited</th>
                <th style={{ padding: '1rem 1.25rem' }}>Entry Time</th>
                <th style={{ padding: '1rem 1.25rem' }}>Exit Time</th>
                <th style={{ padding: '1rem 1.25rem' }}>Gate #</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{v.id}</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#fff' }}>
                    {v.visitorName}
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.visitorPhone}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>{v.relation}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>{v.residentName} (Room {v.roomNo})</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#34d399' }}>{v.entryTime}</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{v.exitTime || 'In Campus'}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>{v.gateNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
