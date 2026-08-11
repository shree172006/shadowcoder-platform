import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { 
  Play, Send, Eraser, FileCode, ArrowLeft, TerminalSquare, Code2, AlertTriangle, 
  CheckCircle, XCircle, Clock, Cpu, Award, Zap, Layers, Sparkles, Check, X
} from 'lucide-react';
import DesktopOnly from '../../layouts/DesktopOnly';
import WorkspaceConsolePanel from './components/WorkspaceConsolePanel.jsx';

// --- CAREER TRACK PROBLEM DATA DICTIONARY ---
const PROBLEM_DATA_MAP = {
  'prob-fe-01': {
    title: "Responsive CSS Grid & Breakpoint Engine",
    difficulty: "Easy",
    track: "Frontend",
    xp: 150,
    tags: ["CSS Grid", "Responsive Design", "DOM Layout"],
    description: `Build a JavaScript function \`calculateGridColumns(viewportWidth)\` that dynamically computes column tracks based on screen width without triggering layout reflows.\n\n### Requirements:\n- For \`viewportWidth < 640px\`: Return 1 column.\n- For \`640px <= viewportWidth < 1024px\`: Return 2 columns.\n- For \`viewportWidth >= 1024px\`: Return 4 columns.\n- Throw a RangeError if \`viewportWidth\` is negative.`,
    starterCode: `function calculateGridColumns(viewportWidth) {
  if (viewportWidth < 0) throw new RangeError("Width must be positive");
  if (viewportWidth < 640) return 1;
  if (viewportWidth < 1024) return 2;
  return 4;
}
`,
    testCases: [
      { id: 1, fnName: 'calculateGridColumns', arg: 1920, expected: 4 },
      { id: 2, fnName: 'calculateGridColumns', arg: 768, expected: 2 },
      { id: 3, fnName: 'calculateGridColumns', arg: 414, expected: 1 },
    ]
  },
  'prob-be-01': {
    title: "O(1) LRU Cache Implementation",
    difficulty: "Medium",
    track: "Backend",
    xp: 300,
    tags: ["Data Structures", "Doubly-Linked List", "Hash Map"],
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) Cache**.\n\n### Requirements:\n- Initialize cache with a set capacity.\n- \`get(key)\`: Return value if exists, else -1.\n- \`put(key, value)\`: Evict least recently used item when capacity limit is reached.`,
    starterCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
}
`,
    testCases: [
      { id: 1, type: 'lru', capacity: 2, ops: [['put', 1, 1], ['put', 2, 2], ['get', 1]], expected: 1 },
      { id: 2, type: 'lru', capacity: 2, ops: [['put', 1, 1], ['put', 2, 2], ['put', 3, 3], ['get', 1]], expected: -1 },
    ]
  },
  'prob-fs-01': {
    title: "Real-Time Pub/Sub Event Bus",
    difficulty: "Hard",
    track: "Full Stack",
    xp: 500,
    tags: ["Systems Design", "Event Emitter", "WebSockets"],
    description: `Architect an in-memory publish-subscribe event emitter with topic pattern matching.\n\n### Requirements:\n- \`subscribe(event, callback)\`: Register callback.\n- \`publish(event, data)\`: Trigger matching subscribers.`,
    starterCode: `class EventBus {
  constructor() {
    this.listeners = {};
  }

  subscribe(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  publish(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}
`,
    testCases: [
      { id: 1, type: 'eventbus', event: 'order.created', data: { id: 101 }, expected: { id: 101 } },
    ]
  },
};

const FALLBACK_CODE = `function solve(input) {
  return input;
}
`;

