import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, BookOpen, Trophy, ArrowRight, ShieldCheck, 
  Terminal, Code2, Cpu, CheckCircle2, Zap, Layout, Server, Layers, PieChart, 
  Play, RotateCcw, CornerDownLeft, GitBranch, Check, ExternalLink, Sparkles 
} from 'lucide-react';

const CAREER_TRACKS = [
  { id: 'frontend', title: 'Frontend Architecture', icon: <Layout className="text-indigo-400" size={22} />, desc: 'React 19 internals, Virtual DOM reconciliation, state machines, and web performance profiling.', modules: '9 Modules' },
  { id: 'backend', title: 'Distributed Backend Systems', icon: <Server className="text-cyan-400" size={22} />, desc: 'High-throughput Node.js microservices, concurrency mutexes, Redis rate limiting, and PostgreSQL locking.', modules: '8 Modules' },
  { id: 'fullstack', title: 'Full-Stack Cloud Engineering', icon: <Layers className="text-amber-400" size={22} />, desc: 'Monorepos, real-time WebSocket event buses, virtual file systems, and Docker sandboxes.', modules: '12 Modules' },
  { id: 'data-analytics', title: 'Data Systems & Pipelines', icon: <PieChart className="text-emerald-400" size={22} />, desc: 'Advanced SQL window functions, statistical anomaly detection, and high-volume data normalizers.', modules: '7 Modules' },
];

const PLATFORM_PILLARS = [
  { 
    icon: <Briefcase className="text-indigo-400" size={20} />, 
    title: 'Production Job Simulations', 
    desc: 'Debug real multi-file codebases, resolve high-concurrency race conditions, and pass automated staff audits.' 
  },
  { 
    icon: <Terminal className="text-cyan-400" size={20} />, 
    title: 'DevStudio Cloud IDE', 
    desc: 'Full-featured Monaco workspace with hierarchical file explorer, multi-tab editing, and integrated Linux terminal.' 
  },
  { 
    icon: <ShieldCheck className="text-emerald-400" size={20} />, 
    title: 'AI Senior Staff Code Reviews', 
    desc: 'Automated line-by-line AST code quality audits, Big-O complexity metrics, and security defense scoring.' 
  },
  { 
    icon: <Trophy className="text-amber-400" size={20} />, 
    title: 'Verified GitHub Proof of Work', 
    desc: '1-click export solved repositories with cryptographic audit badges directly to your GitHub and LinkedIn.' 
  },
];

