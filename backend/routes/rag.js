const express = require('express');
const { retrieveRelevantDocs } = require('../rag/knowledgeBase');
const router = express.Router();

// POST /api/rag/search
router.post('/search', (req, res) => {
  const { categories = [], text = '', maxDocs = 3 } = req.body;
  const docs = retrieveRelevantDocs(categories, text, Math.min(parseInt(maxDocs) || 3, 5));
  res.json({ documents: docs, count: docs.length });
});

// GET /api/rag/categories
router.get('/categories', (req, res) => {
  const { knowledgeBase } = require('../rag/knowledgeBase');
  const categories = [...new Set(knowledgeBase.map(d => d.category))];
  res.json({ categories });
});

module.exports = router;
