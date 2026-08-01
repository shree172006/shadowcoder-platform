import { useState, useCallback, useEffect } from 'react';
import React, { isValidElement } from 'react';
import ReactFlow, { Background, addEdge, applyNodeChanges, applyEdgeChanges, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  BookOpen, Code2, Database, Terminal, ArrowLeft, CheckCircle, Lock, 
  Play, Plus, Layout, Server, PieChart, Layers, FileJson, Check, Zap, Search,
  ShieldCheck, Edit3, Trash2, Save, X, Link2, Move, Menu, ChevronRight, HelpCircle, AlertCircle, Award, Globe, Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

// --- IMPORT DEDICATED COURSE ROADMAP MODULES ---
import { FRONTEND_COURSE } from './courses/FrontendCourse.jsx';
import { BACKEND_COURSE } from './courses/BackendCourse.jsx';
import { FULLSTACK_COURSE } from './courses/FullStackCourse.jsx';
import { DATA_ANALYTICS_COURSE } from './courses/DataAnalyticsCourse.jsx';

const COURSE_MAP = {
  frontend: FRONTEND_COURSE,
  backend: BACKEND_COURSE,
  fullstack: FULLSTACK_COURSE,
  'data-analytics': DATA_ANALYTICS_COURSE,
};

const INITIAL_CAREER_PATHS = [
  { id: 'frontend', title: 'Frontend Developer', icon: <Layout className="text-pink-500" size={24} /> },
  { id: 'backend', title: 'Backend Developer', icon: <Server className="text-blue-500" size={24} /> },
  { id: 'fullstack', title: 'Full Stack Engineer', icon: <Layers className="text-amber-500" size={24} /> },
  { id: 'data-analytics', title: 'Data Analyst', icon: <PieChart className="text-purple-500" size={24} /> },
];

export default function Learn() {
  const { isAdmin } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState('frontend');
  
  const activeCourse = COURSE_MAP[selectedCourseId] || FRONTEND_COURSE;
  
  const [nodes, setNodes] = useState(activeCourse.nodes);
  const [edges, setEdges] = useState(activeCourse.edges || []);
  const [activeLesson, setActiveLesson] = useState(activeCourse.nodes[3] || activeCourse.nodes[0]);
  const [toastMessage, setToastMessage] = useState(null);

  // Quiz State for Active Lesson
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isQuizCorrect, setIsQuizCorrect] = useState(false);

  // Switch Course Roadmap
  const handleSelectCourse = (courseId) => {
    setSelectedCourseId(courseId);
    const courseData = COURSE_MAP[courseId] || FRONTEND_COURSE;
    setNodes(courseData.nodes);
    setEdges(courseData.edges || []);
    setActiveLesson(courseData.nodes[0]);
    setSelectedAnswerIndex(null);
    setQuizSubmitted(false);
    setIsQuizCorrect(false);
  };

  const handleNodeClick = (_, node) => {
    setActiveLesson(node);
    setSelectedAnswerIndex(null);
    setQuizSubmitted(false);
    setIsQuizCorrect(false);
  };

  const handleQuizSubmit = () => {
    if (selectedAnswerIndex === null || !activeLesson?.data?.testQuestion) return;

    const correct = selectedAnswerIndex === activeLesson.data.testQuestion.correctIndex;
    setIsQuizCorrect(correct);
    setQuizSubmitted(true);

    if (correct) {
      const currentIndex = nodes.findIndex(n => n.id === activeLesson.id);
      
      setNodes(prevNodes => prevNodes.map((n, idx) => {
        if (n.id === activeLesson.id) {
          return { ...n, data: { ...n.data, status: 'completed' } };
        }
        if (idx === currentIndex + 1 && n.data.status === 'locked') {
          return { ...n, data: { ...n.data, status: 'active' } };
        }
        return n;
      }));

      setToastMessage(`🎉 Correct! Node Passed & Next Roadmap Step Unlocked! (+50 XP)`);
    } else {
      setToastMessage(`❌ Incorrect. Review the playbook and try again.`);
    }

    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 animate-in fade-in transition-colors duration-300 select-none">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-2xl bg-slate-900 border-2 border-indigo-500 text-white font-bold text-xs shadow-2xl animate-in slide-in-from-bottom-4 flex items-center gap-2">
          <Zap size={16} className="text-amber-400 fill-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Course Selection Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-indigo-600 dark:text-indigo-400" /> Developer Career Roadmaps
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
            Modular step-by-step career flowcharts with interactive module verification tests.
          </p>
        </div>

        {/* Course Track Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
          {INITIAL_CAREER_PATHS.map((track) => (
            <button
              key={track.id}
              onClick={() => handleSelectCourse(track.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                selectedCourseId === track.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              {track.icon}
              <span>{track.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DUAL PANE WORKSPACE: REACTFLOW CANVAS + MODULE DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT 7 COLS: ReactFlow 2D Flowchart Canvas */}
        <div className="lg:col-span-7 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm h-[750px] relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe size={16} className="text-indigo-500" /> {activeCourse.title} Interactive Flowchart
            </h2>
            <span className="text-[10px] text-slate-400 font-mono font-bold">Pan & Zoom Canvas • Click Any Node</span>
          </div>

          <div className="flex-1 w-full h-full relative">
            <ReactFlow
              nodes={nodes.map((n) => ({
                ...n,
                style: {
                  background: n.data.status === 'completed' ? '#064e3b' : n.data.status === 'active' || activeLesson?.id === n.id ? '#312e81' : '#0f172a',
                  color: '#ffffff',
                  border: n.id === activeLesson?.id ? '2px solid #818cf8' : '1px solid #334155',
                  borderRadius: '16px',
                  padding: '12px 18px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  boxShadow: n.id === activeLesson?.id ? '0 0 20px rgba(99, 102, 241, 0.5)' : 'none',
                  cursor: 'pointer',
                  width: '260px'
                }
              }))}
              edges={edges}
              onNodeClick={handleNodeClick}
              fitView
              attributionPosition="bottom-right"
            >
              <Background color="#334155" gap={20} size={1} />
              <Controls />
            </ReactFlow>
          </div>
        </div>

        {/* RIGHT 5 COLS: Active Module Drawer & Verification Test */}
        {activeLesson && (
          <div className="lg:col-span-5 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest block mb-1">Active Module Node</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{activeLesson.data.label}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                +50 XP Node
              </span>
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <BookOpen size={14} className="text-indigo-400" /> Module Overview
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {activeLesson.data.overview}
              </p>
            </div>

            {/* Ecosystem Tools */}
            {activeLesson.data.tools && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Wrench size={14} className="text-amber-400" /> Tools & Ecosystem
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeLesson.data.tools.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Code Snippet Playbook */}
            {activeLesson.data.codeSnippet && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Code2 size={14} className="text-emerald-400" /> Playbook Code Example
                </h4>
                <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
                  <pre>{activeLesson.data.codeSnippet}</pre>
                </div>
              </div>
            )}

            {/* Interactive Module Verification Test */}
            {activeLesson.data.testQuestion && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 pt-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-wider">
                  <Award size={16} /> Module Verification Test Challenge
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {activeLesson.data.testQuestion.question}
                </h4>

                <div className="space-y-2">
                  {activeLesson.data.testQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => !quizSubmitted && setSelectedAnswerIndex(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                        selectedAnswerIndex === idx
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold text-[10px]">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    </button>
                  ))}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={selectedAnswerIndex === null}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    Submit Test Answer
                  </button>
                ) : (
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
                    isQuizCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    <p className="font-bold">{isQuizCorrect ? '✅ Verification Test Passed!' : '❌ Incorrect Answer'}</p>
                    <p>{activeLesson.data.testQuestion.explanation}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}