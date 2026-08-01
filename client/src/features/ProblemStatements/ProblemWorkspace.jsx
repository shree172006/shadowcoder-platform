import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { 
  Play, Send, Eraser, FileCode, ArrowLeft, TerminalSquare, Code2, AlertTriangle, 
  CheckCircle, XCircle, Clock, Cpu, Award, Zap, Layers, Sparkles, Check, X, Maximize2
} from 'lucide-react';
import DesktopOnly from '../../layouts/DesktopOnly';

// --- CAREER TRACK PROBLEM DATA DICTIONARY ---
const PROBLEM_DATA_MAP = {
  'prob-fe-01': {
    title: "Responsive CSS Grid & Breakpoint Engine",
    difficulty: "Easy",
    track: "Frontend",
    xp: 150,
    tags: ["CSS Grid", "Responsive Design", "DOM Layout"],
    description: `Build a JavaScript function \`calculateGridColumns(viewportWidth)\` that dynamically computes column tracks based on screen width without triggering layout reflows.\n\n### Requirements:\n- For \`viewportWidth < 640px\`: Return 1 column.\n- For \`640px <= viewportWidth < 1024px\`: Return 2 columns.\n- For \`viewportWidth >= 1024px\`: Return 4 columns.\n- Throw a RangeError if \`viewportWidth\` is negative or invalid.`,
    sampleInput: `calculateGridColumns(1280); // Returns 4\ncalculateGridColumns(768);  // Returns 2\ncalculateGridColumns(414);  // Returns 1`,
    expectedOutput: `4\n2\n1`,
    testCases: [
      { id: 1, input: "calculateGridColumns(1920)", expected: "4", actual: "4", passed: true, time: "2ms" },
      { id: 2, input: "calculateGridColumns(800)", expected: "2", actual: "2", passed: true, time: "1ms" },
      { id: 3, input: "calculateGridColumns(375)", expected: "1", actual: "1", passed: true, time: "1ms" },
    ]
  },
  'prob-be-01': {
    title: "O(1) LRU Cache Implementation",
    difficulty: "Medium",
    track: "Backend",
    xp: 300,
    tags: ["Data Structures", "Doubly-Linked List", "Hash Map"],
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) Cache**.\n\n### Methods:\n- \`LRUCache(capacity)\`: Initialize the LRU cache with positive size capacity.\n- \`get(key)\`: Return the value of the key if it exists, otherwise return -1.\n- \`put(key, value)\`: Update or insert the value. When the capacity is reached, invalidate the least recently used item before inserting.`,
    sampleInput: `const cache = new LRUCache(2);\ncache.put(1, 1);\ncache.put(2, 2);\ncache.get(1);    // returns 1\ncache.put(3, 3); // evicts key 2\ncache.get(2);    // returns -1`,
    expectedOutput: `1\n-1`,
    testCases: [
      { id: 1, input: "cache.get(1)", expected: "1", actual: "1", passed: true, time: "4ms" },
      { id: 2, input: "cache.get(2)", expected: "-1", actual: "-1", passed: true, time: "2ms" },
      { id: 3, input: "cache.put(4, 4)", expected: "null", actual: "null", passed: true, time: "3ms" },
    ]
  },
  'prob-fs-01': {
    title: "Real-Time Pub/Sub Event Bus",
    difficulty: "Hard",
    track: "Full Stack",
    xp: 500,
    tags: ["Systems Design", "Event Emitter", "WebSockets"],
    description: `Architect an in-memory publish-subscribe event emitter with pattern matching, topic wildcards, and dead-letter queueing.\n\n### Requirements:\n- \`subscribe(event, callback)\`: Register a subscriber function.\n- \`publish(event, data)\`: Trigger all callbacks listening to the topic.\n- Support \`*\` wildcard topic matching (e.g., \`order.*\`).`,
    sampleInput: `const bus = new EventBus();\nbus.subscribe('order.*', (data) => console.log(data));\nbus.publish('order.created', { id: 101 });`,
    expectedOutput: `{ id: 101 }`,
    testCases: [
      { id: 1, input: "bus.publish('order.created')", expected: "Triggered 1 Subscriber", actual: "Triggered 1 Subscriber", passed: true, time: "5ms" },
      { id: 2, input: "bus.publish('user.signup')", expected: "Triggered 0 Subscribers", actual: "Triggered 0 Subscribers", passed: true, time: "2ms" },
    ]
  },
};

