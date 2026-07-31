// pages/Login.jsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/api';
import { useAuth } from '../context/AuthContext';

const parseApiPayload = data => {
  if (typeof data !== 'string') return data || {};
  try {
    return JSON.parse(data);
  } catch {
    const start = data.indexOf('{');
    const end = data.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(data.slice(start, end + 1));
      } catch {
        return {};
      }
    }
    return {};
  }
};

export default function Login() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: state?.email || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser(form);
      const payload = parseApiPayload(res.data);

      if (payload.success && payload.user && payload.token) {
        login(payload.user, payload.token);
        navigate('/dashboard');
      } else {
        setError(payload.message || payload.error || 'Invalid credentials.');
      }
    } catch (err) {
      const payload = parseApiPayload(err.response?.data);
      setError(payload.message || payload.error || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { font-family: 'Poppins', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60%  { transform: translateX(-6px); }
          40%,80%  { transform: translateX(6px); }
        }
        .login-card { animation: fadeUp 0.55s ease both; }
        .login-input {
          width: 100%;
          box-sizing: border-box;
          padding: 13px 44px 13px 44px;
          border-radius: 14px;
          border: 1.5px solid #e2e8f0;
          font-size: 14px;
          font-family: 'Poppins', sans-serif;
          color: #0f172a;
          background: #f8fafc;
          outline: none;
          transition: all 0.2s;
        }
        .login-input:hover { border-color: #93c5fd; background: #fff; }
        .login-input:focus { border-color: #0ea5e9; background: #fff; box-shadow: 0 0 0 4px rgba(14,165,233,0.10); }
        .login-input::placeholder { color: #cbd5e1; }
        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 15px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(14,165,233,0.30);
          transition: all 0.25s;
          letter-spacing: -0.2px;
        }
        .login-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(14,165,233,0.40); }
        .login-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .error-box { animation: shake 0.4s ease; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(145deg, #f0f9ff 0%, #fff 55%, #f8fafc 100%)',
        padding: '40px 20px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:'8%', left:'6%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'10%', right:'8%', width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle, rgba(2,132,199,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div className="login-card" style={{
          background: '#fff',
          borderRadius: 28,
          padding: '52px 44px',
          width: '100%', maxWidth: 440,
          boxShadow: '0 24px 80px rgba(14,165,233,0.11), 0 2px 12px rgba(0,0,0,0.05)',
          border: '1.5px solid #e0f2fe',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 60, height: 60,
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              borderRadius: 18,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26,
              boxShadow: '0 8px 24px rgba(14,165,233,0.30)',
              marginBottom: 16,
            }}>{'\u26A1'}</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.6px' }}>Welcome back</h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0' }}>Login to access your QR dashboard</p>
          </div>

          {state?.message && (
            <div style={{
              background: '#f0fdf4', border: '1.5px solid #bbf7d0',
              borderRadius: 12, padding: '12px 16px',
              color: '#15803d', fontSize: 13, fontWeight: 500,
              marginBottom: 22, textAlign: 'center'
            }}>
              {'\u2705'} {state.message}
            </div>
          )}

          {error && (
            <div className="error-box" style={{
              background: '#fff1f2', border: '1.5px solid #fecdd3',
              borderRadius: 12, padding: '12px 16px',
              color: '#be123c', fontSize: 13, fontWeight: 500,
              marginBottom: 22, textAlign: 'center'
            }}>
              {'\u26A0\uFE0F'} {error}
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 7 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16, pointerEvents:'none' }}>{'\u2709\uFE0F'}</span>
              <input
                className="login-input"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <div style={{ marginBottom: 26 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 7 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16, pointerEvents:'none' }}>{'\u{1F512}'}</span>
              <input
                className="login-input"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{ paddingRight: 44 }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#94a3b8', padding:0 }}
              >
                {showPassword ? '\u{1F648}' : '\u{1F441}\uFE0F'}
              </button>
            </div>
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>

          <p style={{ textAlign:'center', fontSize:12, color:'#94a3b8', marginTop:18, lineHeight:1.6 }}>
            {'\u{1F512}'} Secured & encrypted session
          </p>
        </div>
      </div>
    </>
  );
}