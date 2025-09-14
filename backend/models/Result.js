const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  question: String,
  originalText: String,
  correctedText: String,
  grammarScore: Number,
  emotion: String,
  emotionConfidence: Number,
  emotionScores: {
    happy: Number,
    sad: Number,
    angry: Number,
    neutral: Number,
    surprised: Number,
    fearful: Number,
    disgusted: Number
  },
  overallScore: Number,
  feedback: String,
  correctionsCount: Number,
  totalWords: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Result', resultSchema);
