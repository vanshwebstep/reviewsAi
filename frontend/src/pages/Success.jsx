import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Success() {
  const { state } = useLocation();
  const url = import.meta.env.VITE_BASE_URL;

  const qrUrl = url + state?.qrPath;
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!qrUrl) return;
    setDownloading(true);
    try {
      const res = await fetch(qrUrl, { mode: 'cors' });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('QR download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <style>{`
      * {
  font-family: 'Poppins', sans-serif;
}
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .success-download-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 28px;
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff;
          padding: 14px 36px;
          border-radius: 12px;
          border: none;
          text-decoration: none;
          font-weight: 700;
          font-size: 15px;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 8px 28px rgba(14,165,233,0.35);
          transition: all 0.25s;
          letter-spacing: -0.2px;
          cursor: pointer;
        }
        .success-download-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(14,165,233,0.45);
        }
        .success-download-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(155deg, #f0f9ff 0%, #ffffff 50%, #e0f2fe 100%)',
        padding: '40px 20px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* bg blobs */}
        <div style={{
          position: 'absolute', top: '5%', right: '5%',
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', left: '5%',
          width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2,132,199,0.07) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          background: '#fff',
          borderRadius: 28,
          padding: '52px 48px',
          textAlign: 'center',
          boxShadow: '0 24px 80px rgba(14,165,233,0.12), 0 2px 12px rgba(0,0,0,0.05)',
          border: '1.5px solid #e0f2fe',
          maxWidth: 440, width: '100%',
          animation: 'fadeUp 0.6s ease both'
        }}>

          {/* Celebration icon */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, margin: '0 auto 28px',
            animation: 'popIn 0.5s 0.2s ease both',
            boxShadow: '0 8px 24px rgba(251,191,36,0.3)'
          }}>🎉</div>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#dcfce7', color: '#16a34a',
            padding: '5px 16px', borderRadius: 100,
            fontSize: 12, fontWeight: 700, marginBottom: 20,
            border: '1px solid #bbf7d0', letterSpacing: '0.3px'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            QR Code Generated Successfully
          </div>

          <h2 style={{
            fontSize: 28, fontWeight: 900, color: '#0f172a',
            marginBottom: 10, letterSpacing: '-0.8px'
          }}>Your QR Code is Ready!</h2>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Customers scan this to leave you a Google Review — instantly, with zero friction.
          </p>

          {/* QR image */}
          <div style={{
            display: 'inline-block',
            padding: 16,
            background: '#f8fafc',
            borderRadius: 20,
            border: '1.5px solid #bae6fd',
            boxShadow: '0 4px 20px rgba(14,165,233,0.08)'
          }}>
            <img
              src={qrUrl}
              alt="QR Code"
              width={200}
              style={{ display: 'block', borderRadius: 10 }}
            />
          </div>

          <div>
            <button onClick={handleDownload} disabled={downloading} className="success-download-btn">
              {downloading ? 'Preparing...' : '↓ Download QR Code'}
            </button>
          </div>

          {/* Tips */}

        </div>
      </div>
    </>
  );
}