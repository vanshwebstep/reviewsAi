const features = [
  { icon: '⚡', title: 'Instant QR Generation', desc: 'QR code linked to your Google Business Profile is generated in seconds after signup.' },
  { icon: '📱', title: 'One Scan, One Review', desc: 'Customers scan the QR with any phone — no app needed. They land directly on your review page.' },
  { icon: '📊', title: 'Track Performance', desc: 'See how many scans your QR gets and monitor your review growth over time.' },
  { icon: '🎨', title: 'Print-Ready Design', desc: 'Download a print-ready QR code to put on tables, receipts, menus, or your counter.' },
  { icon: '🔗', title: 'Direct Google Link', desc: 'QR points directly to your Google review form — maximum conversion, zero friction.' },
  { icon: '🛡️', title: 'Secure & Reliable', desc: 'Your data is stored securely. QR codes never expire as long as your plan is active.' },
];

export default function Features() {
  return (
    <>
      <style>{`
        .feature-card {
          background: #fff;
          border: 1.5px solid #f1f5f9;
          border-radius: 22px;
          padding: 32px 28px;
          transition: all 0.3s ease;
          cursor: default;
        }
        .feature-card:hover {
          border-color: #bae6fd;
          transform: translateY(-4px);
          box-shadow: 0 14px 44px rgba(14,165,233,0.10);
        }
        .feature-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: linear-gradient(135deg, #e0f2fe, #bae6fd);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin-bottom: 20px;
          transition: all 0.3s;
        }
        .feature-card:hover .feature-icon {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
        }
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 520px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section id="features" style={{ padding: '100px 6%', background: '#0285c72c' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              display: 'inline-block', background: '#ffffff', color: '#0284c7',
              padding: '6px 18px', borderRadius: 100, fontSize: 13,
              fontWeight: 700, marginBottom: 18, border: '1px solid #bae6fd'
            }}>
              Why ReviewsAI
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 46px)',
              fontWeight: 900, marginBottom: 16, color: '#0f172a', letterSpacing: '-1px'
            }}>
              Everything you need to collect<br />more Google reviews
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              A complete system for businesses to grow their online reputation effortlessly.
            </p>
          </div>

          <div className="features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24
          }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 style={{
                  fontSize: 17, fontWeight: 800, marginBottom: 10,
                  color: '#0f172a', letterSpacing: '-0.3px'
                }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}