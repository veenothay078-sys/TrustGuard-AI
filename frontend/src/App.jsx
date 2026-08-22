import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Shield, LayoutDashboard, Search, History, FileText, Settings, Zap, ChevronRight } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AnalyzePage from './pages/AnalyzePage';
import HistoryPage from './pages/HistoryPage';
import ReportPage from './pages/ReportPage';
import AdminPage from './pages/AdminPage';
import './index.css';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analyze', icon: Search, label: 'Analyze' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/admin', icon: Settings, label: 'Admin' }
];

function AppLayout() {
  const location = useLocation();
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => setDemoMode(d.demoMode))
      .catch(() => setDemoMode(true));
  }, []);

  if (location.pathname === '/' || location.pathname === '/landing') {
    return <LandingPage />;
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🛡️</div>
          <div>
            <div className="sidebar-logo-text">TrustGuard</div>
            <div className="sidebar-logo-sub">Risk Manager</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={18} className="nav-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {demoMode && (
            <div className="demo-badge">
              <Zap size={12} />
              DEMO MODE
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <div className="page-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/report/:id" element={<ReportPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
