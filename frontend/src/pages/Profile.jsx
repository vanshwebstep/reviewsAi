import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useState(() => readStoredUser());

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const navItems = [
    { label: 'Home', to: '/dashboard' },
    { label: 'Profile', to: '/profile' },
    { label: 'Smart Reply', to: '/smart-reply' },
    { label: 'Plans', to: '/plans' },
    { label: 'Contact Us', to: '/contact' },
  ];

  const infoRows = [
    { icon: '🏢', label: 'Business Name', value: user.full_name },
    { icon: '✉️', label: 'Email', value: user.email },
    { icon: '📞', label: 'Phone', value: user.phone },
    { icon: '📋', label: 'Plan', value: user.plan_name },
    { icon: '💰', label: 'Amount', value: `$${user.plan_amount}/mo` },
    { icon: '🔗', label: 'Business URL', value: user.google_business_url, isLink: true },
  ];

  return (
    <>
      <style>{`
        * { font-family: 'Poppins', sans-serif; }
        .dash-card {
          background: #fff;
          border-radius: 24px;
          border: 1.5px solid #e0f2fe;
          box-shadow: 0 20px 60px rgba(14,165,233,0.10), 0 2px 10px rgba(0,0,0,0.04);
        }
        .info-row {
          display: flex; align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid #f1f5f9;
          gap: 14px;
        }
        .info-row:last-child { border-bottom: none; }
          .nav-link {
  text-decoration: none; color: #64748b; font-size: 15px; font-weight: 600;
  padding: 10px 18px; border-radius: 100px; transition: all 0.2s; white-space: nowrap;
}
        .nav-link:hover { color: #0284c7; background: #f0f9ff; }
        .nav-link.active {
          color: #fff; background: linear-gradient(135deg, #0ea5e9, #0284c7);
          box-shadow: 0 4px 14px rgba(14,165,233,0.3);
        }
        .logout-btn {
          background: none; border: 1.5px solid #e2e8f0; color: #64748b;
          border-radius: 10px; padding: 8px 18px; font-size: 13px;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .logout-btn:hover { border-color: #fca5a5; color: #ef4444; background: #fff1f2; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #f0f9ff 0%, #fff 55%, #f8fafc 100%)',
        padding: '40px 20px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            background: '#fff', border: '1.5px solid #e0f2fe', borderRadius: 20,
            padding: '14px 18px', marginBottom: 28, boxShadow: '0 8px 30px rgba(14,165,233,0.08)',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>⚡</div>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>ReviewsAI</span>
            </div>

            <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {navItems.map(item => (
                <Link key={item.to} to={item.to}
                  className={`nav-link ${location.pathname === item.to ? 'active' : ''}`}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <button className="logout-btn" onClick={() => {
              localStorage.removeItem('user'); localStorage.removeItem('token'); navigate('/login');
            }}>🚪 Logout</button>
          </div>

          {/* Profile Card */}
          <div className="dash-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, boxShadow: '0 6px 20px rgba(14,165,233,0.28)',
              }}>🏢</div>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>{user.full_name}</h1>
                <span style={{
                  background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', color: '#fff',
                  borderRadius: 100, padding: '3px 12px', fontSize: 12, fontWeight: 600,
                }}>{user.plan_name}</span>
              </div>
            </div>

            {infoRows.map(row => (
              <div className="info-row" key={row.label}>
                <span style={{ fontSize: 18 }}>{row.icon}</span>
                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600, minWidth: 100 }}>{row.label}</span>
                {row.isLink ? (
                  <a href={row.value} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 13, color: '#0284c7', fontWeight: 500, wordBreak: 'break-all' }}>
                    {row.value}
                  </a>
                ) : (
                  <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 500, wordBreak: 'break-all' }}>{row.value}</span>
                )}
              </div>
            ))}

            {user.created_at && (
              <div style={{
                marginTop: 20, background: '#f8fafc', borderRadius: 12,
                padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>📅</span>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                  Subscribed on: {new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
