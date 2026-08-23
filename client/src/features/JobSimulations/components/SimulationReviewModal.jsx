import React, { useState } from 'react';
import { 
  CheckCircle, AlertTriangle, ShieldCheck, Terminal, Award, 
  Download, Sparkles, X, ArrowRight, RefreshCw, Brain 
} from 'lucide-react';
import GitHubExportModal from '../../../components/IDE/GitHubExportModal.jsx';
import AiReviewModal from '../../../components/IDE/AiReviewModal.jsx';

// Inline GitHub SVG Icon
const GithubIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function SimulationReviewModal({
  isOpen = true,
  onClose,
  scorecard,
  onRetry,
  files = {},
  scenarioTitle = 'Job Simulation Task',
  scenarioRole = 'Software Engineer',
  difficulty = 'Mid-Level',
}) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAiReviewModalOpen, setIsAiReviewModalOpen] = useState(false);

  if (!isOpen || !scorecard) return null;

  const isPass = scorecard.score >= 80;

  // Compute Hunter Tier based on score
  const hunterTier = scorecard.score >= 80 
    ? { title: 'Pro Hunter (Apex)', badge: '🏆 Pro Hunter Pack', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' }
    : scorecard.score >= 50
    ? { title: 'Hunter (Standard)', badge: '⚔️ Hunter Rank', color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' }
    : { title: 'Porter (Apprentice)', badge: '📦 Porter Tier', color: 'text-slate-400 border-slate-700 bg-slate-800/40' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in select-none font-sans">
      <div className="bg-[#0f172a] text-slate-100 p-6 sm:p-8 rounded-3xl border-2 border-slate-800 max-w-3xl w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* HEADER SCORE BANNER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            {isPass ? (
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle size={32} />
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertTriangle size={32} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isPass
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {scorecard.status}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${hunterTier.color}`}>
                  {hunterTier.badge}
                </span>
                <span className="text-slate-400 text-xs font-mono font-bold">+ {scorecard.earnedXp} XP Awarded</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                Audit Score: {scorecard.score} <span className="text-slate-500 text-lg font-normal">/ 100</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 1-CLICK GITHUB EXPORT & AI REVIEW BANNER */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-indigo-600/10">
          <div>
            <span className="text-xs font-black text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Brain size={16} className="text-purple-400" /> AI Staff Review & Verified Export
            </span>
            <p className="text-slate-300 text-xs mt-0.5">
              Request line-by-line Gemini AI review or export your verified repository to GitHub.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsAiReviewModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all hover:scale-105 shrink-0 cursor-pointer"
            >
              <Sparkles size={14} /> AI Code Review
            </button>

            {isPass && (
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all hover:scale-105 shrink-0 cursor-pointer"
              >
                <GithubIcon size={14} /> Export Repo
              </button>
            )}
          </div>
        </div>

        {/* STAFF ENGINEERING METRICS GRID */}
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

        {/* JIRA CRITERIA AUDIT CHECKLIST */}
        {scorecard.criteriaAudit && scorecard.criteriaAudit.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-400" /> Acceptance Criteria Audit
            </h4>
            <div className="space-y-2">
              {scorecard.criteriaAudit.map((crit, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <span className="text-slate-300 font-medium">{crit.name}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                    crit.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {crit.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SENIOR STAFF FEEDBACK */}
        {scorecard.feedback && (
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Terminal size={14} className="text-indigo-400" /> Senior Staff Engineer Code Review
            </h4>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed space-y-1">
              {Array.isArray(scorecard.feedback) ? (
                scorecard.feedback.map((f, i) => <div key={i}>• {f}</div>)
              ) : (
                <p>"{scorecard.feedback}"</p>
              )}
            </div>
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} /> Back to DevStudio Editor
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAiReviewModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/20"
            >
              <Sparkles size={14} /> AI Review
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>

      {/* GITHUB EXPORT MODAL */}
      <GitHubExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        scenarioTitle={scenarioTitle}
        scenarioRole={scenarioRole}
        difficulty={difficulty}
        files={files}
        scorecard={scorecard}
      />

      {/* AI CODE REVIEW MODAL */}
      <AiReviewModal
        isOpen={isAiReviewModalOpen}
        onClose={() => setIsAiReviewModalOpen(false)}
        files={files}
        scenarioTitle={scenarioTitle}
        scenarioRole={scenarioRole}
        difficulty={difficulty}
        testResults={scorecard}
      />
    </div>
  );
}
