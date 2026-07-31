import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateSmartReply } from '../api/api';

export default function SmartReply() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
 const [replies, setReplies] = useState([]);
const [generating, setGenerating] = useState(false);
const [error, setError] = useState('');
const [copiedIndex, setCopiedIndex] = useState(null);

  if (!user) return null;

  const isLocked = user.plan_name === 'Starter';

  const navItems = [
    { label: 'Home', to: '/dashboard' },
    { label: 'Profile', to: '/profile' },
    { label: 'Smart Reply', to: '/smart-reply' },
    { label: 'Plans', to: '/plans' },
    { label: 'Contact Us', to: '/contact' },
  ];

const handleGenerate = async () => {
  setError('');
  if (!customerName.trim() || !rating || !reviewText.trim()) {
    setError('Please fill customer name, rating, and review text.');
    return;
  }
  setGenerating(true);
  setReplies([]);
  setCopiedIndex(null);
  try {
    const res = await generateSmartReply({
      subscription_id: user.id,
      customer_name: customerName,
      rating,
      review_text: reviewText,
    });
    if (!res.data?.success) {
      setError(res.data?.message || 'Could not generate replies.');
      return;
    }
    setReplies(res.data.replies || []);
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong. Please try again.');
  } finally {
    setGenerating(false);
  }
};

const handleCopy = (text, index) => {
  navigator.clipboard.writeText(text).then(() => {
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  });
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
        .nav-link.active { color: #fff; background: linear-gradient(135deg, #0ea5e9, #0284c7); }
        .logout-btn {
          background: none; border: 1.5px solid #e2e8f0; color: #64748b; border-radius: 10px;
          padding: 8px 18px; font-size: 13px; cursor: pointer; white-space: nowrap;
        }
        .logout-btn:hover { border-color: #fca5a5; color: #ef4444; background: #fff1f2; }
        .sr-input, .sr-textarea {
          width: 100%; box-sizing: border-box; padding: 13px 16px;
          border-radius: 14px; border: 1.5px solid #e2e8f0;
          font-size: 14px; color: #0f172a; background: #f8fafc;
          outline: none; transition: all 0.2s; font-family: 'Poppins', sans-serif;
        }
        .sr-input:focus, .sr-textarea:focus {
          border-color: #0ea5e9; background: #fff; box-shadow: 0 0 0 4px rgba(14,165,233,0.10);
        }
        .sr-textarea { resize: vertical; min-height: 110px; line-height: 1.6; }
        .star-btn { font-size: 32px; cursor: pointer; transition: transform 0.15s; user-select: none; background: none; border: none; padding: 0; }
        .star-btn:hover { transform: scale(1.12); }
        .generate-btn {
          width: 100%;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff; border: none; border-radius: 14px;
          padding: 15px; font-size: 15px; font-weight: 700;
          cursor: pointer; box-shadow: 0 8px 28px rgba(14,165,233,0.30);
          transition: all 0.25s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .generate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(14,165,233,0.40); }
        .generate-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .spinner {
          width: 16px; height: 16px; border: 2.5px solid rgba(255,255,255,0.4);
          border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .copy-btn {
          background: #f0f9ff; color: #0284c7; border: 1.5px solid #bae6fd;
          border-radius: 10px; padding: 8px 16px; font-size: 13px; font-weight: 700; cursor: pointer;
        }
        .copy-btn:hover { background: #e0f2fe; }
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
                width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
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
            <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }}>🚪 Logout</button>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#e0f2fe', color: '#0284c7',
              padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 10,
              border: '1px solid #bae6fd'
            }}>✨ Smart Reply</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>AI Review Reply Generator</h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
              Paste a customer review, and get an SEO-friendly reply ready to post in one click.
            </p>
          </div>

          {isLocked ? (
            <div style={{
              background: '#fff', borderRadius: 24, border: '1.5px solid #e0f2fe',
              boxShadow: '0 20px 60px rgba(14,165,233,0.10)', padding: '48px 32px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>🔒</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Smart Reply is a Growth plan feature</h2>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 22, maxWidth: 380, margin: '0 auto 22px' }}>
                Upgrade to Growth to auto-generate personalized, SEO-friendly replies for every customer review.
              </p>
              <button className="generate-btn" style={{ maxWidth: 260, margin: '0 auto' }} onClick={() => navigate('/plans')}>
                ⬆️ Upgrade to Growth
              </button>
            </div>
          ) : (
            <div style={{
              background: '#fff', borderRadius: 24, border: '1.5px solid #e0f2fe',
              boxShadow: '0 20px 60px rgba(14,165,233,0.10)', padding: '32px 28px',
            }}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 7 }}>
                  Customer Name
                </label>
                <input
                  className="sr-input"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 10 }}>
                  Rating
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className="star-btn"
                      onClick={() => setRating(star)}
                      style={{ color: star <= rating ? '#f59e0b' : '#e2e8f0' }}
                    >★</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 22 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 7 }}>
                  Review Text
                </label>
                <textarea
                  className="sr-textarea"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  placeholder="Paste the customer's review here..."
                />
              </div>

              {error && (
                <div style={{
                  background: '#fff1f2', border: '1.5px solid #fecdd3', borderRadius: 12,
                  padding: '11px 15px', color: '#be123c', fontSize: 13, fontWeight: 500, marginBottom: 18,
                }}>⚠️ {error}</div>
              )}

              <button className="generate-btn" onClick={handleGenerate} disabled={generating}>
                {generating ? <><span className="spinner" /> Generating...</> : '✨ Generate Smart Reply'}
              </button>

             {replies.length > 0 && (
  <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <span style={{ fontSize: 12, fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      Choose Your Favorite Reply
    </span>
    {replies.map((r, i) => (
      <div key={i} style={{
        background: '#f0f9ff', border: '1.5px solid #bae6fd',
        borderRadius: 16, padding: '18px 20px', animation: 'fadeUp 0.4s ease both',
        animationDelay: `${i * 0.08}s`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: '#0ea5e9', background: '#e0f2fe',
            padding: '3px 10px', borderRadius: 100,
          }}>Option {i + 1}</span>
          <button className="copy-btn" onClick={() => handleCopy(r, i)}>
            {copiedIndex === i ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
        <p style={{ fontSize: 14, color: '#0f172a', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
          {r}
        </p>
      </div>
    ))}
  </div>
)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}