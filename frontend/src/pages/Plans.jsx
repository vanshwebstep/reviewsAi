import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { fetchPlans, createUpgradeCheckoutSession, cancelSubscription } from '../api/api';
import { useModal } from '../context/ModalContext';

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export default function Plans() {
  const navigate = useNavigate();
const { showConfirm, showAlert } = useModal();

  const location = useLocation();
  const [user, setUser] = useState(() => readStoredUser());
  const [plans, setPlans] = useState([]);
  
  const [pricingError, setPricingError] = useState('');
  const [promo, setPromo] = useState({ active: false, percent: 0, slots_left: 0, limit: 0 });
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelMsg, setCancelMsg] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false); // 👈 naya state

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    let active = true;
    fetchPlans()
      .then(r => {
        if (!active) return;
        const list = Array.isArray(r.data?.plans) ? r.data.plans : [];
        setPlans(list.map(plan => ({
          ...plan,
          is_popular: !!plan.is_popular,
          features: Array.isArray(plan.features) ? plan.features : [],
          price_monthly: Number(plan.price_monthly ?? plan.price ?? 0),
          promo_price_monthly: plan.promo_price_monthly != null ? Number(plan.promo_price_monthly) : null,
        })));
        setPromo(r.data?.promo || { active: false, percent: 0, slots_left: 0, limit: 0 });
        setPricingError(list.length ? '' : (r.data?.message || r.data?.error || 'Plans are unavailable right now.'));
      })
      .catch(err => {
        if (!active) return;
        setPlans([]);
        setPricingError(err.response?.data?.message || err.response?.data?.error || 'Plans are unavailable right now.');
      });
    return () => { active = false; };
  }, []);

  if (!user) return null;

  const navItems = [
    { label: 'Home', to: '/dashboard' },
    { label: 'Profile', to: '/profile' },
    { label: 'Smart Reply', to: '/smart-reply' },
    { label: 'Plans', to: '/plans' },
    { label: 'Contact Us', to: '/contact' },
  ];

  const handleUpgrade = async (plan) => {
    setUpgrading(true);
    setUpgradeError('');
    try {
      const frontendBaseUrl = `${window.location.origin}/demo/reviewsai/frontend`;
      const showPromo = promo.active && plan.promo_price_monthly != null;
      const res = await createUpgradeCheckoutSession({
        subscription_id: user.id,
        plan_name: plan.name,
        frontend_base_url: frontendBaseUrl,
        use_promo: showPromo,
      });
      if (!res.data?.success || !res.data?.checkout_url) {
  showAlert(res.data?.message || 'Could not start upgrade.', { variant: 'warning', title: 'Upgrade Failed' });
  return;
}
      window.location.assign(res.data.checkout_url);
    } catch (err) {
      setUpgradeError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setUpgrading(false);
    }
  };

  // 👇 button ab sirf modal kholta hai
