import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      background: isSuccess ? 'rgba(16, 185, 129, 0.95)' : 'rgba(99, 102, 241, 0.95)',
      backdropFilter: 'blur(8px)',
      color: '#fff',
      padding: '0.85rem 1.25rem',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '0.9rem',
      fontWeight: 600,
      animation: 'slideUp 0.3s ease'
    }}>
      {isSuccess ? <CheckCircle2 size={18} /> : <Info size={18} />}
      <span>{toast.message}</span>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '6px' }}>
        <X size={16} />
      </button>
    </div>
  );
}
