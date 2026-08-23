import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, BookOpen, Code2, CheckCircle2, XCircle, 
  HelpCircle, Copy, Check, Sparkles, Award, ShieldCheck, Layers, 
  Play, Terminal, RotateCcw, Flame, Sparkle 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { getCourseById } from '../data/coursesData.jsx';

export default function LessonWorkspaceView() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // Active Tab: 'guide' | 'playground' | 'quiz'
  const [activeTab, setActiveTab] = useState('guide');

  // Code Sandbox State
  const [code, setCode] = useState(lessonData.codeSnippet || '');
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Quiz & Copy State
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset state when lessonId changes
  useEffect(() => {
    setCode(lessonData.codeSnippet || '');
    setConsoleOutput([]);
    setSelectedOption(null);
    setIsSubmitted(false);
    setCopied(false);
    setActiveTab('guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [courseId, lessonId, lessonData.codeSnippet]);

  const testQuestion = lessonData.testQuestion || {
    question: 'What is the primary objective of this module?',
    options: ['Build solid foundational architecture', 'Bypass test suites', 'Ignore API contracts', 'Delete code'],
    correctIndex: 0,
    explanation: 'Foundational architecture ensures scalability, maintainability, and clean separation of concerns.',
  };

  const handleCopyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Safe in-browser sandbox runner capturing console logs
  const handleRunCode = () => {
    setIsRunningCode(true);
    setConsoleOutput(['[SANDBOX EXECUTION INITIALIZED...]']);

    setTimeout(() => {
      const logs = [];
      const originalLog = console.log;
      const originalWarn = console.warn;
      const originalError = console.error;

      try {
        console.log = (...args) => {
          logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        };
        console.warn = (...args) => {
          logs.push(`⚠️ WARN: ${args.join(' ')}`);
        };
        console.error = (...args) => {
          logs.push(`❌ ERROR: ${args.join(' ')}`);
        };

        // Execute user's code safely
        const runner = new Function(code);
        runner();

        if (logs.length === 0) {
          logs.push('✓ Code executed successfully with 0 runtime errors (No console.log outputs generated).');
        }
        setConsoleOutput(logs);
      } catch (err) {
        setConsoleOutput([`❌ Runtime Exception: ${err.message}`]);
      } finally {
        console.log = originalLog;
        console.warn = originalWarn;
        console.error = originalError;
        setIsRunningCode(false);
      }
    }, 300);
  };

  const isCorrect = selectedOption === testQuestion.correctIndex;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07090e] text-slate-100 p-4 sm:p-8 transition-colors duration-300 select-none font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* TOP BREADCRUMB & NAVIGATION */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link
            to={`/learn/${course.id || courseId}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={16} /> Back to {course.title} Roadmap
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">
              Module {currentIndex + 1} of {nodes.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
              +150 XP
            </span>
          </div>
        </div>

        {/* LESSON TITLE & TAB SELECTOR */}
        <div className="bg-[#0b0f19] border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider font-mono">
                {lessonData.category || 'Core Architecture'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
                {lessonData.label || 'Interactive Lesson'}
              </h1>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('guide')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'guide'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen size={13} /> Concept Guide
              </button>

              <button
                onClick={() => setActiveTab('playground')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'playground'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 size={13} /> Code Sandbox
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'quiz'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HelpCircle size={13} /> Quiz
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 1: CONCEPT DEEP DIVE */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'guide' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Concept Overview & Theory
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {lessonData.overview}
                </p>
              </div>

              {lessonData.tools && lessonData.tools.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Core Tooling & Runtime Ecosystem
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {lessonData.tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-400 font-bold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-sm">Ready to test your implementation?</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Switch to the interactive Code Sandbox or test your knowledge in the Quiz.</p>
                </div>
                <button
                  onClick={() => setActiveTab('playground')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  Open Sandbox <Code2 size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 2: LIVE CODE PLAYGROUND */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'playground' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="rounded-2xl bg-[#090d14] border border-slate-800 overflow-hidden shadow-2xl">
                
                {/* Sandbox Toolbar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#07090e] border-b border-slate-800 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-300 font-bold">interactive_sandbox.js</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyCode}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <><Check size={12} className="text-emerald-400" /> Copied</> : <><Copy size={12} /> Copy</>}
                    </button>

                    <button
                      onClick={() => setCode(lessonData.codeSnippet || '')}
                      title="Reset starter snippet"
                      className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                    >
                      <RotateCcw size={13} />
                    </button>

                    <button
                      onClick={handleRunCode}
                      disabled={isRunningCode}
                      className="px-3.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-105"
                    >
                      {isRunningCode ? (
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Play size={12} className="fill-white" />
                      )}
                      Run Sandbox
                    </button>
                  </div>
                </div>

                {/* Editable Textarea Playground */}
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={12}
                  className="w-full bg-[#07090e] p-4 text-xs font-mono text-slate-200 focus:outline-none resize-none leading-relaxed"
                  spellCheck="false"
                />

                {/* Live Console Output Box */}
                <div className="p-4 bg-slate-950 border-t border-slate-800 font-mono text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center gap-1">
                    <Terminal size={12} /> Sandbox Console Output
                  </span>
                  <div className="p-3 rounded-xl bg-[#090d14] border border-slate-800/80 min-h-[60px] max-h-[120px] overflow-y-auto space-y-1 text-slate-300">
                    {consoleOutput.length > 0 ? (
                      consoleOutput.map((log, i) => (
                        <div key={i} className="text-[11px] leading-relaxed">
                          {log}
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 text-[11px]">Click "Run Sandbox" above to execute this code block.</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 3: QUIZ & KNOWLEDGE CHECK */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Module Verification Question
                </span>
                <h3 className="text-base font-bold text-white">
                  {testQuestion.question}
                </h3>

                <div className="space-y-2.5">
                  {testQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => !isSubmitted && setSelectedOption(idx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        selectedOption === idx
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      } ${
                        isSubmitted && idx === testQuestion.correctIndex
                          ? '!bg-emerald-950/40 !border-emerald-500 !text-emerald-300'
                          : ''
                      } ${
                        isSubmitted && selectedOption === idx && !isCorrect
                          ? '!bg-rose-950/40 !border-rose-500 !text-rose-300'
                          : ''
                      }`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && idx === testQuestion.correctIndex && (
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>

                {!isSubmitted ? (
                  <button
                    onClick={() => selectedOption !== null && setIsSubmitted(true)}
                    disabled={selectedOption === null}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <div className={`p-4 rounded-xl border text-xs space-y-1 ${
                    isCorrect ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold">
                      {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      <span>{isCorrect ? 'Correct! +150 XP Earned.' : 'Incorrect.'}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] pt-1">{testQuestion.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM STEPPER NAVIGATION */}
        <div className="flex items-center justify-between pt-2">
          {prevLesson ? (
            <button
              onClick={() => navigate(`/learn/${course.id || courseId}/lesson/${prevLesson.id}`)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={14} /> Previous Module
            </button>
          ) : <div />}

          {nextLesson ? (
            <button
              onClick={() => navigate(`/learn/${course.id || courseId}/lesson/${nextLesson.id}`)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 hover:scale-105"
            >
              Next Module <ArrowRight size={14} />
            </button>
          ) : (
            <Link
              to={`/learn/${course.id || courseId}`}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 hover:scale-105"
            >
              Complete Roadmap <CheckCircle2 size={14} />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
