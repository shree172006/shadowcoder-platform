import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Plus, BookOpen, Briefcase, FileCode, CheckCircle2, 
  AlertCircle, Sparkles, Terminal, Code2, Layers, Server, Layout, 
  PieChart, Check, Trash2, ArrowRight, Activity, Save 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'course' | 'problem' | 'telemetry'
  const [statusMsg, setStatusMsg] = useState(null);

  // --- 1. SIMULATION FORM STATE ---
  const [simForm, setSimForm] = useState({
    title: '',
    ticketId: 'PAY-201',
    role: 'Backend Developer',
    track: 'backend',
    difficulty: 'Mid-Level',
    timeLimit: '45 mins',
    xpReward: 300,
    description: '',
    acceptanceCriteria: '1. Acquire mutex lock before mutating cart balance.\n2. Always release lock in finally block.\n3. Return status 409 on race collision.',
    keyFile: 'src/service.js',
    starterCode: `// Starter Service Code\nexport async function handleRequest(payload) {\n  // Implement logic here\n  return { success: true };\n}`,
  });

  // --- 2. COURSE MODULE FORM STATE ---
  const [courseForm, setCourseForm] = useState({
    courseId: 'javascript',
    label: '',
    category: 'Core Architecture',
    overview: '',
    codeSnippet: `// Example Code Snippet\nfunction calculate(data) {\n  return data.map(x => x * 2);\n}`,
    tools: 'V8 Engine, Node.js, WebSockets',
    question: 'What is the primary benefit of this architectural pattern?',
    optionA: 'Reduces CPU cycle overhead and prevents race conditions',
    optionB: 'Bypasses browser memory limits',
    optionC: 'Deletes database tables automatically',
    optionD: 'Disables all HTTP security',
    correctIndex: 0,
    explanation: 'This pattern guarantees isolated state management without memory leaks.',
  });

  // --- 3. PROBLEM STATEMENT FORM STATE ---
  const [probForm, setProbForm] = useState({
    title: '',
    track: 'Backend',
    difficulty: 'Medium',
    xp: 250,
    description: '',
    starterCode: `export function solve(input) {\n  // Your algorithm here\n  return input;\n}`,
    testAssertions: `console.log('Test 1:', solve([1, 2, 3]) !== null ? 'PASS' : 'FAIL');`,
  });

  // Handle Simulation Submit
  const handlePublishSimulation = (e) => {
    e.preventDefault();
    if (!simForm.title.trim()) {
      setStatusMsg({ type: 'error', text: 'Simulation title is required.' });
      return;
    }

    setStatusMsg({
      type: 'success',
      text: `✓ Successfully published Job Simulation "${simForm.title}" [${simForm.ticketId}] to the live catalog!`,
    });

    // Reset Form
    setSimForm((prev) => ({ ...prev, title: '', description: '' }));
  };

  // Handle Course Module Submit
  const handlePublishCourseModule = (e) => {
    e.preventDefault();
    if (!courseForm.label.trim()) {
      setStatusMsg({ type: 'error', text: 'Module label is required.' });
      return;
    }

    setStatusMsg({
      type: 'success',
      text: `✓ Successfully added Module "${courseForm.label}" to the ${courseForm.courseId.toUpperCase()} Roadmap!`,
    });

    setCourseForm((prev) => ({ ...prev, label: '', overview: '' }));
  };

  // Handle Problem Submit
  const handlePublishProblem = (e) => {
    e.preventDefault();
    if (!probForm.title.trim()) {
      setStatusMsg({ type: 'error', text: 'Problem title is required.' });
      return;
    }

    setStatusMsg({
      type: 'success',
      text: `✓ Successfully published Problem Statement "${probForm.title}" (+${probForm.xp} XP)!`,
    });

    setProbForm((prev) => ({ ...prev, title: '', description: '' }));
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 sm:p-6 lg:p-8 font-sans select-none">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER & STATUS BAR */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[11px] font-bold uppercase">
                Developer & Admin Console
              </span>
              <span className="text-xs text-zinc-500 font-mono">v1.2.0</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Platform Content & Simulation Management</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Create real-world workplace simulations, skill roadmap modules, and algorithm problems.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
            >
              Exit to Dashboard
            </Link>
          </div>
        </div>

        {/* STATUS ALERT */}
        {statusMsg && (
          <div className={`p-4 rounded-xl border text-xs font-medium flex items-center justify-between gap-3 ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            <span>{statusMsg.text}</span>
            <button onClick={() => setStatusMsg(null)} className="text-zinc-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* TAB CONTROLS */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('simulation'); setStatusMsg(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'simulation' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Briefcase size={14} /> Add Job Simulation
          </button>

          <button
            onClick={() => { setActiveTab('course'); setStatusMsg(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'course' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <BookOpen size={14} /> Add Course Module
          </button>

          <button
            onClick={() => { setActiveTab('problem'); setStatusMsg(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'problem' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <FileCode size={14} /> Add Problem Statement
          </button>

          <button
            onClick={() => { setActiveTab('telemetry'); setStatusMsg(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'telemetry' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Activity size={14} /> Platform Metrics
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB 1: ADD JOB SIMULATION */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'simulation' && (
          <form onSubmit={handlePublishSimulation} className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase size={16} className="text-indigo-400" /> Create New Job Simulation Ticket
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Scenario Title</label>
                <input
                  type="text"
                  value={simForm.title}
                  onChange={(e) => setSimForm({ ...simForm, title: e.target.value })}
                  placeholder="e.g. Optimize Redis Token Invalidation & Mutex"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Jira Ticket ID</label>
                <input
                  type="text"
                  value={simForm.ticketId}
                  onChange={(e) => setSimForm({ ...simForm, ticketId: e.target.value })}
                  placeholder="e.g. AUTH-402"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Career Track</label>
                <select
                  value={simForm.track}
                  onChange={(e) => setSimForm({ ...simForm, track: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="frontend">Frontend Developer</option>
                  <option value="backend">Backend Developer</option>
                  <option value="fullstack">Full Stack Engineer</option>
                  <option value="data-analytics">Data Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Difficulty & XP Reward</label>
                <div className="flex gap-2">
                  <select
                    value={simForm.difficulty}
                    onChange={(e) => setSimForm({ ...simForm, difficulty: e.target.value })}
                    className="w-1/2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead Architect">Lead Architect</option>
                  </select>
                  <input
                    type="number"
                    value={simForm.xpReward}
                    onChange={(e) => setSimForm({ ...simForm, xpReward: Number(e.target.value) })}
                    className="w-1/2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                    placeholder="XP"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Problem Description & Story</label>
              <textarea
                value={simForm.description}
                onChange={(e) => setSimForm({ ...simForm, description: e.target.value })}
                rows={3}
                placeholder="Explain the production bug, the user impact, and the desired outcome..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Acceptance Criteria (Line separated)</label>
              <textarea
                value={simForm.acceptanceCriteria}
                onChange={(e) => setSimForm({ ...simForm, acceptanceCriteria: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500 resize-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Starter File & Code ({simForm.keyFile})</label>
              <textarea
                value={simForm.starterCode}
                onChange={(e) => setSimForm({ ...simForm, starterCode: e.target.value })}
                rows={6}
                className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
                spellCheck="false"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Save size={14} /> Publish Simulation to Catalog
            </button>
          </form>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB 2: ADD COURSE MODULE */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'course' && (
          <form onSubmit={handlePublishCourseModule} className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-400" /> Add Module to Skill Roadmap
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Target Course Roadmap</label>
                <select
                  value={courseForm.courseId}
                  onChange={(e) => setCourseForm({ ...courseForm, courseId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="javascript">JavaScript Core & ES6+</option>
                  <option value="react">React.js Architecture & Performance</option>
                  <option value="backend">Distributed Backend Systems</option>
                  <option value="sql">SQL & Relational Databases</option>
                  <option value="python">Python Programming & Architecture</option>
                  <option value="fullstack">Full Stack Cloud Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Module Title</label>
                <input
                  type="text"
                  value={courseForm.label}
                  onChange={(e) => setCourseForm({ ...courseForm, label: e.target.value })}
                  placeholder="e.g. 7. WebSockets & Real-Time Change Streams"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Concept Overview & Theory</label>
              <textarea
                value={courseForm.overview}
                onChange={(e) => setCourseForm({ ...courseForm, overview: e.target.value })}
                rows={3}
                placeholder="Explain the architectural concept, why it matters in production, and how to implement it cleanly..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Runnable Sandbox Code Snippet</label>
              <textarea
                value={courseForm.codeSnippet}
                onChange={(e) => setCourseForm({ ...courseForm, codeSnippet: e.target.value })}
                rows={6}
                className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
                spellCheck="false"
              />
            </div>

            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3">
              <span className="text-xs font-bold text-white block">Verification Quiz Question</span>
              <input
                type="text"
                value={courseForm.question}
                onChange={(e) => setCourseForm({ ...courseForm, question: e.target.value })}
                className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                placeholder="Question text"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  value={courseForm.optionA}
                  onChange={(e) => setCourseForm({ ...courseForm, optionA: e.target.value })}
                  className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none"
                  placeholder="Option 1 (Correct)"
                />
                <input
                  type="text"
                  value={courseForm.optionB}
                  onChange={(e) => setCourseForm({ ...courseForm, optionB: e.target.value })}
                  className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none"
                  placeholder="Option 2"
                />
                <input
                  type="text"
                  value={courseForm.optionC}
                  onChange={(e) => setCourseForm({ ...courseForm, optionC: e.target.value })}
                  className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none"
                  placeholder="Option 3"
                />
                <input
                  type="text"
                  value={courseForm.optionD}
                  onChange={(e) => setCourseForm({ ...courseForm, optionD: e.target.value })}
                  className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none"
                  placeholder="Option 4"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Save size={14} /> Add Module to Roadmap
            </button>
          </form>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB 3: ADD PROBLEM STATEMENT */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'problem' && (
          <form onSubmit={handlePublishProblem} className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode size={16} className="text-indigo-400" /> Create Problem Statement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Problem Title</label>
                <input
                  type="text"
                  value={probForm.title}
                  onChange={(e) => setProbForm({ ...probForm, title: e.target.value })}
                  placeholder="e.g. Distributed Token Bucket Rate Limiter"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Difficulty & XP</label>
                <div className="flex gap-2">
                  <select
                    value={probForm.difficulty}
                    onChange={(e) => setProbForm({ ...probForm, difficulty: e.target.value })}
                    className="w-1/2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <input
                    type="number"
                    value={probForm.xp}
                    onChange={(e) => setProbForm({ ...probForm, xp: Number(e.target.value) })}
                    className="w-1/2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Problem Statement & Requirements</label>
              <textarea
                value={probForm.description}
                onChange={(e) => setProbForm({ ...probForm, description: e.target.value })}
                rows={3}
                placeholder="Detail time complexity requirements, data structure bounds, and edge cases..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Starter Template Code</label>
              <textarea
                value={probForm.starterCode}
                onChange={(e) => setProbForm({ ...probForm, starterCode: e.target.value })}
                rows={6}
                className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
                spellCheck="false"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Save size={14} /> Publish Problem Statement
            </button>
          </form>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB 4: PLATFORM METRICS & TELEMETRY */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'telemetry' && (
          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" /> Real-Time Platform Telemetry
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-500 text-[11px] uppercase font-mono block">Simulations</span>
                <span className="text-xl font-bold text-white font-mono">8 Active</span>
              </div>
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-500 text-[11px] uppercase font-mono block">Roadmap Courses</span>
                <span className="text-xl font-bold text-indigo-400 font-mono">6 Courses</span>
              </div>
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-500 text-[11px] uppercase font-mono block">Total Modules</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">34 Modules</span>
              </div>
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-500 text-[11px] uppercase font-mono block">Sandbox Engine</span>
                <span className="text-xl font-bold text-amber-400 font-mono">v1.2 In-Browser</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
              <span className="font-bold text-zinc-300 block">Active Microservices & Endpoints</span>
              <ul className="space-y-1 font-mono text-[11px] text-zinc-400">
                <li>• /api/simulations ──► Active (MongoDB & In-Memory Fallback)</li>
                <li>• /api/ai/review ──► Active (Gemini 2.0 Flash + AST Static Analysis)</li>
                <li>• /api/auth ──► Active (JWT Token Rotation & Firebase Auth)</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
