require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Question = require('../models/Question');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

async function fetchQuestionsFromAI() {
  const prompt = `Generate 5  programming interview questions in JSON format.
Each question should be an object with:
- questionText
- correctAnswer
- explanation
- difficulty ("easy", "medium", or "hard")
- answerType ("text")
- topic ("Programming")

Return only a JSON array of 5 objects. Do not wrap it in markdown or explain anything.`;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: prompt }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const content = response.data.choices[0].message.content.trim();
  return content;
}

async function insertQuestions() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const raw = await fetchQuestionsFromAI();

    // Try to parse the response as JSON
    let questions;
    try {
      questions = JSON.parse(raw);
    } catch (err) {
      console.error('❌ Failed to parse AI response as JSON.');
      console.log('🔍 Raw response:\n', raw);
      return;
    }

    // Insert into DB
    const saved = await Question.insertMany(questions);
    console.log(`✅ Successfully inserted ${saved.length} questions`);
  } catch (err) {
    console.error('❌ Error generating or saving questions:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

insertQuestions();
