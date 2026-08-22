const mongoose = require('mongoose');

const IndicatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  severity: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'], default: 'MODERATE' },
  score: { type: Number, min: 0, max: 100 },
  explanation: String
});

const AnalysisSchema = new mongoose.Schema({
  analysisId: { type: String, required: true, unique: true, index: true },
  inputType: {
    type: String,
    enum: ['text', 'url', 'page', 'screenshot'],
    required: true
  },
  input: {
    text: String,
    url: String,
    domain: String,
    pageTitle: String,
    screenshotPath: String,
    extractedText: String
  },
  result: {
    riskScore: { type: Number, min: 0, max: 100 },
    riskLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] },
    categories: [String],
    indicators: [IndicatorSchema],
    summary: String,
    recommendations: [String],
    uncertainty: String,
    urlAnalysis: mongoose.Schema.Types.Mixed,
    ragEvidence: [mongoose.Schema.Types.Mixed]
  },
  isDemo: { type: Boolean, default: false },
  processingTimeMs: Number,
  createdAt: { type: Date, default: Date.now, index: true }
});

// Index for dashboard queries
AnalysisSchema.index({ createdAt: -1 });
AnalysisSchema.index({ 'result.riskLevel': 1 });

module.exports = mongoose.model('Analysis', AnalysisSchema);
