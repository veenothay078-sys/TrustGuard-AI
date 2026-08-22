/**
 * RiskScoreCircle - Animated SVG risk meter
 */
export function RiskScoreCircle({ score, level, size = 120 }) {
  const radius = (size / 2) - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colors = {
    LOW: '#22c55e',
    MODERATE: '#f59e0b',
    HIGH: '#ef4444',
    CRITICAL: '#dc2626'
  };
  const color = colors[level] || '#4f8ef7';

  return (
    <div className="risk-score-circle" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease', filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
      </svg>
      <div className="risk-score-number" style={{ color }}>{score}</div>
      <div className="risk-score-label">/ 100</div>
    </div>
  );
}

/**
 * RiskBadge - Level indicator badge
 */
export function RiskBadge({ level }) {
  const icons = { LOW: '✓', MODERATE: '⚠', HIGH: '⛔', CRITICAL: '🚨' };
  return (
    <span className={`risk-badge ${level}`}>
      {icons[level] || '?'} {level}
    </span>
  );
}

/**
 * FactorBar - Single risk factor progress bar
 */
export function FactorBar({ name, score, severity }) {
  return (
    <div style={{ marginBottom: '0.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{name}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: severity === 'CRITICAL' ? '#dc2626' : severity === 'HIGH' ? '#ef4444' : severity === 'MODERATE' ? '#f59e0b' : '#22c55e' }}>{score}</span>
      </div>
      <div className="progress-bar">
        <div className={`progress-fill ${severity}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

/**
 * IndicatorCard - Single detected indicator
 */
export function IndicatorCard({ indicator }) {
  return (
    <div className={`indicator-pill ${indicator.severity}`}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{indicator.name}</span>
          <span className={`risk-badge ${indicator.severity}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem' }}>{indicator.severity}</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{indicator.explanation}</p>
      </div>
    </div>
  );
}

/**
 * RAGEvidence - Supporting knowledge base results
 */
export function RAGEvidence({ docs }) {
  if (!docs || docs.length === 0) return null;
  return (
    <div>
      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
        📚 Supporting Knowledge Base
      </h4>
      {docs.map((doc, i) => (
        <div key={i} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.875rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{doc.title}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--color-bg-card)', padding: '0.1rem 0.5rem', borderRadius: 999 }}>{doc.category}</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {doc.relevantContent?.slice(0, 200)}...
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Disclaimer - Always-visible AI disclaimer
 */
export function Disclaimer() {
  return (
    <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
      ⚠️ <span><strong>AI Disclaimer:</strong> This is an AI-assisted risk assessment and should not be treated as definitive proof of fraud or scam activity. Always verify suspicious content through official channels.</span>
    </div>
  );
}

/**
 * LoadingState - Animated loading
 */
export function LoadingState({ message = 'Analyzing content...' }) {
  return (
    <div className="loading-overlay">
      <div className="spinner" />
      <span>{message}</span>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>This may take a few seconds</span>
    </div>
  );
}

/**
 * EmptyState
 */
export function EmptyState({ icon = '🔍', title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
      <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>{title}</div>
      <div style={{ fontSize: '0.85rem' }}>{subtitle}</div>
    </div>
  );
}
