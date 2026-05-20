const steps = [
  { num: '01', icon: '📝', title: 'Choose Your Plan', desc: 'Select a subscription that fits your business — Starter, Growth, or Premium. Upgrade or downgrade anytime.' },
  { num: '02', icon: '🔗', title: 'Paste Your Google URL', desc: 'Fill in your details and paste your Google Business Profile link. Takes less than 60 seconds.' },
  { num: '03', icon: '⚙️', title: 'We Generate Your QR', desc: 'Our system instantly creates a unique QR code linked directly to your review page. Ready to use.' },
  { num: '04', icon: '🚀', title: 'Share & Collect Reviews', desc: 'Download, print and place it anywhere — table cards, receipts, menus — and watch your reviews grow.' },
];

export default function HowItWorks() {
  return (
    <>
      <style>{`
        .step-card {
          background: #fff;
          border-radius: 22px;
          padding: 36px 28px;
          border: 1.5px solid #f1f5f9;
          position: relative;
          text-align: center;
          transition: all 0.3s ease;
        }
        .step-card:hover {
          border-color: #bae6fd;
          box-shadow: 0 12px 40px rgba(14,165,233,0.10);
          transform: translateY(-4px);
        }
        @media (max-width: 768px) {
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section id="how-it-works" style={{
        padding: '100px 6%',
        background: '#fff'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              display: 'inline-block', background: '#e0f2fe', color: '#0284c7',
              padding: '6px 18px', borderRadius: 100,
              fontSize: 13, fontWeight: 700, marginBottom: 18, border: '1px solid #bae6fd'
            }}>
              How It Works
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 46px)',
              fontWeight: 900, marginBottom: 16, color: '#0f172a', letterSpacing: '-1px'
            }}>
              Up and running in 4 simple steps
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
              No technical skills needed. From signup to QR code in under 2 minutes.
            </p>
          </div>

          <div className="steps-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20
          }}>
            {steps.map((s, i) => (
              <div key={i} className="step-card">
                {/* Step number badge */}
                <div style={{
                  position: 'absolute', top: 20, right: 20,
                  fontSize: 11, fontWeight: 800, color: '#bae6fd',
                  letterSpacing: '1.5px'
                }}>{s.num}</div>

                {/* Icon circle */}
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, margin: '0 auto 20px',
                  boxShadow: '0 8px 24px rgba(14,165,233,0.28)'
                }}>{s.icon}</div>

                <h3 style={{
                  fontSize: 16, fontWeight: 800, marginBottom: 10,
                  color: '#0f172a', letterSpacing: '-0.3px'
                }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>

                {/* Connector arrow (not last) */}
                {i < steps.length - 1 && (
                  <div style={{
                    display: 'none',  /* shown via CSS below on md+ */
                    position: 'absolute', right: -14, top: '38%',
                    zIndex: 1, fontSize: 18, color: '#bae6fd'
                  }} className="step-arrow">→</div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}