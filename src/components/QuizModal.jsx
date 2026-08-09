import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Award, RotateCcw, HelpCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizModal({ quiz, onClose, onPassQuiz }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);

  const currentQ = quiz.questions[currentQuestionIndex];

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const handleSelectOption = (questionId, optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / quiz.questions.length) * 100);
    setScorePercent(percent);
    setIsSubmitted(true);

    if (percent >= quiz.passingScore) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onPassQuiz) onPassQuiz(quiz.id);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl transition-all my-8">
        
        {/* Quiz Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Module Assessment
            </span>
            <h3 className="text-lg font-bold font-heading">{quiz.title}</h3>
          </div>

          <div className="flex items-center gap-4">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-full text-xs font-mono font-semibold text-emerald-400 border border-slate-700">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quiz Content Body */}
        <div className="p-6">
          {!isSubmitted ? (
            <div>
              {/* Question Stepper */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-mono">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <span>Passing Score: {quiz.passingScore}%</span>
              </div>

              {/* Question Text */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6">
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{currentQ.question}</span>
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id, idx)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-sm font-medium ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stepper Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:text-slate-900"
                >
                  Previous
                </button>

                {currentQuestionIndex < quiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg"
                  >
                    Submit Quiz Answers
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <Award className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                {scorePercent >= quiz.passingScore ? "Congratulations! Quiz Passed 🎉" : "Quiz Attempt Complete"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
                You scored <span className="font-bold text-emerald-600">{scorePercent}%</span> (Passing score: {quiz.passingScore}%)
              </p>

              {/* Explanations List */}
              <div className="space-y-4 text-left max-h-60 overflow-y-auto mb-6 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                {quiz.questions.map((q, idx) => {
                  const userAns = selectedAnswers[q.id];
                  const isCorrect = userAns === q.correctIndex;
                  return (
                    <div key={q.id} className="text-xs p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="text-slate-800 dark:text-slate-200">Q{idx + 1}: {q.question}</span>
                        {isCorrect ? (
                          <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Correct</span>
                        ) : (
                          <span className="text-rose-500 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Incorrect</span>
                        )}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 font-mono">
                        Explanation: {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers({});
                    setTimeLeft(quiz.timeLimit * 60);
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all shadow"
                >
                  Done & Continue
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
