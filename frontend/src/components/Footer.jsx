export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        .footer-link {
          background: none; border: none;
          color: #d3d3d3; font-size: 14px;
          cursor: pointer; padding: 0;
          transition: color 0.2s;
          text-align: left;
          line-height: 2;
        }
        .footer-link:hover { color: #38bdf8; }
        .social-btn {
          width: 38px; height: 38px; border-radius: 11px;
          background: #1e293b; border: 1px solid #334155;
          display: flex; align-items: center; justify-content: center;
          color: #d3d3d3; font-size: 13px; cursor: pointer;
          transition: all 0.2s; font-weight: 700;
        }
        .social-btn:hover {
          background: #0ea5e9; color: #fff; border-color: #0ea5e9;
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <footer id="contact" style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #0c1523 100%)',
        color: '#94a3b8', padding: '80px 6% 36px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <div className="footer-grid" style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: 56, marginBottom: 64
          }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 17
                }}>R</div>
                <span style={{ fontWeight: 800, fontSize: 21, color: '#fff', letterSpacing: '-0.5px' }}>
                  Reviews<span style={{ color: '#0ea5e9' }}>AI</span>
                </span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: '#d3d3d3', maxWidth: 260, marginBottom: 24 }}>
                Helping businesses collect more Google reviews with smart QR technology. Simple, fast, effective.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['𝕏', 'in', 'f'].map((s, i) => (
                  <div key={i} className="social-btn">{s}</div>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 style={{
                color: '#fff', fontSize: 13, fontWeight: 700,
                marginBottom: 20, letterSpacing: '1px', textTransform: 'uppercase'
              }}>Product</h4>
              {['Features', 'Pricing', 'How It Works'].map(l => (
                <div key={l}>
                  <button
                    className="footer-link"
                    onClick={() => scrollTo(l.toLowerCase().replace(/ /g, '-'))}
                  >{l}</button>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <h4 style={{
                color: '#fff', fontSize: 13, fontWeight: 700,
                marginBottom: 20, letterSpacing: '1px', textTransform: 'uppercase'
              }}>Contact</h4>
              {[
                { icon: '✉️', text: 'support@reviewsai.in' },
                { icon: '📞', text: '+91 98765 43210' },
                { icon: '📍', text: 'India' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: '#d3d3d3' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid #d3d3d3', paddingTop: 28,
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: 12
          }}>
            <p style={{ fontSize: 13, color: '#d3d3d3' }}>© 2026 ReviewsAI. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Privacy Policy', 'Terms of Service'].map(l => (
                <span key={l} style={{ fontSize: 13, color: '#d3d3d3', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'}
                  onMouseLeave={e => e.currentTarget.style.color = '#d3d3d3'}
                >{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}