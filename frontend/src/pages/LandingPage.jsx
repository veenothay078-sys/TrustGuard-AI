import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Eye, Brain, Lock, ChevronRight, CheckCircle } from 'lucide-react';

const features = [
  { icon: '🔍', title: 'Page Scanner', desc: 'Scan any webpage in real-time via the browser extension. Extract and analyze all visible content for risk indicators.' },
  { icon: '📝', title: 'Text Analysis', desc: 'Paste suspicious SMS, email, or message content for instant AI-powered risk assessment.' },
  { icon: '🔗', title: 'URL Analysis', desc: 'Analyze URLs for phishing patterns, suspicious domains, lookalike attacks, and malicious indicators.' },
  { icon: '📸', title: 'Screenshot OCR', desc: 'Upload screenshots of suspicious messages. OCR extracts text and AI analyzes the risk.' },
  { icon: '🧠', title: 'Explainable AI', desc: 'Every risk score comes with clear reasons, supporting evidence, and recommended actions.' },
  { icon: '📚', title: 'RAG Evidence', desc: 'Analysis backed by a curated cybersecurity knowledge base with supporting guidance and citations.' }
];

const scamCategories = [
  'Phishing Risk', 'Financial Fraud', 'Identity Theft', 'Account Takeover',
  'Prize Scam', 'Investment Scam', 'Payment Scam', 'Impersonation',
  'Malicious Links', 'Social Engineering', 'Suspicious Ads', 'Other Activity'
];

const steps = [
  { num: '01', title: 'Scan', desc: 'Submit text, URL, webpage, or screenshot for analysis' },
  { num: '02', title: 'Analyze', desc: 'AI + heuristic engine examines content for risk patterns' },
  { num: '03', title: 'Detect', desc: 'Risk score (0–100) and categories identified' },
  { num: '04', title: 'Explain', desc: 'Clear reasons for every detected risk indicator' },
  { num: '05', title: 'Recommend', desc: 'Actionable safety steps tailored to the specific threat' }
];

const faqs = [
  { q: 'Is TrustGuard a guaranteed scam detector?', a: 'No. TrustGuard provides AI-assisted risk assessments based on pattern detection. Results should be treated as decision support, not definitive proof. Always verify through official channels.' },
  { q: 'Does TrustGuard collect my browsing history?', a: 'No. TrustGuard only analyzes content you explicitly submit. The browser extension only activates when you click "Scan This Page" — it does not silently monitor your browsing.' },
  { q: 'What AI model does TrustGuard use?', a: 'TrustGuard uses Google Gemini API for analysis. You can run it in Demo Mode without an API key to explore all features.' },
  { q: 'Can I use TrustGuard without a Gemini API key?', a: 'Yes! Demo Mode provides realistic pre-configured analysis examples so you can explore all features without any API key.' },
  { q: 'What should I do if TrustGuard gives a high risk score?', a: 'Do not click suspicious links, do not share personal/financial information, and verify the source through official channels (official website, official customer service number).' }
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--color-border)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🛡️</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.3px' }}>TrustGuard</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Risk Manager</div>
          </div>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="#how-it-works" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>How it Works</a>
          <a href="#features" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>Features</a>
          <a href="#faq" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>FAQ</a>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/analyze')}>Launch App</button>
        </nav>
      </header>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '6rem 2rem 4rem', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.3)', borderRadius: 999, padding: '0.35rem 1rem', marginBottom: '2rem', fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>
          <Zap size={13} /> AI-Powered Risk Detection
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          TrustGuard
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.35rem)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          AI-Powered Scam &amp; Fraud Risk Manager
        </p>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem' }}>
          Analyze suspicious digital content, understand potential risks, and make safer decisions with AI. Supports text, URLs, webpages, and screenshots.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/analyze')}>
            Analyze Content <ChevronRight size={18} />
          </button>
          <a href="#how-it-works" className="btn btn-secondary btn-lg">How It Works</a>
        </div>

        {/* Risk level preview */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
          {['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].map(level => (
            <div key={level} className={`risk-badge ${level}`}>
              {level === 'LOW' ? '✓ ' : level === 'MODERATE' ? '⚠ ' : '⛔ '}{level}
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '4rem 2rem', background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>How TrustGuard Works</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>A 5-step AI analysis pipeline for smarter risk detection</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ flex: '1 1 160px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)', opacity: 0.4, marginBottom: '0.5rem' }}>{step.num}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{step.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Features</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>Everything you need to stay safe online</p>
          <div className="grid-3">
            {features.map((f, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Detection Categories */}
      <section style={{ padding: '4rem 2rem', background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>12 Scam Categories Detected</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>TrustGuard classifies suspicious content across multiple fraud types</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {scamCategories.map((cat, i) => (
              <span key={i} style={{ padding: '0.35rem 0.875rem', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 999, fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <Lock size={40} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Privacy &amp; Security First</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            TrustGuard only analyzes content you explicitly submit. It does not silently monitor your browsing, store passwords, or collect unnecessary personal data. API keys are kept secure on the backend only.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['No silent tracking', 'No stored passwords', 'API keys server-side only', 'Minimal data collection'].map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-low)' }}>
                <CheckCircle size={14} /> {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '4rem 2rem', background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 800, marginBottom: '2.5rem' }}>Frequently Asked Questions</h2>
          {faqs.map((faq, i) => (
            <div key={i} style={{ marginBottom: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', fontWeight: 600, fontSize: '0.9rem', background: 'var(--color-bg-card)' }}>{faq.q}</div>
              <div style={{ padding: '0.875rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="alert alert-warning" style={{ textAlign: 'center', justifyContent: 'center' }}>
            ⚠️ <strong>Important:</strong> TrustGuard provides AI-assisted risk assessment and is not a guaranteed scam detector. Users should independently verify suspicious content through trusted official channels. Do not treat AI results as definitive legal or financial conclusions.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to analyze suspicious content?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Works in Demo Mode — no API key required to get started.</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/analyze')}>
          Start Analyzing <ChevronRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '1.5rem 2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>🛡️ TrustGuard – AI-Powered Scam &amp; Fraud Risk Manager</div>
        <div>For decision support only. Not legal or financial advice.</div>
      </footer>
    </div>
  );
}
