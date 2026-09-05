import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Flame, Search, ShieldCheck, Trophy, 
  BookOpen, Briefcase, FileCode, CheckCircle2,
  Code2, ExternalLink, ChevronRight 
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const userXp = user?.xp || 0;
  const userLevel = user?.level || 1;
  const streakCount = user?.streakDays || user?.streak?.currentCount || 1;
  const ticketsSolvedCount = user?.completedScenarios?.length || 0;
  const displayName = user?.name || user?.email?.split('@')[0] || 'Developer';
  const usernameSlug = displayName.toLowerCase().replace(/[^a-z0-9]/g, '-');

  const challenges = [
    {
      id: 'sim-be-01',
      title: 'Resolve Payment Desync & Mutex Lock',
      type: 'simulation',
      category: 'Backend',
      difficulty: 'Mid-Level',
      xp: 300,
      description: 'Implement a thread-safe mutex lock with 409 Conflict error boundaries to prevent race conditions during checkout.',
    },
    {
      id: 'sim-fe-01',
      title: 'React UI Performance & Re-render Bottleneck',
      type: 'simulation',
      category: 'Frontend',
      difficulty: 'Junior',
      xp: 250,
      description: 'Eliminate 500+ unnecessary component re-renders per keystroke using useMemo and useCallback hooks.',
    },
    {
      id: 'sim-fs-01',
      title: 'Virtual File System & Stream ZIP Parser',
      type: 'simulation',
      category: 'Full Stack',
      difficulty: 'Senior',
      xp: 500,
      description: 'Build a stream-based ZIP extractor and virtual file system (VFS) tree builder connecting Node.js streams to a React editor.',
    },
    {
      id: 'prob-be-01',
      title: 'O(1) LRU Cache Implementation',
      type: 'problem',
      category: 'Algorithms',
      difficulty: 'Medium',
      xp: 300,
      description: 'Design a Doubly-Linked List + Hash Map LRU cache data structure with O(1) read and write performance.',
    },
  ];

  const filteredItems = challenges.filter((item) => {
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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 sm:p-6 lg:p-8 font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* USER STATS HEADER */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {displayName}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Level {userLevel} • {user?.track || 'Full Stack'} Track
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-zinc-500 block">Total XP</span>
              <span className="text-sm font-bold text-indigo-400">{userXp} XP</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Streak</span>
              <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                <Flame size={14} className="fill-amber-400" /> {streakCount} Days
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block">Solved</span>
              <span className="text-sm font-bold text-emerald-400">{ticketsSolvedCount} Tasks</span>
            </div>
            <Link
              to={`/u/${usernameSlug}`}
              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
            >
              Profile <ExternalLink size={11} />
            </Link>
          </div>
        </div>

        {/* QUICK SHORTCUTS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/simulations"
            className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-white block">Job Simulations</span>
              <span className="text-[11px] text-zinc-400">Production workplace tasks</span>
            </div>
            <Briefcase size={18} className="text-blue-400" />
          </Link>

          <Link
            to="/problems"
            className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-white block">Problem Statements</span>
              <span className="text-[11px] text-zinc-400">Data structures & algorithms</span>
            </div>
            <FileCode size={18} className="text-emerald-400" />
          </Link>

          <Link
            to="/learn"
            className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-white block">Learn Roadmaps</span>
              <span className="text-[11px] text-zinc-400">Structured skill courses</span>
            </div>
            <BookOpen size={18} className="text-amber-400" />
          </Link>
        </div>

        {/* CHALLENGES LIST */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('simulations')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'simulations' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Simulations
              </button>
              <button
                onClick={() => setActiveTab('problems')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'problems' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Problems
              </button>
            </div>

            <div className="relative w-full sm:w-56">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-indigo-400 font-medium">{item.category}</span>
                    <span className="font-mono text-zinc-400 text-xs">+{item.xp} XP</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono text-[11px]">{item.difficulty}</span>
                  <Link
                    to={item.type === 'simulation' ? `/task/${item.id}` : `/problems/${item.id}`}
                    className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    Open <ChevronRight size={13} />
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