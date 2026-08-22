const express = require('express');
const { getHistory, getAnalysisById, deleteAnalysis } = require('../controllers/historyController');
const router = express.Router();

// GET /api/analysis/history
router.get('/history', getHistory);

// GET /api/analysis/:id
router.get('/:id', getAnalysisById);

// DELETE /api/analysis/:id
router.delete('/:id', deleteAnalysis);

module.exports = router;
