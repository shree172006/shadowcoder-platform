import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Flame, ArrowRight, Search, ShieldCheck, Trophy, 
  BookOpen, Briefcase, FileCode, CheckCircle2, Zap, 
  Code2, Award, Brain, Target, GitBranch, ExternalLink,
  ChevronRight, Star, Activity 
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const userXp = user?.xp || 0;
  const userLevel = user?.level || 1;
  const streakCount = user?.streakDays || user?.streak?.currentCount || 1;
  const ticketsSolvedCount = user?.completedScenarios?.length || 0;
  const displayName = user?.name || user?.email?.split('@')[0] || 'Developer';
  const usernameSlug = displayName.toLowerCase().replace(/[^a-z0-9]/g, '-');

  // Professional Executive Hunter Ratings
  const hunterTier = userLevel >= 8 || userXp >= 3500
    ? { title: 'Apex Shadow Architect', tier: 'Tier S', badge: 'Tier S • Apex', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' }
    : userLevel >= 5 || userXp >= 1500
    ? { title: 'Senior Staff Hunter', tier: 'Tier A', badge: 'Tier A • Staff', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' }
    : userLevel >= 2 || userXp >= 500
    ? { title: 'Specialist Hunter', tier: 'Tier B', badge: 'Tier B • Specialist', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' }
    : { title: 'Apprentice Engineer', tier: 'Tier C', badge: 'Tier C • Apprentice', color: 'text-slate-400 bg-slate-800 border-slate-700' };

  // Next Rank XP Calculation
  const nextTierGoal = userXp >= 3500 ? 5000 : userXp >= 1500 ? 3500 : userXp >= 500 ? 1500 : 500;
  const xpProgressPercent = Math.min(100, Math.round((userXp / nextTierGoal) * 100));

  const featuredChallenges = [
    {
      id: 'sim-be-01',
      title: 'Resolve Payment Desync & Mutex Lock',
      type: 'simulation',
      category: 'Backend Architecture',
      company: 'Fintech Cloud Corp',
      difficulty: 'Mid-Level',
      xp: 300,
      description: 'A race condition causes cart totals to desync under high concurrent traffic. Implement a thread-safe mutex lock with 409 Conflict error boundaries.',
    },
    {
      id: 'sim-fe-01',
      title: 'React UI Performance & Re-render Bottleneck',
      type: 'simulation',
      category: 'Frontend Engineering',
      company: 'NextGen Analytics',
      difficulty: 'Junior',
      xp: 250,
      description: 'A dashboard component re-renders 500+ times per keystroke due to unmemoized object allocations. Refactor with useMemo and useCallback.',
    },
    {
      id: 'sim-fs-01',
      title: 'Virtual File System & Stream ZIP Parser',
      type: 'simulation',
      category: 'Full Stack Systems',
      company: 'CloudTier IDE Engine',
      difficulty: 'Senior',
      xp: 500,
      description: 'Build a stream-based ZIP extractor and virtual file system (VFS) tree builder connecting Node.js streams to a React editor.',
    },
    {
      id: 'prob-be-01',
      title: 'O(1) LRU Cache Implementation',
      type: 'problem',
      category: 'Core Algorithms',
      company: 'Problem Statement',
      difficulty: 'Medium',
      xp: 300,
      description: 'Design a Doubly-Linked List + Hash Map LRU cache data structure with O(1) read and write performance.',
    },
  ];

  const filteredItems = featuredChallenges.filter((item) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'simulations' && item.type === 'simulation') ||
      (activeTab === 'problems' && item.type === 'problem');
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans select-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ═══════════════════════════════════════════════════════ */}
        {/* EXECUTIVE DEVELOPER HUD */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0e14] border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-center font-mono font-bold text-xl text-white shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {displayName}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${hunterTier.color}`}>
                  {hunterTier.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>{hunterTier.title}</span>
                <span>•</span>
                <span className="font-mono text-slate-500">Level {userLevel}</span>
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-6 sm:gap-8 border-t lg:border-t-0 border-slate-800 pt-4 lg:pt-0 w-full lg:w-auto justify-between lg:justify-end">
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">XP Rating</span>
              <span className="text-lg font-bold font-mono text-indigo-400 tabular-nums">{userXp.toLocaleString()} XP</span>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Streak</span>
              <span className="text-lg font-bold font-mono text-amber-400 flex items-center gap-1 tabular-nums">
                <Flame size={16} className="fill-amber-400" /> {streakCount} Days
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Solved</span>
              <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">{ticketsSolvedCount} PRs</span>
            </div>

            <Link
              to={`/u/${usernameSlug}`}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-750 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              Public Portfolio <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* XP Progress Bar to Next Rank */}
        <div className="p-4 rounded-xl bg-[#0b0e14] border border-slate-850 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              Rank Progression: <span className="text-slate-200 font-bold">{userXp} / {nextTierGoal} XP</span>
            </span>
            <span className="text-indigo-400 font-bold">{xpProgressPercent}% to next rank</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-indigo-600 transition-all duration-500 rounded-full"
              style={{ width: `${xpProgressPercent}%` }}
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ACTIVE ROADMAP QUICK ACCESS */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#0b0e14] border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-indigo-400">Current Roadmap</span>
              <h3 className="text-sm font-bold text-white mt-1">JavaScript Core & Concurrency</h3>
              <p className="text-xs text-slate-400 mt-1">Module 1: Closures & Lexical Scope</p>
            </div>
            <Link
              to="/learn/javascript"
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Continue Learning <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-5 rounded-xl bg-[#0b0e14] border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-400">Job Simulation</span>
              <h3 className="text-sm font-bold text-white mt-1">Payment Desync & Mutex</h3>
              <p className="text-xs text-slate-400 mt-1">Ticket PAY-104 • Critical Blocker</p>
            </div>
            <Link
              to="/task/sim-be-01"
              className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-200 font-medium text-xs text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Open DevStudio IDE <Code2 size={13} />
            </Link>
          </div>

          <div className="p-5 rounded-xl bg-[#0b0e14] border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-amber-400">Certifications</span>
              <h3 className="text-sm font-bold text-white mt-1">Cryptographic Badges</h3>
              <p className="text-xs text-slate-400 mt-1">Export verified proof-of-work to GitHub</p>
            </div>
            <Link
              to="/achievements"
              className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-200 font-medium text-xs text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              View Badges <Award size={13} />
            </Link>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* WORKPLACE CHALLENGES CATALOG */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Challenges
              </button>
              <button
                onClick={() => setActiveTab('simulations')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'simulations' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Job Simulations
              </button>
              <button
                onClick={() => setActiveTab('problems')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'problems' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Problem Statements
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter challenges..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#0b0e14] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* List of Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-[#0b0e14] border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] font-bold text-indigo-400 uppercase">{item.category}</span>
                    <span className="font-mono font-bold text-amber-400 text-xs">+{item.xp} XP</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">{item.difficulty} • {item.company}</span>
                  <Link
                    to={item.type === 'simulation' ? `/task/${item.id}` : `/problems/${item.id}`}
                    className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    Open Workspace <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}