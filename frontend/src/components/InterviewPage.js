import React, { useEffect, useState } from 'react';
import API from '../api';

function InterviewPage() {
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [aiExplanation, setAiExplanation] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
const [wrongCount, setWrongCount] = useState(0);
const [timeLeft, setTimeLeft] = useState(60);


useEffect(() => {
  if (isCorrect !== null) return;

  if (timeLeft === 0) {
    // Time's up! Count as wrong and move to next question
    setWrongCount((prev) => prev + 1);
    setFeedback('⏰ Time’s up! ❌ Incorrect.');
    
    // Optionally show the correct answer before moving on (1 sec delay)
    setTimeout(() => {
      fetchQuestion();
      setTimeLeft(60); // reset timer
    }, 100000);
    return;
  }

  const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
  return () => clearInterval(timer);
}, [timeLeft, isCorrect]);


  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const fetchQuestion = async () => {
    try {
      const res = await API.get('/questions');
      const random = res.data[Math.floor(Math.random() * res.data.length)];
      setQuestion(random);
      setFeedback('');
      setAiExplanation('');
      setUserAnswer('');
      setIsCorrect(null);
      setTimeLeft(60); // ⬅️ Reset timer when question is loaded
      setQuestionNumber((prev) => prev + 1);
       if (res.data.isCorrect) {
  setCorrectCount((prev) => prev + 1);
} else {
  setWrongCount((prev) => prev + 1);
}
    } catch (err) {
      console.error('Error loading question:', err);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

   

    try {
      const res = await API.post(
        '/answers',
        {
          userId,
          questionId: question._id,
          userAnswer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsCorrect(res.data.isCorrect);
      setFeedback(res.data.isCorrect ? '✅ Correct!' : '❌ Incorrect.');
      setAiExplanation(res.data.aiExplanation || '');
    } catch (err) {
      console.error('Error submitting answer:', err);
      setFeedback('Something went wrong.');
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Smart Interview</h2>
        <p className="text-red-500 font-mono">⏱️ Time left: {timeLeft}s</p>


        {question ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-sm text-gray-500 mb-2 text-right">
              Question {questionNumber}
            </div>

            <h3 className="text-xl font-bold text-gray-800">{question.questionText}</h3>

            <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-3">
              <span><strong>Topic:</strong> {question.topic}</span>
              <span><strong>Difficulty:</strong> {question.difficulty}</span>
              <span><strong>Type:</strong> {question.answerType}</span>
            </div>

            {isCorrect === null && (
              <form onSubmit={handleSubmit} className="mt-6">
                <label className="block mb-2 font-medium">Your Answer:</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Type your answer..."
                  required
                />
                <button
                  type="submit"
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
                >
                  Submit
                </button>
              </form>
            )}

            {feedback && (
              <div className="mt-6">
                <p className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {feedback}
                </p>

                {!isCorrect && (
                  <div className="mt-4 space-y-4">
                    <details className="bg-red-50 border border-red-200 p-4 rounded">
                      <summary className="cursor-pointer font-semibold">Correct Answer</summary>
                      <p className="mt-2">{question.correctAnswer}</p>
                    </details>

                    <details className="bg-blue-50 border border-blue-200 p-4 rounded">
                      <summary className="cursor-pointer font-semibold">Explanation</summary>
                      <p className="mt-2">{question.explanation}</p>
                    </details>

                    {aiExplanation && (
                      <details className="bg-gray-100 border border-gray-300 p-4 rounded">
                        <summary className="cursor-pointer font-semibold">AI Explanation</summary>
                        <p className="mt-2">{aiExplanation}</p>
                      </details>
                    )}
                  </div>
                )}

                <button
                  onClick={fetchQuestion}
                  className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
                >
                  Next Question
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading question...</p>
        )}
        <div className="mb-6 flex justify-between items-center text-sm text-gray-600">
  
</div>
      <div className="flex justify-between items-center text-sm text-gray-600">
      <span>✅ Correct: <strong>{correctCount}</strong></span>
        <span>❌ Incorrect: <strong>{wrongCount}</strong></span>
        <span>📊 Total Answered: <strong>{correctCount + wrongCount}</strong></span>
              </div>
              <progress value={correctCount + wrongCount} max={20} className="w-full h-2 bg-gray-200 rounded"></progress>

            </div>
    </div>
    </>
  );
}

export default InterviewPage;
