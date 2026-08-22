// TrustGuard Extension Popup Script

const BACKEND_URL = 'http://localhost:5000';
const DASHBOARD_URL = 'http://localhost:5173';

// DOM References
const el = id => document.getElementById(id);
let currentAnalysisId = null;

// ─── Initialize ────────────────────────────────────────────────────────────────
async function init() {
  // Load saved backend URL from options
  const stored = await chrome.storage.sync.get(['backendUrl', 'demoMode']);
  const backendUrl = stored.backendUrl || BACKEND_URL;

  // Show current tab URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    try {
      const domain = new URL(tab.url).hostname;
      el('current-url').textContent = domain || tab.url;
    } catch {
      el('current-url').textContent = tab.url;
    }
  }

  // Check backend health
  try {
    const res = await fetch(`${backendUrl}/api/health`);
    const health = await res.json();
    if (health.demoMode) {
      el('demo-badge').classList.remove('hidden');
    }
  } catch {
    // Backend not reachable - show warning
    el('current-url').textContent += ' (Backend offline)';
  }

  // Button handlers
  el('btn-scan-page').addEventListener('click', () => scanPage(tab, backendUrl));
  el('btn-analyze-selected').addEventListener('click', () => analyzeSelected(tab, backendUrl));
  el('btn-view-report').addEventListener('click', viewReport);
  el('btn-ask-ai').addEventListener('click', openChat);
  el('btn-retry').addEventListener('click', () => {
    hideAll();
    el('status-panel').classList.remove('hidden');
  });
}

// ─── Scan Page ────────────────────────────────────────────────────────────────
async function scanPage(tab, backendUrl) {
  showLoading();
  try {
    // Inject content script to extract page data
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractPageContent
    });

    const response = await fetch(`${backendUrl}/api/analyze/page`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: tab.url,
        title: result.title,
        text: result.text,
        headings: result.headings,
        forms: result.forms,
        links: result.links
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Analysis failed');
    }

    const data = await response.json();
    showResult(data);
  } catch (err) {
    showError(err.message);
  }
}

// ─── Analyze Selected Text ────────────────────────────────────────────────────
async function analyzeSelected(tab, backendUrl) {
  showLoading();
  try {
    const [{ result: selectedText }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() || ''
    });

    if (!selectedText || selectedText.trim().length < 5) {
      showError('Please select some text on the page first, then click this button.');
      return;
    }

    const response = await fetch(`${backendUrl}/api/analyze/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: selectedText })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Analysis failed');
    }

    const data = await response.json();
    showResult(data);
  } catch (err) {
    showError(err.message);
  }
}

// ─── Page Content Extractor (runs in page context) ────────────────────────────
function extractPageContent() {
  const getVisible = (selector) =>
    [...document.querySelectorAll(selector)]
      .map(el => el.innerText?.trim())
      .filter(t => t && t.length > 2)
      .slice(0, 20);

  const bodyText = document.body?.innerText || '';
  const maxText = bodyText.slice(0, 3000);

  // Extract forms and their fields
  const forms = [...document.querySelectorAll('form')].map(f => {
    const inputs = [...f.querySelectorAll('input, select, textarea')].map(i => i.type || i.tagName.toLowerCase());
    return inputs.join(', ');
  }).filter(Boolean).slice(0, 5);

  // Extract links (suspicious ones)
  const links = [...document.querySelectorAll('a[href]')]
    .map(a => a.href)
    .filter(href => href && !href.startsWith('#'))
    .slice(0, 10);

  return {
    title: document.title,
    text: maxText,
    headings: getVisible('h1, h2, h3'),
    forms,
    links
  };
}

// ─── Display Result ────────────────────────────────────────────────────────────
function showResult(data) {
  currentAnalysisId = data.analysisId;
  hideAll();
  el('result-panel').classList.remove('hidden');

  // Demo banner
  if (data.isDemo) el('demo-banner').classList.remove('hidden');

  // Score circle animation
  const score = data.riskScore || 0;
  const level = data.riskLevel || 'LOW';
  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (score / 100) * circumference;

  const colors = { LOW: '#22c55e', MODERATE: '#f59e0b', HIGH: '#ef4444', CRITICAL: '#dc2626' };
  const color = colors[level] || '#4f8ef7';

  const arc = el('score-arc');
  arc.style.stroke = color;
  arc.style.strokeDashoffset = offset;
  arc.style.filter = `drop-shadow(0 0 4px ${color}88)`;

  el('score-number').textContent = score;
  el('score-number').style.color = color;

  // Risk badge
  const badge = el('risk-level-badge');
  badge.className = `risk-badge ${level}`;
  const icons = { LOW: '✓', MODERATE: '⚠', HIGH: '⛔', CRITICAL: '🚨' };
  badge.textContent = `${icons[level]} ${level}`;

  // Categories
  const cats = data.categories || [];
  el('risk-categories').textContent = cats.slice(0, 3).join(' • ') || 'No specific category';

  // Indicators
  const indicators = data.indicators || [];
  const indicatorsList = el('indicators-list');
  if (indicators.length > 0) {
    el('indicators-section').style.display = 'block';
    indicatorsList.innerHTML = indicators.slice(0, 3).map(ind => `
      <div class="indicator-item ${ind.severity}">
        ⚠ ${ind.name}
      </div>
    `).join('');
  } else {
    el('indicators-section').style.display = 'none';
  }

  // Recommendation
  const recs = data.recommendations || [];
  if (recs.length > 0) {
    el('rec-section').style.display = 'block';
    el('recommendation').textContent = recs[0];
  } else {
    el('rec-section').style.display = 'none';
  }
}

// ─── Error Display ─────────────────────────────────────────────────────────────
function showError(message) {
  hideAll();
  el('error-panel').classList.remove('hidden');
  el('error-message').textContent = message;
}

// ─── Loading ───────────────────────────────────────────────────────────────────
function showLoading() {
  hideAll();
  el('loading-state').classList.remove('hidden');
}

function hideAll() {
  ['status-panel', 'loading-state', 'result-panel', 'error-panel', 'demo-banner'].forEach(id => {
    el(id)?.classList.add('hidden');
  });
}

// ─── Navigate to Dashboard ─────────────────────────────────────────────────────
function viewReport() {
  const url = currentAnalysisId
    ? `${DASHBOARD_URL}/report/${currentAnalysisId}`
    : `${DASHBOARD_URL}/analyze`;
  chrome.tabs.create({ url });
}

function openChat() {
  chrome.tabs.create({ url: `${DASHBOARD_URL}/analyze` });
}

// ─── Start ─────────────────────────────────────────────────────────────────────
init();
