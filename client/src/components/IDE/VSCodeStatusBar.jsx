import React from 'react';
import { 
  GitBranch, AlertCircle, CheckCircle2, Terminal, Bell, Cpu, 
  Settings2, Code2, Wifi, WifiOff 
} from 'lucide-react';
import { getMonacoLanguage } from './fileUtils.jsx';

export default function VSCodeStatusBar({
  activeFile = '',
  cursorPos = { line: 1, column: 1 },
  branchName = 'main',
  isConnected = true,
  errorCount = 0,
  warningCount = 0,
  onToggleTerminal,
}) {
  const language = getMonacoLanguage(activeFile);

  const displayLanguage = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python 3.12',
    json: 'JSON',
    html: 'HTML5',
    css: 'CSS3',
    sql: 'PostgreSQL',
    markdown: 'Markdown',
  }[language] || 'Plain Text';

  return (
    <div className="h-6 w-full bg-[#181824] border-t border-slate-800/80 text-slate-400 px-3 flex items-center justify-between text-[11px] font-mono select-none">
      
      {/* LEFT STATUS SECTION */}
      <div className="flex items-center gap-3">
        {/* Branch */}
        <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
          <GitBranch size={12} className="text-indigo-400" />
          <span>{branchName}</span>
        </div>

        {/* Sync Status */}
        <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
          {isConnected ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400">
              <WifiOff size={11} /> Offline
            </span>
          )}
        </div>

        {/* Errors & Warnings */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-slate-400 hover:text-rose-400 cursor-pointer">
            <AlertCircle size={11} /> {errorCount}
          </span>
          <span className="flex items-center gap-1 text-slate-400 hover:text-amber-400 cursor-pointer">
            <span className="text-[10px]">▲</span> {warningCount}
          </span>
        </div>
      </div>

      {/* RIGHT STATUS SECTION */}
      <div className="flex items-center gap-3">
        {/* Toggle Terminal Quick Button */}
        <button
          onClick={onToggleTerminal}
          className="flex items-center gap-1 text-slate-400 hover:text-indigo-300 transition-colors"
        >
          <Terminal size={11} /> Terminal
        </button>

        {/* Line & Column */}
        <div className="hover:text-white cursor-pointer transition-colors">
          Ln {cursorPos.line}, Col {cursorPos.column}
        </div>

        {/* Indent Spaces */}
        <div className="hover:text-white cursor-pointer transition-colors">
          Spaces: 2
        </div>

        {/* Encoding */}
        <div className="hover:text-white cursor-pointer transition-colors">
          UTF-8
        </div>

        {/* Language Mode */}
        <div className="flex items-center gap-1 text-indigo-400 font-bold hover:text-indigo-300 cursor-pointer transition-colors">
          <Code2 size={11} /> {displayLanguage}
        </div>
      </div>

    </div>
  );
}
