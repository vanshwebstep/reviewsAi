import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const url = import.meta.env.VITE_BASE_URL
const BACKEND_BASE = url;

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export default function Contact() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useState(() => readStoredUser());

  const [form, setForm] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' }); // type: 'success' | 'error'

  const navItems = [
    { label: 'Home', to: '/dashboard' },
    { label: 'Profile', to: '/profile' },
    { label: 'Smart Reply', to: '/smart-reply' },
    { label: 'Plans', to: '/plans' },
    { label: 'Contact Us', to: '/contact' },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    setSending(true);
    setStatus({ type: '', text: '' });
    try {
      const res = await fetch(`${BACKEND_BASE}/api/contact_us.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || data.error || 'Could not send your message.');
      }
      setStatus({ type: 'success', text: "Thanks! We've received your message and will get back to you soon." });
      setForm({ name: user?.full_name || '', email: user?.email || '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{`
        * { font-family: 'Poppins', sans-serif; }
        .nav-link {
          text-decoration: none; color: #64748b; font-size: 13px; font-weight: 600;
          padding: 8px 16px; border-radius: 100px; transition: all 0.2s; white-space: nowrap;
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
        .dash-card {
          background: #fff; border-radius: 24px; border: 1.5px solid #e0f2fe;
          box-shadow: 0 20px 60px rgba(14,165,233,0.10), 0 2px 10px rgba(0,0,0,0.04);
        }
        .field-input, .field-textarea {
          width: 100%; box-sizing: border-box; padding: 12px 14px; border-radius: 12px;
          border: 1.5px solid #e2e8f0; font-size: 14px; color: #0f172a;
          font-family: 'Poppins', sans-serif; background: #f8fafc; outline: none; transition: all 0.2s;
        }
        .field-input:focus, .field-textarea:focus {
          border-color: #0ea5e9; background: #fff; box-shadow: 0 0 0 4px rgba(14,165,233,0.10);
        }
        .field-textarea { resize: vertical; min-height: 130px; line-height: 1.6; }
        .submit-btn {
          width: 100%; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff;
          border: none; border-radius: 14px; padding: 14px; font-size: 15px; font-weight: 700;
          cursor: pointer; box-shadow: 0 8px 28px rgba(14,165,233,0.30); transition: all 0.25s;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(14,165,233,0.40); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .status-msg {
          text-align: center; font-size: 13px; font-weight: 600; margin-bottom: 16px;
          padding: 10px 14px; border-radius: 10px;
        }
        .status-msg.success { color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; }
        .status-msg.error { color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #f0f9ff 0%, #fff 55%, #f8fafc 100%)',
        padding: '40px 20px',
      }}>
        <div style={{maxWidth: 1100, margin: '0 auto' }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            background: '#fff', border: '1.5px solid #e0f2fe', borderRadius: 20,
            padding: '14px 18px', marginBottom: 32, boxShadow: '0 8px 30px rgba(14,165,233,0.08)',
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

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Contact Us</h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>Have a question or issue? Send us a message.</p>
          </div>

          <div className="dash-card" style={{ padding: '32px', maxWidth: 640, margin: '0 auto' }}>
            {status.text && <div className={`status-msg ${status.type}`}>{status.text}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Name</label>
                <input className="field-input" name="name" value={form.name} onChange={handleChange} disabled={sending} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Email</label>
                <input className="field-input" type="email" name="email" value={form.email} onChange={handleChange} disabled={sending} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Message</label>
                <textarea className="field-textarea" name="message" value={form.message} onChange={handleChange} disabled={sending}
                  placeholder="Tell us what's going on..." />
              </div>
              <button className="submit-btn" type="submit" disabled={sending}>
                {sending ? 'Sending...' : '📩 Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
