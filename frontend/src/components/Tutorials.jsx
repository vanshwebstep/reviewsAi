import { useState } from 'react';
import video1 from '../assets/ReviewsAI1.mp4';
import video2 from '../assets/ReviewsAI2.mp4';
import video3 from '../assets/ReviewsAI3.mp4';

const tutorials = [
  { num: '01', duration: '2:10', title: 'Login & add your business', desc: 'See how to view the platform, log in to your account, and add your business details to get started.', videoUrl: video1 },
  { num: '02', duration: '1:52', title: 'Describe your company & generate QR', desc: 'Fill in your company details and instantly generate your unique review QR code.', videoUrl: video2 },
  { num: '03', duration: '2:05', title: 'Select rating & post your review', desc: 'Choose your star rating, copy the suggested review, and paste it directly on Google.', videoUrl: video3 },
];

export default function Tutorials() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <>
      <style>{`
        .tut-card {
          background: #fff;
          border-radius: 22px;
          border: 1.5px solid #f1f5f9;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .tut-card:hover {
          border-color: #bae6fd;
          box-shadow: 0 14px 44px rgba(14,165,233,0.10);
          transform: translateY(-4px);
        }
        .tut-thumb {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: linear-gradient(135deg, #ecf2f5, #f3fbff);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
        }
        .tut-thumb video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.55;
        }
        .tut-play {
          position: relative;
          z-index: 2;
          width: 60px; height: 60px; border-radius: 50%;
          background: rgba(255,255,255,0.95);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          transition: transform 0.25s;
        }
        .tut-card:hover .tut-play { transform: scale(1.1); }
        .tut-duration {
          position: absolute; bottom: 12px; right: 12px; z-index: 2;
          background: rgba(15,23,42,0.75); color: #fff;
          font-size: 11px; font-weight: 700;
          padding: 3px 9px; border-radius: 6px;
          letter-spacing: 0.3px;
        }
        .tut-num {
          position: absolute; top: 12px; left: 14px; z-index: 2;
          color: rgba(255,255,255,0.85);
          font-size: 11px; font-weight: 800; letter-spacing: 1.5px;
        }
        @media (max-width: 768px) {
          .tut-grid { grid-template-columns: 1fr !important; }
        }

        .video-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.85);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
          padding: 24px;
          animation: fadeInOverlay 0.25s ease;
        }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        .video-modal-box {
          position: relative;
          width: 100%;
          max-width: 860px;
          background: #000;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0,0,0,0.4);
          animation: scaleInModal 0.3s ease;
        }
        @keyframes scaleInModal { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
        .video-modal-box video {
          width: 100%;
          display: block;
          max-height: 80vh;
        }
        .video-modal-close {
          position: absolute; top: 14px; right: 14px; z-index: 5;
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 18px;
          backdrop-filter: blur(4px);
          transition: background 0.2s;
        }
        .video-modal-close:hover { background: rgba(255,255,255,0.28); }
      `}</style>

      <section id="tutorials" style={{ padding: '100px 6%', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{
              display: 'inline-block', background: '#e0f2fe', color: '#0284c7',
              padding: '6px 18px', borderRadius: 100,
              fontSize: 13, fontWeight: 700, marginBottom: 18, border: '1px solid #bae6fd'
            }}>
              Tutorials
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 46px)',
              fontWeight: 900, marginBottom: 16, color: '#0f172a', letterSpacing: '-1px'
            }}>
              Learn How to Use ReviewsAI in minutes
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Three short guides to get you from signup to your first Google review.
            </p>
          </div>

          <div className="tut-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24
          }}>
            {tutorials.map((t, i) => (
              <div key={i} className="tut-card">
                <div className="tut-thumb" onClick={() => setActiveVideo(t.videoUrl)}>
                  <video muted playsInline preload="metadata">
                    <source src={t.videoUrl + '#t=0.5'} type="video/mp4" />
                  </video>
                  <span className="tut-num">{t.num}</span>
                  <div className="tut-play">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#0284c7">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="tut-duration">{t.duration}</span>
                </div>

                <div style={{ padding: '24px 24px 28px' }}>
                  <h3 style={{
                    fontSize: 17, fontWeight: 800, marginBottom: 10,
                    color: '#0f172a', letterSpacing: '-0.3px'
                  }}>{t.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, margin: 0 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {activeVideo && (
        <div className="video-modal-overlay" onClick={() => setActiveVideo(null)}>
          <div className="video-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setActiveVideo(null)} aria-label="Close video">✕</button>
            <video src={activeVideo} controls autoPlay />
          </div>
        </div>
      )}
    </>
  );
}