import { useEffect, useState } from 'react';
import { fetchPlans } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function PricingPlans() {
  const [plans, setPlans] = useState([]);
  const [pricingError, setPricingError] = useState('');
  const [billing, setBilling] = useState('monthly'); // 'monthly' | 'annual'
  const [promo, setPromo] = useState({ active: false, percent: 0, slots_left: 0, limit: 0 });
  const navigate = useNavigate();

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
          price_annual: Number(plan.price_annual ?? 0),
          price_annual_per_month: Number(plan.price_annual_per_month ?? 0),
          annual_discount_percent: Number(plan.annual_discount_percent ?? 20),
          promo_active: !!plan.promo_active,
          promo_price_monthly: plan.promo_price_monthly != null ? Number(plan.promo_price_monthly) : null,
          promo_price_annual: plan.promo_price_annual != null ? Number(plan.promo_price_annual) : null,
          promo_price_annual_per_month: plan.promo_price_annual_per_month != null ? Number(plan.promo_price_annual_per_month) : null,
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

const handleSelect = (plan) => {
  const regularAmount = billing === 'annual' ? plan.price_annual : plan.price_monthly;
  const promoAmount = billing === 'annual' ? plan.promo_price_annual : plan.promo_price_monthly;
  const usingPromo = promo.active && promoAmount != null;

  navigate('/subscribe', {
    state: {
      planName: plan.name,
      planAmount: usingPromo ? promoAmount : regularAmount,
      billingCycle: billing,
      usePromo: usingPromo,
      trialEnabled: !!plan.trial_enabled,
      trialDays: plan.trial_days || 0,
    }
  });
};

  return (
    <>
      <style>{`
        .plan-card {
          background: #fff;
          border-radius: 22px;
          padding: 36px 28px;
          border: 1.5px solid #e2e8f0;
          position: relative;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }
        .plan-card:hover {
          border-color: #7dd3fc;
          box-shadow: 0 16px 48px rgba(14,165,233,0.12);
          transform: translateY(-4px);
        }
        .plan-card.popular {
          border-color: #0ea5e9;
          box-shadow: 0 12px 40px rgba(14,165,233,0.15);
        }
        .plan-card.popular:hover {
          box-shadow: 0 20px 60px rgba(14,165,233,0.22);
          transform: translateY(-6px);
        }
        .plan-btn {
          width: 100%;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s;
          letter-spacing: -0.2px;
          margin-top: auto;
        }
        .plan-btn-default {
          background: #f0f9ff;
          color: #0284c7;
          border: 1.5px solid #bae6fd;
        }
        .plan-btn-default:hover {
          background: #e0f2fe;
          transform: translateY(-2px);
        }
        .plan-btn-popular {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff;
          box-shadow: 0 6px 20px rgba(14,165,233,0.35);
        }
        .plan-btn-popular:hover {
          box-shadow: 0 10px 28px rgba(14,165,233,0.45);
          transform: translateY(-2px);
        }

        .billing-toggle {
          display: flex;
          align-items: center;
          width: 320px;
          max-width: 100%;
          background: #fff;
          border: 1.5px solid #e0f2fe;
          border-radius: 100px;
          padding: 5px;
          box-shadow: 0 4px 16px rgba(14,165,233,0.08);
          position: relative;
        }
        .billing-toggle-btn {
          position: relative;
          z-index: 1;
          flex: 1 1 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          padding: 10px 22px;
          border-radius: 100px;
          border: none;
          background: transparent;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.25s ease;
          color: #64748b;
        }
        .billing-toggle-btn.active {
          color: #fff;
        }
        .billing-toggle-btn.active .save-chip {
          background: rgba(255,255,255,0.2);
          color: #fff;
          border-color: rgba(255,255,255,0.35);
        }
        .billing-toggle-thumb {
          position: absolute;
          top: 5px;
          bottom: 5px;
          left: 5px;
          width: calc(50% - 5px);
          border-radius: 100px;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          box-shadow: 0 6px 16px rgba(14,165,233,0.35);
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .billing-toggle-thumb.annual {
          transform: translateX(100%);
        }
        .save-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
          padding: 2px 9px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          margin-left: 6px;
          vertical-align: middle;
        }
        .plan-save-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          color: #059669;
          border: 1px solid #a7f3d0;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11.5px;
          font-weight: 800;
          margin-bottom: 6px;
        }
        .strike-price {
          text-decoration: line-through;
          color: #878d94;
          font-size: 18px;
          font-weight: 700;
        }
        .promo-banner {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg,#fef3c7,#fde68a);
          border: 1px solid #fbbf24;
          border-radius: 100px;
          padding: 10px 20px;
          font-size: 13px;
          color: #92400e;
          font-weight: 700;
        }
        .promo-tag {
          position: absolute;
          top: -14px;
          right: 20px;
          background: linear-gradient(135deg,#f59e0b,#d97706);
          color: #fff;
          padding: 5px 14px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(217,119,6,0.35);
          white-space: nowrap;
        }

        @media (max-width: 900px) {
          .plans-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .plans-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section id="pricing" style={{
        padding: '100px 6%',
        background: '#0285c72c'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              display: 'inline-block', background: '#e0f2fe', color: '#0284c7',
              padding: '6px 18px', borderRadius: 100, fontSize: 13,
              fontWeight: 700, marginBottom: 18, border: '1px solid #bae6fd'
            }}>
              Pricing
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 46px)',
              fontWeight: 900, marginBottom: 16, color: '#0f172a',
              letterSpacing: '-1px'
            }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>

          {/* Promo banner */}
          {promo.active && (
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <span className="promo-banner">
                🔥 {promo.percent}% OFF launch offer · ⏳ Limited time — only {promo.slots_left} of {promo.limit} spots left
              </span>
            </div>
          )}

          {/* Billing toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 44 }}>
            <div className="billing-toggle">
              <div className={`billing-toggle-thumb ${billing === 'annual' ? 'annual' : ''}`} />
              <button
                onClick={() => setBilling('monthly')}
                className={`billing-toggle-btn ${billing === 'monthly' ? 'active' : ''}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('annual')}
                className={`billing-toggle-btn ${billing === 'annual' ? 'active' : ''}`}
              >
                Annual
                <span className="save-chip">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div
            className="plans-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 24,
              alignItems: 'stretch',
            }}
          >
            {plans.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', fontSize: 14, padding: '28px 16px' }}>
                {pricingError || 'Loading plans...'}
              </div>
            )}
            {plans.map(plan => {
              const isAnnual = billing === 'annual';
              const displayPrice = isAnnual ? plan.price_annual_per_month : plan.price_monthly;
              const yearlySavings = Math.max(0, (plan.price_monthly * 12) - plan.price_annual);

              const promoPrice = isAnnual ? plan.promo_price_annual_per_month : plan.promo_price_monthly;
              const showPromo = promo.active && promoPrice != null;

              return (
                <div
                  key={plan.id}
                  className={`plan-card ${plan.is_popular ? 'popular' : ''}`}
                >
                  {showPromo && (
                    <div className="promo-tag">⏳ {promo.percent}% OFF</div>
                  )}

                  {!!plan.is_popular && (
                    <div style={{
                      position: 'absolute', top: -14, left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      color: '#fff', padding: '5px 20px',
                      borderRadius: 100, fontSize: 12, fontWeight: 700,
                      whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(14,165,233,0.3)'
                    }}>
                      ✦ Most Popular
                    </div>
                  )}

                  {/* Plan name */}
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: plan.is_popular ? '#0ea5e9' : '#94a3b8',
                    letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12
                  }}>
                    {plan.name}
                  </div>

                  {/* Savings badge (annual only, non-promo) */}
                  {!showPromo && isAnnual && yearlySavings > 0 && (
                    <div className="plan-save-badge">
                      🎉 Save ${yearlySavings.toFixed(0)}/yr
                    </div>
                  )}

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    {(showPromo || isAnnual) && (
                      <span className="strike-price">${showPromo ? displayPrice : plan.price_monthly}</span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>$</span>
                      <span style={{ fontSize: 44, fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: '-2px' }}>
                        {showPromo ? promoPrice : displayPrice}
                      </span>
                      <span style={{ fontSize: 14, color: '#94a3b8', marginBottom: 6, marginLeft: 2 }}>/mo</span>
                    </div>
                  </div>

               <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24, lineHeight: 1.5 }}>
  {showPromo
    ? `Limited time launch price for first ${promo.limit} customers · cancel anytime`
    : isAnnual
      ? `Billed $${plan.price_annual}/yr · cancel anytime`
      : 'Billed monthly, cancel anytime'}
</p>

                  {/* Divider */}
                  <div style={{ height: 1, background: '#f1f5f9', marginBottom: 24 }} />

                  {/* Features */}
                  <ul style={{ listStyle: 'none', marginBottom: 28, flex: 1 }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '7px 0', color: '#475569', fontSize: 14,
                        borderBottom: i < plan.features.length - 1 ? '1px solid #f8fafc' : 'none'
                      }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          background: plan.is_popular ? 'linear-gradient(135deg,#0ea5e9,#0284c7)' : '#e0f2fe',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, color: plan.is_popular ? '#fff' : '#0284c7',
                          fontWeight: 700, marginTop: 1
                        }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

              <button
  onClick={() => handleSelect(plan)}
  className={`plan-btn ${plan.is_popular ? 'plan-btn-popular' : 'plan-btn-default'}`}
>
  {plan.trial_enabled ? `Start ${plan.trial_days}-day free trial` : 'Get Started'} {plan.is_popular ? '→' : ''}
</button>
                </div>
              );
            })}
          </div>

          {/* Trust note */}
          <p style={{ textAlign: 'center', marginTop: 36, fontSize: 13, color: '#94a3b8' }}>
            🔒 Secure payments · No contracts · Cancel anytime
          </p>
        </div>
      </section>
    </>
  );
}