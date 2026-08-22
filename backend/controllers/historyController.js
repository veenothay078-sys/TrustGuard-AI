const Analysis = require('../models/Analysis');

// In-memory fallback store (shared ref from analyzeController pattern)
let inMemoryStore = [];
try {
  inMemoryStore = require('./analyzeController').inMemoryStore || [];
} catch { /* ok */ }

/**
 * GET /api/analysis/history
 */
async function getHistory(req, res, next) {
  try {
    const { page = 1, limit = 20, riskLevel, inputType, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (riskLevel) query['result.riskLevel'] = riskLevel;
    if (inputType) query['inputType'] = inputType;

    let analyses;
    let total;

    try {
      const filter = { ...query };
      if (search) {
        filter.$or = [
          { 'input.url': { $regex: search, $options: 'i' } },
          { 'input.text': { $regex: search, $options: 'i' } },
          { 'input.pageTitle': { $regex: search, $options: 'i' } }
        ];
      }
      total = await Analysis.countDocuments(filter);
      analyses = await Analysis.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v');
    } catch {
      // In-memory fallback
      analyses = inMemoryStore.slice(skip, skip + parseInt(limit));
      total = inMemoryStore.length;
    }

    res.json({
      analyses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/analysis/:id
 */
async function getAnalysisById(req, res, next) {
  try {
    const { id } = req.params;

    let analysis;
    try {
      analysis = await Analysis.findOne({ analysisId: id }).select('-__v');
    } catch {
      analysis = inMemoryStore.find(a => a.analysisId === id);
    }

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found.' });
    }

    res.json(analysis);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/analysis/:id
 */
async function deleteAnalysis(req, res, next) {
  try {
    const { id } = req.params;

    let deleted = false;
    try {
      const result = await Analysis.deleteOne({ analysisId: id });
      deleted = result.deletedCount > 0;
    } catch {
      const idx = inMemoryStore.findIndex(a => a.analysisId === id);
      if (idx !== -1) {
        inMemoryStore.splice(idx, 1);
        deleted = true;
      }
    }

    if (!deleted) {
      return res.status(404).json({ error: 'Analysis not found.' });
    }

    res.json({ message: 'Analysis deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getHistory, getAnalysisById, deleteAnalysis };
