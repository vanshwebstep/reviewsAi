import { useEffect, useState } from 'react';
import { adminListPlans, adminAddPlan, adminUpdatePlan, adminDeletePlan } from '../../api/adminApi';

const blank = { name: '', price: '', max_profiles: 1, is_popular: false, annual_discount_percent: 20, currency: 'USD', features: [] };

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(blank);
  const [featuresText, setFeaturesText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminListPlans().then(r => setPlans(r.data?.plans || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ ...p });
    setFeaturesText((p.features || []).join('\n'));
    setError('');
    setShowForm(true);
  };

  const startAdd = () => {
    setEditingId(null);
    setForm(blank);
    setFeaturesText('');
    setError('');
    setShowForm(true);
  };

  const resetForm = () => { setEditingId(null); setForm(blank); setFeaturesText(''); setShowForm(false); setError(''); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, features: featuresText.split('\n').map(f => f.trim()).filter(Boolean) };
    try {
      const res = editingId ? await adminUpdatePlan({ ...payload, id: editingId }) : await adminAddPlan(payload);
      if (!res.data?.success) { setError(res.data?.message || 'Something went wrong'); return; }
      resetForm();
      load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id, name) => {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    const res = await adminDeletePlan({ id });
    if (!res.data?.success) { alert(res.data?.message || 'Delete failed'); return; }
    load();
  };

  return (
    <>
      <style>{`
        * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        .ap-plan-card {
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 18px;
          padding: 24px; position: relative; transition: all 0.25s ease;
          display: flex; flex-direction: column;
        }
        .ap-plan-card:hover {
          border-color: #7dd3fc; box-shadow: 0 16px 40px rgba(14,165,233,0.12);
          transform: translateY(-3px);
        }
        .ap-plan-card.popular { border-color: #0ea5e9; box-shadow: 0 10px 32px rgba(14,165,233,0.14); }
        .ap-icon-btn {
          width: 34px; height: 34px; border-radius: 9px; border: 1.5px solid #e2e8f0;
          background: #fff; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; font-size: 13.5px;
        }
        .ap-icon-btn:hover { border-color: #7dd3fc; background: #f0f9ff; }
        .ap-icon-btn.danger:hover { border-color: #fca5a5; background: #fff1f2; }
        .ap-add-card {
          border: 1.5px dashed #cbd5e1; border-radius: 18px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px; cursor: pointer;
          transition: all 0.2s; min-height: 200px; background: #f8fafc;
        }
        .ap-add-card:hover { border-color: #0ea5e9; background: #f0f9ff; }
        .ap-input {
          width: 100%; padding: 11px 13px; border-radius: 10px; border: 1.5px solid #e2e8f0;
          font-size: 13.5px; outline: none; font-family: inherit; box-sizing: border-box; transition: all 0.2s;
        }
        .ap-input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 4px rgba(14,165,233,0.10); }
        .ap-primary-btn {
          background: linear-gradient(135deg,#0ea5e9,#0284c7); color: #fff; border: none;
          border-radius: 11px; padding: 12px 20px; font-size: 13.5px; font-weight: 700;
          cursor: pointer; box-shadow: 0 8px 22px rgba(14,165,233,0.32); transition: all 0.2s;
        }
        .ap-primary-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(14,165,233,0.4); }
        .ap-primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={h1}>Plans</h1>
            <p style={{ fontSize: 13, color: '#64748b' }}>{plans.length} active plan{plans.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={startAdd} className="ap-primary-btn">+ Add new plan</button>
        </div>

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13.5 }}>Loading plans...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 18 }}>
            {plans.map(p => (
              <div key={p.id} className={`ap-plan-card ${p.is_popular ? 'popular' : ''}`}>
             {!!p.is_popular && (
                  <div style={{
                    position: 'absolute', top: -13, left: 24,
                    background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', color: '#fff',
                    fontSize: 10.5, fontWeight: 700, padding: '4px 12px', borderRadius: 100,
                    boxShadow: '0 4px 12px rgba(14,165,233,0.35)',
                  }}>✦ Most popular</div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    {p.name}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="ap-icon-btn" onClick={() => startEdit(p)} title="Edit">✏️</button>
                    <button className="ap-icon-btn danger" onClick={() => remove(p.id, p.name)} title="Delete">🗑️</button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#64748b' }}>{p.currency}</span>
                  <span style={{ fontSize: 34, fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: '-1px' }}>{p.price}</span>
                  <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 2 }}>/mo</span>
                </div>

                <div style={{ height: 1, background: '#f1f5f9', margin: '14px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 6, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#475569' }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: 6, background: '#e0f2fe', color: '#0284c7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0,
                    }}>🏢</span>
                    {p.max_profiles} business profile{p.max_profiles > 1 ? 's' : ''}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#475569' }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: 6, background: '#ecfdf5', color: '#059669',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0,
                    }}>%</span>
                    {p.annual_discount_percent}% off on annual billing
                  </div>
                  {(p.features || []).slice(0, 3).map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: '#64748b' }}>
                      <span style={{ color: '#0ea5e9', flexShrink: 0 }}>✓</span> {f}
                    </div>
                  ))}
                  {(p.features || []).length > 3 && (
                    <span style={{ fontSize: 11.5, color: '#94a3b8' }}>+{p.features.length - 3} more feature{p.features.length - 3 > 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            ))}

            <div className="ap-add-card" onClick={startAdd}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', background: '#e0f2fe', color: '#0284c7',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700,
              }}>+</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Add new plan</span>
            </div>
          </div>
        )}

        {showForm && (
          <div style={modalOverlay} onClick={resetForm}>
            <form onSubmit={submit} style={modalBox} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>{editingId ? 'Edit plan' : 'Add new plan'}</h3>
                <button type="button" onClick={resetForm} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#94a3b8' }}>✕</button>
              </div>

              <label style={label}>Plan name</label>
              <input className="ap-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Growth" required />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={label}>Price / month</label>
                  <input className="ap-input" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
                <div><label style={label}>Currency</label>
                  <input className="ap-input" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} /></div>
                <div><label style={label}>Max business profiles</label>
                  <input className="ap-input" type="number" value={form.max_profiles} onChange={e => setForm({ ...form, max_profiles: e.target.value })} required /></div>
                <div><label style={label}>Annual discount %</label>
                  <input className="ap-input" type="number" value={form.annual_discount_percent} onChange={e => setForm({ ...form, annual_discount_percent: e.target.value })} /></div>
              </div>

              <label style={{ ...label, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={!!form.is_popular} onChange={e => setForm({ ...form, is_popular: e.target.checked })} />
                Mark as "Most popular"
              </label>

              <label style={label}>Features (one per line)</label>
              <textarea className="ap-input" value={featuresText} onChange={e => setFeaturesText(e.target.value)}
                placeholder={'Unlimited reviews\nQR code generator\nPriority support'}
                style={{ height: 90, resize: 'vertical' }} />

              {error && (
                <div style={{ background: '#fff1f2', border: '1px solid #fca5a5', color: '#ef4444', fontSize: 12.5, borderRadius: 10, padding: '10px 14px', marginTop: 14 }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="submit" disabled={saving} className="ap-primary-btn" style={{ flex: 1 }}>
                  {saving ? 'Saving...' : editingId ? 'Update plan' : 'Create plan'}
                </button>
                <button type="button" onClick={resetForm} style={{
                  flex: 1, border: '1.5px solid #e2e8f0', background: '#fff', color: '#334155',
                  borderRadius: 11, padding: 12, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

const h1 = { fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 2 };
const label = { display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6, marginTop: 14 };
const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20, overflowY: 'auto' };
const modalBox = { background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' };