import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Printer, 
  Download, 
  DollarSign, 
  FileText,
  Search,
  PlusCircle
} from 'lucide-react';

export default function FeesView({ data, onRecordPayment, onSelectReceipt }) {
  const { fees, residents } = data;

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const totalCollected = fees.reduce((acc, f) => acc + (f.amountPaid || 0), 0);
  const totalPending = fees.reduce((acc, f) => acc + (f.balanceDue || (f.totalAmount - f.amountPaid)), 0);

  const filteredFees = fees.filter(f => {
    if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = f.residentName.toLowerCase().includes(q);
      const matchRoll = f.rollNo?.toLowerCase().includes(q);
      const matchRoom = f.roomNo.toLowerCase().includes(q);
      if (!matchName && !matchRoll && !matchRoom) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Fees & Dues Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Semester room rent, mess fee breakdown, payment receipts, and overdue alerts.
          </p>
        </div>
      </div>

      {/* Financial Overview Summary Banner */}
      <div className="grid-3">
        
        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #34d399' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Fees Collected
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
            ${totalCollected.toLocaleString()}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {fees.filter(f => f.status === 'Paid').length} Fully Cleared Accounts
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #fbbf24' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Pending Dues
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            ${totalPending.toLocaleString()}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {fees.filter(f => f.status !== 'Paid').length} Pending / Overdue Accounts
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-primary)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Semester Fee Standard Rate
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>
            $2,300 - $3,400
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Includes Rent, Mess & High-speed Wi-Fi
          </span>
        </div>

      </div>

      {/* Search & Status Filters Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', gap: '1rem', flex: 1, maxW: '500px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search resident, roll no, or room no..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'Paid', 'Pending', 'Overdue'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className="btn btn-secondary btn-sm"
              style={{
                background: statusFilter === st ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                color: statusFilter === st ? '#fff' : 'var(--text-muted)'
              }}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Fee Table Ledger */}
      <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.25rem' }}>Receipt #</th>
              <th style={{ padding: '1rem 1.25rem' }}>Resident Student</th>
              <th style={{ padding: '1rem 1.25rem' }}>Room No</th>
              <th style={{ padding: '1rem 1.25rem' }}>Total Fee</th>
              <th style={{ padding: '1rem 1.25rem' }}>Amount Paid</th>
              <th style={{ padding: '1rem 1.25rem' }}>Balance Due</th>
              <th style={{ padding: '1rem 1.25rem' }}>Status</th>
              <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.map(fee => (
              <tr key={fee.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 1.25rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                  {fee.id}
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#fff', display: 'block' }}>{fee.residentName}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Roll: {fee.rollNo}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>
                  {fee.roomNo}
                </td>
                <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>
                  ${fee.totalAmount}
                </td>
                <td style={{ padding: '1rem 1.25rem', color: '#34d399', fontWeight: 700 }}>
                  ${fee.amountPaid}
                </td>
                <td style={{ padding: '1rem 1.25rem', color: fee.balanceDue > 0 ? '#fbbf24' : 'var(--text-muted)', fontWeight: 700 }}>
                  ${fee.balanceDue}
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span className={`badge ${fee.status === 'Paid' ? 'badge-paid' : fee.status === 'Pending' ? 'badge-pending' : 'badge-overdue'}`}>
                    {fee.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => onSelectReceipt(fee)}>
                      <Printer size={14} /> Receipt
                    </button>
                    {fee.status !== 'Paid' && (
                      <button className="btn btn-primary btn-sm" onClick={() => onRecordPayment(fee)}>
                        <CreditCard size={14} /> Pay
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
