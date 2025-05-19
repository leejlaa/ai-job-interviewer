const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Add a sample question
router.post('/', async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all questions
router.get('/', async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

module.exports = router;
