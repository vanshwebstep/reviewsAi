import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '../api/api';
import PremiumAlert from '../components/PremiumAlert';

const fieldLabels = {
  full_name: 'Business Name',
  email: 'Email Address',
  phone: 'Phone Number',
  google_business_url: 'Google Business URL',
  password: 'Create Password',
};

const fieldIcons = {
  full_name: '🏢',
  email: '\u2709\uFE0F',
  phone: '\u{1F4DE}',
  google_business_url: '\u{1F517}',
  password: '\u{1F512}',
};

const fieldPlaceholders = {
  full_name: 'Enter Your Business Name',
  email: 'you@example.com',
  phone: '+91 98765 43210',
  google_business_url: 'Paste your Google Business profile URL',
  password: 'Min. 6 characters',
};

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

export default function Subscribe() {
  const { state, search } = useLocation();
  const navigate = useNavigate();
  const savedForm = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('pendingSubscribeForm') || '{}');
    } catch {
      return {};
    }
  })();
  const [form, setForm] = useState({
    full_name: savedForm.full_name || '',
    email: savedForm.email || '',
    phone: savedForm.phone || '',
    plan_name: state?.planName || savedForm.plan_name || '',
    plan_amount: state?.planAmount || savedForm.plan_amount || '',
    google_business_url: savedForm.google_business_url || '',
    password: savedForm.password || '',
  });
  const [alert, setAlert] = useState(() => {
    const params = new URLSearchParams(search);
    return params.get('payment') === 'cancelled'
      ? {
        type: 'warning',
        title: 'Payment cancelled',
        message: 'Your details are still here. You can retry the Stripe demo payment when ready.',
      }
      : null;
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const requiredFields = ['full_name', 'email', 'phone', 'plan_name', 'plan_amount', 'google_business_url', 'password'];
    const missingField = requiredFields.find(field => !String(form[field] || '').trim());

    if (missingField) {
      setAlert({
        type: 'warning',
        title: 'Missing details',
        message: 'Please fill all fields before starting the Stripe demo payment.',
        actions: [{ label: 'Got it', variant: 'primary', onClick: () => setAlert(null) }]
      });
      return;
    }

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
      const frontendBaseUrl = `${window.location.origin}/demo/reviewsai/frontend`;
      sessionStorage.setItem('pendingSubscribeForm', JSON.stringify(form));
      const res = await createCheckoutSession({
        ...form,
        frontend_base_url: frontendBaseUrl,
      });
      const payload = parseApiPayload(res.data);
      const checkoutUrl = payload.checkout_url || payload.checkoutUrl;

      if (!payload.success || !checkoutUrl) {
        setAlert({
          type: 'error',
          title: 'Payment could not start',
          message: payload.message || payload.error || 'Checkout URL missing from backend response.',
          actions: [{ label: 'Retry', variant: 'primary', onClick: () => setAlert(null) }]
        });
        return;
      }
      localStorage.setItem('pendingSubscribeForm', JSON.stringify(form));
      window.location.assign(checkoutUrl);
    } catch (err) {
      const payload = parseApiPayload(err.response?.data);
      const status = err.response?.status;
      const message = payload.message || payload.error || err.message || 'Please check your connection and try again.';
      setAlert({
        type: 'error',
        title: status === 409 ? 'Email already registered' : 'Payment could not start',
        message,
        actions: status === 409
          ? [
            { label: 'Go to login', variant: 'primary', onClick: () => navigate('/login') },
            { label: 'Try another email', variant: 'secondary', onClick: () => setAlert(null) },
          ]
          : [{ label: 'Retry', variant: 'primary', onClick: () => setAlert(null) }]
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

          <div style={{ marginBottom: 36 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#e0f2fe', color: '#0284c7',
              padding: '5px 14px', borderRadius: 100,
              fontSize: 12, fontWeight: 700, marginBottom: 16,
              border: '1px solid #bae6fd'
            }}>{'\u2726'} Almost there!</div>
            <h2 style={{ fontSize: 26, fontWeight: 600, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.7px' }}>
              Subscribe to {form.plan_name}
            </h2>
            <span style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: '#fff', padding: '4px 14px',
              borderRadius: 100, fontSize: 15, fontWeight: 600,
            }}>{'\u20B9'}{form.plan_amount}<span style={{ fontWeight: 500, fontSize: 12, opacity: 0.85 }}>/mo</span></span>
          </div>

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
                      field === 'email' ? 'email'
                        : field === 'phone' ? 'tel'
                          : field === 'password' ? (showPassword ? 'text' : 'password')
                            : 'text'
                    }
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={fieldPlaceholders[field]}
                  />
                  {field === 'password' && (
                    <button type="button" className="eye-btn" onClick={() => setShowPassword(p => !p)}>
                      {showPassword ? '\u{1F648}' : '\u{1F441}\uFE0F'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: '#f1f5f9', margin: '28px 0 0' }} />

          <button className="sub-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Redirecting to secure payment...' : 'Proceed to Demo Payment'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 16, lineHeight: 1.6 }}>
            {'\u{1F512}'} Your password is encrypted & secure
          </p>
        </div>
        <PremiumAlert config={alert} onClose={() => setAlert(null)} />
      </div>
    </>
  );
}