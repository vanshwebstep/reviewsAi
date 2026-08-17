import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin') || 'null');
const items = [
  { label: '📊 Dashboard', to: '/admin/dashboard' },
  { label: '👥 Users', to: '/admin/users' },
  { label: '📦 Plans', to: '/admin/plans' },
  { label: '🔥 Promo', to: '/admin/promo' },
];

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Poppins, sans-serif', background: '#f8fafc' }}>
      <aside style={{ width: 220, background: '#0f172a', padding: '24px 16px', flexShrink: 0 }}>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 28, padding: '0 8px' }}>⚡ Admin Panel</div>
        {items.map(item => (
          <Link key={item.to} to={item.to} style={{
            display: 'block', padding: '10px 14px', borderRadius: 10, marginBottom: 6,
            textDecoration: 'none', fontSize: 13.5, fontWeight: 600,
            color: location.pathname.startsWith(item.to) ? '#fff' : '#94a3b8',
            background: location.pathname.startsWith(item.to) ? 'linear-gradient(135deg,#0ea5e9,#0284c7)' : 'transparent',
          }}>{item.label}</Link>
        ))}
        <button onClick={logout} style={{
          marginTop: 20, width: '100%', background: 'none', border: '1px solid #334155', color: '#94a3b8',
          borderRadius: 10, padding: '10px', fontSize: 13, cursor: 'pointer',
        }}>🚪 Logout {admin?.name ? `(${admin.name})` : ''}</button>
      </aside>
      <main style={{ flex: 1, padding: '32px 36px', overflowX: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}