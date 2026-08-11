import React from 'react';
import { Sparkles, Code2, Cpu, ShieldCheck, Terminal } from 'lucide-react';

/**
 * Auth Sidebar Showcase component (Left column feature highlights)
 */
export default function AuthSidebarShowcase() {
  return (
    <div className="lg:col-span-6 p-8 lg:p-12 bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-purple-950/30 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-6">
          <Sparkles size={14} className="animate-spin" /> Next-Gen Gamified Job Simulation
        </div>

        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
          Level Up Your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Engineering Mastery</span>
        </h1>

        <p className="text-slate-400 text-sm lg:text-base leading-relaxed mb-8">
          Experience real-world job simulations across 4 career tracks, solve Jira tickets, execute sandboxed code, and earn badges.
        </p>
      </div>

      {/* Micro Feature Cards */}
      <div className="space-y-4 my-6">
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md flex items-center gap-4 hover:border-indigo-500/50 transition-all hover:scale-[1.02]">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
            <Code2 size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Real Production Codebases</h4>
            <p className="text-xs text-slate-400">4 Specialization Career Tracks: Frontend, Backend, Full Stack & Data Analyst</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md flex items-center gap-4 hover:border-purple-500/50 transition-all hover:scale-[1.02]">
          <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400">
            <Cpu size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Staff Engineer AI Evaluation</h4>
            <p className="text-xs text-slate-400">AST static analysis & automated security audit reviews</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-4 border-t border-slate-800">
        <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-400" /> HTTP-Only Security</span>
        <span>•</span>
        <span className="flex items-center gap-1.5"><Terminal size={16} className="text-indigo-400" /> 100+ Gamification Badges</span>
      </div>
    </div>
  );
}
