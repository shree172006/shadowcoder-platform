import React, { useState } from 'react';
import { 
  ClipboardList, CheckCircle2, AlertCircle, FileCode, Tag, 
  ExternalLink, Sparkles, HelpCircle, ArrowRight, ShieldCheck, 
  Clock, Flame, Check, Code2 
} from 'lucide-react';

export default function TaskInstructionsPanel({
  scenarioContext,
  title = 'Simulation Challenge',
  subtitle = 'Engineering Sandbox',
  activeFile,
  onOpenFile,
}) {
  const [completedItems, setCompletedItems] = useState(new Set());

  const toggleCheck = (idx) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const defaultCriteria = [
    'Inspect the active codebase files in the file explorer.',
    'Implement the requested logic, concurrency locks, or optimizations.',
    'Execute test suites using the "Run Tests" button or "npm test" in the terminal.',
    'Ensure all acceptance criteria and edge case tests pass with 0 errors.',
  ];

  const criteria = scenarioContext?.acceptanceCriteria || defaultCriteria;
  const ticketId = scenarioContext?.ticketId || 'JIRA-101';
  const priority = scenarioContext?.priority || 'High Priority';
  const keyFile = scenarioContext?.keyFile || (scenarioContext?.files ? Object.keys(scenarioContext.files)[0] : null);

  return (
    <div className="h-full flex flex-col bg-[#0b0e14] text-slate-200 overflow-hidden select-none font-sans text-xs">
      
      {/* HEADER: JIRA TICKET TITLE & BADGES */}
      <div className="p-4 bg-[#080b11] border-b border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-mono font-bold text-[10px]">
              {ticketId}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-[10px] uppercase">
              {priority}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold">Production Bug</span>
        </div>

        <div>
          <h2 className="text-sm font-black text-white leading-snug tracking-tight">
            {title}
          </h2>
          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
            {subtitle}
          </span>
        </div>
      </div>

      {/* BODY: SCROLLABLE INSTRUCTIONS & REQUIREMENTS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        
        {/* SCENARIO BACKGROUND */}
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ClipboardList size={13} className="text-indigo-400" /> Scenario Context
          </span>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/90 text-slate-300 leading-relaxed text-[11px]">
            {scenarioContext?.description || (
              <p>
                A critical production bug has been assigned to your team. Analyze the codebase, identify the root cause, and implement the fix without breaking existing contracts.
              </p>
            )}
          </div>
        </div>

        {/* KEY FILE JUMP BUTTON */}
        {keyFile && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileCode size={13} className="text-amber-400" /> Primary Target File
            </span>
            <button
              onClick={() => onOpenFile?.(keyFile)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 text-amber-300 font-mono text-xs font-bold transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 truncate">
                <Code2 size={14} className="text-amber-400" />
                <span className="truncate">{keyFile}</span>
              </div>
              <span className="text-[10px] uppercase font-sans font-extrabold text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Open in Editor <ArrowRight size={11} />
              </span>
            </button>
          </div>
        )}

        {/* ACCEPTANCE CRITERIA CHECKLIST */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" /> Acceptance Criteria
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {completedItems.size}/{criteria.length} Done
            </span>
          </div>

          <div className="space-y-2">
            {criteria.map((item, idx) => {
              const isChecked = completedItems.has(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-700 bg-slate-800'
                    }`}
                  >
                    {isChecked && <Check size={11} strokeWidth={3} />}
                  </div>
                  <span className={`text-[11px] leading-relaxed ${isChecked ? 'line-through opacity-80' : ''}`}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ARCHITECTURE HINTS & TIPS */}
        {scenarioContext?.hints && scenarioContext.hints.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles size={13} className="text-purple-400" /> Architecture Hints
            </span>
            <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-[11px] text-purple-200/90 leading-relaxed space-y-1.5">
              {scenarioContext.hints.map((hint, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{hint}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FOOTER SHORTCUT HINT */}
      <div className="p-3 bg-[#080b11] border-t border-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-between">
        <span>Run Tests: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-bold">Ctrl+Enter</kbd></span>
        <span>Toggle Panel: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-bold">Ctrl+B</kbd></span>
      </div>

    </div>
  );
}
