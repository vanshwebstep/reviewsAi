export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        .hero-btn-primary {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 15px 34px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(14,165,233,0.35);
          transition: all 0.25s;
          letter-spacing: -0.2px;
        }
        .hero-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(14,165,233,0.45);
        }
        .hero-btn-secondary {
          background: #fff;
          color: #0284c7;
          border: 1.5px solid #bae6fd;
          border-radius: 12px;
          padding: 15px 28px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
        }
        .hero-btn-secondary:hover {
          border-color: #0ea5e9;
          background: #f0f9ff;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-card-wrap { display: none !important; }
          .hero-btns { justify-content: center !important; }
          .hero-stats { justify-content: center !important; }
        }
      `}</style>

      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(155deg, #f0f9ff 0%, #ffffff 45%, #f8fafc 100%)',
        display: 'flex', alignItems: 'center',
        padding: '110px 6% 80px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '8%', right: '3%',
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', left: '2%',
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2,132,199,0.07) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />

        <div className="hero-grid" style={{
          maxWidth: 1200, margin: '0 auto', width: '100%',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center'
        }}>

          {/* LEFT */}
          <div style={{ animation: 'fadeUp 0.7s ease both' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#e0f2fe', color: '#0284c7',
              padding: '6px 16px', borderRadius: 100,
              fontSize: 13, fontWeight: 700, marginBottom: 28,
              border: '1px solid #bae6fd'
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0ea5e9', display: 'inline-block', animation: 'floatY 2s ease-in-out infinite' }} />
              Trusted by 500+ businesses
            </div>

            <h1 style={{
              fontSize: 'clamp(34px, 5vw, 60px)',
              fontWeight: 900, lineHeight: 1.08,
              marginBottom: 22, color: '#0f172a',
              letterSpacing: '-1.5px'
            }}>
              Turn Customers Into<br />
              <span style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                5-Star Reviews
              </span>
            </h1>

            <p style={{
              fontSize: 18, color: '#475569', lineHeight: 1.75,
              marginBottom: 38, maxWidth: 460
            }}>
              Generate smart QR codes linked to your Google Business Profile. One scan — your customer leaves a review instantly.
            </p>

            <div className="hero-btns" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="hero-btn-primary" onClick={() => scrollTo('pricing')}>View Plans →</button>
              <button className="hero-btn-secondary" onClick={() => scrollTo('how-it-works')}>How It Works</button>
            </div>

            <div className="hero-stats" style={{ display: 'flex', gap: 40, marginTop: 52 }}>
              {[['500+', 'Businesses'], ['50K+', 'Reviews Generated'], ['4.9★', 'Avg Rating']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#0ea5e9', letterSpacing: '-0.5px' }}>{n}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, fontWeight: 500, letterSpacing: '0.3px' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="hero-card-wrap" style={{
            animation: 'fadeUp 0.7s 0.18s ease both',
            display: 'flex', justifyContent: 'center'
          }}>
            <div style={{
              background: '#fff', borderRadius: 28,
              boxShadow: '0 24px 80px rgba(14,165,233,0.13), 0 2px 12px rgba(0,0,0,0.06)',
              padding: '36px 32px', width: '100%', maxWidth: 360,
              border: '1px solid #e0f2fe',
              animation: 'floatY 5s ease-in-out infinite'
            }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: '#fff', padding: '4px 16px', borderRadius: 100,
                  fontSize: 11, fontWeight: 700, letterSpacing: '1px',
                  textTransform: 'uppercase', marginBottom: 16
                }}>Your QR Code</div>

                <div style={{
                  width: 164, height: 164, margin: '0 auto',
                  background: '#f8fafc', borderRadius: 20,
                  border: '1.5px solid #bae6fd',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, padding: 14 }}>
                    {Array.from({ length: 49 }).map((_, i) => (
                      <div key={i} style={{
                        width: 13, height: 13, borderRadius: 3,
                        background: [0, 1, 2, 7, 8, 9, 14, 4, 11, 18, 25, 32, 39, 46, 48, 47, 42, 43, 44, 6, 13, 20, 27, 34, 41, 3, 10, 17, 24, 31, 38, 45, 35, 36, 37, 28, 29, 30].includes(i) ? '#0284c7' : '#e0f2fe'
                      }} />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                borderRadius: 14, padding: '12px 16px', marginBottom: 14,
                border: '1px solid #bae6fd'
              }}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Linked to</div>
                <div style={{ fontSize: 13, color: '#0284c7', fontWeight: 700, marginTop: 3 }}>Google Business Profile ↗</div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#fffbeb', borderRadius: 12,
                padding: '12px 14px', border: '1px solid #fde68a'
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#fef3c7', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0
                }}>⭐</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>Customer scans → Reviews instantly</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Zero friction for your customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}