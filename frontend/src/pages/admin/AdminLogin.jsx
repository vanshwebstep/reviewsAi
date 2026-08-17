import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../api/adminApi';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminLogin(form);
      if (!res.data?.success) {
        setError(res.data?.message || 'Login failed');
        return;
      }
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('admin', JSON.stringify(res.data.admin));
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: '👥', title: 'User Management', desc: 'View, edit and manage all subscribers in one place' },
    { icon: '📦', title: 'Plans & Pricing', desc: 'Full control over plans, limits and pricing tiers' },
    { icon: '🔥', title: 'Promotions', desc: 'Configure launch offers and discount campaigns' },
    { icon: '📊', title: 'Live Analytics', desc: 'Real-time MRR, signups and usage stats' },
  ];

  return (
    <>
      <style>{`
        * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        @keyframes floatBlob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .admin-login-input {
          width: 100%; padding: 13px 16px 13px 44px; border-radius: 12px;
          border: 1.5px solid #e2e8f0; font-size: 14px; outline: none;
          transition: all 0.2s; background: #f8fafc; box-sizing: border-box;
        }
        .admin-login-input:focus {
          border-color: #0ea5e9; background: #fff;
          box-shadow: 0 0 0 4px rgba(14,165,233,0.10);
        }
        .admin-login-submit {
          width: 100%; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff;
          border: none; border-radius: 12px; padding: 14px; font-size: 14.5px; font-weight: 700;
          cursor: pointer; transition: all 0.25s; box-shadow: 0 10px 28px rgba(14,165,233,0.35);
        }
        .admin-login-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(14,165,233,0.45); }
        .admin-login-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .admin-login-eye {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 13px;
          padding: 4px;
        }
        .admin-feature-row { animation: fadeInUp 0.5s ease both; }
        @media (max-width: 860px) {
          .admin-login-left { display: none !important; }
          .admin-login-right { max-width: 100% !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', display: 'flex',
        background: '#f8fafc',
      }}>
        {/* Left branding panel */}
        <div className="admin-login-left" style={{
          flex: '1 1 46%', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(155deg, #0ea5e9 0%, #0284c7 55%, #075985 100%)',
          padding: '56px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          minWidth: 380,
        }}>
          <div style={{
            position: 'absolute', width: 340, height: 340, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', top: -100, right: -100,
            animation: 'floatBlob 8s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', width: 220, height: 220, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', bottom: -60, left: -60,
            animation: 'floatBlob 10s ease-in-out infinite reverse',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                border: '1px solid rgba(255,255,255,0.25)',
              }}>⚡</div>
              <span style={{ color: '#fff', fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px' }}>ReviewsAI</span>
            </div>

            <h1 style={{ color: '#fff', fontSize: 34, fontWeight: 900, lineHeight: 1.25, marginBottom: 14, letterSpacing: '-1px' }}>
              Manage your entire<br />business from here
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14.5, lineHeight: 1.7, maxWidth: 380 }}>
              One dashboard to control users, plans, pricing and promotions across your whole platform.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {features.map((f, i) => (
              <div key={f.title} className="admin-feature-row" style={{ display: 'flex', gap: 14, animationDelay: `${i * 0.1}s` }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>{f.icon}</div>
                <div>
                  <div style={{ color: '#fff', fontSize: 13.5, fontWeight: 700, marginBottom: 2 }}>{f.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12.5, lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div className="admin-login-right" style={{
          flex: '1 1 54%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px 24px',
        }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#e0f2fe', color: '#0284c7', padding: '5px 14px', borderRadius: 100,
              fontSize: 12, fontWeight: 700, marginBottom: 20, border: '1px solid #bae6fd',
            }}>🔒 Admin Access</div>

            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 6, letterSpacing: '-0.6px' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 13.5, color: '#64748b', marginBottom: 32 }}>
              Sign in to access the control panel
            </p>

            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>Email address</label>
              <div style={{ position: 'relative', marginBottom: 18 }}>
                <span style={iconStyle}>✉️</span>
                <input
                  type="email"
                  placeholder="admin@reviewsai.in"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="admin-login-input"
                  autoComplete="username"
                  required
                />
              </div>

              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative', marginBottom: 8 }}>
                <span style={iconStyle}>🔑</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="admin-login-input"
                  autoComplete="current-password"
                  required
                />
                <button type="button" className="admin-login-eye" onClick={() => setShowPassword(s => !s)}>
                  {showPassword ? '🙈 Hide' : '👁 Show'}
                </button>
              </div>

              {error && (
                <div style={{
                  background: '#fff1f2', border: '1px solid #fca5a5', color: '#ef4444',
                  fontSize: 12.5, borderRadius: 10, padding: '11px 14px', marginTop: 14,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>⚠️ {error}</div>
              )}

              <button type="submit" disabled={loading} className="admin-login-submit" style={{ marginTop: 24 }}>
                {loading ? 'Signing in...' : 'Sign in to dashboard →'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 28 }}>
              Restricted area · Unauthorized access is prohibited
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const labelStyle = { display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 8 };
const iconStyle = { position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.5, pointerEvents: 'none' };