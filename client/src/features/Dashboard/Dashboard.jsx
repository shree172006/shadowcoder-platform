import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Rocket, Flame, ArrowRight, Search, ShieldCheck, Trophy, 
  BookOpen, Briefcase, FileCode, CheckCircle2, Zap, Sparkles, 
  ExternalLink, Code2, Award, Brain, Target 
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

  // Hunter Tier computation
  const hunterTier = userLevel >= 8 || userXp >= 1500
    ? { title: 'Pro Hunter (Apex)', badge: '🏆 Pro Hunter Pack', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' }
    : userLevel >= 4 || userXp >= 500
    ? { title: 'Hunter (Standard)', badge: '⚔️ Hunter Rank', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' }
    : { title: 'Porter (Apprentice)', badge: '📦 Porter Tier', color: 'text-slate-400 bg-slate-800 border-slate-700' };

  const featuredChallenges = [
    {
      id: 'sim-be-01',
      title: 'Resolve Payment Desync & Mutex Lock',
      type: 'simulation',
      category: 'Backend',
      company: 'Fintech Cloud Corp',
      difficulty: 'Mid-Level',
      xp: 300,
      description: 'A race condition causes cart totals to desync under high concurrent traffic. Implement a thread-safe mutex lock with 409 Conflict error boundaries.',
    },
    {
      id: 'sim-fe-01',
      title: 'React UI Performance & Re-render Bottleneck',
      type: 'simulation',
      category: 'Frontend',
      company: 'NextGen Analytics',
      difficulty: 'Junior',
      xp: 250,
      description: 'A dashboard component re-renders 500+ times per keystroke due to unmemoized object allocations. Refactor with useMemo and useCallback.',
    },
    {
      id: 'sim-fs-01',
      title: 'Virtual File System & Stream ZIP Parser',
      type: 'simulation',
      category: 'Full Stack',
      company: 'CloudTier IDE Engine',
      difficulty: 'Senior',
      xp: 500,
      description: 'Build a stream-based ZIP extractor and virtual file system (VFS) tree builder connecting Node.js streams to a React editor.',
    },
    {
      id: 'prob-be-01',
      title: 'O(1) LRU Cache Implementation',
      type: 'problem',
      category: 'Algorithms',
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
    <div className="min-h-screen bg-[#07090e] text-slate-100 p-4 lg:p-8 transition-colors duration-300 select-none font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TOP COMMAND BAR */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[#0b0f19] border-2 border-indigo-500/20 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-600/30 shrink-0">
              <div className="w-full h-full bg-[#0d111a] rounded-[14px] flex items-center justify-center font-black text-2xl text-white font-mono">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Welcome back, {displayName}
                </h1>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase border ${hunterTier.color}`}>
                  {hunterTier.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold border border-indigo-500/30">
                  Level {userLevel}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 flex-wrap">
                <span>{user?.track ? `${user.track.toUpperCase()} Track` : 'Full Stack Track'}</span>
                <span>•</span>
                <span className="text-amber-400 font-mono font-bold">+{userXp} XP Cumulative</span>
                <span>•</span>
                <Link
                  to={`/u/${usernameSlug}`}
                  className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition-colors"
                >
                  View Public Portfolio <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs font-mono">
              <Flame size={16} className="fill-amber-400 animate-pulse" /> {streakCount} Day Streak
            </div>
            
            <button
              onClick={() => navigate('/simulations')}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <Rocket size={16} /> Launch DevStudio
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* QUICK PROGRESS & ROADMAP CONTINUE CARDS */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={16} className="text-indigo-400" /> Syllabus Roadmaps
              </span>
              <span className="text-[10px] text-indigo-400 font-mono font-bold">Interactive 2D</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Full-Stack & Backend Roadmaps</h3>
              <p className="text-xs text-slate-400 mt-0.5">Explore 5 specialized tracks with live code playbooks.</p>
            </div>
            <Link
              to="/learn"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              Open Roadmaps Catalog <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-5 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase size={16} className="text-emerald-400" /> DevStudio Simulations
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">VS Code Engine</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Production Jira Tickets</h3>
              <p className="text-xs text-slate-400 mt-0.5">{ticketsSolvedCount} simulations passed with verified audit.</p>
            </div>
            <Link
              to="/simulations"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              Explore Job Simulations <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-5 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy size={16} className="text-amber-400" /> Hunter Leaderboard
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">Live Rankings</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Global Developer Standings</h3>
              <p className="text-xs text-slate-400 mt-0.5">Compete with engineers worldwide for the S-Rank Monarch.</p>
            </div>
            <Link
              to="/leaderboard"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              View Global Leaderboard <ArrowRight size={13} />
            </Link>
          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* CHALLENGE WORKSPACE CATALOG */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {[
                { id: 'all', label: 'All Challenges' },
                { id: 'simulations', label: 'Job Simulations' },
                { id: 'problems', label: 'Problem Statements' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-4 hover:border-indigo-500/50 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold">
                      + {item.xp} XP
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block">{item.company}</span>
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-indigo-400 transition-colors mt-0.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                  <span className="font-bold text-slate-400 font-mono">{item.difficulty}</span>
                  <button
                    onClick={() => navigate(item.type === 'simulation' ? `/task/${item.id}` : `/problem/${item.id}`)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-slate-800 hover:border-indigo-600"
                  >
                    Open DevStudio <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}