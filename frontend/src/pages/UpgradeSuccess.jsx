import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmUpgradeSubscription } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function UpgradeSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { login } = useAuth();
  const [status, setStatus] = useState(sessionId ? 'processing' : 'error');
  const [message, setMessage] = useState(sessionId ? 'Confirming your upgrade payment...' : 'Session missing. Please try upgrading again.');

  const hasRun = useRef(false); // 👈 guard — duplicate calls rokega

  useEffect(() => {
    if (!sessionId) return;
    if (hasRun.current) return; // 👈 dobara mat chalao
    hasRun.current = true;

    confirmUpgradeSubscription({ session_id: sessionId })
      .then(res => {
        const payload = res.data;
        if (!payload.success) {
          setStatus('error');
          setMessage(payload.message || 'Upgrade confirmation failed.');
          return;
        }
        if (payload.user) {
          const token = localStorage.getItem('token');
          login(payload.user, token);
        }
        setStatus('success');
        setMessage(payload.message || 'Plan upgraded! Redirecting to your dashboard...');
        setTimeout(() => navigate('/dashboard', { replace: true }), 1400);
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Upgrade confirmation failed. Contact support if amount was deducted.');
      });
  }, [sessionId]); // 👈 sirf sessionId — navigate/login hata diye deps se

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(155deg, #f0f9ff 0%, #ffffff 50%, #f8fafc 100%)', padding: '60px 20px',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        background: '#fff', borderRadius: 28, padding: '44px 40px', width: '100%', maxWidth: 480,
        textAlign: 'center', boxShadow: '0 24px 80px rgba(14,165,233,0.11)', border: '1.5px solid #e0f2fe'
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 22px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
          background: status === 'error' ? '#fee2e2' : '#dcfce7', color: status === 'error' ? '#dc2626' : '#16a34a'
        }}>
          {status === 'processing' ? '...' : status === 'error' ? '!' : 'OK'}
        </div>
        <h2 style={{ fontSize: 25, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
          {status === 'error' ? 'Upgrade Issue' : 'Plan Upgrade'}
        </h2>
        <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>{message}</p>
        {status === 'error' && (
          <button onClick={() => navigate('/plans')} style={{
            marginTop: 20, border: 'none', borderRadius: 12, padding: '13px 22px',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff', fontWeight: 700, cursor: 'pointer'
          }}>Back to Plans</button>
        )}
      </div>
    </div>
  );
}