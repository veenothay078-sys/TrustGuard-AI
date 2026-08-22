/**
 * TrustGuard Risk Scoring Engine
 * Generates transparent, explainable risk scores from 0–100
 *
 * Risk Levels:
 *   0–20   = LOW
 *   21–50  = MODERATE
 *   51–75  = HIGH
 *   76–100 = CRITICAL
 */

const RISK_FACTORS = {
  urgency: { weight: 0.18, keywords: ['urgent', 'immediately', 'act now', 'expires', 'limited time', 'hurry', 'deadline', 'final notice', 'last chance', 'within 24 hours', 'right now', 'today only'] },
  paymentRequest: { weight: 0.22, keywords: ['pay now', 'send money', 'transfer funds', 'wire transfer', 'bank transfer', 'payment required', 'pay to', 'send to account', 'crypto', 'bitcoin', 'gift card', 'itunes card', 'google play card'] },
  credentialRequest: { weight: 0.20, keywords: ['password', 'otp', 'pin', 'cvv', 'credit card', 'bank account', 'social security', 'ssn', 'aadhaar', 'id number', 'login', 'verify account', 'confirm identity'] },
  rewardClaim: { weight: 0.15, keywords: ['congratulations', 'you won', 'winner', 'prize', 'free gift', 'lottery', 'selected', 'lucky draw', 'claim your', 'reward', 'bonus', 'inheritance', 'million dollars', 'jackpot'] },
  impersonation: { weight: 0.12, keywords: ['amazon', 'paypal', 'google', 'microsoft', 'apple', 'bank', 'irs', 'government', 'official', 'police', 'court', 'support team', 'customer service', 'tech support'] },
  suspiciousLink: { weight: 0.13, keywords: ['click here', 'click this link', 'verify now', 'update your', 'confirm your', 'bit.ly', 'tinyurl', 'shorturl', 'bit.do', 't.co', 'ow.ly'] }
};

const RISK_LEVELS = [
  { max: 20, level: 'LOW', label: 'Low Risk', color: '#22c55e' },
  { max: 50, level: 'MODERATE', label: 'Moderate Risk', color: '#f59e0b' },
  { max: 75, level: 'HIGH', label: 'High Risk', color: '#ef4444' },
  { max: 100, level: 'CRITICAL', label: 'Critical Risk', color: '#dc2626' }
];

/**
 * Score text content heuristically before AI analysis
 * Returns factor-level scores and an overall pre-score
 */
function scoreText(text = '') {
  const lower = text.toLowerCase();
  const factorScores = {};
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [factor, config] of Object.entries(RISK_FACTORS)) {
    let hits = 0;
    for (const kw of config.keywords) {
      if (lower.includes(kw)) hits++;
    }
    // Normalize: each keyword hit adds roughly 15 points, cap at 100
    const score = Math.min(100, hits * 15 + (hits > 0 ? 20 : 0));
    factorScores[factor] = score;
    weightedSum += score * config.weight;
    totalWeight += config.weight;
  }

  const preScore = Math.round(weightedSum / totalWeight);
  return { factorScores, preScore };
}

/**
 * Analyze URL for suspicious characteristics
 */
function analyzeUrl(url = '') {
  if (!url) return { score: 0, indicators: [] };

  const indicators = [];
  let score = 0;

  try {
    const parsed = new URL(url.startsWith('http') ? url : 'https://' + url);
    const hostname = parsed.hostname.toLowerCase();

    // HTTP (not HTTPS)
    if (parsed.protocol === 'http:') {
      indicators.push({ name: 'Unencrypted connection (HTTP)', severity: 'MODERATE' });
      score += 25;
    }

    // Excessive subdomains
    const parts = hostname.split('.');
    if (parts.length > 4) {
      indicators.push({ name: 'Excessive subdomains detected', severity: 'HIGH' });
      score += 30;
    }

    // IP address as hostname
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      indicators.push({ name: 'IP address used instead of domain name', severity: 'HIGH' });
      score += 40;
    }

    // URL shorteners
    const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'ow.ly', 'bit.do', 'goo.gl', 'shorturl.at'];
    if (shorteners.some(s => hostname.includes(s))) {
      indicators.push({ name: 'URL shortener detected', severity: 'MODERATE' });
      score += 20;
    }

    // Look-alike patterns
    const lookalikes = ['paypa1', 'g00gle', 'amaz0n', 'micros0ft', 'app1e', 'faceb00k', 'bankofamerica-', 'secure-paypal'];
    if (lookalikes.some(s => hostname.includes(s))) {
      indicators.push({ name: 'Domain appears to impersonate a trusted brand', severity: 'CRITICAL' });
      score += 60;
    }

    // Very long domain
    if (hostname.length > 50) {
      indicators.push({ name: 'Unusually long domain name', severity: 'MODERATE' });
      score += 15;
    }

    // Suspicious TLDs
    const suspiciousTLDs = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.click', '.download', '.zip'];
    if (suspiciousTLDs.some(tld => hostname.endsWith(tld))) {
      indicators.push({ name: 'Suspicious top-level domain', severity: 'HIGH' });
      score += 30;
    }

    // Query parameters with sensitive keywords
    const sensitiveParams = ['password', 'token', 'otp', 'creditcard', 'ssn', 'verify'];
    const queryStr = parsed.search.toLowerCase();
    if (sensitiveParams.some(p => queryStr.includes(p))) {
      indicators.push({ name: 'Sensitive data in URL query parameters', severity: 'HIGH' });
      score += 35;
    }

    // Punycode/IDN homograph
    if (hostname.includes('xn--')) {
      indicators.push({ name: 'Internationalized domain name (possible homograph attack)', severity: 'HIGH' });
      score += 40;
    }

  } catch (e) {
    indicators.push({ name: 'Malformed or invalid URL', severity: 'MODERATE' });
    score += 30;
  }

  return {
    score: Math.min(100, score),
    indicators
  };
}

/**
 * Map final score to risk level
 */
function getRiskLevel(score) {
  for (const level of RISK_LEVELS) {
    if (score <= level.max) return level;
  }
  return RISK_LEVELS[RISK_LEVELS.length - 1];
}

/**
 * Blend AI score with heuristic pre-score
 * aiScore has higher weight (70%) when available
 */
function blendScores(aiScore, heuristicScore) {
  if (aiScore === null || aiScore === undefined) return heuristicScore;
  return Math.round(aiScore * 0.7 + heuristicScore * 0.3);
}

/**
 * Build human-readable factor scores for display
 */
function buildFactorDisplay(factorScores, urlScore) {
  const display = [];
  const names = {
    urgency: 'Urgency Language',
    paymentRequest: 'Payment Request',
    credentialRequest: 'Credential Request',
    rewardClaim: 'Reward/Prize Claim',
    impersonation: 'Impersonation',
    suspiciousLink: 'Suspicious Links'
  };

  for (const [key, score] of Object.entries(factorScores)) {
    if (score > 0) {
      display.push({ name: names[key] || key, score, severity: getRiskLevel(score).level });
    }
  }

  if (urlScore > 0) {
    display.push({ name: 'URL Analysis', score: urlScore, severity: getRiskLevel(urlScore).level });
  }

  return display.sort((a, b) => b.score - a.score);
}

module.exports = { scoreText, analyzeUrl, getRiskLevel, blendScores, buildFactorDisplay };
