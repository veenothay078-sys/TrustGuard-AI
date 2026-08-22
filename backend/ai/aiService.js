/**
 * TrustGuard AI Service
 * Abstraction layer for AI provider (currently Gemini)
 * Can be swapped for other providers by implementing the same interface
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getDemoResult } = require('./demoMode');

let genAI = null;
let model = null;

function initializeAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.AI_MODEL || 'gemini-1.5-flash';

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('⚠️  GEMINI_API_KEY not configured. Running in DEMO MODE.');
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.3, // Lower temp for more consistent JSON output
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048
      }
    });
    console.log(`✅ Gemini AI initialized with model: ${modelName}`);
    return true;
  } catch (err) {
    console.error('❌ Failed to initialize Gemini AI:', err.message);
    return false;
  }
}

// Initialize on module load
const isAIAvailable = initializeAI();

/**
 * Parse AI response - extract JSON from the response text
 */
function parseAIResponse(text) {
  // Remove markdown code fences if present
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');

  // Try to parse as JSON
  const result = JSON.parse(cleaned);

  // Validate required fields
  if (typeof result.riskScore !== 'number') throw new Error('Missing riskScore');
  if (!result.riskLevel) throw new Error('Missing riskLevel');

  // Normalize risk score to 0-100
  result.riskScore = Math.min(100, Math.max(0, Math.round(result.riskScore)));

  // Normalize risk level
  const validLevels = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'];
  if (!validLevels.includes(result.riskLevel)) {
    // Derive from score
    if (result.riskScore <= 20) result.riskLevel = 'LOW';
    else if (result.riskScore <= 50) result.riskLevel = 'MODERATE';
    else if (result.riskScore <= 75) result.riskLevel = 'HIGH';
    else result.riskLevel = 'CRITICAL';
  }

  // Ensure arrays exist
  result.categories = Array.isArray(result.categories) ? result.categories : [];
  result.indicators = Array.isArray(result.indicators) ? result.indicators : [];
  result.recommendations = Array.isArray(result.recommendations) ? result.recommendations : [];
  result.summary = result.summary || 'Analysis completed. Review indicators for details.';
  result.uncertainty = result.uncertainty || 'This is an AI-assisted risk assessment and should not be treated as definitive proof.';

  return result;
}

/**
 * Main analysis function
 * @param {string} prompt - Full formatted prompt
 * @param {string} inputText - Original input for demo fallback
 * @param {string} inputType - Type of input
 * @returns {object} Parsed analysis result
 */
async function analyzeWithAI(prompt, inputText = '', inputType = 'text') {
  const isDemoMode = process.env.DEMO_MODE === 'true' || !isAIAvailable;

  if (isDemoMode) {
    // Return demo result with a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 800));
    return getDemoResult(inputText, inputType);
  }

  if (!model) {
    throw new Error('AI model not initialized. Check GEMINI_API_KEY.');
  }

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return parseAIResponse(text);
  } catch (err) {
    if (err.message.includes('API_KEY_INVALID') || err.message.includes('401')) {
      throw new Error('Invalid Gemini API key. Please check your GEMINI_API_KEY in .env');
    }
    if (err.message.includes('QUOTA') || err.message.includes('429')) {
      throw new Error('Gemini API quota exceeded. Try again later or switch to Demo Mode.');
    }
    throw new Error(`AI analysis failed: ${err.message}`);
  }
}

/**
 * Chat completion function
 * @param {string} prompt - Chat prompt
 * @returns {string} Assistant response text
 */
async function chatWithAI(prompt) {
  const isDemoMode = process.env.DEMO_MODE === 'true' || !isAIAvailable;

  if (isDemoMode) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return 'I\'m running in Demo Mode. In live mode, I can answer detailed questions about any analysis using AI. The risk score shown is based on pre-configured demo scenarios to illustrate TrustGuard\'s capabilities. Add your Gemini API key to enable real AI analysis.';
  }

  if (!model) {
    throw new Error('AI model not initialized.');
  }

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    throw new Error(`Chat AI failed: ${err.message}`);
  }
}

module.exports = { analyzeWithAI, chatWithAI, isAIAvailable };
