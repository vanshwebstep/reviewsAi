import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitSubscribe } from '../api/api';
import PremiumAlert from '../components/PremiumAlert';

const fieldLabels = {
  full_name: 'Full Name',
  email: 'Email Address',
  phone: 'Phone Number',
  google_business_url: 'Google Business URL',
  password: 'Create Password',
};

const fieldIcons = {
  full_name: '👤',
  email: '✉️',
  phone: '📞',
  google_business_url: '🔗',
  password: '🔒',
};

const fieldPlaceholders = {
  full_name: 'John Doe',
  email: 'you@example.com',
  phone: '+91 98765 43210',
  google_business_url: 'Paste your Google Business profile URL',
  password: 'Min. 6 characters',
};

export default function Subscribe() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    plan_name: state?.planName || '',
    plan_amount: state?.planAmount || '',
    google_business_url: '',
    password: '',
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.password || form.password.length < 6) {
      setAlert({
        type: 'warning',
        title: 'Password too short',
        message: 'Password must be at least 6 characters long for your security.',
        actions: [{ label: 'Got it', variant: 'primary', onClick: () => setAlert(null) }]
      });
      return;
    }

    setLoading(true);
    try {
      const res = await submitSubscribe(form);

      if (!res.data.success) {
        setAlert({
          type: 'error',
          title: 'Email already registered',
          message: 'This email is already linked to an account. Please login to continue.',
          actions: [
            { label: 'Go to login',       variant: 'primary',   onClick: () => navigate('/login') },
            { label: 'Try another email', variant: 'secondary', onClick: () => setAlert(null) },
          ]
        });
        return;
      }

      // ✅ Sirf account create, QR dashboard se generate hoga
      navigate('/login', {
        state: {
          message: 'Account created! Please login and generate your QR from dashboard.',
          email: form.email,
        }
      });

    } catch (err) {
      setAlert({
        type: 'error',
        title: 'Something went wrong',
        message: 'Please check your connection and try again.',
        actions: [{ label: 'Retry', variant: 'primary', onClick: () => setAlert(null) }]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { font-family: 'Poppins', sans-serif; font-weight: normal; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sub-input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 14px 12px 42px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          font-size: 14px;
          color: #0f172a;
          background: #fff;
          outline: none;
          transition: all 0.2s;
        }
        .sub-input:hover { border-color: #bae6fd; }
        .sub-input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 4px rgba(14,165,233,0.10); }
        .sub-input::placeholder { color: #cbd5e1; }
        .sub-btn {
          width: 100%;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff;
          border: none;
          border-radius: 13px;
          padding: 15px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 10px;
          box-shadow: 0 8px 28px rgba(14,165,233,0.32);
          transition: all 0.25s;
          letter-spacing: -0.2px;
        }
        .sub-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(14,165,233,0.42); }
        .sub-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .eye-btn {
          position: absolute; right: 13px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; font-size: 16px;
          color: #94a3b8; padding: 0;
        }
        .password-input { padding-right: 42px !important; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(155deg, #f0f9ff 0%, #ffffff 50%, #f8fafc 100%)',
        padding: '60px 20px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '5%', right: '5%',
          width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.09) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          background: '#fff', borderRadius: 28, padding: '48px 44px',
          width: '100%', maxWidth: 500,
          boxShadow: '0 24px 80px rgba(14,165,233,0.11), 0 2px 12px rgba(0,0,0,0.05)',
          border: '1.5px solid #e0f2fe',
          animation: 'fadeUp 0.6s ease both'
        }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#e0f2fe', color: '#0284c7',
              padding: '5px 14px', borderRadius: 100,
              fontSize: 12, fontWeight: 700, marginBottom: 16,
              border: '1px solid #bae6fd'
            }}>✦ Almost there!</div>
            <h2 style={{ fontSize: 26, fontWeight: 600, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.7px' }}>
              Subscribe to {form.plan_name}
            </h2>
            <span style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: '#fff', padding: '4px 14px',
              borderRadius: 100, fontSize: 15, fontWeight: 600,
            }}>₹{form.plan_amount}<span style={{ fontWeight: 500, fontSize: 12, opacity: 0.85 }}>/mo</span></span>
          </div>

          {/* Fields — only 5 fields, no key_features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {['full_name', 'email', 'phone', 'google_business_url', 'password'].map(field => (
              <div key={field}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 7 }}>
                  {fieldLabels[field]}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 13, top: '50%',
                    transform: 'translateY(-50%)', fontSize: 15, pointerEvents: 'none'
                  }}>{fieldIcons[field]}</span>
                  <input
                    className={`sub-input${field === 'password' ? ' password-input' : ''}`}
                    name={field}
                    type={
                      field === 'email'    ? 'email'
                      : field === 'phone'  ? 'tel'
                      : field === 'password' ? (showPassword ? 'text' : 'password')
                      : 'text'
                    }
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={fieldPlaceholders[field]}
                    onFocus={() => setFocused(field)}
                    onBlur={() => setFocused('')}
                  />
                  {field === 'password' && (
                    <button type="button" className="eye-btn" onClick={() => setShowPassword(p => !p)}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: '#f1f5f9', margin: '28px 0 0' }} />

          <button className="sub-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? '⏳ Creating your account...' : '⚡ Create My Account'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 16, lineHeight: 1.6 }}>
            🔒 Your password is encrypted & secure
          </p>
        </div>
        <PremiumAlert config={alert} onClose={() => setAlert(null)} />
      </div>
    </>
  );
}