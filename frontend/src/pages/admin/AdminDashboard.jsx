import { useEffect, useState } from 'react';
import { adminGetDashboardStats } from '../../api/adminApi';

const initials = (name) => (name || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => { adminGetDashboardStats().then(r => setStats(r.data?.stats)); }, []);

  const cards = stats ? [
    { label: 'Total users', value: stats.total_users, icon: '👥', bg: '#e0f2fe', fg: '#0284c7' },
    { label: 'Business profiles', value: stats.total_profiles, icon: '🏢', bg: '#ede9fe', fg: '#7c3aed' },
    { label: 'Reviews generated', value: stats.total_reviews_generated, icon: '⭐', bg: '#fef3c7', fg: '#b45309' },
    { label: 'MRR', value: `$${Number(stats.mrr).toLocaleString()}`, icon: '💰', bg: '#d1fae5', fg: '#059669' },
    { label: 'Promo signups', value: stats.promo_users, icon: '🔥', bg: '#fee2e2', fg: '#dc2626' },
    { label: 'Promo slots left', value: stats.promo_slots_left, icon: '🎯', bg: '#e0f2fe', fg: '#0284c7' },
  ] : [];

  return (
    <>
      <style>{`
        * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        .ad-stat-card { transition: all 0.25s ease; }
        .ad-stat-card:hover { transform: translateY(-3px); box-shadow: 0 14px 34px rgba(14,165,233,0.12); border-color: #7dd3fc; }
        @media (max-width: 800px) { .ad-two-col { grid-template-columns: 1fr !important; } }
      `}</style>

      <div>
        <h1 style={h1}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Overview of your ReviewsAI business</p>

        {!stats ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13.5 }}>Loading stats...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
              {cards.map(c => (
                <div key={c.label} className="ad-stat-card" style={statCard}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 11, background: c.bg, color: c.fg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 14,
                  }}>{c.icon}</div>
                  <div style={{ fontSize: 25, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>{c.value}</div>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 3 }}>{c.label}</div>
                </div>
              ))}
            </div>

            <div className="ad-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={card}>
                <h3 style={cardTitle}>Plan breakdown</h3>
                {stats.plan_breakdown.length === 0 ? (
                  <p style={{ fontSize: 12.5, color: '#94a3b8' }}>No subscribers yet.</p>
                ) : stats.plan_breakdown.map(p => {
                  const max = Math.max(...stats.plan_breakdown.map(x => x.count));
                  const pct = max ? (p.count / max) * 100 : 0;
                  return (
                    <div key={p.plan_name} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                        <span style={{ color: '#334155', fontWeight: 600 }}>{p.plan_name}</span>
                        <span style={{ color: '#0284c7', fontWeight: 700 }}>{p.count}</span>
                      </div>
                      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#0ea5e9,#0284c7)', borderRadius: 100 }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={card}>
                <h3 style={cardTitle}>Recent signups</h3>
                {stats.recent_users.length === 0 ? (
                  <p style={{ fontSize: 12.5, color: '#94a3b8' }}>No signups yet.</p>
                ) : stats.recent_users.map((u, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0',
                    borderBottom: i < stats.recent_users.length - 1 ? '1px solid #f1f5f9' : 'none',
                  }}>
                    <div style={avatar}>{initials(u.full_name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.full_name}</div>
                      <div style={{ fontSize: 11.5, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                    </div>
                    <span style={planBadge}>{u.plan_name}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

const h1 = { fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 2 };
const card = { background: '#fff', border: '1.5px solid #e0f2fe', borderRadius: 18, padding: 22, boxShadow: '0 8px 30px rgba(14,165,233,0.06)' };
const cardTitle = { fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 16 };
const statCard = { background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16, padding: '18px 20px', boxShadow: '0 6px 20px rgba(14,165,233,0.05)' };
const avatar = {
  width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0,
};
const planBadge = { background: '#e0f2fe', color: '#0284c7', padding: '3px 10px', borderRadius: 100, fontSize: 10.5, fontWeight: 700, flexShrink: 0 };