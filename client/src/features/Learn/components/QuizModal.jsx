import React from 'react';
import { Award } from 'lucide-react';

export default function QuizModal({
  testQuestion,
  selectedAnswerIndex,
  setSelectedAnswerIndex,
  quizSubmitted,
  isQuizCorrect,
  handleQuizSubmit,
}) {
  if (!testQuestion) return null;

  return (
    <div className="bg-white dark:bg-[#161b22] border-2 border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-sm uppercase tracking-wider">
          <Award size={20} /> Module Verification Test Challenge
        </div>
        <span className="text-xs font-bold text-amber-500 font-mono">+50 XP Award</span>
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
        {testQuestion.question}
      </h3>

      <div className="space-y-3">
        {testQuestion.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => !quizSubmitted && setSelectedAnswerIndex(idx)}
            className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
              selectedAnswerIndex === idx
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-[1.01]'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-500'
            }`}
          >
            <span>{opt}</span>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold text-xs shrink-0 ml-3">
              {String.fromCharCode(65 + idx)}
            </span>
          </button>
        ))}
      </div>

      {!quizSubmitted ? (
        <button
          onClick={handleQuizSubmit}
          disabled={selectedAnswerIndex === null}
          className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition-all disabled:opacity-50 uppercase tracking-wider cursor-pointer"
        >
          Submit Verification Answer
        </button>
      ) : (
        <div className={`p-5 rounded-2xl border-2 text-xs sm:text-sm leading-relaxed space-y-2 ${
          isQuizCorrect ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
        }`}>
          <p className="font-black text-base">{isQuizCorrect ? '🎉 Verification Test Passed!' : '❌ Incorrect Answer'}</p>
          <p className="font-medium">{testQuestion.explanation}</p>
        </div>
      )}
    </div>
  );
}
