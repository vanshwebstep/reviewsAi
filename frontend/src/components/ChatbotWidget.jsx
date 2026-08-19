import { useState, useRef, useEffect } from 'react';
import { sendChatbotMessage } from '../api/api';

const QUICK_OPTIONS = [
  { label: '💳 Pricing & Plans', prompt: 'Can you tell me about your pricing plans?' },
  { label: '📱 How QR codes work', prompt: 'How does the QR code review collection work?' },
  { label: '✨ Smart Reply feature', prompt: 'What is Smart Reply and how do I use it?' },
  { label: '🤖 AI review generation', prompt: 'How does the AI review generator work?' },
];

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! 👋 I'm here to help with anything about ReviewsAI — pricing, QR codes, Smart Reply, or your account. What would you like to know?" },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const newMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setInput('');
    setSending(true);

    try {
      const res = await sendChatbotMessage({
        message: trimmed,
        history: newMessages.slice(-6),
      });
      if (!res.data?.success) {
        setMessages(m => [...m, { role: 'assistant', content: "Sorry, I couldn't process that. Please try again or contact support." }]);
        return;
      }
      setMessages(m => [...m, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: "Something went wrong. Please try again in a moment." }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{`
        .cb-fab {
          position: fixed; bottom: 24px; right: 24px; z-index: 999;
          width: 58px; height: 58px; border-radius: 50%; border: none;
          background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff;
          font-size: 24px; cursor: pointer; box-shadow: 0 10px 30px rgba(14,165,233,0.45);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s;
        }
        .cb-fab:hover { transform: scale(1.08); box-shadow: 0 14px 36px rgba(14,165,233,0.55); }

        .cb-window {
          position: fixed; bottom: 96px; right: 24px; z-index: 999;
          width: 360px; max-width: calc(100vw - 32px); height: 520px; max-height: calc(100vh - 140px);
          background: #fff; border-radius: 20px; border: 1.5px solid #e0f2fe;
          box-shadow: 0 24px 64px rgba(15,23,42,0.22);
          display: flex; flex-direction: column; overflow: hidden;
          animation: cbPop 0.2s ease;
          font-family: 'Poppins', sans-serif;
        }
        @keyframes cbPop { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .cb-header {
          background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff;
          padding: 16px 18px; display: flex; align-items: center; justify-content: space-between;
        }
        .cb-close { background: rgba(255,255,255,0.15); border: none; color: #fff; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; font-size: 14px; }

        .cb-body { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #f8fafc; }

        .cb-bubble { max-width: 82%; padding: 10px 14px; border-radius: 14px; font-size: 13.5px; line-height: 1.55; }
        .cb-bubble.user { align-self: flex-end; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff; border-bottom-right-radius: 4px; }
        .cb-bubble.assistant { align-self: flex-start; background: #fff; color: #0f172a; border: 1.5px solid #e2e8f0; border-bottom-left-radius: 4px; }

        .cb-quick-wrap { display: flex; flex-direction: column; gap: 7px; padding: 4px 0 2px; }
        .cb-quick-btn {
          text-align: left; background: #fff; border: 1.5px solid #bae6fd; color: #0284c7;
          border-radius: 12px; padding: 9px 12px; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all 0.15s;
        }
        .cb-quick-btn:hover { background: #f0f9ff; border-color: #0ea5e9; }

        .cb-typing { display: inline-flex; gap: 4px; padding: 12px 14px; }
        .cb-typing span { width: 6px; height: 6px; border-radius: 50%; background: #94a3b8; animation: cbBlink 1.2s infinite ease-in-out; }
        .cb-typing span:nth-child(2) { animation-delay: 0.2s; }
        .cb-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes cbBlink { 0%, 80%, 100% { opacity: 0.25; } 40% { opacity: 1; } }

        .cb-footer { padding: 12px; border-top: 1px solid #f1f5f9; display: flex; gap: 8px; background: #fff; }
        .cb-input {
          flex: 1; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 10px 13px;
          font-size: 13px; outline: none; font-family: inherit;
        }
        .cb-input:focus { border-color: #0ea5e9; }
        .cb-send { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff; border: none; border-radius: 12px; padding: 0 16px; cursor: pointer; font-weight: 700; font-size: 13px; }
        .cb-send:disabled { opacity: 0.55; cursor: not-allowed; }

        @media (max-width: 420px) {
          .cb-window { right: 16px; left: 16px; width: auto; bottom: 88px; }
          .cb-fab { right: 16px; }
        }
      `}</style>

      {!open && (
        <button className="cb-fab" onClick={() => setOpen(true)} aria-label="Open support chat">
          💬
        </button>
      )}

      {open && (
        <div className="cb-window">
          <div className="cb-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🤖</div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>ReviewsAI Support</div>
                <div style={{ fontSize: 10.5, opacity: 0.85 }}>Usually replies instantly</div>
              </div>
            </div>
            <button className="cb-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="cb-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`cb-bubble ${m.role}`}>{m.content}</div>
            ))}

            {messages.length === 1 && (
              <div className="cb-quick-wrap">
                {QUICK_OPTIONS.map((opt, i) => (
                  <button key={i} className="cb-quick-btn" onClick={() => sendMessage(opt.prompt)} disabled={sending}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {sending && (
              <div className="cb-bubble assistant" style={{ padding: 0 }}>
                <div className="cb-typing"><span /><span /><span /></div>
              </div>
            )}
          </div>

          <div className="cb-footer">
            <input
              className="cb-input"
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(input); }}
              disabled={sending}
            />
            <button className="cb-send" onClick={() => sendMessage(input)} disabled={sending || !input.trim()}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}