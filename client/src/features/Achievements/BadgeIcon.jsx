import React from 'react';
import { 
  Rocket, Briefcase, Building, Crown, Sprout, Zap, Flame, Diamond, 
  Terminal, Server, Code2, Database, ShieldCheck, Bug, Timer, 
  GitPullRequest, Compass, Star, Award, Layers, Cpu, Sparkles, 
  Crosshair, Lock, Activity, Binary, Network, Radio, Box 
} from 'lucide-react';

/**
 * Returns a sleek, high-grade SVG Crest/Emblem for every badge ID instead of raw emojis.
 */
export default function BadgeIcon({ badgeId = '', size = 20, isLocked = false, className = '' }) {
  const iconProps = {
    size,
    className: `${isLocked ? 'text-slate-500' : ''} ${className}`,
  };

  switch (badgeId) {
    // --- JOB SIMULATIONS ---
    case 'sim_first':
      return <Rocket {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-cyan-400'}`} />;
    case 'sim_5':
      return <Briefcase {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-blue-400'}`} />;
    case 'sim_10':
      return <Building {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-indigo-400'}`} />;
    case 'sim_lead':
      return <Crown {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-amber-400'}`} />;

    // --- STACK MASTERY ---
    case 'track_junior':
      return <Sprout {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-emerald-400'}`} />;
    case 'track_mid':
      return <Zap {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-amber-400'}`} />;
    case 'track_senior':
      return <Flame {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-rose-400'}`} />;
    case 'track_monarch':
      return <Diamond {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-purple-400'}`} />;
    case 'stack_node_1':
      return <Server {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-emerald-400'}`} />;
    case 'stack_node_2':
      return <Cpu {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-amber-400'}`} />;
    case 'stack_react_1':
      return <Code2 {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-cyan-400'}`} />;
    case 'stack_react_2':
      return <Sparkles {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-purple-400'}`} />;
    case 'stack_db_1':
      return <Database {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-emerald-400'}`} />;
    case 'stack_db_2':
      return <Layers {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-rose-400'}`} />;

    // --- TICKETS & DEBUGGING ---
    case 'ticket_1':
      return <Bug {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-emerald-400'}`} />;
    case 'ticket_10':
      return <ShieldCheck {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-blue-400'}`} />;
    case 'ticket_25':
      return <Crosshair {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-purple-400'}`} />;
    case 'speed_solve':
      return <Timer {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-amber-400'}`} />;
    case 'pr_approved':
      return <GitPullRequest {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-emerald-400'}`} />;
    case 'pr_10_approved':
      return <Award {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-cyan-400'}`} />;

    // --- STREAKS & DAILY ---
    case 'streak_3':
      return <Flame {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-amber-400'}`} />;
    case 'streak_7':
      return <Flame {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-orange-400'}`} />;
    case 'streak_30':
      return <Star {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-amber-400'}`} />;
    case 'streak_100':
      return <Sparkles {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-rose-400'}`} />;
    case 'daily_1':
      return <Target {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-blue-400'}`} />;
    case 'daily_7':
      return <Award {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-purple-400'}`} />;

    // --- MILESTONES & RANKS ---
    case 'lvl_5':
      return <Star {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-slate-300'}`} />;
    case 'lvl_15':
      return <Star {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-cyan-400'}`} />;
    case 'lvl_30':
      return <Award {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-indigo-400'}`} />;
    case 'lvl_50':
      return <Crown {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-amber-400'}`} />;
    case 'xp_1k':
      return <Zap {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-amber-400'}`} />;
    case 'xp_5k':
      return <Zap {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-cyan-400'}`} />;
    case 'xp_10k':
      return <Diamond {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-purple-400'}`} />;

    // --- CODE QUALITY & SECURITY ---
    case 'audit_perfect':
      return <ShieldCheck {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-emerald-400'}`} />;
    case 'audit_sec_a':
      return <ShieldCheck {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-blue-400'}`} />;
    case 'audit_zero_smell':
      return <Cpu {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-amber-400'}`} />;

    default:
      return <Award {...iconProps} className={`${isLocked ? 'text-slate-500' : 'text-indigo-400'}`} />;
  }
}
