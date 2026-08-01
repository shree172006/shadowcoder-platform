import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Trophy, Rocket, Code2, Terminal, ArrowRight, ShieldCheck, Flame, Zap, Layers, Server, Play, Search, CheckCircle2, Sparkles, AlertTriangle, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dailyQuestClaimed, setDailyQuestClaimed] = useState(false);

  const userXp = user?.xp || 0;
  const userLevel = user?.level || 1;
  const streakCount = user?.streak?.currentCount || 1;

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 p-4 lg:p-8 transition-colors duration-300 select-none">
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

        {/* DAILY QUEST COMPULSION & XP PENALTY BANNER */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border-2 border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-wider">
              <Clock size={18} /> Daily Compulsion Quest Active • Resets at Midnight
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Complete 1 Job Simulation or Pass 1 Learn Test Today
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-rose-500 shrink-0" />
              <span>Penalty Warning: Missing your daily task incurs a <strong className="text-rose-500">-50 XP Penalty</strong> & resets streak to 0!</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {dailyQuestClaimed ? (
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Daily Quest Complete (+100 XP)
              </span>
            ) : (
              <button
                onClick={() => {
                  setDailyQuestClaimed(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Zap size={16} className="fill-slate-950" /> Claim Daily Quest (+100 XP)
              </button>
            )}
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
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* CHALLENGE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 space-y-4 hover:border-indigo-500/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                  + {item.xp} XP
                </span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{item.company}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <span className="font-bold text-slate-600 dark:text-slate-400">{item.difficulty}</span>
                <button
                  onClick={() => navigate(item.type === 'simulation' ? `/task/${item.id}` : `/problem/${item.id}`)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  Start Task <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}