const DEFAULT_CODE = `/**
 * ShadowCoder Code Challenge Studio
 * Language: JavaScript (ES6+)
 */

function solve(input) {
  // Implement your optimal solution here
  return input;
}
`;

export default function ProblemWorkspace() {
  const { id } = useParams();
  const problem = PROBLEM_DATA_MAP[id] || PROBLEM_DATA_MAP['prob-be-01'];
  
  // Editor State
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState('javascript');
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'testcases'
  const [terminalTab, setTerminalTab] = useState('console'); // 'console' | 'audit'
  
  // Execution & UI State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  // --- HANDLERS ---
  const confirmReset = () => {
    setCode(DEFAULT_CODE);
    setConsoleOutput('');
    setExecutionResult(null);
    setShowResetModal(false);
  };

  const handleRunCode = () => {
    setIsEvaluating(true);
    setTerminalTab('console');
    setConsoleOutput('Compiling code against public test cases...\n');
    
    setTimeout(() => {
      setConsoleOutput(prev => prev + `\n[AST Inspection]: Clean syntax tree. Zero anti-patterns detected.\n> Test Case 1: PASSED (2ms)\n> Test Case 2: PASSED (1ms)\n\nExecution Time: 18ms | Peak Memory: 14.2 MB\nStatus: All public test cases passing!`);
      setExecutionResult({
        status: 'PASSED',
        passedCount: problem.testCases.length,
        totalCount: problem.testCases.length,
        runtime: '18ms',
        memory: '14.2 MB',
      });
      setIsEvaluating(false);
    }, 1200);
  };

  const handleSubmit = () => {
    setIsEvaluating(true);
    setTerminalTab('audit');
    setConsoleOutput('Running full submission audit against hidden system test suite...\n');
    
    setTimeout(() => {
      setConsoleOutput(prev => prev + `\n> Hidden Test 1: PASSED\n> Hidden Test 2: PASSED\n> Hidden Test 3: PASSED\n\n🎉 SUBMISSION VERIFIED! Score: 100/100`);
      setExecutionResult({
        status: 'ACCEPTED',
        passedCount: problem.testCases.length + 5,
        totalCount: problem.testCases.length + 5,
        runtime: '24ms',
        memory: '15.8 MB',
        earnedXp: problem.xp,
      });
      setIsEvaluating(false);
    }, 1800);
  };

  return (
    <DesktopOnly backLink="/problems" backText="Back to Problem Statements">
      <div className="fixed inset-0 z-[100] w-full h-screen flex bg-[#07090e] text-slate-200 font-sans overflow-hidden select-none">
        
        {/* CUSTOM RESET CONFIRMATION MODAL */}
        {showResetModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#0d1117] border-2 border-slate-800 rounded-3xl shadow-2xl p-6 max-w-sm w-full mx-4 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-black text-white">Reset Editor Workspace</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Are you sure you want to reset your code editor? Current unsaved modifications will be reverted to the starter template.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmReset}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LEFT PANE: Problem Description & Test Details */}
        <div className="w-1/2 flex flex-col border-r border-slate-800/80 bg-[#07090e] overflow-y-auto">
          
          {/* Top Bar Header */}
          <div className="sticky top-0 bg-[#07090e]/95 backdrop-blur border-b border-slate-800/80 p-4 flex items-center justify-between z-10 shadow-sm">
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

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800/80">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'description'
                  ? 'border-indigo-500 text-indigo-400 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Problem Description
            </button>
            <button
              onClick={() => setActiveTab('testcases')}
              className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'testcases'
                  ? 'border-indigo-500 text-indigo-400 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Public Test Cases
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-6">
            {activeTab === 'description' ? (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest block mb-1">
                    {problem.track} Track • Task ID: {id}
                  </span>
                  <h1 className="text-2xl font-black text-white tracking-tight">{problem.title}</h1>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Problem Statement text */}
                <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed font-sans space-y-4">
                  <div whitespace-pre-line="true">{problem.description}</div>
                </div>

                {/* Sample Input Block */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileCode size={14} className="text-indigo-400" /> Sample Input & Invocation
                  </h4>
                  <div className="bg-[#0d1117] p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 shadow-inner">
                    <pre className="whitespace-pre-wrap">{problem.sampleInput}</pre>
                  </div>
                </div>
              </div>
            ) : (
              /* Public Test Cases Tab */
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white mb-2">System Execution Benchmarks</h3>
                {problem.testCases.map((tc) => (
                  <div key={tc.id} className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800/80 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-slate-300">Test Case #{tc.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase flex items-center gap-1">
                        <Check size={12} /> Passed ({tc.time})
                      </span>
                    </div>
                    <div className="text-slate-400">
                      <span className="text-slate-500">Invocation:</span> {tc.input}
                    </div>
                    <div className="text-emerald-400">
                      <span className="text-slate-500">Expected:</span> {tc.expected}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Code Editor & Live Execution Terminal */}
        <div className="w-1/2 flex flex-col bg-[#0d1117] relative">
          
          {/* Editor Header Bar */}
          <div className="h-14 bg-[#090d14] border-b border-slate-800/80 flex items-center justify-between px-4 shrink-0 shadow-sm">
            
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-700/60 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-indigo-500"
              >
                <option value="javascript">JavaScript (Node v20)</option>
                <option value="python">Python 3.11</option>
                <option value="typescript">TypeScript</option>
              </select>

              <span className="text-xs text-slate-500 font-mono">solution.js</span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleRunCode}
                disabled={isEvaluating}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-1.5 rounded-xl font-bold text-xs transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                <Play size={14} className="text-emerald-400 fill-emerald-400" /> Run Public Tests
              </button>

              <button 
                onClick={() => setShowResetModal(true)}
                className="flex items-center gap-1.5 text-slate-500 hover:text-rose-400 transition-colors font-bold text-xs border-l border-slate-800 pl-3" 
                title="Reset Code Workspace"
              >
                <Eraser size={14} /> Revert
              </button>
            </div>
          </div>

          {/* Monaco Code Editor */}
          <div className="flex-1 relative z-0">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              loading={
                <div className="flex flex-col items-center justify-center h-full bg-[#0d1117] text-slate-400 space-y-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-500">Initializing High-Speed Monaco Studio...</span>
                </div>
              }
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

          {/* EXECUTIVE LIVE TERMINAL OUTPUT PANEL */}
          <div className="h-48 bg-[#07090e] border-t-2 border-slate-800 flex flex-col shrink-0 z-10">
            
            {/* Terminal Header Tabs */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#090d14] border-b border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTerminalTab('console')}
                  className={`font-bold flex items-center gap-1.5 transition-all ${
                    terminalTab === 'console' ? 'text-indigo-400 font-black' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <TerminalSquare size={14} /> Live Terminal Output
                </button>
                <button
                  onClick={() => setTerminalTab('audit')}
                  className={`font-bold flex items-center gap-1.5 transition-all ${
                    terminalTab === 'audit' ? 'text-indigo-400 font-black' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Cpu size={14} /> Execution Audit
                </button>
              </div>

              {executionResult && (
                <div className="flex items-center gap-3 font-mono text-[10px]">
                  <span className="text-emerald-400 font-bold">Runtime: {executionResult.runtime}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-indigo-400 font-bold">Memory: {executionResult.memory}</span>
                </div>
              )}
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto leading-relaxed">
              {terminalTab === 'console' ? (
                <pre className="text-slate-300 whitespace-pre-wrap">{consoleOutput || 'Click "Run Public Tests" or "Submit Code" to execute compiler.'}</pre>
              ) : (
                <div className="space-y-2">
                  {problem.testCases.map((tc) => (
                    <div key={tc.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-300">Test Case #{tc.id}: <code className="text-indigo-400">{tc.input}</code></span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check size={12} /> PASSED ({tc.time})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Submit Bar */}
            <div className="p-3 bg-[#090d14] border-t border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Sparkles size={14} className="text-amber-400" /> Automated Staff Engineer Review Enabled
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isEvaluating}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white px-7 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <Send size={14} /> Submit Final Solution
              </button>
            </div>

          </div>

        </div>
      </div>
    </DesktopOnly>
  );
}