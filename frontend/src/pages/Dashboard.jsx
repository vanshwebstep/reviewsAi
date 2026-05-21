import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { generateQR, generateAIReviews } from '../api/api';
// https://webstepdev.com/demo/reviewsai/backend
// http://localhost/reviewsai/backend
const url = import.meta.env.VITE_BASE_URL
const BACKEND_BASE = url;

export default function Dashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(state?.user);

  const [keyWords, setKeyWords] = useState(user?.key_words || '');
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(''); // status message
  const [qrPath, setQrPath] = useState(user?.qr_code_path || null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const qrFullUrl = qrPath ? `${BACKEND_BASE}/${qrPath}` : null;

  const handleDownload = () => {
    if (!qrFullUrl) return;
    const link = document.createElement('a');
    link.href = qrFullUrl;
    link.download = `qr-${user.full_name?.replace(/\s+/g, '-')}.png`;
    link.click();
  };

  const handleGenerateQR = async () => {
    if (!keyWords.trim()) {
      alert('Please enter your key words first!');
      return;
    }
    setGenerating(true);
    try {
      // Step 1: Save key words to DB
      setGenStep('💾 Saving your key words...');
      await fetch(`${BACKEND_BASE}/api/save_key_words.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription_id: user.id,
          key_words: keyWords,
        }),
      });

      // Step 2: Generate AI reviews
      setGenStep('🤖 AI reviews generate ho rahe hain...');
      await generateAIReviews({
        subscription_id: user.id,
        key_words: keyWords,
        business_name: user.full_name,
      });

      // Step 3: Generate QR
      setGenStep('🔗 QR Code ban raha hai...');
      const qrRes = await generateQR({
        subscription_id: user.id,
        google_business_url: user.google_business_url,
      });

      setQrPath(qrRes.data.qr_path);
      setGenStep('');
    } catch (err) {
      console.error('Full error:', err)
      alert('Something went wrong. Please try again.');
      setGenStep('');
    } finally {
      setGenerating(false);
    }
  };

  const infoRows = [
    { icon: '👤', label: 'Full Name', value: user.full_name },
    { icon: '✉️', label: 'Email', value: user.email },
    { icon: '📞', label: 'Phone', value: user.phone },
    { icon: '📋', label: 'Plan', value: user.plan_name },
    { icon: '💰', label: 'Amount', value: `₹${user.plan_amount}/mo` },
    { icon: '🔗', label: 'Business URL', value: user.google_business_url, isLink: true },
  ];

  return (
    <>
      <style>{`
        * { font-family: 'Poppins', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes qrReveal {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .dash-card {
          background: #fff;
          border-radius: 24px;
          border: 1.5px solid #e0f2fe;
          box-shadow: 0 20px 60px rgba(14,165,233,0.10), 0 2px 10px rgba(0,0,0,0.04);
          animation: fadeUp 0.55s ease both;
        }
        .info-row {
          display: flex; align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
          gap: 12px;
        }
        .info-row:last-child { border-bottom: none; }
        .download-btn {
          width: 100%;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff; border: none; border-radius: 14px;
          padding: 14px; font-size: 15px; font-weight: 700;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(14,165,233,0.30);
          transition: all 0.25s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .download-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(14,165,233,0.40); }
        .generate-btn {
          width: 100%;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff; border: none; border-radius: 14px;
          padding: 14px; font-size: 15px; font-weight: 700;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(16,185,129,0.30);
          transition: all 0.25s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .generate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(16,185,129,0.40); }
        .generate-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .logout-btn {
          background: none; border: 1.5px solid #e2e8f0;
          color: #64748b; border-radius: 10px;
          padding: 8px 18px; font-size: 13px;
          font-family: 'Poppins', sans-serif;
          cursor: pointer; transition: all 0.2s;
        }
        .logout-btn:hover { border-color: #fca5a5; color: #ef4444; background: #fff1f2; }
        .qr-img {
          animation: qrReveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          animation-delay: 0.2s;
        }
        .words-textarea {
          width: 100%; box-sizing: border-box;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          font-size: 13px; color: #0f172a;
          font-family: 'Poppins', sans-serif;
          background: #f8fafc;
          outline: none; resize: vertical;
          min-height: 90px;
          transition: all 0.2s;
          line-height: 1.6;
        }
        .words-textarea:focus {
          border-color: #0ea5e9;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(14,165,233,0.10);
        }
        .words-textarea::placeholder { color: #cbd5e1; }
        .step-msg {
          text-align: center;
          font-size: 13px; font-weight: 600;
          color: #0284c7;
          margin-bottom: 12px;
          padding: 10px 14px;
          background: #e0f2fe;
          border-radius: 10px;
          animation: fadeUp 0.3s ease;
        }
        .spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #f0f9ff 0%, #fff 55%, #f8fafc 100%)',
        padding: '40px 20px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Blobs */}
        <div style={{ position: 'absolute', top: '5%', right: '5%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '8%', left: '4%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(2,132,199,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#e0f2fe', color: '#0284c7',
                padding: '5px 14px', borderRadius: 100,
                fontSize: 12, fontWeight: 700, marginBottom: 8,
                border: '1px solid #bae6fd'
              }}>⚡ Dashboard</div>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.6px' }}>
                Hey, {user.full_name?.split(' ')[0]} 👋
              </h1>
              <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>Here's your subscription & QR overview</p>
            </div>
            <button className="logout-btn" onClick={() => navigate('/login')}>🚪 Logout</button>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

            {/* LEFT — User Details */}
            <div className="dash-card" style={{ padding: '32px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, boxShadow: '0 6px 20px rgba(14,165,233,0.28)', flexShrink: 0
                }}>👤</div>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 }}>{user.full_name}</h2>
                  <span style={{
                    background: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
                    color: '#fff', borderRadius: 100,
                    padding: '3px 12px', fontSize: 12, fontWeight: 600
                  }}>{user.plan_name}</span>
                </div>
              </div>

              {infoRows.map(row => (
                <div className="info-row" key={row.label}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{row.icon}</span>
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600, minWidth: 100, flexShrink: 0 }}>{row.label}</span>
                  {row.isLink ? (
                    <a href={row.value} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 13, color: '#0284c7', fontWeight: 500, textDecoration: 'none', wordBreak: 'break-all' }}>
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
                  padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <span>📅</span>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                    Subscribed on: {new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              )}
            </div>

            {/* RIGHT — Key Words + QR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Key Words Card */}
              <div className="dash-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>✨</span>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Key Words</h2>
                  {!qrFullUrl && (
                    <span style={{
                      background: '#fef3c7', color: '#d97706',
                      fontSize: 11, fontWeight: 700,
                      padding: '2px 10px', borderRadius: 100,
                      border: '1px solid #fde68a', marginLeft: 'auto'
                    }}>Required to generate QR</span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14, lineHeight: 1.6 }}>
                  Describe your business — AI will create 10 custom reviews for your customers
                </p>
                <textarea
                  className="words-textarea"
                  value={keyWords}
                  onChange={e => setKeyWords(e.target.value)}
                  placeholder="e.g. Best Electronic shop in city, premium quality products, great deals, trusted by 1000+ customers..."
                  disabled={generating}
                />
                {genStep && <div className="step-msg">{genStep}</div>}
                <button
                  className="generate-btn"
                  onClick={handleGenerateQR}
                  disabled={generating || !keyWords.trim()}
                  style={{ marginTop: 14 }}
                >
                  {generating
                    ? <><span className="spinner" /> Generating...</>
                    : qrFullUrl
                      ? '🔄 Regenerate QR'
                      : '⚡ Generate My QR Code'
                  }
                </button>
              </div>

              {/* QR Card */}
              <div className="dash-card" style={{ padding: '28px', textAlign: 'center' }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Your Google Review QR</h2>
                <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
                  Share with customers to collect Google reviews instantly
                </p>

                {qrFullUrl ? (
                  <>
                    <div style={{
                      background: '#f8fafc', borderRadius: 20,
                      border: '2px dashed #bae6fd',
                      padding: 20, marginBottom: 16, display: 'inline-block'
                    }}>
                      <img src={qrFullUrl} alt="QR Code" className="qr-img"
                        style={{ width: 180, height: 180, display: 'block', borderRadius: 12 }} />
                    </div>
                    <button className="download-btn" onClick={handleDownload}>
                      <span>⬇️</span> Download QR Code
                    </button>
                  </>
                ) : (
                  <div style={{
                    background: '#f8fafc', borderRadius: 20, padding: '36px 24px',
                    border: '2px dashed #e2e8f0', color: '#94a3b8', fontSize: 13
                  }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>🔲</div>
                    Add your key words above<br />to generate your QR code
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                  {['🔒 Encrypted', '⚡ Instant', '📱 Scannable'].map(badge => (
                    <span key={badge} style={{
                      background: '#f1f5f9', color: '#475569',
                      padding: '5px 12px', borderRadius: 100,
                      fontSize: 11, fontWeight: 600
                    }}>{badge}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}