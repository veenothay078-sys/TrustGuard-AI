/**
 * TrustGuard Demo Mode
 * Provides realistic pre-canned analysis results for 5 demo scenarios
 * Used when DEMO_MODE=true or when AI API is unavailable
 */

const demoScenarios = [
  {
    id: 'demo-001',
    name: 'Fake Bank Alert SMS',
    inputType: 'text',
    matchKeywords: ['bank', 'account', 'blocked', 'otp', 'verify', 'suspended'],
    result: {
      riskScore: 91,
      riskLevel: 'CRITICAL',
      categories: ['Phishing Risk', 'Account Takeover Risk', 'Impersonation Scam'],
      indicators: [
        { name: 'Bank Impersonation', severity: 'CRITICAL', score: 95, explanation: 'The message claims to be from a bank, a common impersonation target.' },
        { name: 'Credential Request', severity: 'CRITICAL', score: 93, explanation: 'Requesting OTP or account details via SMS/message is a hallmark phishing tactic.' },
        { name: 'Urgency Language', severity: 'HIGH', score: 88, explanation: 'Phrases like "account blocked" create urgency to bypass rational thinking.' },
        { name: 'Suspicious Link', severity: 'HIGH', score: 85, explanation: 'The link does not match the claimed bank\'s official domain.' }
      ],
      summary: 'This message exhibits multiple critical indicators of a banking phishing scam. It impersonates a financial institution and requests sensitive credentials through an unofficial channel. No legitimate bank will ever ask for your OTP, PIN, or password via SMS or message.',
      recommendations: [
        'Do NOT click any links in this message.',
        'Do NOT share your OTP, PIN, or password with anyone.',
        'Contact your bank directly using the official number on their website or your card.',
        'Report this SMS to your bank\'s fraud helpline.',
        'Consider blocking the sender number.'
      ],
      uncertainty: 'This is an AI-assisted risk assessment based on detected patterns. It is not definitive legal or forensic proof of fraud. Always verify through official channels.'
    }
  },
  {
    id: 'demo-002',
    name: 'Fake Prize/Reward Message',
    inputType: 'text',
    matchKeywords: ['won', 'winner', 'prize', 'lottery', 'congratulations', 'claim', 'reward', 'selected'],
    result: {
      riskScore: 87,
      riskLevel: 'CRITICAL',
      categories: ['Prize/Reward Scam', 'Financial Fraud Risk', 'Social Engineering Risk'],
      indicators: [
        { name: 'Reward/Prize Claim', severity: 'CRITICAL', score: 96, explanation: 'Claiming the recipient has won a prize they did not enter is a classic advance-fee scam technique.' },
        { name: 'Urgency Language', severity: 'HIGH', score: 82, explanation: 'Deadline pressure is used to prevent the victim from thinking critically.' },
        { name: 'Payment Request', severity: 'HIGH', score: 80, explanation: 'Legitimate prizes do not require upfront payment to claim.' },
        { name: 'Impersonation', severity: 'MODERATE', score: 65, explanation: 'May impersonate a well-known brand or platform to build false credibility.' }
      ],
      summary: 'This message shows strong indicators of a prize or lottery scam. Legitimate organizations do not notify winners via unsolicited SMS or email, and never require fee payment to claim winnings. This pattern is consistent with advance-fee fraud designed to extract money from victims.',
      recommendations: [
        'Do NOT pay any fees to "claim" a prize.',
        'Do NOT share personal or financial information.',
        'If you did not enter a contest, you cannot have won it.',
        'Report this message to consumer protection authorities.',
        'Delete the message and block the sender.'
      ],
      uncertainty: 'This is an AI-assisted risk assessment. Results should be independently verified. Not all prize notifications are fraudulent, but this one contains multiple suspicious patterns.'
    }
  },
  {
    id: 'demo-003',
    name: 'Investment Scam',
    inputType: 'text',
    matchKeywords: ['invest', 'returns', 'profit', 'guaranteed', 'trading', 'forex', 'crypto', 'double', 'multiply'],
    result: {
      riskScore: 84,
      riskLevel: 'CRITICAL',
      categories: ['Investment Scam', 'Financial Fraud Risk', 'Social Engineering Risk'],
      indicators: [
        { name: 'Guaranteed Returns', severity: 'CRITICAL', score: 97, explanation: 'No legitimate investment can guarantee returns. This is a primary red flag.' },
        { name: 'Urgency Language', severity: 'HIGH', score: 79, explanation: 'Time pressure ("limited slots") prevents careful evaluation.' },
        { name: 'Unrealistic Profit Claims', severity: 'HIGH', score: 88, explanation: 'Returns promised far exceed realistic investment performance.' },
        { name: 'Unverified Platform', severity: 'MODERATE', score: 70, explanation: 'The investment platform may not be registered with financial regulators.' }
      ],
      summary: 'This content shows strong indicators of an investment scam. Promises of guaranteed high returns, urgency, and requests to recruit others are hallmarks of Ponzi or pyramid schemes. All legitimate investments carry risk and are regulated.',
      recommendations: [
        'Do NOT invest money based on this offer.',
        'Verify if the platform is registered with official financial regulators (SEBI, SEC, FCA, etc.).',
        'Consult a certified financial advisor before investing.',
        'Be wary of platforms that promise guaranteed profits.',
        'Report this to financial crime authorities if you have already invested.'
      ],
      uncertainty: 'This assessment identifies risk patterns consistent with investment fraud. It does not constitute financial or legal advice. Consult qualified professionals.'
    }
  },
  {
    id: 'demo-004',
    name: 'Suspicious Shopping Website',
    inputType: 'url',
    matchKeywords: ['shop', 'buy', 'deal', 'discount', 'sale', 'offer', 'cheap', 'free shipping'],
    result: {
      riskScore: 62,
      riskLevel: 'HIGH',
      categories: ['Financial Fraud Risk', 'Suspicious Advertisement', 'Malicious Link Risk'],
      indicators: [
        { name: 'Suspicious Domain', severity: 'HIGH', score: 75, explanation: 'Domain was recently registered and does not match established retailers.' },
        { name: 'Unrealistic Discounts', severity: 'HIGH', score: 80, explanation: 'Prices significantly below market value are common in fake shopping sites.' },
        { name: 'Limited Contact Information', severity: 'MODERATE', score: 60, explanation: 'No verifiable physical address or customer service contact found.' },
        { name: 'No Return Policy', severity: 'MODERATE', score: 55, explanation: 'Absence of return/refund policy is a warning sign for online retailers.' }
      ],
      summary: 'This website shows several indicators of a fraudulent shopping platform. Characteristics include suspicious domain age, unrealistic pricing, and limited verifiable business information. Fraudulent shopping sites collect payment and either deliver counterfeit goods or nothing at all.',
      recommendations: [
        'Search for customer reviews of this website on independent platforms.',
        'Check the domain registration date using WHOIS lookup.',
        'Look for verifiable contact information and return policies.',
        'Use a credit card (not debit) for any online purchases for better fraud protection.',
        'Consider using established platforms with buyer protection.'
      ],
      uncertainty: 'This is an AI-assisted assessment. Not all discounted websites are fraudulent. Exercise caution and verify independently before purchasing.'
    }
  },
  {
    id: 'demo-005',
    name: 'Legitimate Website',
    inputType: 'url',
    matchKeywords: [], // Catches anything not matching other patterns
    result: {
      riskScore: 8,
      riskLevel: 'LOW',
      categories: [],
      indicators: [],
      summary: 'No significant risk indicators were detected in this content. The content appears to follow normal patterns without exhibiting common scam or fraud characteristics. Continue to exercise standard internet safety practices.',
      recommendations: [
        'Continue using standard internet safety practices.',
        'Keep your browser and antivirus software updated.',
        'Always verify sensitive transactions through official channels.'
      ],
      uncertainty: 'This is an AI-assisted assessment. A low risk score does not guarantee safety. Always exercise judgment when sharing personal or financial information online.'
    }
  }
];

/**
 * Get a demo result based on input text/url content
 */
function getDemoResult(inputText = '', inputType = 'text') {
  const lower = inputText.toLowerCase();

  // Try to match a specific demo scenario
  for (const scenario of demoScenarios.slice(0, -1)) { // exclude "safe" catch-all
    const matches = scenario.matchKeywords.filter(kw => lower.includes(kw));
    if (matches.length >= 2) {
      return {
        ...scenario.result,
        _demoScenario: scenario.name,
        isDemo: true
      };
    }
  }

  // Default to safe scenario
  return {
    ...demoScenarios[demoScenarios.length - 1].result,
    _demoScenario: 'Legitimate Website (Demo)',
    isDemo: true
  };
}

module.exports = { demoScenarios, getDemoResult };
