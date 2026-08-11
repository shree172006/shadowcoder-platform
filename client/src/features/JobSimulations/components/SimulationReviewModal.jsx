import React from 'react';
import { CheckCircle, AlertTriangle, ShieldCheck, Terminal, Award } from 'lucide-react';

export default function SimulationReviewModal({ scorecard }) {
  if (!scorecard) return null;

  return (
    <div className="bg-[#0f172a] text-slate-100 p-6 sm:p-8 rounded-3xl border-2 border-slate-800 shadow-2xl space-y-6 animate-in slide-in-from-bottom-4">
      {/* Header Score Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          {scorecard.score >= 80 ? (
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle size={32} />
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle size={32} />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  scorecard.score >= 80
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {scorecard.status}
              </span>
              <span className="text-slate-400 text-xs font-mono font-bold">+ {scorecard.earnedXp} XP Awarded</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              Score: {scorecard.score} <span className="text-slate-500 text-lg font-normal">/ 100</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Staff Engineering Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Rating</span>
          <span className="text-lg font-black text-emerald-400 font-mono">{scorecard.securityRating}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maintainability</span>
          <span className="text-lg font-black text-indigo-400 font-mono">{scorecard.maintainabilityIndex} / 100</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Test Suite</span>
          <span className="text-xs font-black text-amber-400 font-mono mt-1 block">{scorecard.testSuiteRate}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complexity</span>
          <span className="text-xs font-black text-cyan-400 font-mono mt-1 block">{scorecard.complexity}</span>
        </div>
      </div>

      {/* Jira Acceptance Criteria Audit Checklist */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck size={16} className="text-indigo-400" /> Jira Ticket Acceptance Criteria Audit
        </h4>
        <div className="space-y-2">
          {scorecard.criteriaChecks && scorecard.criteriaChecks.map((crit, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <span className="text-slate-300 font-medium">{crit.criterion}</span>
              {crit.passed ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase">Passed</span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-[10px] uppercase">Failed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Senior Staff Feedback */}
      {scorecard.feedback && (
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Terminal size={14} className="text-indigo-400" /> Senior Staff Engineer Code Review
          </h4>
          <p className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
            "{scorecard.feedback}"
          </p>
        </div>
      )}
    </div>
  );
}
