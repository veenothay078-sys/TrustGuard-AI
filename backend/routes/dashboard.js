const express = require('express');
const { getDashboardStats, getAdminStats } = require('../controllers/dashboardController');
const router = express.Router();

// GET /api/dashboard/statistics
router.get('/statistics', getDashboardStats);

// GET /api/dashboard/admin
router.get('/admin', getAdminStats);

module.exports = router;
