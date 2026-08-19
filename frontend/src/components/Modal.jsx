export default function Modal({
  open,
  onClose,
  type = 'confirm',       // 'confirm' | 'alert'
  variant = 'danger',     // 'danger' | 'success' | 'warning' | 'info'
  icon,                   // custom emoji/icon override
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  onConfirm,
}) {
  if (!open) return null;

  const variants = {
    danger:  { bg: '#fef2f2', iconDefault: '⚠️', btnGradient: 'linear-gradient(135deg, #ef4444, #dc2626)', shadow: 'rgba(239,68,68,0.3)', shadowHover: 'rgba(239,68,68,0.4)' },
    success: { bg: '#ecfdf5', iconDefault: '✅', btnGradient: 'linear-gradient(135deg, #10b981, #059669)', shadow: 'rgba(16,185,129,0.3)', shadowHover: 'rgba(16,185,129,0.4)' },
    warning: { bg: '#fffbeb', iconDefault: '⚠️', btnGradient: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: 'rgba(245,158,11,0.3)', shadowHover: 'rgba(245,158,11,0.4)' },
    info:    { bg: '#f0f9ff', iconDefault: 'ℹ️', btnGradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)', shadow: 'rgba(14,165,233,0.3)', shadowHover: 'rgba(14,165,233,0.4)' },
  };
  const v = variants[variant] || variants.info;

  return (
    <>
      <style>{`
        .modal-backdrop {
          position: fixed; inset: 0; background: rgba(15,23,42,0.55);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px; backdrop-filter: blur(2px);
          animation: fadeIn 0.15s ease;
        }
        .modal-card {
          font-family: 'Poppins', sans-serif;
          background: #fff; border-radius: 20px;
          padding: 28px 26px; max-width: 380px; width: 100%;
          box-shadow: 0 24px 60px rgba(15,23,42,0.25);
          animation: popIn 0.18s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.94) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .modal-btn-secondary {
          border: 1.5px solid #e2e8f0; background: #fff; color: #475569;
          border-radius: 10px; padding: 11px 18px; font-size: 13.5px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .modal-btn-secondary:hover { border-color: #cbd5e1; background: #f8fafc; }
        .modal-btn-primary {
          border: none; color: #fff;
          border-radius: 10px; padding: 11px 18px; font-size: 13.5px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
        }
        .modal-btn-primary:hover { transform: translateY(-1px); }
        .modal-btn-primary:disabled { opacity: 0.7; cursor: default; transform: none; }
      `}</style>

      <div className="modal-backdrop" onClick={() => !loading && onClose?.()}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: v.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14,
          }}>
            {icon || v.iconDefault}
          </div>

          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
            {title}
          </h3>

          {message && (
            <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.5, marginBottom: 22 }}>
              {message}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            {type === 'confirm' && (
              <button className="modal-btn-secondary" onClick={onClose} disabled={loading}>
                {cancelText}
              </button>
            )}
            <button
              className="modal-btn-primary"
              style={{ background: v.btnGradient, boxShadow: `0 6px 18px ${v.shadow}` }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 8px 22px ${v.shadowHover}`}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 6px 18px ${v.shadow}`}
              onClick={type === 'alert' ? onClose : onConfirm}
              disabled={loading}
            >
              {loading ? 'Please wait...' : (type === 'alert' ? (confirmText || 'OK') : confirmText)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}