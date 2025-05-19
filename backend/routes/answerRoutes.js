const express = require('express');
const router = express.Router();
const UserAnswer = require('../models/UserAnswer');
const Question = require('../models/Question');
const { evaluateAnswer } = require('../services/aiService'); // Assuming you have a service to handle AI evaluation

// POST /api/answers
router.post('/', async (req, res) => {
  try {
    const { userId, questionId, userAnswer } = req.body;

    // Fetch the question
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    // Evaluate the answer using OpenAI
    const { isCorrect, aiExplanation } = await evaluateAnswer(
      question.questionText,
      userAnswer,
      question.correctAnswer
    );

    // Save the user's answer
    const answerDoc = new UserAnswer({
      userId,
      questionId,
      userAnswer,
      isCorrect,
      aiExplanation
    });

    await answerDoc.save();

    // Respond with result
    res.status(201).json({
      message: isCorrect ? '✅ Correct!' : '❌ Incorrect.',
      isCorrect,
      aiExplanation,
      answerId: answerDoc._id
    });
  } catch (err) {
    console.error('❌ Error handling answer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
