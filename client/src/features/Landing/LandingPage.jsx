import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Briefcase, FileCode, BookOpen, Trophy, ArrowRight, ShieldCheck, 
  Terminal, Code2, Cpu, CheckCircle2, Zap, Layout, Server, Layers, PieChart, Star, 
  Play, Folder, ChevronRight, ExternalLink 
} from 'lucide-react';

const CAREER_TRACKS = [
  { id: 'frontend', title: 'Frontend Developer', icon: <Layout className="text-pink-500" size={28} />, desc: 'HTML5, CSS Grid, React 19, Vite, Testing & Next.js App Router.', modules: '9 Modules' },
  { id: 'backend', title: 'Backend Developer', icon: <Server className="text-blue-500" size={28} />, desc: 'Node.js, Express, PostgreSQL, Redis Rate Limiting & Concurrency Mutexes.', modules: '8 Modules' },
  { id: 'fullstack', title: 'Full Stack Engineer', icon: <Layers className="text-amber-500" size={28} />, desc: 'Monorepos, WebSockets, Virtual File Systems & CI/CD Pipelines.', modules: '12 Modules' },
  { id: 'data-analytics', title: 'Data Analyst', icon: <PieChart className="text-purple-500" size={28} />, desc: 'Advanced SQL Window Functions, Python Pandas, NumPy & Data Pipelines.', modules: '7 Modules' },
];

const FEATURES = [
  { icon: <Briefcase className="text-indigo-400" size={24} />, title: 'Real-World Job Simulations', desc: 'Debug production codebase tickets, submit pull requests, and pass executive code audits.' },
  { icon: <Terminal className="text-emerald-400" size={24} />, title: 'DevStudio Web IDE', desc: 'Multi-file file explorer, Monaco editor, tabs, breadcrumbs, and integrated CLI terminal.' },
  { icon: <BookOpen className="text-amber-400" size={24} />, title: 'Official 2D Roadmap Paths', desc: 'Follow step-by-step career flowcharts with interactive module verification tests.' },
  { icon: <Trophy className="text-purple-400" size={24} />, title: '1-Click GitHub Exporter', desc: 'Export verified repository code with recruiter badges and LinkedIn proof of work.' },
];

export default function LandingPage() {
  const [activeFile, setActiveFile] = useState('src/payment.js');
  const [isRunning, setIsRunning] = useState(false);
  const [testOutput, setTestOutput] = useState('Type "npm test" or click "Run Sandbox" above to execute.');

  const sampleFiles = {
    'src/payment.js': `// Payment Processing Service - Thread-Safe Concurrency
import { Mutex } from './utils/mutex.js';

const lock = new Mutex();

export async function processTransaction(cartId, amount) {
  const release = await lock.acquire();
  try {
    if (amount <= 0) throw new Error('Invalid amount');
    return { status: 200, cartId, processed: true };
  } catch (err) {
    return { status: 409, error: err.message };
  } finally {
    release();
  }
}`,
    'src/utils/mutex.js': `// Mutex Synchronization Primitive
export class Mutex {
  #locked = false;
  #queue = [];

  async acquire() {
    return new Promise((res) => {
      if (!this.#locked) {
        this.#locked = true;
        res(() => this.#release());
      } else {
        this.#queue.push(res);
      }
    });
  }

  #release() {
    if (this.#queue.length > 0) {
      const next = this.#queue.shift();
      next(() => this.#release());
    } else {
      this.#locked = false;
    }
  }
}`,
  };

  const handleRunDemo = () => {
    setIsRunning(true);
    setTestOutput('Executing sandbox test runner on 50 concurrent transactions...');
    setTimeout(() => {
      setIsRunning(false);
      setTestOutput('✓ PASS: All 50 concurrent transactions synchronized successfully without collision (100% Pass Rate). Score: 98/100 (Pro Hunter Apex).');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans transition-colors duration-300 overflow-hidden select-none">
      
      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-20 px-4 md:px-8 max-w-7xl mx-auto text-center">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-extrabold text-xs mb-8 shadow-sm">
          <Sparkles size={14} className="text-amber-400 fill-amber-400" />
          <span>The Next-Gen Developer Career & Job Simulation Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6 max-w-5xl mx-auto">
          Level Up Your Software Career Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Real-World Codebases</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-400 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
          Debug real Jira tickets in an integrated VS Code-grade DevStudio IDE, pass executive code quality audits, and export verified proof-of-work repositories to your GitHub.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 relative z-10">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 hover:scale-105"
          >
            Get Started Free <ArrowRight size={18} />
          </Link>
          <Link
            to="/simulations"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold text-sm hover:border-indigo-500 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Explore Public Simulations
          </Link>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* INTERACTIVE DEVSTUDIO IDE PREVIEW SHOWCASE */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#0b0f19] border-2 border-indigo-500/30 shadow-2xl overflow-hidden text-left relative z-10 font-mono text-xs">
          
          {/* Mock IDE Topbar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#080b12] border-b border-slate-800 text-slate-400 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-bold text-white">DevStudio IDE • Simulation Sandbox</span>
            </div>

            <button
              onClick={handleRunDemo}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer transition-all hover:scale-105"
            >
              {isRunning ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Play size={12} className="fill-white" />}
              Run Sandbox (Ctrl+Enter)
            </button>
          </div>

          {/* IDE Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-4 min-h-[300px]">
            {/* Sidebar */}
            <div className="p-3 bg-[#090d14] border-r border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-2">Explorer</span>
              {Object.keys(sampleFiles).map((file) => (
                <div
                  key={file}
                  onClick={() => setActiveFile(file)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    activeFile === file ? 'bg-indigo-600/30 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Code2 size={13} className="text-cyan-400" />
                  <span className="truncate">{file}</span>
                </div>
              ))}
            </div>

            {/* Code View */}
            <div className="md:col-span-3 bg-[#07090e] p-4 flex flex-col justify-between overflow-x-auto">
              <pre className="text-slate-200 leading-relaxed font-mono text-xs overflow-x-auto">
                <code>{sampleFiles[activeFile]}</code>
              </pre>

              {/* Mini Terminal Output */}
              <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                <span className="text-indigo-400 font-bold flex items-center gap-1">
                  <Terminal size={12} /> devtier:~/workspace$
                </span>
                <p className={testOutput.includes('PASS') ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {testOutput}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-sm max-w-4xl mx-auto mt-12">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-indigo-400">4</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Career Tracks</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-400">100%</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">DevStudio VFS IDE</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-amber-400">+500</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engineers Playing</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-purple-400">Pro Hunter</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Audits</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FEATURE HIGHLIGHTS */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#090d14] border-y border-slate-800/80 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Why Engineers Choose ShadowCoder
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              Everything you need to level up from junior coder to senior staff engineer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 shadow-sm space-y-3">
                <div className="p-3 w-fit rounded-2xl bg-slate-900 border border-slate-800">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CAREER TRACKS SECTION */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Specialized Career Paths
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            Industry-aligned curriculum flowcharts built for modern high-paying engineering roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAREER_TRACKS.map((track) => (
            <div key={track.id} className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 hover:border-indigo-500/50 transition-all group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="p-3.5 w-fit rounded-2xl bg-slate-900 border border-slate-800">
                  {track.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{track.desc}</p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">{track.modules}</span>
                <Link to="/learn" className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition-colors">
                  Explore <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
