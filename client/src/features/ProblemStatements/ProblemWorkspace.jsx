import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { 
  Play, Send, Eraser, FileCode, ArrowLeft, TerminalSquare, Code2, AlertTriangle
} from 'lucide-react';
import DesktopOnly from '../../layouts/DesktopOnly';

// --- MOCK DATA ---
const PROBLEM_DATA = {
  title: "Array Manipulation: Max Sum",
  description: `Query the Name of any student in STUDENTS who scored higher than 75 Marks. Order your output by the last three characters of each name. If two or more students both have names ending in the same last three characters (i.e.: Bobby, Robby, etc.), secondary sort them by ascending ID.`,
  inputFormat: `The STUDENTS table is described as follows:\n\nColumn | Type\n--- | ---\nID | Integer\nName | String\nMarks | Integer`,
  sampleInput: `ID | Name | Marks\n1 | Ashley | 81\n2 | Samantha | 75\n3 | Julia | 76\n4 | Belvet | 84`,
};

const DEFAULT_CODE = `/*
  Enter your query here and follow these instructions:
  1. Please append a semicolon ";" at the end of the query.
  2. Type your code immediately after the comment.
*/

function solve(input) {
    // Write your logic here
    
}
`;

export default function ProblemWorkspace() {
  const { id } = useParams();
  
  // Editor State
  const [code, setCode] = useState(DEFAULT_CODE);
  
  // Execution & UI State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [showResetModal, setShowResetModal] = useState(false); // NEW: Controls the custom popup

  // --- HANDLERS ---
  const confirmReset = () => {
    setCode(DEFAULT_CODE);
    setConsoleOutput('');
    setShowResetModal(false);
  };

  const handleRunCode = () => {
    setIsEvaluating(true);
    setConsoleOutput('Compiling and running against public test cases...\n');
    setTimeout(() => {
      setConsoleOutput(prev => prev + '\n> Test Case 1: PASSED\n> Test Case 2: PASSED\n> Execution successful. Time: 42ms\n\nReady for final submission!');
      setIsEvaluating(false);
    }, 1500);
  };

  const handleSubmit = () => {
    setIsEvaluating(true);
    setConsoleOutput('Running against hidden system tests...\n');
    setTimeout(() => {
      setConsoleOutput(prev => prev + '\n> Hidden Case 1: PASSED\n> Hidden Case 2: PASSED\n> Hidden Case 3: PASSED\n\n✅ SUCCESS! You earned 500 XP.');
      setIsEvaluating(false);
    }, 2000);
  };

  return (
    <DesktopOnly backLink="/problems" backText="Back to Problems">
      <div className="fixed inset-0 z-[100] w-full h-screen flex bg-slate-950 text-slate-300 font-sans overflow-hidden">
        
        {/* CUSTOM RESET MODAL */}
        {showResetModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-in zoom-in-95">
              <div className="flex items-center gap-3 mb-4 text-red-400">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-bold text-white">Reset Workspace</h3>
              </div>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Are you sure you want to clear your code? This action cannot be undone and you will lose your current progress.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmReset}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 hover:bg-red-500 text-white transition-colors shadow-sm"
                >
                  Yes, Reset Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LEFT PANE: DevTier Problem Prompt */}
        <div className="w-1/2 flex flex-col border-r border-slate-800 bg-slate-950 overflow-y-auto">
          
          <div className="sticky top-0 bg-slate-950/90 backdrop-blur border-b border-slate-800 p-4 flex items-center gap-4 z-10 shadow-sm">
            <Link to="/problems" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
              <ArrowLeft size={16} /> Back
            </Link>
            <div className="h-4 w-px bg-slate-700"></div>
            <span className="text-blue-500 font-bold text-sm tracking-wider uppercase flex items-center gap-2">
              <TerminalSquare size={16} /> Task: {id}
            </span>
          </div>

          <div className="p-8 prose prose-invert prose-slate max-w-none">
            <h1 className="text-2xl font-black text-white mb-6 tracking-tight">{PROBLEM_DATA.title}</h1>
            <p className="text-slate-300 leading-relaxed text-sm mb-8">{PROBLEM_DATA.description}</p>
            
            <h3 className="text-white font-bold text-lg mb-4">Input Format</h3>
            <p className="text-slate-400 text-sm mb-4">The STUDENTS table is described as follows:</p>
            
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden mb-8 shadow-inner">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/50 text-slate-200 border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-bold">Column</th>
                    <th className="p-3 font-bold border-l border-slate-800">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-400">
                  <tr><td className="p-3 font-mono text-xs text-blue-400">ID</td><td className="p-3">Integer</td></tr>
                  <tr><td className="p-3 font-mono text-xs text-blue-400">Name</td><td className="p-3">String</td></tr>
                  <tr><td className="p-3 font-mono text-xs text-blue-400">Marks</td><td className="p-3">Integer</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-slate-500 text-xs mb-8 italic">Note: The Name column only contains uppercase (A-Z) and lowercase (a-z) letters.</p>
            
            <h3 className="text-white font-bold text-lg mb-4">Sample Input</h3>
            <div className="bg-[#0d1117] p-4 rounded-lg border border-slate-800 font-mono text-sm mb-8 shadow-inner">
              <pre className="text-emerald-400 m-0">{PROBLEM_DATA.sampleInput}</pre>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Code Editor & Execution Controls */}
        <div className="w-1/2 flex flex-col bg-[#0d1117] relative">
          
          <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 shadow-sm">
            
            <div className="flex items-center gap-2 h-full">
              <div className="flex items-center gap-2 text-slate-300 font-bold px-2 text-sm">
                <FileCode size={16} className="text-blue-500" /> solution.js
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleRunCode}
                disabled={isEvaluating}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-1.5 rounded-lg font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                <Play size={14} className="text-emerald-400" /> Run Code
              </button>

              {/* Reset button now triggers the Custom Modal instead of window.confirm */}
              <button 
                onClick={() => setShowResetModal(true)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors border-l border-slate-700 pl-4 font-bold text-xs" 
                title="Clear & Reset Code"
              >
                <Eraser size={14} /> Reset
              </button>
            </div>
          </div>

          <div className="flex-1 relative z-0">
            <Editor
              height="100%"
              language="javascript"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              loading={
                <div className="flex flex-col items-center justify-center h-full bg-[#0d1117] text-slate-400 space-y-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-500">Initializing High-Speed Code Editor...</span>
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

          {consoleOutput && (
            <div className="h-40 bg-slate-950 border-t border-slate-800 p-4 font-mono text-sm overflow-y-auto shrink-0 shadow-inner z-10">
              <div className="text-slate-500 text-xs mb-2 font-bold uppercase tracking-widest flex items-center gap-2">
                <TerminalSquare size={14} /> Console Output
              </div>
              <pre className="text-slate-300 whitespace-pre-wrap">{consoleOutput}</pre>
            </div>
          )}

          <div className="bg-slate-900 border-t border-slate-800 p-4 flex items-center justify-between shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-slate-300 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700 flex items-center gap-2">
                <Code2 size={16} className="text-yellow-400" /> JavaScript
              </span>
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={isEvaluating}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md"
            >
              <Send size={16} /> Submit Code
            </button>
          </div>

        </div>
      </div>
    </DesktopOnly>
  );
}