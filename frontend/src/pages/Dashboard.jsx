import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { getDashboardStats } from '../services/api';
import { LoadingState, EmptyState } from '../components/RiskComponents';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const chartOptions = {
  responsive: true,
  plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } } }
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats()
      .then(data => setStats(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return <EmptyState title="No data yet" subtitle="Run your first analysis to see dashboard stats" />;

  const doughnutData = {
    labels: ['Critical', 'High', 'Moderate', 'Low'],
    datasets: [{
      data: [stats.criticalCount, stats.highCount, stats.moderateCount, stats.lowCount],
      backgroundColor: ['#dc2626', '#ef4444', '#f59e0b', '#22c55e'],
      borderColor: ['#dc2626', '#ef4444', '#f59e0b', '#22c55e'],
      borderWidth: 2
    }]
  };

  const categoryData = {
    labels: stats.topCategories.map(c => c.category.replace(' Risk', '').replace(' Scam', '')),
    datasets: [{
      label: 'Detections',
      data: stats.topCategories.map(c => c.count),
      backgroundColor: 'rgba(79, 142, 247, 0.6)',
      borderColor: '#4f8ef7',
      borderWidth: 2,
      borderRadius: 4
    }]
  };

  const trendData = {
    labels: stats.riskTrend?.slice(-14).map(t => t.date?.slice(5)) || [],
    datasets: [{
      label: 'Avg Risk Score',
      data: stats.riskTrend?.slice(-14).map(t => t.avgScore) || [],
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#ef4444'
    }]
  };

  const inputTypeData = {
    labels: stats.inputTypeDistribution.map(t => t.type),
    datasets: [{
      data: stats.inputTypeDistribution.map(t => t.count),
      backgroundColor: ['#4f8ef7', '#7c3aed', '#f59e0b', '#22c55e']
    }]
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📊 Dashboard</h1>
        <p className="page-subtitle">
          Risk analysis overview and statistics
          {stats.isDemo && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>⚡ DEMO DATA</span>}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(79,142,247,0.15)', color: '#4f8ef7' }}>🔍</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalAnalyses}</div>
            <div className="stat-label">Total Analyses</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(220,38,38,0.15)', color: '#dc2626' }}>🚨</div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#dc2626' }}>{stats.criticalCount + stats.highCount}</div>
            <div className="stat-label">High + Critical</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>⚠️</div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.moderateCount}</div>
            <div className="stat-label">Moderate Risk</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>✓</div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#22c55e' }}>{stats.lowCount}</div>
            <div className="stat-label">Low Risk</div>
          </div>
        </div>
      </div>

      {/* Second row stats */}
      <div className="grid-2 mb-6">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(79,142,247,0.15)', color: '#4f8ef7' }}>📈</div>
          <div className="stat-info">
            <div className="stat-value">{stats.averageRiskScore}</div>
            <div className="stat-label">Average Risk Score</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.15)', color: '#7c3aed' }}>🏆</div>
          <div className="stat-info">
            <div className="stat-value">{stats.topCategories[0]?.category?.split(' ')[0] || 'N/A'}</div>
            <div className="stat-label">Top Detected Category</div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid-2 mb-6">
        <div className="card">
          <h3 className="card-title mb-4">Risk Distribution</h3>
          <div style={{ maxWidth: 280, margin: '0 auto' }}>
            <Doughnut data={doughnutData} options={{ ...chartOptions, cutout: '65%' }} />
          </div>
        </div>
        <div className="card">
          <h3 className="card-title mb-4">Input Type Distribution</h3>
          <div style={{ maxWidth: 280, margin: '0 auto' }}>
            <Doughnut data={inputTypeData} options={{ ...chartOptions, cutout: '65%' }} />
          </div>
        </div>
      </div>

      {/* Risk Trend */}
      {trendData.labels.length > 0 && (
        <div className="card mb-6">
          <h3 className="card-title mb-4">Risk Score Trend (Last 14 Days)</h3>
          <Line data={trendData} options={{
            ...chartOptions,
            scales: {
              y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
              x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }
            }
          }} />
        </div>
      )}

      {/* Category Distribution */}
      {stats.topCategories.length > 0 && (
        <div className="card mb-6">
          <h3 className="card-title mb-4">Top Scam Categories Detected</h3>
          <Bar data={categoryData} options={{
            ...chartOptions,
            indexAxis: 'y',
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
              y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } }
            }
          }} />
        </div>
      )}

      {/* Recent Analyses */}
      {stats.recentAnalyses?.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="card-title">Recent Analyses</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/history')}>View All</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Content</th>
                  <th>Risk Score</th>
                  <th>Level</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAnalyses.map((a, i) => (
                  <tr key={i} style={{ cursor: 'pointer' }} onClick={() => navigate(`/report/${a.analysisId}`)}>
                    <td><span style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>{a.inputType}</span></td>
                    <td><span className="truncate" style={{ maxWidth: 200, display: 'block' }}>{a.input?.url || a.input?.pageTitle || a.input?.text || 'N/A'}</span></td>
                    <td><strong>{a.result?.riskScore}/100</strong></td>
                    <td><span className={`risk-badge ${a.result?.riskLevel}`} style={{ fontSize: '0.7rem' }}>{a.result?.riskLevel}</span></td>
                    <td style={{ fontSize: '0.8rem' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        ⚠️ Dashboard statistics include AI-assisted assessments. Risk scores are model-derived and should not be interpreted as definitive security metrics.
      </div>
    </div>
  );
}
