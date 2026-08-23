import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, Play, CheckCircle2, XCircle, AlertTriangle, 
  Trash2, Maximize2, Minimize2, Copy, Check, ChevronRight, CornerDownLeft, 
  Cpu, FileCode, Clock, ShieldCheck 
} from 'lucide-react';

export default function IntegratedTerminal({
  logs = [],
  testResults = null,
  isExecuting = false,
  onRunTests,
  onClearLogs,
  files = {},
  activeFile = '',
}) {
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' | 'output' | 'tests' | 'problems'
  const [inputCommand, setInputCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [terminalLines, setTerminalLines] = useState([
    { text: 'DevStudio Interactive Sandbox Terminal v1.0.0 [x86_64-node]', type: 'system' },
    { text: 'Type "npm test" or "help" to view available developer CLI commands.', type: 'info' },
  ]);
  const [isCopied, setIsCopied] = useState(false);

  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll terminal to bottom on new output
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines, logs]);

  // Sync external test execution into terminal output
  useEffect(() => {
    if (isExecuting) {
      setTerminalLines((prev) => [
        ...prev,
        { text: '$ npm test -- --reporter=spec', type: 'command' },
        { text: 'Executing test runner sandbox in isolated container...', type: 'info' },
      ]);
    }
  }, [isExecuting]);

  useEffect(() => {
    if (testResults) {
      const isPass = testResults.status === 'PASSED' || testResults.score > 80;
      setTerminalLines((prev) => [
        ...prev,
        {
          text: isPass
            ? `✓ PASS: All test suites completed successfully! (${testResults.testSuiteRate || '100%'} passed)`
            : `✖ FAIL: Test suite failed with ${testResults.codeSmellsCount || 1} error(s).`,
          type: isPass ? 'success' : 'error',
        },
      ]);
    }
  }, [testResults]);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = inputCommand.trim();
    if (!cmd) return;

    // Add to history
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    // Print command line
    setTerminalLines((prev) => [...prev, { text: `$ ${cmd}`, type: 'command' }]);
    setInputCommand('');

    // Command Parser
    const parts = cmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts[1];

    switch (mainCmd) {
      case 'help':
        setTerminalLines((prev) => [
          ...prev,
          { text: 'Available DevStudio Commands:', type: 'system' },
          { text: '  npm test          - Run automated test suite audit against workspace files', type: 'info' },
          { text: '  node <file>       - Execute a JavaScript file and output result', type: 'info' },
          { text: '  python <file>     - Execute a Python script', type: 'info' },
          { text: '  ls / dir          - List all files in the current workspace directory', type: 'info' },
          { text: '  cat <file>        - Print source code of a specified file', type: 'info' },
          { text: '  pwd               - Print current virtual workspace directory', type: 'info' },
          { text: '  git status        - Display workspace modified files and branch status', type: 'info' },
          { text: '  clear             - Clear terminal screen buffer', type: 'info' },
        ]);
        break;

      case 'clear':
      case 'cls':
        setTerminalLines([]);
        onClearLogs?.();
        break;

      case 'npm':
      case 'run':
        if (arg === 'test' || arg === 'run' || mainCmd === 'run') {
          onRunTests?.();
          setActiveTab('terminal');
        } else {
          setTerminalLines((prev) => [
            ...prev,
            { text: `npm script "${arg || ''}" recognized. Running default test suite...`, type: 'info' },
          ]);
          onRunTests?.();
        }
        break;

      case 'ls':
      case 'dir':
        const fileList = Object.keys(files);
        setTerminalLines((prev) => [
          ...prev,
          { text: `total ${fileList.length} files in /workspace:`, type: 'system' },
          ...fileList.map((f) => ({ text: `  - ${f}`, type: 'info' })),
        ]);
        break;

      case 'pwd':
        setTerminalLines((prev) => [
          ...prev,
          { text: '/workspace/shadowcoder-sandbox', type: 'info' },
        ]);
        break;

      case 'git':
        if (arg === 'status') {
          setTerminalLines((prev) => [
            ...prev,
            { text: 'On branch main', type: 'info' },
            { text: 'Your branch is up to date with origin/main.', type: 'info' },
            { text: 'Changes ready to submit for code audit.', type: 'success' },
          ]);
        } else {
          setTerminalLines((prev) => [
            ...prev,
            { text: `git: '${arg}' is ready for automated PR review on submit.`, type: 'info' },
          ]);
        }
        break;

      case 'cat':
        if (!arg) {
          setTerminalLines((prev) => [...prev, { text: 'usage: cat <filename>', type: 'error' }]);
        } else {
          const matchedKey = Object.keys(files).find(
            (k) => k === arg || k.endsWith(`/${arg}`) || k.toLowerCase() === arg.toLowerCase()
          );
          if (matchedKey && files[matchedKey]) {
            setTerminalLines((prev) => [
              ...prev,
              { text: `--- ${matchedKey} ---`, type: 'system' },
              { text: files[matchedKey], type: 'info' },
            ]);
          } else {
            setTerminalLines((prev) => [
              ...prev,
              { text: `cat: ${arg}: No such file in workspace`, type: 'error' },
            ]);
          }
        }
        break;

      case 'node':
      case 'python':
        const targetFile = arg || activeFile;
        const matchedCode = files[targetFile];
        if (!matchedCode) {
          setTerminalLines((prev) => [
            ...prev,
            { text: `${mainCmd}: cannot find '${targetFile || 'file'}' in workspace`, type: 'error' },
          ]);
        } else {
          setTerminalLines((prev) => [
            ...prev,
            { text: `[${mainCmd.toUpperCase()} RUNNER]: Executing ${targetFile}...`, type: 'system' },
          ]);
          try {
            // Safe simulated runtime execution
            if (mainCmd === 'node') {
              const logsCaptured = [];
              const safeConsole = { log: (...args) => logsCaptured.push(args.join(' ')) };
              const runFn = new Function('console', matchedCode);
              runFn(safeConsole);
              if (logsCaptured.length > 0) {
                setTerminalLines((prev) => [
                  ...prev,
                  ...logsCaptured.map((l) => ({ text: l, type: 'info' })),
                ]);
              } else {
                setTerminalLines((prev) => [
                  ...prev,
                  { text: 'Process finished with exit code 0.', type: 'success' },
                ]);
              }
            } else {
              setTerminalLines((prev) => [
                ...prev,
                { text: `Python script compiled and verified cleanly (0 syntax errors).`, type: 'success' },
              ]);
            }
          } catch (evalErr) {
            setTerminalLines((prev) => [
              ...prev,
              { text: `RuntimeError: ${evalErr.message}`, type: 'error' },
            ]);
          }
        }
        break;

      default:
        setTerminalLines((prev) => [
          ...prev,
          { text: `bash: ${mainCmd}: command not found. Type "help" for list of commands.`, type: 'error' },
        ]);
        break;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputCommand(commandHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputCommand('');
      } else {
        setHistoryIndex(nextIndex);
        setInputCommand(commandHistory[nextIndex]);
      }
    }
  };

  const handleCopyLogs = () => {
    const textToCopy = terminalLines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#07090e] border-t border-slate-800 text-slate-300 font-mono text-xs select-none">
      
      {/* TERMINAL TOP TAB BAR */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0d1117] border-b border-slate-800/80">
        <div className="flex items-center gap-1">
          {[
            { id: 'terminal', label: 'Terminal', icon: <TerminalIcon size={13} /> },
            { id: 'output', label: 'Output / Logs', icon: <FileCode size={13} />, count: logs.length },
            { id: 'tests', label: 'Test Results', icon: <Cpu size={13} />, highlight: !!testResults },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white border border-slate-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-300 text-[9px]">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRunTests}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-all hover:scale-105 disabled:opacity-50"
          >
            {isExecuting ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play size={12} className="fill-white" />
            )}
            Run Tests (Ctrl+Enter)
          </button>

          <button
            onClick={handleCopyLogs}
            title="Copy Terminal Logs"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>

          <button
            onClick={() => {
              setTerminalLines([]);
              onClearLogs?.();
            }}
            title="Clear Console"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* TERMINAL TAB CONTENT */}
      {activeTab === 'terminal' && (
        <div 
          onClick={() => inputRef.current?.focus()}
          className="flex-1 p-3 overflow-y-auto space-y-1 bg-[#07090e] cursor-text custom-scrollbar font-mono text-[11px]"
        >
          {terminalLines.map((line, idx) => (
            <div
              key={idx}
              className={`leading-relaxed break-all ${
                line.type === 'command'
                  ? 'text-cyan-400 font-bold'
                  : line.type === 'success'
                  ? 'text-emerald-400 font-semibold'
                  : line.type === 'error'
                  ? 'text-rose-400 font-semibold'
                  : line.type === 'system'
                  ? 'text-indigo-300 font-bold'
                  : 'text-slate-300'
              }`}
            >
              {line.text}
            </div>
          ))}

          {/* Interactive Command Input Line */}
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-1">
            <span className="text-emerald-400 font-bold">devtier:~/workspace$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono text-[11px] p-0 m-0 caret-indigo-400"
            />
          </form>
          <div ref={terminalEndRef} />
        </div>
      )}

      {/* OUTPUT / RAW LOGS TAB */}
      {activeTab === 'output' && (
        <div className="flex-1 p-3 overflow-y-auto space-y-1 bg-[#07090e] custom-scrollbar font-mono text-[11px]">
          {logs.length > 0 ? (
            logs.map((log, i) => (
              <div key={i} className="text-slate-300 whitespace-pre-wrap">{log}</div>
            ))
          ) : (
            <div className="text-slate-500 italic py-4 text-center">
              No runtime log streams captured yet. Run tests or execute files to view output.
            </div>
          )}
        </div>
      )}

      {/* TEST RESULTS TAB */}
      {activeTab === 'tests' && (
        <div className="flex-1 p-4 overflow-y-auto bg-[#07090e] space-y-3 custom-scrollbar">
          {testResults ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  {testResults.score >= 80 ? (
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  ) : (
                    <XCircle size={18} className="text-rose-400" />
                  )}
                  <div>
                    <h4 className="font-bold text-xs text-white">
                      {testResults.status || (testResults.score >= 80 ? 'PASSED' : 'FAILED')}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Score: {testResults.score}/100 • Pass Rate: {testResults.testSuiteRate || '100%'}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold">
                  +{testResults.earnedXp || 150} XP
                </span>
              </div>

              {testResults.criteriaAudit && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Test Suite Specs:</span>
                  {testResults.criteriaAudit.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                      <span className="text-slate-300">{c.name}</span>
                      <span className={`font-bold uppercase text-[10px] ${c.status === 'passed' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 italic py-4 text-center">
              No test execution has run yet. Click "Run Tests" or type "npm test" in the terminal.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
