// TrustGuard Content Script
// Runs on all pages - extracts content when requested by popup

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    sendResponse(extractPageContent());
    return true;
  }
  if (request.action === 'getSelectedText') {
    sendResponse({ text: window.getSelection()?.toString() || '' });
    return true;
  }
  if (request.action === 'showRiskBanner') {
    showRiskBanner(request.data);
    return true;
  }
});

/**
 * Extract meaningful page content for risk analysis
 * Only collects what is necessary for risk assessment
 */
function extractPageContent() {
  const bodyText = document.body?.innerText || '';

  // Extract headings
  const headings = [...document.querySelectorAll('h1, h2, h3')]
    .map(h => h.innerText?.trim())
    .filter(t => t && t.length > 2)
    .slice(0, 15);

  // Extract form field types (not values - we never collect personal data)
  const forms = [...document.querySelectorAll('form')].map(f => {
    const inputs = [...f.querySelectorAll('input, select, textarea')]
      .map(i => i.type || i.name || i.tagName.toLowerCase())
      .filter(Boolean);
    return inputs.join(', ');
  }).filter(Boolean).slice(0, 5);

  // Extract link destinations
  const links = [...document.querySelectorAll('a[href]')]
    .map(a => a.href)
    .filter(href => href && !href.startsWith('#') && !href.startsWith('javascript:'))
    .slice(0, 10);

  return {
    title: document.title,
    text: bodyText.slice(0, 3000), // Limit to 3000 chars
    headings,
    forms,
    links,
    url: window.location.href
  };
}

/**
 * Show a non-intrusive risk banner at top of page
 */
function showRiskBanner(data) {
  // Remove existing banner
  document.getElementById('tg-risk-banner')?.remove();

  if (!data || data.riskLevel === 'LOW') return;

  const colors = {
    MODERATE: { bg: '#d97706', text: '#fff' },
    HIGH: { bg: '#dc2626', text: '#fff' },
    CRITICAL: { bg: '#991b1b', text: '#fff' }
  };

  const style = colors[data.riskLevel] || colors.MODERATE;

  const banner = document.createElement('div');
  banner.id = 'tg-risk-banner';
  banner.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; z-index: 2147483647;
    background: ${style.bg}; color: ${style.text};
    padding: 8px 16px; font-family: -apple-system, sans-serif; font-size: 13px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  `;

  banner.innerHTML = `
    <span>🛡️ TrustGuard: <strong>${data.riskLevel} RISK</strong> detected on this page (Score: ${data.riskScore}/100)</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;font-size:16px;padding:0 4px">✕</button>
  `;

  document.body.prepend(banner);

  // Auto-remove after 10 seconds
  setTimeout(() => banner.remove(), 10000);
}
