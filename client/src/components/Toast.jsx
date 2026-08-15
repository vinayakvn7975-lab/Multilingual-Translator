import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type || 'success'}`}>
        {toast.type === 'error' ? (
          <AlertCircle size={20} className="toast-icon" style={{ color: '#f43f5e' }} />
        ) : (
          <CheckCircle2 size={20} className="toast-icon" style={{ color: '#10b981' }} />
        )}
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: 'auto' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
