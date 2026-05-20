import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitSubscribe, generateQR } from '../api/api';

const fieldLabels = {
  full_name: 'Full Name',
  email: 'Email Address',
  phone: 'Phone Number',
  google_business_url: 'Google Business URL',
};

const fieldIcons = {
  full_name: '👤',
  email: '✉️',
  phone: '📞',
  google_business_url: '🔗',
};

const fieldPlaceholders = {
  full_name: 'John Doe',
  email: 'you@example.com',
  phone: '+91 98765 43210',
  google_business_url: 'Paste your Google Business profile URL',
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
  });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await submitSubscribe(form);
      if (res.data.success) {
        const qrRes = await generateQR({
          subscription_id: res.data.subscription_id,
          google_business_url: form.google_business_url,
        });
        navigate('/success', { state: { qrPath: qrRes.data.qr_path } });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
      * {
  font-family: 'Poppins', sans-serif;
  font-weight: normal;
}
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
        .sub-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(14,165,233,0.42);
        }
        .sub-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(155deg, #f0f9ff 0%, #ffffff 50%, #f8fafc 100%)',
        padding: '60px 20px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* bg blob */}
        <div style={{
          position: 'absolute', top: '5%', right: '5%',
          width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.09) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          background: '#fff',
          borderRadius: 28,
          padding: '48px 44px',
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
            }}>
              ✦ Almost there!
            </div>
            <h2 style={{
              fontSize: 26, fontWeight: 600, color: '#0f172a',
              marginBottom: 8, letterSpacing: '-0.7px'
            }}>
              Subscribe to {form.plan_name}
            </h2>

            {/* Plan price badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: '#fff', padding: '4px 14px',
                borderRadius: 100, fontSize: 15, fontWeight: 600,
                letterSpacing: '-0.3px'
              }}>₹{form.plan_amount}<span style={{ fontWeight: 500, fontSize: 12, opacity: 0.85 }}>/mo</span></span>
            
            </div>
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {['full_name', 'email', 'phone', 'google_business_url'].map(field => (
              <div key={field}>
                <label style={{
                  fontSize: 13, fontWeight: 600, color: '#475569',
                  display: 'block', marginBottom: 7
                }}>
                  {fieldLabels[field]}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 13, top: '50%',
                    transform: 'translateY(-50%)', fontSize: 15,
                    pointerEvents: 'none'
                  }}>{fieldIcons[field]}</span>
                  <input
                    className="sub-input"
                    name={field}
                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={fieldPlaceholders[field]}
                    onFocus={() => setFocused(field)}
                    onBlur={() => setFocused('')}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#f1f5f9', margin: '28px 0 0' }} />

          {/* Submit */}
          <button className="sub-btn" onClick={handleSubmit} disabled={loading}>
            {loading
              ? '⏳ Generating your QR...'
              : '⚡ Generate My QR Code'}
          </button>

          {/* Trust */}
          <p style={{
            textAlign: 'center', fontSize: 12, color: '#94a3b8',
            marginTop: 16, lineHeight: 1.6
          }}>
            🔒 Secure & encrypted
          </p>
        </div>
      </div>
    </>
  );
}