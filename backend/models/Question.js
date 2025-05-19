const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  answerType: { type: String, enum: ['text', 'multiple-choice'], required: true },
  correctAnswer: { type: String, required: true },
  choices: [String], // Only used if it's multiple-choice
  explanation: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
