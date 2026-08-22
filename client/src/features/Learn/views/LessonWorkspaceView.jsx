import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, BookOpen, Code2, CheckCircle2, XCircle, 
  HelpCircle, Copy, Check, Sparkles, Award, ShieldCheck, Layers 
} from 'lucide-react';

import { getCourseById } from '../data/coursesData.jsx';

export default function LessonWorkspaceView() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  // Dynamic course resolution supporting browser back/forward navigation
  const course = useMemo(() => getCourseById(courseId), [courseId]);
  const nodes = useMemo(() => course.nodes || [], [course]);

  const currentIndex = useMemo(() => {
    if (!nodes.length) return 0;
    const idx = nodes.findIndex((n) => n.id === lessonId);
    return idx >= 0 ? idx : 0;
  }, [nodes, lessonId]);

  const currentNode = nodes[currentIndex] || nodes[0] || {};
  const lessonData = currentNode?.data || currentNode || {};

  const prevLesson = currentIndex > 0 ? nodes[currentIndex - 1] : null;
  const nextLesson = currentIndex < nodes.length - 1 ? nodes[currentIndex + 1] : null;

  // Quiz & Copy State
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset quiz state whenever lessonId or courseId changes in the URL (Browser Back/Forward support)
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setCopied(false);
    // Scroll to top on lesson switch
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [courseId, lessonId]);

  const testQuestion = lessonData.testQuestion || {
    question: 'What is the primary objective of this module?',
    options: ['Build solid foundational architecture', 'Bypass test suites', 'Ignore API contracts', 'Delete code'],
    correctIndex: 0,
    explanation: 'Foundational architecture ensures scalability, maintainability, and clean separation of concerns.',
  };

  const handleCopyCode = () => {
    if (lessonData.codeSnippet) {
      navigator.clipboard.writeText(lessonData.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isCorrect = selectedOption === testQuestion.correctIndex;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 p-4 sm:p-8 transition-colors duration-300 select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* BREADCRUMB NAVIGATION */}
        <div className="flex items-center justify-between">
          <Link
            to={`/learn/${course.id || courseId}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={16} /> Back to {course.title} Roadmap
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Lesson {currentIndex + 1} of {nodes.length}</span>
          </div>
        </div>

        {/* LESSON HEADER CARD */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              {lessonData.category || 'Core Module'}
            </span>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold text-xs font-mono">
                +150 XP
              </span>
              {lessonData.status === 'completed' ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase flex items-center gap-1">
                  <CheckCircle2 size={14} /> Passed
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs uppercase">
                  Active Lesson
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {lessonData.label || 'Lesson Overview'}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {lessonData.overview || 'Explore the technical overview and interactive code playbook below.'}
          </p>

          {/* Tools & Tech Stack Badges */}
          {lessonData.tools && lessonData.tools.length > 0 && (
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Stack:</span>
              {lessonData.tools.map((tool, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
                  {tool}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CODE PLAYBOOK & SNIPPET SECTION */}
        {lessonData.codeSnippet && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-6 py-3 bg-[#0d1117] border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-400 font-bold">
                <Code2 size={16} className="text-cyan-400" /> Interactive Playbook Code
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                {copied ? <><Check size={14} className="text-emerald-400" /> Copied!</> : <><Copy size={14} /> Copy Snippet</>}
              </button>
            </div>
            <pre className="p-6 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
              <code>{lessonData.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* MODULE VERIFICATION TEST CHALLENGE */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <HelpCircle size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Module Verification Challenge</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Answer correctly to verify your understanding and claim XP.</p>
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 leading-snug">
            {testQuestion.question}
          </h3>

          {/* Quiz Options */}
          <div className="space-y-3">
            {testQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500';

              if (isSubmitted) {
                if (idx === testQuestion.correctIndex) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-400 font-bold';
                }
              } else if (isSelected) {
                btnStyle = 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold';
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isSubmitted && idx === testQuestion.correctIndex && (
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  )}
                  {isSubmitted && isSelected && idx !== testQuestion.correctIndex && (
                    <XCircle size={18} className="text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Submit / Explanation Area */}
          {!isSubmitted ? (
            <button
              onClick={() => setIsSubmitted(true)}
              disabled={selectedOption === null}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Submit Answer for Review
            </button>
          ) : (
            <div className={`p-5 rounded-2xl border-2 space-y-2 animate-in fade-in ${
              isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
            }`}>
              <div className="flex items-center gap-2 font-black text-sm">
                {isCorrect ? (
                  <span className="text-emerald-500 flex items-center gap-1.5"><CheckCircle2 size={18} /> Correct! +150 XP Awarded</span>
                ) : (
                  <span className="text-rose-500 flex items-center gap-1.5"><XCircle size={18} /> Incorrect Answer</span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {testQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM LESSON NAVIGATION BUTTONS */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          {prevLesson ? (
            <button
              onClick={() => {
                navigate(`/learn/${course.id || courseId}/lesson/${prevLesson.id}`);
              }}
              className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <ArrowLeft size={16} /> Previous Lesson
            </button>
          ) : <div />}

          {nextLesson ? (
            <button
              onClick={() => {
                navigate(`/learn/${course.id || courseId}/lesson/${nextLesson.id}`);
              }}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
            >
              Next Lesson <ArrowRight size={16} />
            </button>
          ) : (
            <Link
              to={`/learn/${course.id || courseId}`}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
            >
              Finish Roadmap <CheckCircle2 size={16} />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
