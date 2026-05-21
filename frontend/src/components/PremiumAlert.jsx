import { useEffect } from 'react';

export default function PremiumAlert({ config, onClose }) {
  if (!config) return null;

  const icons = { error: '✗', success: '✓', warning: '!' };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <style>{`
        @keyframes alertFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes alertPop {
          from { transform: scale(0.88) translateY(16px); opacity:0 }
          to   { transform: scale(1) translateY(0); opacity:1 }
        }
        .pal-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.45);
          display: flex; align-items: center; justify-content: center;
          animation: alertFadeIn 0.2s ease;
        }
        .pal-box {
          background: #fff; border-radius: 20px;
          border: 1px solid #f1f5f9;
          padding: 36px 32px 28px;
          max-width: 360px; width: 90%;
          text-align: center;
          animation: alertPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
          box-shadow: 0 32px 80px rgba(0,0,0,0.12);
        }
        .pal-icon {
          width: 64px; height: 64px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px; font-size: 26px; font-weight: 700;
        }
        .pal-icon.error   { background: #FCEBEB; color: #A32D2D; }
        .pal-icon.success { background: #EAF3DE; color: #3B6D11; }
        .pal-icon.warning { background: #FAEEDA; color: #854F0B; }
        .pal-title { font-size: 17px; font-weight: 600; color: #0f172a; margin: 0 0 8px; }
        .pal-msg   { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 24px; }
        .pal-actions { display: flex; gap: 10px; justify-content: center; }
        .pal-btn { padding: 10px 22px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all 0.18s; }
        .pal-btn.primary   { background: #E24B4A; color: #fff; }
        .pal-btn.primary:hover { background: #A32D2D; }
        .pal-btn.secondary { background: #f8fafc; color: #0f172a; border: 1px solid #e2e8f0; }
        .pal-btn.secondary:hover { background: #f1f5f9; }
      `}</style>

      <div className="pal-overlay" onClick={(e) => e.target.classList.contains('pal-overlay') && onClose()}>
        <div className="pal-box">
          <div className={`pal-icon ${config.type}`}>{icons[config.type]}</div>
          <p className="pal-title">{config.title}</p>
          <p className="pal-msg">{config.message}</p>
          <div className="pal-actions">
            {config.actions.map((a, i) => (
              <button key={i} className={`pal-btn ${a.variant || 'primary'}`} onClick={a.onClick}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}