const handleCancelClick = async () => {
  const confirmed = await showConfirm(
    "You'll keep access until the current billing period ends.",
    { title: 'Cancel your subscription?', variant: 'danger', icon: '⚠️', confirmText: 'Yes, Cancel', cancelText: 'Keep Subscription' }
  );
  if (!confirmed) return;

  setCancelling(true);
  setCancelMsg('');
  try {
    const res = await cancelSubscription({ subscription_id: user.id });
    if (!res.data?.success) {
      setCancelMsg(res.data?.message || 'Could not cancel.');
      showAlert(res.data?.message || 'Could not cancel.', { variant: 'warning', title: 'Oops' });
      return;
    }
    const updatedUser = { ...user, cancel_at_period_end: 1 };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCancelMsg('Subscription will cancel at period end.');
    showAlert('Your subscription will cancel at the end of the billing period.', { variant: 'success', title: 'Cancelled' });
  } catch (err) {
    showAlert(err.response?.data?.message || 'Something went wrong.', { variant: 'danger', title: 'Error' });
  } finally {
    setCancelling(false);
  }
};
  // 👇 asli cancel logic — modal ke "Yes, Cancel" par chalega
  const confirmCancel = async () => {
    setShowCancelModal(false);
    setCancelling(true);
    setCancelMsg('');
    try {
      const res = await cancelSubscription({ subscription_id: user.id });
      if (!res.data?.success) {
        setCancelMsg(res.data?.message || 'Could not cancel.');
        return;
      }
      setCancelMsg('Subscription will cancel at period end.');
    } catch (err) {
      setCancelMsg(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <style>{`
        * { font-family: 'Poppins', sans-serif; }
         .nav-link {
  text-decoration: none; color: #64748b; font-size: 15px; font-weight: 600;
  padding: 10px 18px; border-radius: 100px; transition: all 0.2s; white-space: nowrap;
}
        .nav-link:hover { color: #0284c7; background: #f0f9ff; }
        .nav-link.active {
          color: #fff; background: linear-gradient(135deg, #0ea5e9, #0284c7);
          box-shadow: 0 4px 14px rgba(14,165,233,0.3);
        }
        .logout-btn {
          background: none; border: 1.5px solid #e2e8f0; color: #64748b;
          border-radius: 10px; padding: 8px 18px; font-size: 13px;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .logout-btn:hover { border-color: #fca5a5; color: #ef4444; background: #fff1f2; }
        .plan-card {
          background: #fff; border-radius: 22px; padding: 32px 26px;
          border: 1.5px solid #e2e8f0; position: relative;
          display: flex; flex-direction: column; transition: all 0.3s ease;
        }
        .plan-card:hover { border-color: #7dd3fc; box-shadow: 0 16px 48px rgba(14,165,233,0.12); transform: translateY(-4px); }
        .plan-card.current { border-color: #10b981; box-shadow: 0 12px 40px rgba(16,185,129,0.15); }
        .plan-card.popular { border-color: #0ea5e9; box-shadow: 0 12px 40px rgba(14,165,233,0.15); }
        .plan-btn {
          width: 100%; border: none; border-radius: 12px; padding: 14px;
          font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.25s; margin-top: auto;
        }
        .plan-btn-upgrade {
          background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff;
          box-shadow: 0 6px 20px rgba(14,165,233,0.35);
        }
        .plan-btn-upgrade:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(14,165,233,0.45); }
        .plan-btn-current {
          background: #ecfdf5; color: #059669; border: 1.5px solid #a7f3d0; cursor: default;
        }
        .modal-backdrop {
          position: fixed; inset: 0; background: rgba(15,23,42,0.55);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px; backdrop-filter: blur(2px);
          animation: fadeIn 0.15s ease;
        }
        .modal-card {
          background: #fff; borderRadius: 20px; border-radius: 20px;
          padding: 28px 26px; max-width: 380px; width: 100%;
          box-shadow: 0 24px 60px rgba(15,23,42,0.25);
          animation: popIn 0.18s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.94) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .modal-btn-secondary {
          border: 1.5px solid #e2e8f0; background: #fff; color: #475569;
          border-radius: 10px; padding: 11px 18px; font-size: 13.5px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .modal-btn-secondary:hover { border-color: #cbd5e1; background: #f8fafc; }
        .modal-btn-danger {
          border: none; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff;
          border-radius: 10px; padding: 11px 18px; font-size: 13.5px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; box-shadow: 0 6px 18px rgba(239,68,68,0.3);
        }
        .modal-btn-danger:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(239,68,68,0.4); }
        .modal-btn-danger:disabled { opacity: 0.7; cursor: default; transform: none; }
        @media (max-width: 900px) { .plans-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .plans-grid { grid-template-columns: 1fr !important; } }
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
            padding: '14px 18px', marginBottom: 32, boxShadow: '0 8px 30px rgba(14,165,233,0.08)',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
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
            <button className="logout-btn" onClick={() => {
              localStorage.removeItem('user'); localStorage.removeItem('token'); navigate('/login');
            }}>🚪 Logout</button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Your Plan</h1>
            {!user.cancel_at_period_end ? (
              <button
                onClick={handleCancelClick}
                disabled={cancelling}
                style={{
                  marginTop: 10, background: 'none', border: '1.5px solid #fca5a5', color: '#ef4444',
                  borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                {cancelling ? 'Cancelling...' : 'Cancel subscription'}
              </button>
            ) : (
              <p style={{ color: '#ef4444', fontSize: 13, marginTop: 6 }}>Subscription set to cancel at period end.</p>
            )}
           
            <p style={{ color: '#64748b', fontSize: 14 }}>
              You're currently on <strong style={{ color: '#0284c7' }}>{user.plan_name}</strong> — upgrade anytime.
            </p>
          </div>

          <div className="plans-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, alignItems: 'stretch',
          }}>
            {plans.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', fontSize: 14, padding: '28px 16px' }}>
                {pricingError || 'Loading plans...'}
              </div>
            )}
            {plans.map(plan => {
              const isCurrent = plan.name === user.plan_name;
              const showPromo = promo.active && plan.promo_price_monthly != null;
              return (
                <div key={plan.id} className={`plan-card ${isCurrent ? 'current' : plan.is_popular ? 'popular' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    {showPromo && (
                      <span style={{ textDecoration: 'line-through', color: '#878d94', fontSize: 16, fontWeight: 700 }}>
                        ${plan.price_monthly}
                      </span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#64748b' }}>$</span>
                      <span style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                        {showPromo ? plan.promo_price_monthly : plan.price_monthly}
                      </span>
                      <span style={{ fontSize: 14, color: '#94a3b8', marginLeft: 2 }}>/mo</span>
                    </div>
                  </div>
                  {isCurrent && (
                    <div style={{
                      position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
                      padding: '5px 20px', borderRadius: 100, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                    }}>✓ Current Plan</div>
                  )}
                  {!isCurrent && plan.is_popular && (
                    <div style={{
                      position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff',
                      padding: '5px 20px', borderRadius: 100, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                    }}>✦ Most Popular</div>
                  )}

                  <div style={{ fontSize: 13, fontWeight: 700, color: isCurrent ? '#059669' : '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
                    {plan.name}
                  </div>

                  <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Billed monthly, cancel anytime</p>
                  <div style={{ height: 1, background: '#f1f5f9', marginBottom: 20 }} />

                  <ul style={{ listStyle: 'none', marginBottom: 24, flex: 1, padding: 0 }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', color: '#475569', fontSize: 13 }}>
                        <span style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                          background: isCurrent ? '#059669' : '#e0f2fe',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, color: isCurrent ? '#fff' : '#0284c7', fontWeight: 700,
                        }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <button className="plan-btn plan-btn-current" disabled>Current Plan</button>
                  ) : (
                    <button className="plan-btn plan-btn-upgrade" onClick={() => handleUpgrade(plan)} disabled={upgrading}>
                      {upgrading ? 'Redirecting...' : 'Upgrade →'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 👇 Custom Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="modal-backdrop" onClick={() => setShowCancelModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: '#fef2f2',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14,
            }}>⚠️</div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
              Cancel your subscription?
            </h3>
            <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.5, marginBottom: 22 }}>
              You'll keep access until the current billing period ends. This action can be undone anytime before then.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="modal-btn-secondary" onClick={() => setShowCancelModal(false)}>
                Keep Subscription
              </button>
              <button className="modal-btn-danger" onClick={confirmCancel} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}