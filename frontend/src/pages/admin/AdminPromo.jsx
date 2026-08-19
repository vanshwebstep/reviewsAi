import { useEffect, useState } from 'react';
import { adminGetPromoSettings, adminUpdatePromoSettings } from '../../api/adminApi';

export default function AdminPromo() {
  const [promo, setPromo] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetPromoSettings().then(r => setPromo(r.data?.promo)).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    await adminUpdatePromoSettings(promo);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <style>{`
        * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        .apr-input {
          width: 100%; padding: 12px 14px; border-radius: 11px; border: 1.5px solid #e2e8f0;
          font-size: 14px; outline: none; font-family: inherit; box-sizing: border-box; transition: all 0.2s;
        }
        .apr-input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 4px rgba(14,165,233,0.10); }
        .apr-toggle {
          width: 44px; height: 26px; border-radius: 100px; position: relative; cursor: pointer;
          transition: background 0.2s; border: none; flex-shrink: 0;
        }
        .apr-toggle-knob {
          position: absolute; top: 3px; width: 20px; height: 20px; border-radius: 50%;
          background: #fff; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.25);
        }
        .apr-save-btn {
          background: linear-gradient(135deg,#0ea5e9,#0284c7); color: #fff; border: none;
          border-radius: 11px; padding: 13px; font-size: 13.5px; font-weight: 700;
          cursor: pointer; box-shadow: 0 8px 22px rgba(14,165,233,0.32); transition: all 0.2s;
        }
        .apr-save-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(14,165,233,0.4); }
        .apr-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div>
        <h1 style={h1}>Promo & offers</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Controls the launch offer shown on the public pricing page.</p>

        {loading || !promo ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13.5 }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20, alignItems: 'start' }}>
            <div style={card}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Promo active</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>Show discount on pricing page</div>
                </div>
                <button
                  className="apr-toggle"
                  onClick={() => setPromo({ ...promo, is_active: !promo.is_active })}
                  style={{ background: promo.is_active ? '#0ea5e9' : '#e2e8f0' }}
                >
                  <span className="apr-toggle-knob" style={{ left: promo.is_active ? 21 : 3 }} />
                </button>
              </div>

              <div style={{ padding: 20 }}>
                <label style={label}>Discount percentage</label>
                <div style={{ position: 'relative' }}>
                  <input type="number" value={promo.percent} onChange={e => setPromo({ ...promo, percent: e.target.value })} className="apr-input" />
                  <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>%</span>
                </div>

                <label style={label}>Slot limit (first N signups)</label>
                <input type="number" value={promo.slot_limit} onChange={e => setPromo({ ...promo, slot_limit: e.target.value })} className="apr-input" />

                <button onClick={save} disabled={saving} className="apr-save-btn" style={{ marginTop: 20, width: '100%' }}>
                  {saving ? 'Saving...' : saved ? '✅ Saved' : 'Save changes'}
                </button>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>
                Live preview
              </div>
             {promo.is_active ? (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'linear-gradient(135deg,#fef3c7,#fde68a)', border: '1px solid #fbbf24',
    borderRadius: 100, padding: '11px 20px', fontSize: 13, color: '#92400e', fontWeight: 700,
  }}>
    🔥 {promo.percent || 0}% OFF · ⏳ Limited time — first {promo.slot_limit || 0} customers
  </div>
) : (
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
                  Promo is currently disabled. Pricing page will show regular prices only.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const h1 = { fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 2 };
const card = { background: '#fff', border: '1.5px solid #e0f2fe', borderRadius: 18, boxShadow: '0 8px 30px rgba(14,165,233,0.06)', overflow: 'hidden' };
const label = { display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 8, marginTop: 16 };