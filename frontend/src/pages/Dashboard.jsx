import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getBusinessProfiles,
  addBusinessProfile,
  deleteBusinessProfile,
  generateQR,
  generateAIReviews,
  saveKeyWords,
  updateBusinessProfile
} from '../api/api';

const url = import.meta.env.VITE_BASE_URL;
const BACKEND_BASE = url;

function ProfileCard({ profile, subscriptionId, onDeleted, onUpdated }) {
  const [keyWords, setKeyWords] = useState(profile.key_words || '');
  const [qrPath, setQrPath] = useState(profile.qr_code_path || null);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState('');
  const [genError, setGenError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [needsRegen, setNeedsRegen] = useState(false);

  // 👇 reviewToken hata ke seedha reviewUrl state (single source of truth)
  const [reviewUrl, setReviewUrl] = useState(
    profile.review_token ? `${BACKEND_BASE}/api/review.php?token=${profile.review_token}` : null
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.business_name);
  const [editUrl, setEditUrl] = useState(profile.google_business_url);
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);

  const qrFullUrl = qrPath ? `${BACKEND_BASE}/${qrPath}` : null;
  const handleDownload = async () => {
    if (!qrFullUrl) return;
    try {
      const res = await fetch(qrFullUrl, { mode: 'cors' });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `qr-${profile.business_name?.replace(/\s+/g, '-') || 'code'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl); // memory cleanup
    } catch (err) {
      console.error('QR download failed:', err);
      // optional: setGenError('Could not download QR. Please try again.');
    }
  };
  const handleGenerateQR = async () => {
    if (!keyWords.trim()) {
      setGenError('Please enter key words first!');
      return;
    }
    setGenerating(true);
    setGenError('');
    try {
      setGenStep('💾 Saving your key words...');
      const saveRes = await saveKeyWords({
        profile_id: profile.id,
        subscription_id: subscriptionId,
        key_words: keyWords,
      });
      if (!saveRes.data?.success) {
        throw new Error(saveRes.data?.message || 'Could not save key words.');
      }

      setGenStep('🤖 Generating AI reviews...');
      const reviewRes = await generateAIReviews({
        profile_id: profile.id,
        subscription_id: subscriptionId,
        key_words: keyWords,
      });
      if (!reviewRes.data?.success) {
        throw new Error(reviewRes.data?.message || 'AI review generation had an issue — please try again.');
      }

      setGenStep('🔗 Generating QR Code...');
      const qrRes = await generateQR({
        profile_id: profile.id,
        subscription_id: subscriptionId,
      });
      if (!qrRes.data?.success || !qrRes.data?.qr_path) {
        throw new Error(qrRes.data?.message || 'Could not generate QR code.');
      }

      setQrPath(qrRes.data.qr_path);
      setReviewUrl(qrRes.data.review_url || null);
      setNeedsRegen(false); // 👈 regenerate hote hi warning clear
      setGenStep('');
    } catch (err) {
      setGenError(err.message || 'Something went wrong. Please try again.');
      setGenStep('');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!reviewUrl) return;
    try {
      await navigator.clipboard.writeText(reviewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = reviewUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editUrl.trim()) {
      setEditError('Please fill both fields.');
      return;
    }
    setSaving(true);
    setEditError('');
    try {
      const res = await updateBusinessProfile({
        profile_id: profile.id,
        subscription_id: subscriptionId,
        business_name: editName,
        google_business_url: editUrl,
      });
      if (!res.data?.success) {
        setEditError(res.data?.message || 'Could not update profile.');
        return;
      }

      onUpdated(profile.id, { business_name: editName, google_business_url: editUrl });

      // 👇 QR ko locally bhi clear karo agar backend ne clear kiya
      if (res.data?.qr_cleared) {
        setQrPath(null);
        setReviewUrl(null);
        setNeedsRegen(true);
      }

      setIsEditing(false);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${profile.business_name}"? This will remove its QR code and reviews.`)) return;
    setDeleting(true);
    try {
      await deleteBusinessProfile({ profile_id: profile.id, subscription_id: subscriptionId });
      onDeleted(profile.id);
    } catch {
      setDeleting(false);
    }
  };


  // ProfileCard return — replace the grid + right column
  return (
    <div className="dash-card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        {isEditing ? (
          <div style={{ flex: 1, marginRight: 12 }}>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Business Name"
              style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, marginBottom: 8, outline: 'none' }}
            />
            <input
              value={editUrl}
              onChange={e => setEditUrl(e.target.value)}
              placeholder="Google Business URL"
              style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none' }}
            />
            {editError && <div style={{ color: '#dc2626', fontSize: 11, marginTop: 6 }}>⚠️ {editError}</div>}
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={handleSaveEdit} disabled={saving} className="download-btn" style={{ padding: '7px 14px', fontSize: 12, width: 'auto' }}>
                {saving ? 'Saving...' : '✓ Save'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditName(profile.business_name);
                  setEditUrl(profile.google_business_url);
                  setEditError('');
                }}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>{profile.business_name}</h3>
            <a href={profile.google_business_url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: '#0284c7', textDecoration: 'none' }}>
              {profile.google_business_url}
            </a>
          </div>
        )}

        {!isEditing && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setIsEditing(true)} style={{
              background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontSize: 13
            }}>✏️</button>
            <button onClick={handleDelete} disabled={deleting} style={{
              background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 13
            }}>{deleting ? '...' : '🗑️'}</button>
          </div>
        )}
      </div>

      {/* 👇 compulsory regenerate warning banner */}
      {needsRegen && (
        <div style={{
          background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 10,
          padding: '10px 14px', color: '#b45309', fontSize: 12, fontWeight: 600,
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8
        }}>
          ⚠️ Business details changed — old QR code is invalid. Please regenerate below.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <textarea
            className="words-textarea"
            value={keyWords}
            onChange={e => setKeyWords(e.target.value)}
            placeholder="Describe this business — AI will create 10 custom reviews..."
            disabled={generating}
            style={{ minHeight: 70, flex: 1 }}
          />
          {genStep && <div className="step-msg">{genStep}</div>}
          {genError && <div className="error-msg" style={{ color: '#dc2626', fontSize: 12, marginTop: 6 }}>⚠️ {genError}</div>}
          <button
            className="generate-btn"
            onClick={handleGenerateQR}
            disabled={generating || !keyWords.trim()}
            style={{ marginTop: 12, ...(needsRegen ? { boxShadow: '0 6px 20px rgba(217,119,6,0.35)', background: 'linear-gradient(135deg, #f59e0b, #d97706)' } : {}) }}
          >
            {generating ? <><span className="spinner" /> Generating...</> : needsRegen ? '🔁 Regenerate QR (required)' : qrFullUrl ? '🔄 Regenerate QR' : '⚡ Generate QR Code'}
          </button>
        </div>

        <div style={{
          textAlign: 'center', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          {qrFullUrl ? (
            <>
              <img src={qrFullUrl} alt="QR Code" style={{ width: 160, height: 160, borderRadius: 10 }} />
              <button className="download-btn" onClick={handleDownload} style={{ marginTop: 10, padding: '8px', fontSize: 12, width: '100%', maxWidth: 160 }}>
                ⬇️ Download
              </button>
              {reviewUrl && (
                <button
                  onClick={handleCopyUrl}
                  style={{
                    marginTop: 8, padding: '8px', fontSize: 12, width: '100%', maxWidth: 160,
                    background: copied ? '#dcfce7' : '#f0f9ff',
                    color: copied ? '#16a34a' : '#0284c7',
                    border: `1.5px solid ${copied ? '#bbf7d0' : '#bae6fd'}`,
                    borderRadius: 10, cursor: 'pointer', fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  {copied ? '✓ Copied!' : '🔗 Copy URL'}
                </button>
              )}
            </>
          ) : (
            <div style={{
              background: needsRegen ? '#fffbeb' : '#f8fafc', borderRadius: 14, width: '100%', height: '100%',
              border: `2px dashed ${needsRegen ? '#fde68a' : '#e2e8f0'}`, color: needsRegen ? '#b45309' : '#94a3b8', fontSize: 12,
              minHeight: 140,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 12px'
            }}>
              <span style={{ fontSize: 26 }}>{needsRegen ? '⚠️' : '📱'}</span>
              <span>{needsRegen ? 'QR invalidated — regenerate now' : 'Add key words to generate QR'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [maxProfiles, setMaxProfiles] = useState(1);
  const [hasSmartReply, setHasSmartReply] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadProfiles();
  }, [user]);

  const loadProfiles = async () => {
    setLoadingProfiles(true);
    try {
      const res = await getBusinessProfiles(user.id);
      if (res.data?.success) {
        setProfiles(res.data.profiles || []);
        setMaxProfiles(res.data.max_profiles ?? 1);
        setHasSmartReply(!!res.data.has_smart_reply);
      }
    } finally {
      setLoadingProfiles(false);
    }
  };

  const handleAddProfile = async () => {
    if (!newName.trim() || !newUrl.trim()) {
      setAddError('Please fill both fields.');
      return;
    }
    setAddLoading(true);
    setAddError('');
    try {
      const res = await addBusinessProfile({
        subscription_id: user.id,
        business_name: newName,
        google_business_url: newUrl,
      });
      if (!res.data?.success) {
        setAddError(res.data?.message || 'Could not add profile.');
        return;
      }
      setShowAddModal(false);
      setNewName('');
      setNewUrl('');
      loadProfiles();
    } catch (err) {
      setAddError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleProfileDeleted = (profileId) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  };
  const handleProfileUpdated = (profileId, updates) => {
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, ...updates } : p));
  };

  if (!user) return null;

  const limitReached = profiles.length >= maxProfiles;

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Profile', to: '/profile' },
    { label: 'Smart Reply', to: '/smart-reply', locked: !hasSmartReply },
    { label: 'Plans', to: '/plans' },
    { label: 'Contact Us', to: '/contact' },
  ];

  return (
    <>
      <style>{`
        * { font-family: 'Poppins', sans-serif; }
        .dash-card {
          background: #fff; border-radius: 24px; border: 1.5px solid #e0f2fe;
          box-shadow: 0 20px 60px rgba(14,165,233,0.10), 0 2px 10px rgba(0,0,0,0.04);
        }
        .info-row { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; gap: 12px; }
        .info-row:last-child { border-bottom: none; }
        .generate-btn {
          width: 100%; background: linear-gradient(135deg, #10b981, #059669); color: #fff;
          border: none; border-radius: 12px; padding: 11px; font-size: 13px; font-weight: 700;
          cursor: pointer; box-shadow: 0 6px 20px rgba(16,185,129,0.28);
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .generate-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .download-btn {
          width: 100%; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff;
          border: none; border-radius: 10px; cursor: pointer;
        }
        .logout-btn {
          background: none; border: 1.5px solid #e2e8f0; color: #64748b; border-radius: 10px;
          padding: 8px 18px; font-size: 13px; cursor: pointer; white-space: nowrap;
        }
        .logout-btn:hover { border-color: #fca5a5; color: #ef4444; background: #fff1f2; }
        .words-textarea {
          width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 10px;
          border: 1.5px solid #e2e8f0; font-size: 12px; color: #0f172a; background: #f8fafc;
          outline: none; resize: vertical; font-family: 'Poppins', sans-serif;
        }
        .step-msg {
          text-align: center; font-size: 11px; font-weight: 600; color: #0284c7;
          margin-top: 8px; padding: 6px 10px; background: #e0f2fe; border-radius: 8px;
        }
        .spinner {
          width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .nav-link {
          text-decoration: none; color: #64748b; font-size: 13px; font-weight: 600;
          padding: 8px 16px; border-radius: 100px; transition: all 0.2s; white-space: nowrap;
        }
        .nav-link:hover { color: #0284c7; background: #f0f9ff; }
        .nav-link.active { color: #fff; background: linear-gradient(135deg, #0ea5e9, #0284c7); }
        .nav-link.locked { color: #cbd5e1; cursor: pointer; }
       .add-profile-btn {
  border: 2px dashed #bae6fd; background: #f0f9ff; border-radius: 20px;
  color: #0284c7; font-weight: 700; font-size: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 28px; min-height: 100px; width: 100%;
}
        .add-profile-btn:disabled { opacity: 0.6; cursor: not-allowed; color: #94a3b8; border-color: #e2e8f0; background: #f8fafc; }
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
            padding: '14px 18px', marginBottom: 28, flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
              }}>⚡</div>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>ReviewsAI</span>
            </div>

            <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', overflowX: 'auto' }}>
              {navItems.map(item => (
                <Link key={item.to} to={item.to}
                  className={`nav-link ${location.pathname === item.to ? 'active' : ''}`}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }}>
              🚪 Logout
            </button>
          </div>

          {/* Welcome */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Hey, {user.full_name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0' }}>
              {user.plan_name} plan · {profiles.length}/{maxProfiles} business profile{maxProfiles > 1 ? 's' : ''} used
            </p>
          </div>

          {/* Profiles grid */}
          {loadingProfiles ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>Loading your profiles...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
              {profiles.map(profile => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  subscriptionId={user.id}
                  onDeleted={handleProfileDeleted}
                  onUpdated={handleProfileUpdated}
                />
              ))}

              {limitReached ? (
                <div className="dash-card" style={{ padding: 28, textAlign: 'center' }}>
                  <p style={{ color: '#64748b', fontSize: 14, marginBottom: 14 }}>
                    You've used all {maxProfiles} profile{maxProfiles > 1 ? 's' : ''} on your <strong>{user.plan_name}</strong> plan.
                  </p>
                  <button className="download-btn" style={{ padding: '12px 24px', fontWeight: 700, width: 'auto' }}
                    onClick={() => navigate('/plans')}>
                    ⬆️ Upgrade to add more profiles
                  </button>
                </div>
              ) : (
                <button className="add-profile-btn" onClick={() => setShowAddModal(true)}>
                  ➕ Add Business Profile
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Profile Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20
        }}>
          <div className="dash-card" style={{ padding: 28, width: '100%', maxWidth: 420 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>Add Business Profile</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Business Name</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. My Second Store"
                style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Google Business URL</label>
              <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="Paste Google Business profile URL"
                style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none' }} />
            </div>
            {addError && <div style={{ color: '#dc2626', fontSize: 12, marginBottom: 14 }}>⚠️ {addError}</div>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowAddModal(false)} style={{
                flex: 1, background: '#f1f5f9', border: 'none', borderRadius: 10, padding: 12, fontWeight: 600, cursor: 'pointer'
              }}>Cancel</button>
              <button onClick={handleAddProfile} disabled={addLoading} className="download-btn" style={{ flex: 1, padding: 12, fontWeight: 700 }}>
                {addLoading ? 'Adding...' : 'Add Profile'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}