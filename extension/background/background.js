// TrustGuard Background Service Worker
// Handles context menus and inter-component communication

const BACKEND_URL = 'http://localhost:5000';

// ─── Context Menu Setup ───────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'trustguard-analyze-selection',
    title: 'Analyze with TrustGuard 🛡️',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'trustguard-analyze-link',
    title: 'Check this link with TrustGuard 🔗',
    contexts: ['link']
  });

  chrome.contextMenus.create({
    id: 'trustguard-scan-page',
    title: 'Scan page with TrustGuard 🔍',
    contexts: ['page']
  });
});

// ─── Context Menu Click Handler ────────────────────────────────────────────────
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const { backendUrl } = await chrome.storage.sync.get(['backendUrl']);
  const apiBase = backendUrl || BACKEND_URL;

  if (info.menuItemId === 'trustguard-analyze-selection' && info.selectionText) {
    await analyzeText(info.selectionText, tab, apiBase);
  } else if (info.menuItemId === 'trustguard-analyze-link' && info.linkUrl) {
    await analyzeUrl(info.linkUrl, tab, apiBase);
  } else if (info.menuItemId === 'trustguard-scan-page') {
    // Open popup
    chrome.action.openPopup?.();
  }
});

// ─── Analyze Text ─────────────────────────────────────────────────────────────
async function analyzeText(text, tab, apiBase) {
  try {
    const response = await fetch(`${apiBase}/api/analyze/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.slice(0, 3000) })
    });
    const data = await response.json();

    // Show notification
    showNotification(data.riskLevel, data.riskScore, 'Text Analysis Complete');

    // Show banner on page if high risk
    if (data.riskLevel === 'HIGH' || data.riskLevel === 'CRITICAL') {
      chrome.tabs.sendMessage(tab.id, { action: 'showRiskBanner', data });
    }

    // Store last result
    chrome.storage.session.set({ lastAnalysis: data });
  } catch (err) {
    showNotification('ERROR', 0, 'Analysis failed: ' + err.message);
  }
}

// ─── Analyze URL ──────────────────────────────────────────────────────────────
async function analyzeUrl(url, tab, apiBase) {
  try {
    const response = await fetch(`${apiBase}/api/analyze/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await response.json();
    showNotification(data.riskLevel, data.riskScore, 'URL Analysis Complete');
    chrome.storage.session.set({ lastAnalysis: data });
  } catch (err) {
    showNotification('ERROR', 0, 'URL analysis failed');
  }
}

// ─── Show Notification ────────────────────────────────────────────────────────
function showNotification(riskLevel, riskScore, title) {
  const icons = { LOW: '✅', MODERATE: '⚠️', HIGH: '🔴', CRITICAL: '🚨', ERROR: '⚠️' };
  const messages = {
    LOW: `Risk Score: ${riskScore}/100 – Content appears relatively safe`,
    MODERATE: `Risk Score: ${riskScore}/100 – Moderate risk detected`,
    HIGH: `Risk Score: ${riskScore}/100 – High risk detected! Exercise caution`,
    CRITICAL: `Risk Score: ${riskScore}/100 – CRITICAL risk! Do not proceed`,
    ERROR: 'Could not complete analysis'
  };

  chrome.notifications.create({
    type: 'basic',
    iconUrl: '../assets/icons/icon48.png',
    title: `🛡️ TrustGuard – ${title}`,
    message: messages[riskLevel] || `Risk Level: ${riskLevel}`
  });
}

// ─── Message Handler (from popup) ─────────────────────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getLastAnalysis') {
    chrome.storage.session.get(['lastAnalysis'], data => {
      sendResponse(data.lastAnalysis || null);
    });
    return true;
  }
});

console.log('🛡️ TrustGuard Background Service Worker initialized');
