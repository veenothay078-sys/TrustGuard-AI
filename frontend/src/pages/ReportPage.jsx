import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalysis } from '../services/api';
import { RiskScoreCircle, RiskBadge, IndicatorCard, FactorBar, RAGEvidence, Disclaimer, LoadingState } from '../components/RiskComponents';
import ChatPanel from '../components/ChatPanel';
import { ArrowLeft } from 'lucide-react';

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    getAnalysis(id)
      .then(data => setAnalysis(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState message="Loading report..." />;
  if (error) return (
    <div>
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>
      <div className="alert alert-danger">{error}</div>
    </div>
  );
  if (!analysis) return null;

  const r = analysis.result;
  const isHighRisk = r?.riskLevel === 'HIGH' || r?.riskLevel === 'CRITICAL';

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ID: {analysis.analysisId?.slice(0, 8)}... | {new Date(analysis.createdAt).toLocaleString()}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Main Risk Card */}
          <div className={`card${isHighRisk ? ' pulse-critical' : ''}`} style={{ borderColor: isHighRisk ? 'var(--color-high-border)' : undefined }}>
            {/* Report Header */}
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>TrustGuard Risk Report</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Input Type: <strong style={{ textTransform: 'capitalize' }}>{analysis.inputType}</strong>
                {analysis.isDemo && <span style={{ marginLeft: '0.5rem', color: '#f59e0b', fontWeight: 600 }}>⚡ DEMO</span>}
              </div>
            </div>

            {/* Score + Level */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.25rem' }}>
              <RiskScoreCircle score={r?.riskScore || 0} level={r?.riskLevel} size={130} />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Risk Level</div>
                <RiskBadge level={r?.riskLevel} />
                <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Processing time: {analysis.processingTimeMs}ms
                </div>
              </div>
            </div>

            {/* Categories */}
            {r?.categories?.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Categories</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {r.categories.map(cat => (
                    <span key={cat} style={{ padding: '0.25rem 0.625rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 999, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)', padding: '0.875rem', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>AI SUMMARY</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{r?.summary}</p>
            </div>
          </div>

          {/* Input Information */}
          <div className="card">
            <h3 className="card-title mb-3">📄 Analyzed Content</h3>
            {analysis.input?.url && (
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>URL: </span>
                <code style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{analysis.input.url}</code>
              </div>
            )}
            {analysis.input?.pageTitle && (
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Title: </span>
                <span style={{ fontSize: '0.875rem' }}>{analysis.input.pageTitle}</span>
              </div>
            )}
            {analysis.input?.text && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>Content:</div>
                <pre style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--color-bg)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 200, overflow: 'auto' }}>
                  {analysis.input.text}
                </pre>
              </div>
            )}
            {analysis.input?.extractedText && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>OCR Extracted Text:</div>
                <pre style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--color-bg)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}>
                  {analysis.input.extractedText}
                </pre>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {r?.recommendations?.length > 0 && (
            <div className="card">
              <h3 className="card-title mb-3">✅ Recommended Actions</h3>
              {r.recommendations.map((rec, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.625rem', marginBottom: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <div style={{ width: 22, height: 22, background: 'var(--color-primary-glow)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0 }}>{i + 1}</div>
                  {rec}
                </div>
              ))}
            </div>
          )}

          {/* Uncertainty Statement */}
          <div className="alert alert-info">
            🔬 <strong>Confidence Statement:</strong> {r?.uncertainty}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Risk Factors */}
          {r?.factorBreakdown?.length > 0 && (
            <div className="card">
              <h3 className="card-title mb-4">⚡ Risk Factor Breakdown</h3>
              {r.factorBreakdown.map((f, i) => <FactorBar key={i} {...f} />)}
            </div>
          )}

          {/* Detected Indicators */}
          {r?.indicators?.length > 0 && (
            <div className="card">
              <h3 className="card-title mb-3">🚨 Detected Indicators ({r.indicators.length})</h3>
              {r.indicators.map((ind, i) => <IndicatorCard key={i} indicator={ind} />)}
            </div>
          )}

          {/* URL Analysis */}
          {r?.urlAnalysis?.indicators?.length > 0 && (
            <div className="card">
              <h3 className="card-title mb-3">🔗 URL Risk Analysis</h3>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>URL Risk Score: </span>
                <strong>{r.urlAnalysis.score}/100</strong>
              </div>
              {r.urlAnalysis.indicators.map((ind, i) => (
                <div key={i} className={`indicator-pill ${ind.severity}`} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{ind.name}</div>
                </div>
              ))}
            </div>
          )}

          {/* RAG Evidence */}
          {r?.ragEvidence?.length > 0 && (
            <div className="card">
              <RAGEvidence docs={r.ragEvidence} />
            </div>
          )}

          {/* Disclaimer */}
          <Disclaimer />

          {/* Chat Button */}
          <button className={`btn ${showChat ? 'btn-primary' : 'btn-secondary'} w-full`} onClick={() => setShowChat(s => !s)}>
            💬 {showChat ? 'Close' : 'Ask'} TrustGuard AI about this report
          </button>

          {showChat && <ChatPanel analysisContext={{ ...r, analysisId: analysis.analysisId }} />}
        </div>
      </div>
    </div>
  );
}
