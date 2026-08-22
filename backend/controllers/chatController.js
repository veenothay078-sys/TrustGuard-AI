const { v4: uuidv4 } = require('uuid');
const { chatWithAI } = require('../ai/aiService');
const { CHAT_PROMPT } = require('../ai/prompts');
const ChatSession = require('../models/ChatSession');

// In-memory session fallback
const inMemorySessions = {};

async function getSession(sessionId, analysisId) {
  try {
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = await ChatSession.create({ sessionId, analysisId, messages: [] });
    }
    return session;
  } catch {
    // In-memory fallback
    if (!inMemorySessions[sessionId]) {
      inMemorySessions[sessionId] = { sessionId, analysisId, messages: [] };
    }
    return inMemorySessions[sessionId];
  }
}

async function saveSession(session) {
  try {
    if (session.save) await session.save();
    // In-memory sessions are already mutated by reference
  } catch { /* Silent */ }
}

/**
 * POST /api/chat
 */
async function chat(req, res, next) {
  try {
    const { message, sessionId: existingSessionId, analysisContext } = req.body;

    if (!message || message.trim().length < 1) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const sessionId = existingSessionId || uuidv4();
    const session = await getSession(sessionId, analysisContext?.analysisId);

    // Add user message
    session.messages.push({ role: 'user', content: message.slice(0, 1000) });

    // Limit history to last 10 messages
    const recentHistory = session.messages.slice(-10);

    // Generate response
    const context = analysisContext || {};
    const prompt = CHAT_PROMPT(context, recentHistory.slice(0, -1), message);
    const response = await chatWithAI(prompt);

    // Add assistant response
    session.messages.push({ role: 'assistant', content: response });
    await saveSession(session);

    res.json({
      sessionId,
      response,
      messageCount: session.messages.length
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { chat };
