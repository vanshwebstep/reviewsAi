import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmStripeSubscription, loginUser } from '../api/api';

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

export default function SubscribeSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState(sessionId ? 'processing' : 'error');
  const [message, setMessage] = useState(sessionId ? 'Confirming your Stripe demo payment...' : 'Stripe session is missing. Please start the subscription again.');

  useEffect(() => {
    if (!sessionId) return;

    let active = true;

    confirmStripeSubscription({ session_id: sessionId })
      .then(async res => {
        if (!active) return;

        const payload = parseApiPayload(res.data);

        if (!payload.success) {
          setStatus('error');
          setMessage(payload.message || payload.error || 'Payment confirmation failed.');
          return;
        }

        const pendingForm = parseApiPayload(sessionStorage.getItem('pendingSubscribeForm'));
        let user = payload.user || null;

        if (payload.token) {
          localStorage.setItem('token', payload.token); // ya jo bhi key aapke app me use hoti hai
        }

        if (!user && pendingForm.email && pendingForm.password) {
          try {
            const loginRes = await loginUser({
              email: pendingForm.email,
              password: pendingForm.password,
            });
            const loginPayload = parseApiPayload(loginRes.data);
            user = loginPayload.success ? loginPayload.user || null : null;
          } catch {
            user = null;
          }
        }

        sessionStorage.removeItem('pendingSubscribeForm');

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        setStatus('success');
        setMessage(payload.message || 'Payment successful. Redirecting to your dashboard...');

        setTimeout(() => {
          if (user) {
            navigate('/dashboard', { replace: true, state: { user } }); // login page ki jagah direct dashboard
          } else {
            navigate('/login', {
              replace: true,
              state: {
                email: pendingForm.email || '',
                message: 'Payment successful. Please login once to open your dashboard.',
              },
            });
          }
        }, 1400);
      })
      .catch(err => {
        if (!active) return;
        const payload = parseApiPayload(err.response?.data);
        setStatus('error');
        setMessage(payload.message || payload.error || err.message || 'Payment confirmation failed. Please contact support if amount was deducted.');
      });

    return () => {
      active = false;
    };
  }, [navigate, sessionId]);

  return (
    <>
      <style>{`
        * { font-family: 'Poppins', sans-serif; font-weight: normal; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sub-success-btn {
          border: none;
          border-radius: 12px;
          padding: 13px 22px;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(14,165,233,0.32);
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(155deg, #f0f9ff 0%, #ffffff 50%, #f8fafc 100%)',
        padding: '60px 20px'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 28,
          padding: '44px 40px',
          width: '100%',
          maxWidth: 480,
          textAlign: 'center',
          boxShadow: '0 24px 80px rgba(14,165,233,0.11), 0 2px 12px rgba(0,0,0,0.05)',
          border: '1.5px solid #e0f2fe',
          animation: 'fadeUp 0.5s ease both'
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            margin: '0 auto 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            background: status === 'error' ? '#fee2e2' : '#dcfce7',
            color: status === 'error' ? '#dc2626' : '#16a34a'
          }}>
            {status === 'processing' ? '...' : status === 'error' ? '!' : 'OK'}
          </div>

          <h2 style={{ fontSize: 25, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
            {status === 'error' ? 'Payment Confirmation Issue' : 'Stripe Demo Payment'}
          </h2>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, marginBottom: status === 'error' ? 24 : 0 }}>
            {message}
          </p>

          {status === 'error' && (
            <button className="sub-success-btn" onClick={() => navigate('/subscribe')}>
              Back to Subscribe
            </button>
          )}
        </div>
      </div>
    </>
  );
}