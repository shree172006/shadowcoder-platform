import React from 'react';
import { TerminalSquare, Cpu, Check, X, Sparkles, Send } from 'lucide-react';

export default function WorkspaceConsolePanel({
  terminalTab,
  setTerminalTab,
  executionResult,
  consoleOutput,
  testResults,
  runRealCodeEvaluation,
  isEvaluating,
}) {
  return (
    <div className="h-64 bg-[#05070a] border-t border-slate-800 flex flex-col shrink-0">
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
            <span
              className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                executionResult.status === 'ACCEPTED' || executionResult.status === 'PASSED'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {executionResult.status}
            </span>
            <span className="text-emerald-400 font-bold">Runtime: {executionResult.runtime}</span>
            <span className="text-indigo-400 font-bold">Memory: {executionResult.memory}</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto leading-relaxed">
        {terminalTab === 'console' ? (
          <pre className="text-slate-300 whitespace-pre-wrap">
            {consoleOutput || 'Click "Run Public Tests" or "Submit Code" to execute code against test cases.'}
          </pre>
        ) : (
          <div className="space-y-2">
            {testResults.length > 0 ? (
              testResults.map((tc) => (
                <div key={tc.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="space-y-0.5">
                    <div className="text-slate-300 font-bold">Test Case #{tc.id}</div>
                    <div className="text-[11px] text-slate-400">
                      Expected: <span className="text-emerald-400">{tc.expected}</span> | Actual:{' '}
                      <span className="text-indigo-400">{tc.actual}</span>
                    </div>
                  </div>
                  {tc.passed ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase flex items-center gap-1">
                      <Check size={12} /> Passed ({tc.time})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-[10px] uppercase flex items-center gap-1">
                      <X size={12} /> Failed
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-center py-4">No execution audit logs generated yet.</div>
            )}
          </div>
        )}
      </div>

      <div className="p-3 bg-[#090d14] border-t border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Sparkles size={14} className="text-amber-400" /> WebWorker Client-Side Sandbox Active
        </div>

        <button
          onClick={() => runRealCodeEvaluation(true)}
          disabled={isEvaluating}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white px-7 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <Send size={14} /> Submit Final Solution
        </button>
      </div>
    </div>
  );
}
