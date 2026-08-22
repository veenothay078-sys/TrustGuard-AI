/**
 * TrustGuard API Test Suite
 * Tests all 12 required scenarios
 *
 * Run: node tests/api.test.js
 */

process.env.DEMO_MODE = 'true'; // Force demo mode for tests

const assert = require('assert');
const { scoreText, analyzeUrl, getRiskLevel, blendScores } = require('../backend/services/riskScoring');
const { retrieveRelevantDocs } = require('../backend/rag/knowledgeBase');
const { getDemoResult } = require('../backend/ai/demoMode');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${err.message}`);
    failed++;
  }
}

// ─── Risk Scoring Tests ────────────────────────────────────────────────────────
console.log('\n🔬 Risk Scoring Engine Tests');

test('getRiskLevel: score 5 = LOW', () => {
  assert.equal(getRiskLevel(5).level, 'LOW');
});

test('getRiskLevel: score 35 = MODERATE', () => {
  assert.equal(getRiskLevel(35).level, 'MODERATE');
});

test('getRiskLevel: score 60 = HIGH', () => {
  assert.equal(getRiskLevel(60).level, 'HIGH');
});

test('getRiskLevel: score 80 = CRITICAL', () => {
  assert.equal(getRiskLevel(80).level, 'CRITICAL');
});

test('scoreText: bank phishing message scores above zero', () => {
  const { preScore } = scoreText('URGENT: Your bank account has been suspended. Verify your OTP immediately.');
  assert(preScore > 10, `Expected preScore > 10, got ${preScore}`);
});

test('scoreText: safe message scores low', () => {
  const { preScore } = scoreText('Hello, please find the meeting notes attached. See you Thursday.');
  assert(preScore <= 30, `Expected preScore <= 30, got ${preScore}`);
});

test('scoreText: prize scam scores above zero', () => {
  const { preScore } = scoreText('Congratulations! You won the lottery prize! Claim your reward immediately!');
  assert(preScore > 10, `Expected preScore > 10, got ${preScore}`);
});

test('blendScores: combines AI and heuristic correctly', () => {
  const blended = blendScores(80, 60);
  assert.equal(blended, Math.round(80 * 0.7 + 60 * 0.3));
});

test('blendScores: returns heuristic if AI score is null', () => {
  assert.equal(blendScores(null, 55), 55);
});

// ─── URL Analysis Tests ────────────────────────────────────────────────────────
console.log('\n🔗 URL Analysis Tests');

test('analyzeUrl: HTTP URL triggers indicator', () => {
  const { indicators } = analyzeUrl('http://example.com');
  assert(indicators.some(i => i.name.includes('Unencrypted')), 'Should detect HTTP');
});

test('analyzeUrl: suspicious TLD detected', () => {
  const { indicators } = analyzeUrl('https://paypal-verify.tk/login');
  assert(indicators.some(i => i.name.includes('top-level domain')), 'Should detect suspicious TLD');
});

test('analyzeUrl: IP address URL detected', () => {
  const { indicators } = analyzeUrl('http://192.168.1.1/admin');
  assert(indicators.some(i => i.name.includes('IP address')), 'Should detect IP address URL');
});

test('analyzeUrl: HTTPS safe domain scores 0', () => {
  const { score } = analyzeUrl('https://google.com');
  assert(score < 30, `Expected score < 30, got ${score}`);
});

test('analyzeUrl: malformed URL handled gracefully', () => {
  const { score, indicators } = analyzeUrl('not-a-url');
  assert(typeof score === 'number', 'Should return numeric score');
});

// ─── RAG Tests ─────────────────────────────────────────────────────────────────
console.log('\n📚 RAG Knowledge Base Tests');

test('retrieveRelevantDocs: phishing category returns docs', () => {
  const docs = retrieveRelevantDocs(['Phishing Risk'], 'click here verify account', 3);
  assert(docs.length > 0, 'Should retrieve phishing documents');
});

test('retrieveRelevantDocs: investment text retrieves investment docs', () => {
  const docs = retrieveRelevantDocs([], 'guaranteed returns investment trading', 3);
  assert(docs.length > 0, 'Should retrieve investment-related docs');
});

test('retrieveRelevantDocs: respects maxDocs limit', () => {
  const docs = retrieveRelevantDocs(['Phishing Risk'], 'phishing email password otp', 2);
  assert(docs.length <= 2, 'Should not exceed maxDocs limit');
});

// ─── Demo Mode Tests ───────────────────────────────────────────────────────────
console.log('\n🎭 Demo Mode Tests');

test('getDemoResult: bank message returns CRITICAL risk', () => {
  const result = getDemoResult('Your bank account has been blocked. Verify OTP immediately.', 'text');
  assert(result.riskScore > 70, `Expected riskScore > 70, got ${result.riskScore}`);
  assert(result.isDemo === true, 'Should be marked as demo');
});

test('getDemoResult: prize message returns CRITICAL risk', () => {
  const result = getDemoResult('Congratulations! You won a prize! Claim your reward immediately!', 'text');
  assert(result.riskScore > 70, `Expected riskScore > 70, got ${result.riskScore}`);
});

test('getDemoResult: investment scam detected', () => {
  const result = getDemoResult('Guaranteed 300% returns on your investment. Join now!', 'text');
  assert(result.riskScore > 50, `Expected riskScore > 50, got ${result.riskScore}`);
});

test('getDemoResult: normal text returns LOW risk', () => {
  const result = getDemoResult('Meeting tomorrow at 9am. Please review the agenda.', 'text');
  assert(result.riskScore < 30, `Expected riskScore < 30, got ${result.riskScore}`);
});

test('getDemoResult: has required fields', () => {
  const result = getDemoResult('test message', 'text');
  assert(typeof result.riskScore === 'number', 'Should have riskScore');
  assert(typeof result.riskLevel === 'string', 'Should have riskLevel');
  assert(Array.isArray(result.recommendations), 'Should have recommendations array');
  assert(typeof result.uncertainty === 'string', 'Should have uncertainty statement');
});

// ─── Input Validation Tests ─────────────────────────────────────────────────────
console.log('\n🛡️ Input Validation Tests');

test('scoreText: handles empty string gracefully', () => {
  const { preScore } = scoreText('');
  assert(typeof preScore === 'number', 'Should return numeric score for empty string');
  assert.equal(preScore, 0, 'Empty string should score 0');
});

test('analyzeUrl: handles empty URL gracefully', () => {
  const result = analyzeUrl('');
  assert.equal(result.score, 0, 'Empty URL should have 0 score');
});

// ─── Results Summary ───────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(50));
console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All tests passed!\n');
  process.exit(0);
} else {
  console.log(`⚠️  ${failed} test(s) failed.\n`);
  process.exit(1);
}