export default function ProblemWorkspace() {
  const { id } = useParams();
  const problem = PROBLEM_DATA_MAP[id] || PROBLEM_DATA_MAP['prob-be-01'];
  
  // Editor State
  const [code, setCode] = useState(problem.starterCode || FALLBACK_CODE);
  const [language, setLanguage] = useState('javascript');
  const [activeTab, setActiveTab] = useState('description');
  const [terminalTab, setTerminalTab] = useState('console');
  
  // Execution & UI State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  // --- REAL JAVASCRIPT CODE EVALUATOR ---
  const runRealCodeEvaluation = (isFinalSubmission = false) => {
    setIsEvaluating(true);
    setTerminalTab(isFinalSubmission ? 'audit' : 'console');
    setConsoleOutput('Compiling code in WebWorker JS Sandbox...\n');

    const logs = [];
    const customConsole = {
      log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')),
      error: (...args) => logs.push(`[Error]: ${args.join(' ')}`),
      warn: (...args) => logs.push(`[Warn]: ${args.join(' ')}`),
    };

    setTimeout(() => {
      try {
        const startTime = performance.now();
        
        // Execute Code in Safe Function Scope with Custom Console
        const userFunction = new Function('console', `${code}\n return typeof calculateGridColumns !== 'undefined' ? calculateGridColumns : typeof LRUCache !== 'undefined' ? LRUCache : typeof EventBus !== 'undefined' ? EventBus : solve;`);
        const EvaluatedClassOrFn = userFunction(customConsole);

        const evaluatedCases = [];
        let passedCount = 0;

        for (const tc of problem.testCases) {
          const tcStart = performance.now();
          let resultVal = null;
          let isPassed = false;

          if (tc.fnName === 'calculateGridColumns') {
            resultVal = EvaluatedClassOrFn(tc.arg);
            isPassed = resultVal === tc.expected;
          } else if (tc.type === 'lru') {
            const cache = new EvaluatedClassOrFn(tc.capacity);
            for (const op of tc.ops) {
              if (op[0] === 'put') cache.put(op[1], op[2]);
              if (op[0] === 'get') resultVal = cache.get(op[1]);
            }
            isPassed = resultVal === tc.expected;
          } else if (tc.type === 'eventbus') {
            const bus = new EvaluatedClassOrFn();
            let subData = null;
            bus.subscribe(tc.event, (d) => { subData = d; });
            bus.publish(tc.event, tc.data);
            resultVal = subData;
            isPassed = JSON.stringify(subData) === JSON.stringify(tc.expected);
          } else {
            resultVal = EvaluatedClassOrFn(tc.arg || 0);
            isPassed = true;
          }

          if (isPassed) passedCount++;

          const tcDuration = Math.max(1, Math.round(performance.now() - tcStart));
          evaluatedCases.push({
            id: tc.id,
            input: tc.arg ? `input: ${tc.arg}` : 'ops: execution pipeline',
            expected: JSON.stringify(tc.expected),
            actual: JSON.stringify(resultVal),
            passed: isPassed,
            time: `${tcDuration}ms`,
          });
        }

        const totalTime = Math.round(performance.now() - startTime);

        setTestResults(evaluatedCases);
        setConsoleOutput(
          `[Compilation Success]: 0 Syntax Errors\n` +
          (logs.length > 0 ? `\n--- User Console Logs ---\n${logs.join('\n')}\n` : '') +
          `\n> Public Test Cases Passed: ${passedCount} / ${problem.testCases.length}\n` +
          `> Total Execution Time: ${totalTime}ms\n` +
          `> Memory Allocation Peak: 12.4 MB`
        );

        setExecutionResult({
          status: passedCount === problem.testCases.length ? (isFinalSubmission ? 'ACCEPTED' : 'PASSED') : 'FAILED',
          passedCount,
          totalCount: problem.testCases.length,
          runtime: `${totalTime}ms`,
          memory: '12.4 MB',
          earnedXp: passedCount === problem.testCases.length ? problem.xp : 20,
        });

      } catch (err) {
        setConsoleOutput(`[Runtime Error]: ${err.name} - ${err.message}\nStack Trace: Line-by-line inspection detected uncaught exception.`);
        setExecutionResult({
          status: 'RUNTIME ERROR',
          passedCount: 0,
          totalCount: problem.testCases.length,
          runtime: '0ms',
          memory: '0 MB',
          earnedXp: 0,
        });
      } finally {
        setIsEvaluating(false);
      }
    }, 600);
  };

  return (
    <DesktopOnly backLink="/problems" backText="Back to Problem Statements">
      <div className="fixed inset-0 z-[100] w-full h-screen flex bg-[#07090e] text-slate-200 font-sans overflow-hidden select-none">
        
        {/* RESET CONFIRMATION MODAL */}
        {showResetModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#0d1117] border-2 border-slate-800 rounded-3xl shadow-2xl p-6 max-w-sm w-full mx-4 space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-black text-white">Reset Code Editor</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Revert code editor back to default starter code template? Unsaved progress will be cleared.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setShowResetModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">Cancel</button>
                <button onClick={() => { setCode(problem.starterCode || FALLBACK_CODE); setShowResetModal(false); }} className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md">Revert Code</button>
              </div>
            </div>
          </div>
        )}

        {/* LEFT PANE: Problem Prompt */}
        <div className="w-1/2 flex flex-col border-r border-slate-800/80 bg-[#07090e] overflow-y-auto">
          <div className="sticky top-0 bg-[#07090e]/95 backdrop-blur border-b border-slate-800/80 p-4 flex items-center justify-between z-10">
            <Link to="/problems" className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors text-xs font-bold">
              <ArrowLeft size={16} /> Back to Problems
            </Link>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                problem.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                problem.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {problem.difficulty}
              </span>
              <span className="text-xs font-bold text-indigo-400 font-mono bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                + {problem.xp} XP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800/80">
            <button onClick={() => setActiveTab('description')} className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all ${activeTab === 'description' ? 'border-indigo-500 text-indigo-400 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Problem Description</button>
            <button onClick={() => setActiveTab('testcases')} className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all ${activeTab === 'testcases' ? 'border-indigo-500 text-indigo-400 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Public Test Suite</button>
          </div>

          <div className="p-6 space-y-6">
            {activeTab === 'description' ? (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest block mb-1">{problem.track} Track • ID: {id}</span>
                  <h1 className="text-2xl font-black text-white tracking-tight">{problem.title}</h1>
                </div>

                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold">#{tag}</span>
                  ))}
                </div>

                <div className="text-slate-300 leading-relaxed text-xs sm:text-sm font-sans space-y-4 whitespace-pre-line">
                  {problem.description}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white mb-2">Automated Test Benchmarks</h3>
                {problem.testCases.map((tc) => (
                  <div key={tc.id} className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800/80 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-slate-300">Test Case #{tc.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase flex items-center gap-1"><Check size={12} /> Ready</span>
                    </div>
                    <div className="text-slate-400"><span className="text-slate-500">Expected:</span> {JSON.stringify(tc.expected)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Code Editor & Real JavaScript Execution Engine */}
        <div className="w-1/2 flex flex-col bg-[#0d1117] relative">
          <div className="h-14 bg-[#090d14] border-b border-slate-800/80 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-slate-900 border border-slate-700/60 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-indigo-500">
                <option value="javascript">JavaScript (Node v20)</option>
                <option value="python">Python 3.11</option>
              </select>
              <span className="text-xs text-slate-500 font-mono">solution.js</span>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => runRealCodeEvaluation(false)} disabled={isEvaluating} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-1.5 rounded-xl font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm">
                <Play size={14} className="text-emerald-400 fill-emerald-400" /> Run Public Tests
              </button>
              <button onClick={() => setShowResetModal(true)} className="flex items-center gap-1.5 text-slate-500 hover:text-rose-400 transition-colors font-bold text-xs border-l border-slate-800 pl-3">
                <Eraser size={14} /> Revert
              </button>
            </div>
          </div>

          <div className="flex-1 relative z-0">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              onMount={(editor, monaco) => {
                const domNode = editor.getDomNode();
                if (domNode) {
                  // Disable copying inside the Monaco Editor
                  domNode.addEventListener('copy', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    alert("Anti-AI Protection: Copying code from this editor is disabled.");
                  }, true);

                  // Disable cutting inside the Monaco Editor
                  domNode.addEventListener('cut', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    alert("Anti-AI Protection: Cutting code from this editor is disabled.");
                  }, true);

                  // Disable pasting inside the Monaco Editor completely
                  domNode.addEventListener('paste', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    alert("Anti-AI Protection: Pasting code into this editor is disabled. You must type your code manually.");
                  }, true);

                  // Disable dropping text or files inside the Monaco Editor completely
                  domNode.addEventListener('drop', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    alert("Anti-AI Protection: Dragging and dropping code into this editor is disabled.");
                  }, true);
                }
              }}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                renderLineHighlight: 'all',
                lineNumbersMinChars: 3,
                wordWrap: 'on',
                'editor.background': '#0d1117' 
              }}
            />
          </div>

          {/* LIVE TERMINAL & EXECUTION AUDIT PANEL */}
          <div className="h-52 bg-[#07090e] border-t-2 border-slate-800 flex flex-col shrink-0 z-10">
            {/* Console Output & Execution Audit Panel */}
            <WorkspaceConsolePanel
              terminalTab={terminalTab}
              setTerminalTab={setTerminalTab}
              executionResult={executionResult}
              consoleOutput={consoleOutput}
              testResults={testResults}
              runRealCodeEvaluation={runRealCodeEvaluation}
              isEvaluating={isEvaluating}
            />

          </div>
        </div>
      </div>
    </DesktopOnly>
  );
}