// components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <style>{`
        .nav-link {
          text-decoration: none;
          color: #334155;
          font-size: 14px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .nav-link:hover {
          color: #0284c7;
          background: #f0f9ff;
        }
        .nav-cta {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff !important;
          padding: 8px 20px !important;
          border-radius: 10px !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 12px rgba(14,165,233,0.3);
          transition: all 0.2s !important;
        }
        .nav-cta:hover {
          background: linear-gradient(135deg, #38bdf8, #0ea5e9) !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(14,165,233,0.4) !important;
        }
        @media (max-width: 640px) {
          .nav-links { display: none !important; }
        }
      `}</style>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(226,232,240,0.8)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 6%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: 'Georgia, serif'
          }}>R</div>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Reviews<span style={{ color: '#0ea5e9' }}>AI</span>
          </span>
        </div>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', marginRight: '20px', gap: 4 }}>
          {['Home', 'Features', 'Pricing', 'Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
          ))}

          <button
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            className="nav-link nav-cta"
            style={{ marginLeft: '20px' }}
          >
            {user ? 'Dashboard' : 'Login'}
          </button>
        </div>
      </nav>
    </>
  );
}