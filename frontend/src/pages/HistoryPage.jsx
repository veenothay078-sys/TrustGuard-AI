import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deleteAnalysis } from '../services/api';
import { RiskBadge, LoadingState, EmptyState } from '../components/RiskComponents';
import { Trash2, ExternalLink } from 'lucide-react';

const RISK_LEVELS = ['', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'];
const INPUT_TYPES = ['', 'text', 'url', 'page', 'screenshot'];

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getHistory({ page, limit: 15, riskLevel: filterLevel || undefined, inputType: filterType || undefined, search: search || undefined });
      setAnalyses(data.analyses);
      setTotalPages(data.pagination.totalPages);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, filterLevel, filterType]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this analysis?')) return;
    try {
      await deleteAnalysis(id);
      setAnalyses(prev => prev.filter(a => a.analysisId !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📋 Analysis History</h1>
        <p className="page-subtitle">Browse, search, and manage previous risk analyses</p>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 2, minWidth: 200 }}>
            <label className="form-label">Search</label>
            <input className="input" placeholder="Search by URL, text, or domain..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label className="form-label">Risk Level</label>
            <select className="select" value={filterLevel} onChange={e => { setFilterLevel(e.target.value); setPage(1); }}>
              <option value="">All Levels</option>
              {RISK_LEVELS.slice(1).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <label className="form-label">Input Type</label>
            <select className="select" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
              <option value="">All Types</option>
              {INPUT_TYPES.slice(1).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" className="btn btn-secondary" onClick={() => { setSearch(''); setFilterLevel(''); setFilterType(''); setPage(1); }}>Clear</button>
        </form>
      </div>

      {loading && <LoadingState message="Loading history..." />}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && analyses.length === 0 && (
        <EmptyState
          icon="📋"
          title="No analyses found"
          subtitle="Run your first analysis on the Analyze page"
        />
      )}

      {!loading && analyses.length > 0 && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Content</th>
                  <th>Score</th>
                  <th>Level</th>
                  <th>Categories</th>
                  <th>Demo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map(a => (
                  <tr key={a.analysisId} style={{ cursor: 'pointer' }} onClick={() => navigate(`/report/${a.analysisId}`)}>
                    <td style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {new Date(a.createdAt).toLocaleDateString()}<br />
                      <span style={{ color: 'var(--text-muted)' }}>{new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td>
                      <span style={{ textTransform: 'capitalize', fontSize: '0.8rem', background: 'var(--color-bg)', padding: '0.2rem 0.5rem', borderRadius: 4 }}>{a.inputType}</span>
                    </td>
                    <td>
                      <span className="truncate" style={{ maxWidth: 220, display: 'block', fontSize: '0.8rem' }}>
                        {a.input?.url || a.input?.pageTitle || a.input?.text?.slice(0, 60) || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '1rem' }}>{a.result?.riskScore}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>/100</span>
                    </td>
                    <td><RiskBadge level={a.result?.riskLevel} /></td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                        {a.result?.categories?.slice(0, 2).map(c => (
                          <span key={c} style={{ fontSize: '0.65rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '0.1rem 0.4rem', borderRadius: 999 }}>
                            {c.replace(' Risk', '').replace(' Scam', '')}
                          </span>
                        ))}
                        {a.result?.categories?.length > 2 && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>+{a.result.categories.length - 2}</span>}
                      </div>
                    </td>
                    <td>
                      {a.isDemo && <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 600 }}>DEMO</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/report/${a.analysisId}`); }} title="View Report">
                          <ExternalLink size={14} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={e => handleDelete(a.analysisId, e)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
              <span style={{ padding: '0.375rem 0.875rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Page {page} of {totalPages}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
