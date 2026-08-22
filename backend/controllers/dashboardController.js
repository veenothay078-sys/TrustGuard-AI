const Analysis = require('../models/Analysis');

/**
 * GET /api/dashboard/statistics
 */
async function getDashboardStats(req, res, next) {
  try {
    let stats;

    try {
      const [
        totalAnalyses,
        riskDistribution,
        inputTypeDistribution,
        avgScore,
        recentAnalyses,
        categoryData,
        trendData
      ] = await Promise.all([
        Analysis.countDocuments(),
        Analysis.aggregate([
          { $group: { _id: '$result.riskLevel', count: { $sum: 1 } } }
        ]),
        Analysis.aggregate([
          { $group: { _id: '$inputType', count: { $sum: 1 } } }
        ]),
        Analysis.aggregate([
          { $group: { _id: null, avg: { $avg: '$result.riskScore' } } }
        ]),
        Analysis.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .select('analysisId inputType result.riskScore result.riskLevel result.categories input.url input.pageTitle createdAt isDemo'),
        Analysis.aggregate([
          { $unwind: { path: '$result.categories', preserveNullAndEmptyArrays: false } },
          { $group: { _id: '$result.categories', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 8 }
        ]),
        Analysis.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
              },
              avgScore: { $avg: '$result.riskScore' },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } },
          { $limit: 30 }
        ])
      ]);

      const riskMap = {};
      riskDistribution.forEach(r => { riskMap[r._id] = r.count; });

      stats = {
        totalAnalyses,
        criticalCount: riskMap['CRITICAL'] || 0,
        highCount: riskMap['HIGH'] || 0,
        moderateCount: riskMap['MODERATE'] || 0,
        lowCount: riskMap['LOW'] || 0,
        averageRiskScore: avgScore[0] ? Math.round(avgScore[0].avg) : 0,
        riskDistribution: riskDistribution.map(r => ({ level: r._id, count: r.count })),
        inputTypeDistribution: inputTypeDistribution.map(r => ({ type: r._id, count: r.count })),
        recentAnalyses,
        topCategories: categoryData.map(c => ({ category: c._id, count: c.count })),
        riskTrend: trendData.map(t => ({ date: t._id, avgScore: Math.round(t.avgScore), count: t.count }))
      };
    } catch {
      // Return demo stats when MongoDB is unavailable
      stats = generateDemoStats();
    }

    res.json(stats);
  } catch (err) {
    next(err);
  }
}

function generateDemoStats() {
  const now = new Date();
  const trend = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    trend.push({
      date: d.toISOString().split('T')[0],
      avgScore: Math.round(30 + Math.random() * 45),
      count: Math.round(2 + Math.random() * 8)
    });
  }

  return {
    totalAnalyses: 126,
    criticalCount: 18,
    highCount: 31,
    moderateCount: 42,
    lowCount: 35,
    averageRiskScore: 52,
    riskDistribution: [
      { level: 'CRITICAL', count: 18 },
      { level: 'HIGH', count: 31 },
      { level: 'MODERATE', count: 42 },
      { level: 'LOW', count: 35 }
    ],
    inputTypeDistribution: [
      { type: 'text', count: 54 },
      { type: 'url', count: 38 },
      { type: 'page', count: 22 },
      { type: 'screenshot', count: 12 }
    ],
    topCategories: [
      { category: 'Phishing Risk', count: 42 },
      { category: 'Financial Fraud Risk', count: 35 },
      { category: 'Social Engineering Risk', count: 28 },
      { category: 'Payment Scam', count: 22 },
      { category: 'Prize/Reward Scam', count: 18 },
      { category: 'Account Takeover Risk', count: 15 },
      { category: 'Investment Scam', count: 12 },
      { category: 'Impersonation Scam', count: 10 }
    ],
    recentAnalyses: [],
    riskTrend: trend,
    isDemo: true
  };
}

/**
 * GET /api/admin/stats
 */
async function getAdminStats(req, res, next) {
  try {
    let dbCount = 0;
    try {
      dbCount = await Analysis.countDocuments();
    } catch { /* MongoDB unavailable */ }

    res.json({
      totalAnalyses: dbCount,
      demoMode: process.env.DEMO_MODE === 'true',
      aiModel: process.env.AI_MODEL || 'gemini-1.5-flash',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboardStats, getAdminStats };
