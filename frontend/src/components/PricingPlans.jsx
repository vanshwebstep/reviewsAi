import { useEffect, useState } from 'react';
import { fetchPlans } from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function PricingPlans() {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans().then(r => setPlans(r.data.plans));
  }, []);

  const handleSelect = (plan) => {
    navigate('/subscribe', { state: { planName: plan.name, planAmount: plan.price } });
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
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
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

          {/* Plans Grid — equal height via CSS grid + flex columns */}
          <div
            className="plans-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              alignItems: 'stretch',   /* all rows same height */
            }}
          >
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`plan-card ${plan.is_popular ? 'popular' : ''}`}
              >
                {plan.is_popular && (
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

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>₹</span>
                  <span style={{ fontSize: 44, fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: '-2px' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 14, color: '#94a3b8', marginBottom: 6, marginLeft: 2 }}>/mo</span>
                </div>

                <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24, lineHeight: 1.5 }}>
                  Billed monthly, cancel anytime
                </p>

                {/* Divider */}
                <div style={{ height: 1, background: '#f1f5f9', marginBottom: 24 }} />

                {/* Features — flex-grow pushes button to bottom */}
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
                  Get Started {plan.is_popular ? '→' : ''}
                </button>
              </div>
            ))}
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