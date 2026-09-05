import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Play, RotateCcw, CornerDownLeft, Code2, Terminal, 
  Layers, Server, Layout, PieChart 
} from 'lucide-react';

const TRACKS = [
  { id: 'frontend', title: 'Frontend Developer', icon: <Layout size={20} className="text-pink-400" />, desc: 'React 19, Performance Profiling & Custom Hooks.' },
  { id: 'backend', title: 'Backend Developer', icon: <Server size={20} className="text-blue-400" />, desc: 'Node.js, Concurrency Mutexes, Redis & PostgreSQL.' },
  { id: 'fullstack', title: 'Full Stack Engineer', icon: <Layers size={20} className="text-amber-400" />, desc: 'VFS Sandboxes, WebSockets & Event Buses.' },
  { id: 'data-analytics', title: 'Data Analyst', icon: <PieChart size={20} className="text-purple-400" />, desc: 'SQL Window Functions, Pandas & Data Normalization.' },
];

const STARTER_CODE = {
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

export default function LandingPage() {
  const [files, setFiles] = useState(STARTER_CODE);
  const [activeFile, setActiveFile] = useState('src/payment.js');
  const [isRunning, setIsRunning] = useState(false);
  const [cliInput, setCliInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', text: 'DevStudio Virtual Environment ready. Type "npm test" or press Ctrl+Enter.' },
  ]);

  const terminalEndRef = useRef(null);

  const runTests = () => {
    setIsRunning(true);
    setTerminalHistory((prev) => [
      ...prev,
      { type: 'input', text: 'devtier:~/workspace$ npm test' },
      { type: 'info', text: 'Running test suite on 50 concurrent transactions...' }
    ]);

    setTimeout(() => {
      setIsRunning(false);
      setTerminalHistory((prev) => [
        ...prev,
        { type: 'success', text: '✓ PASS: tests/payment.test.js (50/50 transactions synchronized successfully).' },
        { type: 'system', text: 'Score: 100/100 • Ready to deploy.' }
      ]);
    }, 500);
  };

  const handleCliSubmit = (e) => {
    e.preventDefault();
    const cmd = cliInput.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear' || cmd === 'cls') {
      setTerminalHistory([]);
      setCliInput('');
      return;
    }

    if (cmd.includes('test') || cmd.includes('run')) {
      runTests();
      setCliInput('');
      return;
    }

    setTerminalHistory((prev) => [
      ...prev,
      { type: 'input', text: `devtier:~/workspace$ ${cliInput}` },
      { type: 'error', text: `command not found: ${cliInput}. Type "npm test"` }
    ]);
    setCliInput('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runTests();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans select-none">
      
      {/* HERO SECTION */}
      <section className="pt-16 pb-12 px-4 max-w-5xl mx-auto text-center space-y-6">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          Real Job Simulations for Developers
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-normal">
          Solve real workplace tickets in a web IDE, test concurrent codebases, and level up your software skills.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/signup"
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide uppercase transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            to="/simulations"
            className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium text-xs tracking-wide transition-colors"
          >
            Browse Simulations
          </Link>
        </div>
      </section>

      {/* DEVSTUDIO IDE PREVIEW */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden font-mono text-xs">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-zinc-300 font-medium">{activeFile}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiles(STARTER_CODE)}
                title="Reset code"
                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
              </button>
              <button
                onClick={runTests}
                disabled={isRunning}
                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Play size={11} className="fill-white" />
                Run Tests
              </button>
            </div>
          </div>

          {/* IDE Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-4 min-h-[360px]">
            {/* File List */}
            <div className="p-3 bg-zinc-900/60 border-r border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2 px-1">Files</span>
              {Object.keys(files).map((file) => (
                <button
                  key={file}
                  onClick={() => setActiveFile(file)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center gap-2 ${
                    activeFile === file ? 'bg-indigo-600/20 text-indigo-300 font-medium' : 'text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <Code2 size={13} />
                  <span className="truncate">{file}</span>
                </button>
              ))}
            </div>

            {/* Code & Terminal */}
            <div className="md:col-span-3 bg-zinc-950 p-4 flex flex-col justify-between">
              <textarea
                value={files[activeFile]}
                onChange={(e) => setFiles({ ...files, [activeFile]: e.target.value })}
                rows={10}
                className="w-full bg-transparent text-zinc-200 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                spellCheck="false"
              />

              {/* Terminal */}
              <div className="mt-3 p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 text-zinc-400 text-[10px]">
                  <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                    <Terminal size={12} className="text-indigo-400" /> Terminal
                  </span>
                  <button
                    onClick={() => setTerminalHistory([])}
                    className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                <div className="max-h-[90px] overflow-y-auto space-y-1">
                  {terminalHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={
                        item.type === 'input'
                          ? 'text-indigo-300 font-bold'
                          : item.type === 'success'
                          ? 'text-emerald-400 font-medium'
                          : item.type === 'error'
                          ? 'text-rose-400'
                          : 'text-zinc-400'
                      }
                    >
                      {item.text}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>

                <form onSubmit={handleCliSubmit} className="flex items-center gap-2 pt-1 border-t border-zinc-800">
                  <span className="text-indigo-400 font-bold">devtier:~/workspace$</span>
                  <input
                    type="text"
                    value={cliInput}
                    onChange={(e) => setCliInput(e.target.value)}
                    placeholder="npm test"
                    className="w-full bg-transparent text-zinc-200 focus:outline-none text-[11px]"
                  />
                </form>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* TRACKS LIST */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-bold text-white mb-6">Career Tracks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {TRACKS.map((t) => (
            <Link
              key={t.id}
              to="/simulations"
              className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2 block"
            >
              <div className="p-2 rounded bg-zinc-800 w-fit">{t.icon}</div>
              <h3 className="text-sm font-bold text-white">{t.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
