import { useEffect, useState } from 'react';
import { getAdminStats } from '../services/api';
import { LoadingState } from '../components/RiskComponents';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => setStats({ error: 'Could not reach backend' }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Loading admin stats..." />;

  const mem = stats?.memoryUsage;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">⚙️ Admin / Developer View</h1>
        <p className="page-subtitle">System status, runtime info, and API configuration</p>
      </div>

      {stats?.error && <div className="alert alert-danger">{stats.error}</div>}

      <div className="grid-2 mb-6">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(79,142,247,0.15)', color: '#4f8ef7' }}>🗄️</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.totalAnalyses ?? '–'}</div>
            <div className="stat-label">Total DB Records</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: stats?.demoMode ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)', color: stats?.demoMode ? '#f59e0b' : '#22c55e' }}>
            {stats?.demoMode ? '🎭' : '🤖'}
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ fontSize: '1.2rem' }}>{stats?.demoMode ? 'DEMO MODE' : 'LIVE AI'}</div>
            <div className="stat-label">AI Mode</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="card-title mb-4">System Information</h3>
          {[
            { label: 'Node.js Version', value: stats?.nodeVersion },
            { label: 'Environment', value: stats?.environment },
            { label: 'Uptime', value: stats?.uptime ? `${Math.round(stats.uptime)}s` : '–' },
            { label: 'AI Model', value: stats?.aiModel }
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{value || '–'}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="card-title mb-4">Memory Usage</h3>
          {mem ? [
            { label: 'RSS', value: `${Math.round(mem.rss / 1024 / 1024)} MB` },
            { label: 'Heap Used', value: `${Math.round(mem.heapUsed / 1024 / 1024)} MB` },
            { label: 'Heap Total', value: `${Math.round(mem.heapTotal / 1024 / 1024)} MB` },
            { label: 'External', value: `${Math.round(mem.external / 1024 / 1024)} MB` }
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{value}</span>
            </div>
          )) : <span style={{ color: 'var(--text-muted)' }}>No memory data</span>}
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h3 className="card-title mb-4">API Endpoints Reference</h3>
        <div style={{ overflowX: 'auto' }}>
          {[
            { method: 'POST', path: '/api/analyze/text', desc: 'Analyze text/message content' },
            { method: 'POST', path: '/api/analyze/url', desc: 'Analyze URL for risk' },
            { method: 'POST', path: '/api/analyze/page', desc: 'Analyze webpage content' },
            { method: 'POST', path: '/api/analyze/screenshot', desc: 'Upload screenshot for OCR + analysis' },
            { method: 'POST', path: '/api/chat', desc: 'AI chat with analysis context' },
            { method: 'POST', path: '/api/rag/search', desc: 'Search knowledge base' },
            { method: 'GET', path: '/api/analysis/history', desc: 'Get analysis history' },
            { method: 'GET', path: '/api/analysis/:id', desc: 'Get specific analysis' },
            { method: 'DELETE', path: '/api/analysis/:id', desc: 'Delete analysis' },
            { method: 'GET', path: '/api/dashboard/statistics', desc: 'Dashboard statistics' },
            { method: 'GET', path: '/api/health', desc: 'Backend health check' }
          ].map(({ method, path, desc }) => (
            <div key={path} style={{ display: 'flex', gap: '1rem', padding: '0.625rem 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.8rem', alignItems: 'center' }}>
              <span style={{ width: 52, textAlign: 'center', padding: '0.15rem 0.4rem', background: method === 'GET' ? 'rgba(34,197,94,0.1)' : method === 'DELETE' ? 'rgba(239,68,68,0.1)' : 'rgba(79,142,247,0.1)', color: method === 'GET' ? '#22c55e' : method === 'DELETE' ? '#ef4444' : '#4f8ef7', borderRadius: 4, fontWeight: 700, fontFamily: 'monospace' }}>{method}</span>
              <code style={{ flex: 1, color: 'var(--text-primary)' }}>{path}</code>
              <span style={{ color: 'var(--text-muted)', flex: 2 }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
        ⚠️ This page is for development/admin use only. Do not expose in production without authentication.
      </div>
    </div>
  );
}
