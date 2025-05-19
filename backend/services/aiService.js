const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function evaluateAnswer(questionText, userAnswer, correctAnswer) {
  const prompt = `
You are an expert coding interviewer.

Here is a question:
"${questionText}"

A student answered:
"${userAnswer}"

The correct answer is approximately:
"${correctAnswer}"

Your task:
1. Determine if the student's answer is correct (even if phrased differently).
2. Respond with JSON in this exact format:

{
  "isCorrect": true or false,
  "explanation": "Explain your reasoning here"
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = response.choices[0].message.content.trim();

    // Try to parse the JSON from the response
    const match = reply.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON found in AI response.');

    const result = JSON.parse(match[0]);

    return {
      isCorrect: result.isCorrect,
      aiExplanation: result.explanation,
    };
  } catch (error) {
    console.error('❌ AI evaluation error:', error.message);
    return {
      isCorrect: false,
      aiExplanation: 'AI could not evaluate the answer. Please try again later.',
    };
  }
}

module.exports = { evaluateAnswer };
