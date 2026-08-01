import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Trophy, Rocket, Code2, Terminal, ArrowRight, ShieldCheck, Flame, Zap, Layers, Server, Play, Search, CheckCircle2, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const userXp = user?.xp || 0;
  const userLevel = user?.level || 1;
  const streakCount = user?.streak?.currentCount || 1;

  // Mock Developer Activity & Quests
  const featuredChallenges = [
    {
      id: 'auth-service',
      title: 'Distributed Auth Microservice',
      type: 'simulation',
      category: 'Backend',
      company: 'CloudTier Corp',
      difficulty: 'Mid-Level',
      xp: 450,
      ticketsCount: 4,
      icon: '🛡️',
      description: 'Implement JWT refresh rotation, rate limiting, and RBAC authorization middleware.',
    },
    {
      id: 'vfs-engine',
      title: 'Virtual File System Parser',
      type: 'simulation',
      category: 'Full Stack',
      company: 'DevScale Studio',
      difficulty: 'Senior',
      xp: 600,
      ticketsCount: 6,
      icon: '📁',
      description: 'Build stream-based ZIP extraction and hierarchical VFS JSON tree parser.',
    },
    {
      id: 'algo-lru',
      title: 'LRU Cache with O(1) Operations',
      type: 'problem',
      category: 'Algorithms',
      company: 'Problem Statement',
      difficulty: 'Medium',
      xp: 200,
      ticketsCount: 1,
      icon: '⚡',
      description: 'Design a Doubly-Linked List + Hash Map LRU cache data structure.',
    },
    {
      id: 'docker-sandbox',
      title: 'Isolated Execution Sandbox Engine',
      type: 'simulation',
      category: 'DevOps',
      company: 'ShadowCoder Core',
      difficulty: 'Lead Architect',
      xp: 800,
      ticketsCount: 5,
      icon: '⚡',
      description: 'Build secure, memory-managed code evaluation runners for production deployment.',
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 p-4 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* TOP BAR: Quick Command Bar & Stats Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-2xl transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xl">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Developer Command Center
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-500/30">
                  Lvl {userLevel}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.track ? `${user.track.toUpperCase()} Track` : 'Full Stack Track'} • {userXp} Cumulative XP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs">
              <Flame size={16} className="text-amber-500 fill-amber-500 animate-pulse" /> {streakCount} Day Streak
            </div>
            
            <button
              onClick={() => navigate('/simulations')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Rocket size={16} /> Explore Scenarios
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {[
              { id: 'all', label: 'All Challenges' },
              { id: 'simulations', label: 'Job Simulations' },
              { id: 'problems', label: 'Problem Statements' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search challenges by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* MAIN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CHALLENGES LISTING (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 size={20} className="text-indigo-600 dark:text-indigo-400" /> Live Challenges Launchpad
              </h3>
              <span className="text-xs text-slate-500 font-semibold">{filteredItems.length} Available</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/50 shadow-sm dark:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                        {item.icon}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        item.difficulty === 'Senior' || item.difficulty === 'Lead Architect'
                          ? 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400'
                          : 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                      }`}>
                        {item.difficulty}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">+{item.xp} XP</span>
                    
                    <button
                      onClick={() => navigate(item.type === 'simulation' ? `/simulations` : `/problems`)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 text-slate-700 dark:text-slate-200 group-hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Play size={14} className="fill-current" /> Start Challenge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDEBAR: COMPETITION LEADERBOARD (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy size={20} className="text-amber-500" /> Global Leaderboard
              </h3>
              <Link to="/leaderboard" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-sm dark:shadow-xl">
              {[
                { rank: 1, name: `${user?.name || 'Shadow Monarch'} (You)`, xp: 25000, streak: 30, avatar: '👑', isCurrentUser: true },
                { rank: 2, name: 'Elena Rostova', xp: 14200, streak: 14, avatar: '👩‍💻' },
                { rank: 3, name: 'Marcus Chen', xp: 11850, streak: 9, avatar: '👨‍💻' },
              ].map((item) => (
                <div
                  key={item.rank}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    item.isCurrentUser
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-200 dark:border-indigo-500/40 text-slate-900 dark:text-white font-bold'
                      : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] ${
                      item.rank === 1 ? 'bg-amber-400 text-slate-950' :
                      item.rank === 2 ? 'bg-slate-300 text-slate-950' : 'bg-slate-800 text-white'
                    }`}>
                      #{item.rank}
                    </span>
                    <span className="text-base">{item.avatar}</span>
                    <span className="text-xs font-bold truncate max-w-[110px]">{item.name}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block">{item.xp} XP</span>
                  </div>
                </div>
              ))}

              <Link
                to="/leaderboard"
                className="w-full mt-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                Climb Rankings <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}