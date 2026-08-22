import { useState, useRef, useEffect } from 'react';
import { sendChat } from '../services/api';

const QUICK_PROMPTS = [
  'Why is this suspicious?',
  'What type of scam is this?',
  'What should I do next?',
  'Explain in simple terms',
  'What information should I NOT share?'
];

export default function ChatPanel({ analysisContext }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm TrustGuard AI. I can help you understand this risk assessment. The analysis shows a **${analysisContext?.riskLevel || 'UNKNOWN'}** risk score of **${analysisContext?.riskScore || '?'}/100**. What would you like to know?`
    }
  ]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (msg) => {
    const message = msg || input.trim();
    if (!message) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setLoading(true);
    try {
      const data = await sendChat(message, sessionId, analysisContext);
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I encountered an error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1rem' }}>🤖</span>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>TrustGuard AI Assistant</span>
      </div>

      {/* Quick Prompts */}
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {QUICK_PROMPTS.map(p => (
          <button key={p} className="btn btn-secondary btn-sm" style={{ fontSize: '0.7rem' }} onClick={() => send(p)}>
            {p}
          </button>
        ))}
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <div className="chat-bubble">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant">
            <div className="chat-bubble" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ animation: 'pulse 1s infinite' }}>●</span>
              <span style={{ animation: 'pulse 1s infinite 0.3s' }}>●</span>
              <span style={{ animation: 'pulse 1s infinite 0.6s' }}>●</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Ask about this risk analysis..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          disabled={loading}
        />
        <button className="btn btn-primary btn-sm" onClick={() => send()} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
