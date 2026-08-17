import { useEffect, useState } from 'react';
import { adminListUsers, adminUpdateUser, adminDeleteUser, adminDeleteBusinessProfile, adminGenerateQR, resolveQrUrl } from '../../api/adminApi';
const initials = (name) => (name || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrLoadingId, setQrLoadingId] = useState(null);

  const load = () => {
    setLoading(true);
    adminListUsers().then(r => setUsers(r.data?.users || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const regenerateQR = async (profileId) => {
    setQrLoadingId(profileId);
    const res = await adminGenerateQR({ profile_id: profileId });
    setQrLoadingId(null);
    if (!res.data?.success) { alert(res.data?.message || 'QR generation failed'); return; }
    load();
  };

  const saveEdit = async () => {
    setSaving(true);
    await adminUpdateUser(editing);
    setSaving(false);
    setEditing(null);
    load();
  };

  const deleteUser = async (id, name) => {
    if (!confirm(`Delete "${name}" and all their profiles/reviews? This can't be undone.`)) return;
    await adminDeleteUser({ id });
    load();
  };

  const deleteProfile = async (id) => {
    if (!confirm('Delete this business profile and its reviews?')) return;
    await adminDeleteBusinessProfile({ id });
    load();
  };

  return (
    <>
      <style>{`
        * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        .au-search {
          width: 260px; padding: 10px 14px 10px 36px; border-radius: 11px; border: 1.5px solid #e2e8f0;
          font-size: 13.5px; outline: none; transition: all 0.2s; background: #fff;
        }
        .au-search:focus { border-color: #0ea5e9; box-shadow: 0 0 0 4px rgba(14,165,233,0.10); }
        .au-row { transition: background 0.15s; }
        .au-row:hover { background: #f8fafc; }
        .au-icon-btn {
          width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e2e8f0;
          background: #fff; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; font-size: 12.5px;
        }
        .au-icon-btn:hover { border-color: #7dd3fc; background: #f0f9ff; }
        .au-icon-btn.danger:hover { border-color: #fca5a5; background: #fff1f2; }
        .au-input {
          width: 100%; padding: 11px 13px; border-radius: 10px; border: 1.5px solid #e2e8f0;
          font-size: 13.5px; outline: none; font-family: inherit; box-sizing: border-box; transition: all 0.2s;
        }
        .au-input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 4px rgba(14,165,233,0.10); }
        .au-primary-btn {
          background: linear-gradient(135deg,#0ea5e9,#0284c7); color: #fff; border: none;
          border-radius: 11px; padding: 12px; font-size: 13.5px; font-weight: 700;
          cursor: pointer; box-shadow: 0 8px 22px rgba(14,165,233,0.32); transition: all 0.2s;
        }
        .au-primary-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(14,165,233,0.4); }
        .au-primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={h1}>Users</h1>
            <p style={{ fontSize: 13, color: '#64748b' }}>{users.length} total subscriber{users.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, opacity: 0.5 }}>🔍</span>
            <input placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)} className="au-search" />
          </div>
        </div>

        <div style={card}>
          {loading ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13.5 }}>Loading users...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13.5 }}>
              {search ? 'No users match your search.' : 'No users yet.'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={th}>User</th><th style={th}>Plan</th><th style={th}>Amount</th>
                  <th style={th}>Profiles</th><th style={{ ...th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <>
                    <tr key={u.id} className="au-row" style={tr}>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={avatar}>{initials(u.full_name)}</div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13.5 }}>{u.full_name}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={td}><span style={planBadge}>{u.plan_name}</span></td>
                      <td style={td}>${u.plan_amount}</td>
                      <td style={td}>
                        <button onClick={() => setExpanded(expanded === u.id ? null : u.id)} style={linkBtn}>
                          {u.profiles.length} {expanded === u.id ? '▲' : '▼'}
                        </button>
                      </td>
                      <td style={{ ...td, textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button className="au-icon-btn" onClick={() => setEditing({ ...u })} title="Edit">✏️</button>
                          <button className="au-icon-btn danger" onClick={() => deleteUser(u.id, u.full_name)} title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                    {expanded === u.id && (
                      u.profiles.length === 0 ? (
                        <tr style={{ background: '#f8fafc' }}><td style={td} colSpan={5}>
                          <span style={{ color: '#94a3b8', fontSize: 12.5 }}>No business profiles yet.</span>
                        </td></tr>
                      ) : u.profiles.map(p => (
                        <tr key={`p-${p.id}`} style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ ...td, paddingLeft: 44 }} colSpan={2}>
                            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>↳ {p.business_name}</div>
                            <a href={p.google_business_url} target="_blank" rel="noreferrer" style={{ fontSize: 11.5, color: '#0284c7' }}>{p.google_business_url}</a>
                          </td>
                          <td style={td} colSpan={2}>
                           {p.qr_code_path
  ? <a href={resolveQrUrl(p.qr_code_path)} target="_blank" rel="noreferrer" style={{ ...linkBtn, marginRight: 10 }}>View QR</a>
  : <span style={{ color: '#94a3b8', fontSize: 12, marginRight: 10 }}>No QR yet</span>}
                            <button onClick={() => regenerateQR(p.id)} disabled={qrLoadingId === p.id}
                              style={{ ...actionBtn, fontSize: 11.5, padding: '5px 10px' }}>
                              {qrLoadingId === p.id ? 'Generating...' : p.qr_code_path ? '🔄 Regenerate' : '⚡ Generate'}
                            </button>
                          </td>
                          <td style={{ ...td, textAlign: 'right' }}>
                            <button onClick={() => deleteProfile(p.id)} style={dangerBtn}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {editing && (
          <div style={modalOverlay} onClick={() => setEditing(null)}>
            <div style={modalBox} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>Edit user</h3>
                <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#94a3b8' }}>✕</button>
              </div>

              <label style={label}>Full name</label>
              <input className="au-input" value={editing.full_name || ''} onChange={e => setEditing({ ...editing, full_name: e.target.value })} />
              <label style={label}>Email</label>
              <input className="au-input" value={editing.email || ''} onChange={e => setEditing({ ...editing, email: e.target.value })} />
              <label style={label}>Phone</label>
              <input className="au-input" value={editing.phone || ''} onChange={e => setEditing({ ...editing, phone: e.target.value })} />
              <label style={label}>Plan name</label>
              <input className="au-input" value={editing.plan_name || ''} onChange={e => setEditing({ ...editing, plan_name: e.target.value })} />
              <label style={label}>Plan amount</label>
              <input className="au-input" type="number" value={editing.plan_amount || ''} onChange={e => setEditing({ ...editing, plan_amount: e.target.value })} />

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button onClick={saveEdit} disabled={saving} className="au-primary-btn" style={{ flex: 1 }}>
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                <button onClick={() => setEditing(null)} style={{
                  flex: 1, border: '1.5px solid #e2e8f0', background: '#fff', color: '#334155',
                  borderRadius: 11, padding: 12, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const h1 = { fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 2 };
const card = { background: '#fff', borderRadius: 18, border: '1.5px solid #e0f2fe', boxShadow: '0 8px 30px rgba(14,165,233,0.06)', overflow: 'hidden' };
const tr = { borderBottom: '1px solid #f1f5f9' };
const th = { textAlign: 'left', padding: '13px 16px', fontSize: 11.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' };
const td = { padding: '13px 16px', fontSize: 13.5, color: '#334155' };
const avatar = {
  width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0,
};
const planBadge = { background: '#e0f2fe', color: '#0284c7', padding: '4px 12px', borderRadius: 100, fontSize: 11.5, fontWeight: 700 };
const actionBtn = { border: '1.5px solid #e2e8f0', background: '#fff', color: '#334155', borderRadius: 8, padding: '7px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' };
const dangerBtn = { ...actionBtn, color: '#ef4444', borderColor: '#fecaca' };
const linkBtn = { background: 'none', border: 'none', color: '#0284c7', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', padding: 0 };
const label = { display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6, marginTop: 14 };
const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 };
const modalBox = { background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 420, boxShadow: '0 24px 64px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' };