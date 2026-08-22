const { v4: uuidv4 } = require('uuid');
const { analyzeWithAI } = require('../ai/aiService');
const { ANALYSIS_PROMPT, URL_ANALYSIS_PROMPT } = require('../ai/prompts');
const { scoreText, analyzeUrl, getRiskLevel, blendScores, buildFactorDisplay } = require('../services/riskScoring');
const { retrieveRelevantDocs } = require('../rag/knowledgeBase');
const Analysis = require('../models/Analysis');

// In-memory fallback when MongoDB is unavailable
const inMemoryStore = [];

async function saveAnalysis(data) {
  try {
    const analysis = new Analysis(data);
    return await analysis.save();
  } catch (err) {
    // MongoDB unavailable — use in-memory
    inMemoryStore.push(data);
    return data;
  }
}

/**
 * POST /api/analyze/text
 */
async function analyzeText(req, res, next) {
  const startTime = Date.now();
  try {
    const { text, context } = req.body;

    if (!text || text.trim().length < 5) {
      return res.status(400).json({ error: 'Text is required and must be at least 5 characters.' });
    }

    const truncatedText = text.slice(0, 3000); // Limit input size

    // 1. Heuristic pre-scoring
    const { factorScores, preScore } = scoreText(truncatedText);

    // 2. RAG retrieval (based on heuristic categories)
    const ragDocs = retrieveRelevantDocs([], truncatedText, 3);
    const ragContext = ragDocs.map(d => `[${d.title}]: ${d.relevantContent}`).join('\n\n');

    // 3. AI Analysis
    const prompt = ANALYSIS_PROMPT('text', truncatedText, ragContext, preScore);
    const aiResult = await analyzeWithAI(prompt, truncatedText, 'text');

    // 4. Blend scores
    const finalScore = blendScores(aiResult.riskScore, preScore);
    const riskLevel = getRiskLevel(finalScore);
    const factorDisplay = buildFactorDisplay(factorScores, 0);

    // 5. Build final result
    const result = {
      ...aiResult,
      riskScore: finalScore,
      riskLevel: riskLevel.level,
      factorBreakdown: factorDisplay,
      ragEvidence: ragDocs
    };

    // 6. Save to DB
    const analysisId = uuidv4();
    await saveAnalysis({
      analysisId,
      inputType: 'text',
      input: { text: truncatedText.slice(0, 500) },
      result,
      isDemo: aiResult.isDemo || false,
      processingTimeMs: Date.now() - startTime
    });

    res.json({ analysisId, ...result, processingTimeMs: Date.now() - startTime });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/analyze/url
 */
async function analyzeUrlEndpoint(req, res, next) {
  const startTime = Date.now();
  try {
    const { url } = req.body;

    if (!url || url.trim().length < 4) {
      return res.status(400).json({ error: 'URL is required.' });
    }

    // 1. URL heuristic analysis
    const urlAnalysis = analyzeUrl(url);

    // 2. RAG retrieval
    const ragDocs = retrieveRelevantDocs(['Malicious Link Risk', 'Phishing Risk'], url, 2);
    const ragContext = ragDocs.map(d => `[${d.title}]: ${d.relevantContent}`).join('\n\n');

    // 3. AI Analysis
    const prompt = URL_ANALYSIS_PROMPT(url, urlAnalysis);
    const aiResult = await analyzeWithAI(prompt, url, 'url');

    // 4. Blend scores
    const finalScore = blendScores(aiResult.riskScore, urlAnalysis.score);
    const riskLevel = getRiskLevel(finalScore);

    const result = {
      ...aiResult,
      riskScore: finalScore,
      riskLevel: riskLevel.level,
      urlAnalysis,
      ragEvidence: ragDocs
    };

    // 5. Save
    const analysisId = uuidv4();
    await saveAnalysis({
      analysisId,
      inputType: 'url',
      input: { url, domain: extractDomain(url) },
      result,
      isDemo: aiResult.isDemo || false,
      processingTimeMs: Date.now() - startTime
    });

    res.json({ analysisId, ...result, processingTimeMs: Date.now() - startTime });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/analyze/page
 */
async function analyzePage(req, res, next) {
  const startTime = Date.now();
  try {
    const { url, title, text, forms, links, headings } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: 'Page text content is required.' });
    }

    // Build combined content for analysis
    const pageContent = [
      url ? `URL: ${url}` : '',
      title ? `Page Title: ${title}` : '',
      headings?.length ? `Headings: ${headings.slice(0, 10).join(' | ')}` : '',
      forms?.length ? `Forms detected: ${forms.length} (fields: ${forms.join(', ')})` : '',
      links?.length ? `Links found: ${links.slice(0, 5).join(', ')}` : '',
      `Page Content:\n${text.slice(0, 2500)}`
    ].filter(Boolean).join('\n');

    // URL analysis if URL provided
    const urlAnalysis = url ? analyzeUrl(url) : null;
    const { factorScores, preScore: textPreScore } = scoreText(text);
    const preScore = urlAnalysis
      ? Math.round(textPreScore * 0.6 + urlAnalysis.score * 0.4)
      : textPreScore;

    // RAG retrieval
    const ragDocs = retrieveRelevantDocs([], text, 3);
    const ragContext = ragDocs.map(d => `[${d.title}]: ${d.relevantContent}`).join('\n\n');

    // AI Analysis
    const prompt = ANALYSIS_PROMPT('webpage', pageContent, ragContext, preScore);
    const aiResult = await analyzeWithAI(prompt, pageContent, 'page');

    const finalScore = blendScores(aiResult.riskScore, preScore);
    const riskLevel = getRiskLevel(finalScore);
    const factorDisplay = buildFactorDisplay(factorScores, urlAnalysis?.score || 0);

    const result = {
      ...aiResult,
      riskScore: finalScore,
      riskLevel: riskLevel.level,
      factorBreakdown: factorDisplay,
      urlAnalysis,
      ragEvidence: ragDocs
    };

    const analysisId = uuidv4();
    await saveAnalysis({
      analysisId,
      inputType: 'page',
      input: {
        url,
        domain: url ? extractDomain(url) : undefined,
        pageTitle: title,
        text: text.slice(0, 500)
      },
      result,
      isDemo: aiResult.isDemo || false,
      processingTimeMs: Date.now() - startTime
    });

    res.json({ analysisId, ...result, processingTimeMs: Date.now() - startTime });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/analyze/screenshot (OCR + Analysis)
 */
async function analyzeScreenshot(req, res, next) {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Screenshot file is required.' });
    }

    // OCR extraction
    let extractedText = '';
    try {
      const Tesseract = require('tesseract.js');
      const result = await Tesseract.recognize(req.file.path, 'eng', {
        logger: () => {} // Suppress logger
      });
      extractedText = result.data.text;
    } catch (ocrErr) {
      console.warn('OCR warning:', ocrErr.message);
      extractedText = req.body.extractedText || '';
    }

    if (!extractedText || extractedText.trim().length < 5) {
      return res.status(422).json({
        error: 'Could not extract readable text from the image. Please ensure the image is clear and contains visible text.'
      });
    }

    // Analyze extracted text
    const { factorScores, preScore } = scoreText(extractedText);
    const ragDocs = retrieveRelevantDocs([], extractedText, 3);
    const ragContext = ragDocs.map(d => `[${d.title}]: ${d.relevantContent}`).join('\n\n');

    const prompt = ANALYSIS_PROMPT('screenshot (OCR extracted text)', extractedText, ragContext, preScore);
    const aiResult = await analyzeWithAI(prompt, extractedText, 'screenshot');

    const finalScore = blendScores(aiResult.riskScore, preScore);
    const riskLevel = getRiskLevel(finalScore);
    const factorDisplay = buildFactorDisplay(factorScores, 0);

    const result = {
      ...aiResult,
      riskScore: finalScore,
      riskLevel: riskLevel.level,
      extractedText: extractedText.slice(0, 1000),
      factorBreakdown: factorDisplay,
      ragEvidence: ragDocs
    };

    const analysisId = uuidv4();
    await saveAnalysis({
      analysisId,
      inputType: 'screenshot',
      input: {
        screenshotPath: req.file.filename,
        extractedText: extractedText.slice(0, 500)
      },
      result,
      isDemo: aiResult.isDemo || false,
      processingTimeMs: Date.now() - startTime
    });

    res.json({ analysisId, ...result, processingTimeMs: Date.now() - startTime });
  } catch (err) {
    next(err);
  }
}

function extractDomain(url) {
  try {
    const parsed = new URL(url.startsWith('http') ? url : 'https://' + url);
    return parsed.hostname;
  } catch {
    return url;
  }
}

module.exports = { analyzeText, analyzeUrlEndpoint, analyzePage, analyzeScreenshot };
