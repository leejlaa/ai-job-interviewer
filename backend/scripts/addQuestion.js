require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const question = new Question({
      questionText: "What does `typeof NaN` return in JavaScript?",
      topic: "JavaScript",
      difficulty: "easy",
      answerType: "text",
      correctAnswer: "number",
      explanation: "`NaN` is still of type `number` in JavaScript."
    });

    await question.save();
    console.log('✅ Question added!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Failed to connect:', err);
  });
