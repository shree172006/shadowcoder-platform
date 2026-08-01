import { useState, useCallback, useEffect } from 'react';
import React, { isValidElement } from 'react';
import ReactFlow, { Background, addEdge, applyNodeChanges, applyEdgeChanges, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  BookOpen, Code2, Database, Terminal, ArrowLeft, CheckCircle, Lock, 
  Play, Plus, Layout, Server, PieChart, Layers, FileJson, Check, Zap, Search,
  ShieldCheck, Edit3, Trash2, Save, X, Link2, Move, Menu, ChevronRight, HelpCircle, AlertCircle, Award, Globe, Cpu, Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminConsoleModal from '../../components/AdminConsoleModal.jsx';

// --- ICON RENDER HELPER ---
const renderTopicIcon = (icon) => {
  if (React.isValidElement(icon)) return icon;
  const iconStr = typeof icon === 'string' ? icon.toLowerCase() : '';
  switch (iconStr) {
    case 'frontend':
    case 'layout':
    case 'html-css':
      return <Layout className="text-pink-500" size={32} />;
    case 'backend':
    case 'server':
      return <Server className="text-blue-500" size={32} />;
    case 'data-analytics':
    case 'piechart':
      return <PieChart className="text-purple-500" size={32} />;
    case 'fullstack':
    case 'layers':
      return <Layers className="text-amber-500" size={32} />;
    case 'python':
    case 'terminal':
      return <Terminal className="text-blue-600" size={32} />;
    case 'react':
    case 'code2':
      return <Code2 className="text-cyan-500" size={32} />;
    case 'sql':
    case 'database':
      return <Database className="text-emerald-500" size={32} />;
    case 'javascript':
    case 'filejson':
      return <FileJson className="text-yellow-500" size={32} />;
    default:
      return <BookOpen className="text-indigo-500" size={32} />;
  }
};

// --- INITIAL DEFAULT CAREER TRACKS ---
const INITIAL_CAREER_PATHS = [
  { id: 'frontend', title: 'Frontend Developer', icon: 'frontend', modules: 9, completed: 3 },
  { id: 'backend', title: 'Backend Developer', icon: 'backend', modules: 8, completed: 2 },
  { id: 'fullstack', title: 'Full Stack Engineer', icon: 'fullstack', modules: 12, completed: 4 },
  { id: 'data-analytics', title: 'Data Analyst', icon: 'data-analytics', modules: 7, completed: 1 },
];

// --- DETAILED ROADMAP.SH FRONTEND NODES ---
const FRONTEND_ROADMAP_NODES = [
  { 
    id: 'fe-1', 
    position: { x: 350, y: 40 }, 
    data: { 
      label: '1. Internet & Web Protocols', 
      status: 'completed',
      category: 'Foundation',
      overview: 'Understand how the Internet works, HTTP/HTTPS request-response cycles, DNS resolution, IP routing, and browser rendering engines.',
      codeSnippet: `// HTTP GET Request Header Example\nGET /api/v1/users HTTP/1.1\nHost: shadowcoder-app.web.app\nAccept: application/json`,
      tools: ['DNS', 'HTTP/2', 'Chrome DevTools Network Tab'],
      testQuestion: {
        question: 'Which network protocol translates human-readable domain names (e.g. shadowcoder.app) into IP addresses?',
        options: ['HTTP', 'DNS (Domain Name System)', 'FTP', 'SMTP'],
        correctIndex: 1,
        explanation: 'DNS maps domain names to numeric IP addresses required for network routing.'
      }
    } 
  },
  { 
    id: 'fe-2', 
    position: { x: 350, y: 150 }, 
    data: { 
      label: '2. HTML5 & Semantic Web', 
      status: 'completed',
      overview: 'Master semantic element structures (<header>, <main>, <article>), form validation, ARIA accessibility standards, and SEO tags.',
      codeSnippet: `<!-- Semantic HTML5 & Accessibility Example -->\n<header role="banner">\n  <nav aria-label="Main Navigation">\n    <a href="/dashboard">Dashboard</a>\n  </nav>\n</header>`,
      tools: ['W3C Validator', 'Lighthouse Accessibility Audit'],
      testQuestion: {
        question: 'Which semantic HTML5 tag should be used for the primary self-contained content of a document?',
        options: ['<div>', '<main>', '<section>', '<article>'],
        correctIndex: 1,
        explanation: '<main> represents the dominant, unique content of the body of the document.'
      }
    } 
  },
  { 
    id: 'fe-3', 
    position: { x: 350, y: 260 }, 
    data: { 
      label: '3. CSS3 & Modern Layouts', 
      status: 'completed',
      overview: 'Master the CSS Box Model, Flexbox alignment, CSS Grid 2D layouts, Media Queries, CSS Custom Properties (Variables), and responsive breakpoints.',
      codeSnippet: `/* Modern CSS Grid & Flexbox Layout */\n.dashboard-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n}`,
      tools: ['Flexbox Playground', 'CSS Grid Inspector', 'Tailwind CSS'],
      testQuestion: {
        question: 'Which CSS Grid property specifies equal column sizing that automatically wraps items?',
        options: ['flex-direction: column', 'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))', 'position: absolute', 'float: left'],
        correctIndex: 1,
        explanation: 'repeat(auto-fit, minmax(...)) dynamically creates responsive grid column tracks.'
      }
    } 
  },
  { 
    id: 'fe-4', 
    position: { x: 350, y: 370 }, 
    data: { 
      label: '4. JavaScript ES6+ & DOM', 
      status: 'active',
      overview: 'Deep dive into DOM events, Fetch API, Async/Await, ES6 modules, Closures, Prototypes, and the JavaScript Event Loop looper.',
      codeSnippet: `// Async/Await Fetch API Example\nasync function fetchDashboardStats() {\n  const res = await fetch('/api/stats');\n  const data = await res.json();\n  return data;\n}`,
      tools: ['Chrome V8 Engine', 'JS Event Loop Visualizer'],
      testQuestion: {
        question: 'What is the primary role of the JavaScript Event Loop?',
        options: ['To compile JS to C++', 'To handle asynchronous callbacks by offloading tasks to Web APIs and checking the Call Stack', 'To execute SQL queries', 'To minify CSS files'],
        correctIndex: 1,
        explanation: 'The Event Loop monitors the Call Stack and Callback Queue to execute async code.'
      }
    } 
  },
  { 
    id: 'fe-5', 
    position: { x: 180, y: 480 }, 
    data: { 
      label: '5. Version Control & Git', 
      status: 'locked',
      overview: 'Master Git CLI branching workflows, merge conflict resolution, rebase, and GitHub pull requests.',
      codeSnippet: `# Git Feature Branch Workflow\ngit checkout -b feature/auth-flow\ngit commit -m "feat: add Google OAuth login"\ngit push origin feature/auth-flow`,
      tools: ['Git CLI', 'GitHub', 'GitLab'],
      testQuestion: {
        question: 'Which Git command creates and immediately switches to a new branch?',
        options: ['git branch <name>', 'git checkout -b <name>', 'git merge <name>', 'git push'],
        correctIndex: 1,
        explanation: '`git checkout -b` creates a new branch and switches HEAD to it.'
      }
    } 
  },
  { 
    id: 'fe-6', 
    position: { x: 520, y: 480 }, 
    data: { 
      label: '6. Build Tools & Vite', 
      status: 'locked',
      overview: 'Explore module bundlers (Vite, Webpack), static asset optimization, ESLint code quality rules, and Prettier auto-formatting.',
      codeSnippet: `// vite.config.js Optimization\nexport default defineConfig({\n  build: { cssCodeSplit: true, minify: 'terser' }\n});`,
      tools: ['Vite', 'Webpack', 'ESLint', 'Prettier'],
      testQuestion: {
        question: 'Why is Vite faster than Webpack for local development hot module replacement (HMR)?',
        options: ['Vite uses Python under the hood', 'Vite leverages native browser ES Modules (ESM) without bundling everything up front', 'Vite disables CSS', 'Vite requires no Node.js'],
        correctIndex: 1,
        explanation: 'Vite serves source code over native ESM, bundling only on demand.'
      }
    } 
  },
  { 
    id: 'fe-7', 
    position: { x: 350, y: 590 }, 
    data: { 
      label: '7. React.js & State Management', 
      status: 'locked',
      overview: 'Master React JSX, Component Lifecycle, Hooks (useState, useEffect, useMemo, useCallback), Context API, and Zustand / Redux Toolkit.',
      codeSnippet: `// Custom React Hook Example\nfunction useWindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  useEffect(() => {\n    const handleResize = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', handleResize);\n    return () => window.removeEventListener('resize', handleResize);\n  }, []);\n  return width;\n}`,
      tools: ['React DevTools', 'Redux Toolkit', 'Zustand'],
      testQuestion: {
        question: 'Which React Hook is used to memoize expensive calculation values between re-renders?',
        options: ['useState', 'useMemo', 'useEffect', 'useRef'],
        correctIndex: 1,
        explanation: '`useMemo` caches the result of a calculation between renders.'
      }
    } 
  },
  { 
    id: 'fe-8', 
    position: { x: 180, y: 700 }, 
    data: { 
      label: '8. Testing (Jest & Cypress)', 
      status: 'locked',
      overview: 'Unit testing with Jest & React Testing Library, integration testing, and End-to-End (E2E) browser testing with Cypress.',
      codeSnippet: `// React Testing Library Example\ntest('renders login button', () => {\n  render(<AuthPage />);\n  expect(screen.getByText('Sign In')).toBeInTheDocument();\n});`,
      tools: ['Jest', 'React Testing Library', 'Cypress'],
      testQuestion: {
        question: 'What is the core philosophy of React Testing Library?',
        options: ['Test internal component state implementation details', 'The more your tests resemble the way your software is used, the more confidence they give you', 'Test CSS line heights', 'Disable user events'],
        correctIndex: 1,
        explanation: 'React Testing Library focuses on user-centric testing rather than internal implementation details.'
      }
    } 
  },
  { 
    id: 'fe-9', 
    position: { x: 520, y: 700 }, 
    data: { 
      label: '9. Next.js, SSR & Web Vitals', 
      status: 'locked',
      overview: 'TypeScript integration, Server-Side Rendering (SSR), Static Site Generation (SSG), App Router, and Core Web Vitals (LCP, CLS, INP) performance.',
      codeSnippet: `// Next.js App Router Server Component\nexport default async function Page() {\n  const data = await fetch('https://api.example.com/items', { cache: 'force-cache' });\n  const items = await data.json();\n  return <ItemList items={items} />;\n}`,
      tools: ['TypeScript', 'Next.js App Router', 'Google PageSpeed / Web Vitals'],
      testQuestion: {
        question: 'In Web Vitals performance metrics, what does LCP stand for?',
        options: ['Largest Contentful Paint', 'Low Contrast Palette', 'Log Code Protocol', 'Local Cache Process'],
        correctIndex: 0,
        explanation: 'LCP (Largest Contentful Paint) measures render time of the largest content element visible in the viewport.'
      }
    } 
  },
];

const INITIAL_EDGES = [
  { id: 'e1-2', source: 'fe-1', target: 'fe-2', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } },
  { id: 'e2-3', source: 'fe-2', target: 'fe-3', type: 'smoothstep', style: { stroke: '#10b981', strokeWidth: 3 } }, 
  { id: 'e3-4', source: 'fe-3', target: 'fe-4', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
  { id: 'e4-5', source: 'fe-4', target: 'fe-5', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
  { id: 'e4-6', source: 'fe-4', target: 'fe-6', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
  { id: 'e5-7', source: 'fe-5', target: 'fe-7', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
  { id: 'e6-7', source: 'fe-6', target: 'fe-7', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
  { id: 'e7-8', source: 'fe-7', target: 'fe-8', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
  { id: 'e7-9', source: 'fe-7', target: 'fe-9', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
];

export default function Learn() {
  const { isAdmin } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState('frontend');
  const [activeLesson, setActiveLesson] = useState(FRONTEND_ROADMAP_NODES[3]); // Default active JS node
  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [nodes, setNodes] = useState(FRONTEND_ROADMAP_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);

  // Quiz State for Active Lesson
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isQuizCorrect, setIsQuizCorrect] = useState(false);

  useEffect(() => {
    setSelectedAnswerIndex(null);
    setQuizSubmitted(false);
    setIsQuizCorrect(false);
  }, [activeLesson]);

  const handleQuizSubmit = () => {
    if (selectedAnswerIndex === null || !activeLesson?.data?.testQuestion) return;

    const correct = selectedAnswerIndex === activeLesson.data.testQuestion.correctIndex;
    setIsQuizCorrect(correct);
    setQuizSubmitted(true);

    if (correct) {
      // Auto-Unlock Next Roadmap Node
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
      setToastMessage(`❌ Incorrect. Review the module overview and try again.`);
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-indigo-600 dark:text-indigo-400" /> Official Developer Roadmaps
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
            Interactive, step-by-step career learning paths with module verification tests.
          </p>
        </div>

        {/* Track Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          {INITIAL_CAREER_PATHS.map((track) => (
            <button
              key={track.id}
              onClick={() => setSelectedTopic(track.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedTopic === track.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              {track.title}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN DUAL PANE ROADMAP WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT 7 COLS: Interactive Roadmap Tree Visualizer */}
        <div className="lg:col-span-7 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe size={18} className="text-indigo-500" /> Roadmap.sh Official Frontend Path
            </h2>
            <span className="text-xs text-slate-400 font-mono font-bold">9 Sequential Milestones</span>
          </div>

          {/* Interactive Node Timeline Checklist */}
          <div className="space-y-4">
            {nodes.map((node, index) => {
              const isCompleted = node.data.status === 'completed';
              const isActive = node.data.status === 'active' || activeLesson?.id === node.id;
              const isLocked = node.data.status === 'locked';

              return (
                <div
                  key={node.id}
                  onClick={() => !isLocked && setActiveLesson(node)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-600/10 border-indigo-500 shadow-md scale-[1.01]'
                      : isCompleted
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500'
                      : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isCompleted ? 'bg-emerald-500 text-white' :
                      isActive ? 'bg-indigo-600 text-white animate-pulse' :
                      'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {isCompleted ? <Check size={18} /> : isLocked ? <Lock size={16} /> : index + 1}
                    </div>

                    <div>
                      <h3 className={`text-sm font-bold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                        {node.data.label}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{node.data.overview}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isCompleted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                      isActive ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' :
                      'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {node.data.status}
                    </span>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT 5 COLS: Active Module Lesson Drawer & Test Challenge */}
        {activeLesson && (
          <div className="lg:col-span-5 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest block mb-1">Active Learning Node</span>
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