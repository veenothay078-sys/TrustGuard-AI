import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Link, Globe, Camera, Send } from 'lucide-react';
import * as api from '../services/api';
import { RiskScoreCircle, RiskBadge, IndicatorCard, FactorBar, RAGEvidence, Disclaimer, LoadingState } from '../components/RiskComponents';
import ChatPanel from '../components/ChatPanel';

const TABS = [
  { id: 'text', label: 'Text / Message', icon: FileText },
  { id: 'url', label: 'URL', icon: Link },
  { id: 'page', label: 'Webpage', icon: Globe },
  { id: 'screenshot', label: 'Screenshot', icon: Camera }
];

export default function AnalyzePage() {
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [pageText, setPageText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    setShowChat(false);
    try {
      let data;
      if (activeTab === 'text') {
        if (!text.trim()) throw new Error('Please enter text to analyze.');
        data = await api.analyzeText(text);
      } else if (activeTab === 'url') {
        if (!url.trim()) throw new Error('Please enter a URL to analyze.');
        data = await api.analyzeUrl(url);
      } else if (activeTab === 'page') {
        if (!pageText.trim()) throw new Error('Please enter webpage content to analyze.');
        data = await api.analyzePage({ url: pageUrl, text: pageText });
      } else if (activeTab === 'screenshot') {
        if (!file) throw new Error('Please select a screenshot image to analyze.');
        data = await api.analyzeScreenshot(file);
      }
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) setFile(f);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🔍 Analyze Content</h1>
        <p className="page-subtitle">Submit text, URL, webpage, or screenshot for AI risk assessment</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Input Panel */}
        <div>
          {/* Tabs */}
          <div className="tab-bar">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} className={`tab-btn${activeTab === id ? ' active' : ''}`} onClick={() => { setActiveTab(id); setResult(null); setError(''); }}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          <div className="card">
            {/* Text Tab */}
            {activeTab === 'text' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Suspicious Message / Email / SMS</label>
                  <textarea
                    className="textarea"
                    style={{ minHeight: 200 }}
                    placeholder="Paste the suspicious message, email, SMS, or any digital content here...&#10;&#10;Example: 'URGENT: Your bank account has been suspended. Click here to verify: http://...' "
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{text.length} / 5000 characters</div>
                </div>

                {/* Demo examples */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Try a demo example:</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Bank Alert', text: 'URGENT: Your bank account has been blocked due to suspicious activity. Please verify your OTP and password immediately by clicking: http://secure-bank-verify.xyz/login' },
                      { label: 'Prize Scam', text: 'Congratulations! You have been selected as our lucky winner! Claim your ₹50,000 prize now. Limited time offer. Send your bank account details to receive the reward immediately.' },
                      { label: 'Investment', text: 'Guaranteed 300% returns in 30 days! Join our exclusive crypto trading group. Only 10 slots left. Invest now and double your money. Contact us before the deadline!' }
                    ].map(ex => (
                      <button key={ex.label} className="btn btn-secondary btn-sm" onClick={() => setText(ex.text)}>
                        {ex.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* URL Tab */}
            {activeTab === 'url' && (
              <div>
                <div className="form-group">
                  <label className="form-label">URL to Analyze</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="https://example.com or paste any URL..."
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Try a demo URL:</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[
                      'http://paypa1-secure-verify.xyz/login',
                      'https://amaz0n-deals.tk/checkout',
                      'https://google.com'
                    ].map(u => (
                      <button key={u} className="btn btn-secondary btn-sm" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }} onClick={() => setUrl(u)}>
                        {u.slice(0, 35)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Page Tab */}
            {activeTab === 'page' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Webpage URL (optional)</label>
                  <input className="input" placeholder="https://..." value={pageUrl} onChange={e => setPageUrl(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Webpage Content</label>
                  <textarea
                    className="textarea"
                    style={{ minHeight: 200 }}
                    placeholder="Paste the webpage text content here, or use the browser extension to automatically extract and send the current page..."
                    value={pageText}
                    onChange={e => setPageText(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Screenshot Tab */}
            {activeTab === 'screenshot' && (
              <div>
                <div
                  className={`upload-zone${file ? ' active' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileRef.current?.click()}
                >
                  {file ? (
                    <>
                      <div style={{ fontSize: '2rem' }}>📸</div>
                      <div style={{ fontWeight: 600 }}>{file.name}</div>
                      <div style={{ fontSize: '0.75rem' }}>{(file.size / 1024).toFixed(1)} KB</div>
                      <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); setFile(null); }}>Remove</button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '2.5rem' }}>📷</div>
                      <div style={{ fontWeight: 600 }}>Drop screenshot here or click to upload</div>
                      <div style={{ fontSize: '0.8rem' }}>Supports JPG, PNG, GIF, WebP (max 5MB)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SMS, WhatsApp, Email, Payment screenshots</div>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <button
              className="btn btn-primary w-full"
              style={{ marginTop: '1rem' }}
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? '🔍 Analyzing...' : '🛡️ Analyze for Risk'}
            </button>
          </div>

          {loading && <div className="card" style={{ marginTop: '1rem' }}><LoadingState /></div>}
        </div>

        {/* Results Panel */}
        {result && !loading && (
          <div className="fade-in">
            <ResultPanel result={result} navigate={navigate} showChat={showChat} setShowChat={setShowChat} />
          </div>
        )}
      </div>
    </div>
  );
}

function ResultPanel({ result, navigate, showChat, setShowChat }) {
  const isHighRisk = result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Risk Overview Card */}
      <div className={`card${isHighRisk ? ' pulse-critical' : ''}`} style={{ borderColor: isHighRisk ? 'var(--color-high-border)' : undefined }}>
        {result.isDemo && (
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.75rem', marginBottom: '1rem', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚡ DEMO DATA – Not a real analysis
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
          <RiskScoreCircle score={result.riskScore} level={result.riskLevel} />
          <div>
            <RiskBadge level={result.riskLevel} />
            <div style={{ marginTop: '0.5rem' }}>
              {result.categories?.map(cat => (
                <div key={cat} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>• {cat}</div>
              ))}
            </div>
          </div>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{result.summary}</p>
      </div>

      {/* Risk Factors */}
      {result.factorBreakdown?.length > 0 && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>⚡ Risk Factor Breakdown</h3>
          {result.factorBreakdown.map((f, i) => <FactorBar key={i} {...f} />)}
        </div>
      )}

      {/* Detected Indicators */}
      {result.indicators?.length > 0 && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>🚨 Detected Indicators ({result.indicators.length})</h3>
          {result.indicators.map((ind, i) => <IndicatorCard key={i} indicator={ind} />)}
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations?.length > 0 && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>✅ Recommended Actions</h3>
          {result.recommendations.map((rec, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>
              {rec}
            </div>
          ))}
        </div>
      )}

      {/* URL Analysis */}
      {result.urlAnalysis?.indicators?.length > 0 && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>🔗 URL Analysis</h3>
          {result.urlAnalysis.indicators.map((ind, i) => (
            <div key={i} className={`indicator-pill ${ind.severity}`} style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{ind.name}</div>
            </div>
          ))}
        </div>
      )}

      {/* Extracted Text (OCR) */}
      {result.extractedText && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '0.75rem' }}>📷 Extracted Text (OCR)</h3>
          <pre style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--color-bg)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {result.extractedText}
          </pre>
        </div>
      )}

      {/* RAG Evidence */}
      {result.ragEvidence?.length > 0 && (
        <div className="card">
          <RAGEvidence docs={result.ragEvidence} />
        </div>
      )}

      {/* Disclaimer */}
      <Disclaimer />

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {result.analysisId && (
          <button className="btn btn-secondary" onClick={() => navigate(`/report/${result.analysisId}`)}>
            📄 Full Report
          </button>
        )}
        <button className={`btn ${showChat ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowChat(s => !s)}>
          💬 {showChat ? 'Hide' : 'Ask'} TrustGuard AI
        </button>
      </div>

      {/* Chat Panel */}
      {showChat && <ChatPanel analysisContext={result} />}
    </div>
  );
}
