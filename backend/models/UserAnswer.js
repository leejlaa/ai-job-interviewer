const mongoose = require('mongoose');

const userAnswerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  userAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
  aiExplanation: { type: String }, // Filled if incorrect and AI explanation is provided
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserAnswer', userAnswerSchema);
