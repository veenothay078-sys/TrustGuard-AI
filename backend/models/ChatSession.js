const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  analysisId: { type: String, index: true }, // linked analysis if any
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ChatSessionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