const INITIAL_DEMO_FILES = {
  'src/payment.js': `// Payment Processing Service - Thread-Safe Concurrency
import { Mutex } from './utils/mutex.js';

const lock = new Mutex();

export async function processTransaction(cartId, amount) {
  const release = await lock.acquire();
  try {
    if (amount <= 0) throw new Error('Invalid transaction amount');
    // Simulated atomic ledger update
    return { status: 200, cartId, processed: true, timestamp: Date.now() };
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

export default function LandingPage() {
  const [demoFiles, setDemoFiles] = useState(INITIAL_DEMO_FILES);
  const [activeFile, setActiveFile] = useState('src/payment.js');
  const [isRunning, setIsRunning] = useState(false);
  
  // Interactive CLI State
  const [cliInput, setCliInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', text: 'ShadowCoder DevStudio Virtual Container v1.0.0 [x86_64-node]' },
    { type: 'system', text: 'Type "npm test" or press Ctrl+Enter to execute concurrent test suites.' },
  ]);

  const terminalEndRef = useRef(null);
  const terminalInputRef = useRef(null);

  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    setTerminalHistory((prev) => [
      ...prev,
      { type: 'input', text: `devtier:~/workspace$ ${rawCmd}` }
    ]);

    if (cmd === 'clear' || cmd === 'cls') {
      setTerminalHistory([]);
      return;
    }

    if (cmd === 'help') {
      setTerminalHistory((prev) => [
        ...prev,
        { type: 'output', text: 'Commands: npm test, node src/payment.js, ls, cat <file>, clear' }
      ]);
      return;
    }

    if (cmd === 'ls') {
      setTerminalHistory((prev) => [
        ...prev,
        { type: 'output', text: Object.keys(demoFiles).join('    ') }
      ]);
      return;
    }

    if (cmd.startsWith('cat ')) {
      const target = cmd.replace('cat ', '').trim();
      const content = demoFiles[target];
      if (content) {
        setTerminalHistory((prev) => [
          ...prev,
          { type: 'output', text: content }
        ]);
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          { type: 'error', text: `cat: ${target}: No such file or directory` }
        ]);
      }
      return;
    }

    if (cmd.includes('test') || cmd.includes('run') || cmd.includes('node')) {
      setIsRunning(true);
      setTerminalHistory((prev) => [
        ...prev,
        { type: 'info', text: '⚡ Running concurrent test harness (50 parallel threads)...' }
      ]);

      setTimeout(() => {
        setIsRunning(false);
        setTerminalHistory((prev) => [
          ...prev,
          { type: 'success', text: '✓ PASS: tests/payment.test.js — 50/50 concurrent transactions synchronized with 0 collisions.' },
          { type: 'success', text: '✓ AST Code Quality: 98/100 | Security Audit: Grade A+ (Passed)' },
          { type: 'system', text: 'Ready for GitHub repository export & recruiter verification.' }
        ]);
      }, 650);
      return;
    }

    setTerminalHistory((prev) => [
      ...prev,
      { type: 'error', text: `bash: ${rawCmd}: command not found. Type "npm test" or "help".` }
    ]);
  };

  const handleRunDemo = () => {
    executeCommand('npm test');
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!cliInput.trim()) return;
    executeCommand(cliInput);
    setCliInput('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunDemo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [demoFiles]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white select-none">
      
      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        
        {/* Subtle engineering grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 font-mono text-xs mb-8 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Solo Leveling for Software Engineers</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto mb-6">
          The Proof-of-Work Platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">Serious Developers</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
          Solve real multi-file workplace tickets in a VS Code-grade IDE. Pass automated AST code quality audits and export verified repositories to your GitHub for recruiters.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16 relative z-10">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Practicing Free <ArrowRight size={15} />
          </Link>
          <Link
            to="/simulations"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 font-medium text-xs tracking-wider transition-all flex items-center justify-center gap-2"
          >
            Explore Public Simulations
          </Link>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* INTERACTIVE DEVSTUDIO IDE PREVIEW */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="rounded-2xl bg-[#090b10] border border-slate-800 shadow-2xl overflow-hidden text-left relative z-10 font-mono text-xs">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#06080d] border-b border-slate-800 text-slate-400 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-bold text-slate-300 text-xs">DevStudio Sandbox • {activeFile}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDemoFiles(INITIAL_DEMO_FILES)}
                title="Reset starter files"
                className="p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
              </button>

              <button
                onClick={handleRunDemo}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                {isRunning ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Play size={11} className="fill-white" />}
                Run Tests (Ctrl+Enter)
              </button>
            </div>
          </div>

          {/* IDE Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-4 min-h-[380px]">
            {/* File Tree */}
            <div className="p-3 bg-[#080a0f] border-r border-slate-850 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2 px-1">Files</span>
              {Object.keys(demoFiles).map((file) => (
                <div
                  key={file}
                  onClick={() => setActiveFile(file)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    activeFile === file 
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-medium' 
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <Code2 size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">{file}</span>
                </div>
              ))}
            </div>

            {/* Code Editor Area */}
            <div className="md:col-span-3 bg-[#06080d] p-4 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <textarea
                  value={demoFiles[activeFile]}
                  onChange={(e) => setDemoFiles((prev) => ({ ...prev, [activeFile]: e.target.value }))}
                  rows={9}
                  className="w-full bg-transparent text-slate-200 leading-relaxed font-mono text-xs focus:outline-none resize-none"
                  spellCheck="false"
                />
              </div>

              {/* Linux Terminal CLI */}
              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-850 text-[11px] font-mono space-y-2">
                <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 text-slate-400 text-[10px]">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Terminal size={12} className="text-indigo-400" /> Integrated Terminal
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => executeCommand('npm test')}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
                    >
                      npm test
                    </button>
                    <button
                      onClick={() => setTerminalHistory([])}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
                    >
                      clear
                    </button>
                  </div>
                </div>

                <div className="max-h-[110px] overflow-y-auto space-y-1 custom-scrollbar">
                  {terminalHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`leading-relaxed ${
                        item.type === 'input'
                          ? 'text-indigo-300 font-bold'
                          : item.type === 'success'
                          ? 'text-emerald-400 font-medium'
                          : item.type === 'error'
                          ? 'text-rose-400'
                          : item.type === 'info'
                          ? 'text-amber-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.text}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>

                <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-1 border-t border-slate-900">
                  <span className="text-indigo-400 font-bold shrink-0">devtier:~/workspace$</span>
                  <input
                    ref={terminalInputRef}
                    type="text"
                    value={cliInput}
                    onChange={(e) => setCliInput(e.target.value)}
                    placeholder="npm test"
                    className="w-full bg-transparent text-slate-200 focus:outline-none text-[11px] placeholder-slate-600"
                  />
                  <button
                    type="submit"
                    className="text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer shrink-0"
                  >
                    <CornerDownLeft size={12} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 max-w-4xl mx-auto mt-10 text-left">
          <div className="space-y-1">
            <span className="text-2xl font-bold text-white font-mono">4</span>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Career Tracks</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-bold text-emerald-400 font-mono">100%</span>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">VFS Sandboxed IDE</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-bold text-indigo-400 font-mono">AST Graded</span>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Automated PR Audits</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-bold text-amber-400 font-mono">1-Click</span>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">GitHub Repo Exporter</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 4 CORE PILLARS */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#090b10] border-y border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Engineered for Production Competence
            </h2>
            <p className="text-slate-400 text-sm">
              Single-file algorithm quizzes don't prepare you for production codebases. ShadowCoder tests full architecture skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLATFORM_PILLARS.map((pillar) => (
              <div key={pillar.title} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
                <div className="p-2.5 w-fit rounded-xl bg-slate-800 border border-slate-750">
                  {pillar.icon}
                </div>
                <h3 className="text-sm font-bold text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CAREER TRACKS */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Specialized Engineering Tracks
          </h2>
          <p className="text-slate-400 text-sm">
            Curated industry roadmaps with integrated playbooks, code sandboxes, and verification quizzes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CAREER_TRACKS.map((track) => (
            <div key={track.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-750 shrink-0">
                  {track.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {track.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{track.desc}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500">{track.modules}</span>
                <Link to="/learn" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors">
                  Open Syllabus <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
