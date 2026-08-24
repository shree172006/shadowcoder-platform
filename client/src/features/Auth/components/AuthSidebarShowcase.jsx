import React from 'react';
import { ShieldCheck, Terminal, Code2, Cpu, Check, GitBranch } from 'lucide-react';

/**
 * Auth Sidebar Showcase component (Linear-grade clean developer highlights)
 */
export default function AuthSidebarShowcase() {
  return (
    <div className="lg:col-span-6 p-8 lg:p-12 bg-slate-50 dark:bg-[#07090e] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <img 
            src="/shadowcoder-logo.png" 
            alt="ShadowCoder" 
            className="w-8 h-8 rounded-lg border border-slate-700/50 object-cover" 
          />
          <span className="font-bold text-base text-slate-900 dark:text-white font-mono tracking-tight">
            ShadowCoder
          </span>
        </div>

        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Master Production Software Engineering
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Move beyond toy algorithm quizzes. Debug real multi-file codebases, pass automated AST code quality audits, and build verified proof-of-work.
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
              <Check size={12} strokeWidth={3} />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">Multi-File Workplace Repositories:</span> Practice real Jira tickets, mutex concurrency, and architectural refactoring.
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
              <Check size={12} strokeWidth={3} />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">AI Senior Staff Code Reviews:</span> Automated line-by-line PR feedback powered by Gemini and AST rule engines.
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
              <Check size={12} strokeWidth={3} />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">1-Click GitHub Verified Exporter:</span> Export clean solved repositories with verified recruiter badges.
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-6 border-t border-slate-200 dark:border-slate-800 font-mono">
        <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Cryptographically Verified</span>
        <span>•</span>
        <span>4 Specialized Tracks</span>
      </div>
    </div>
  );
}
