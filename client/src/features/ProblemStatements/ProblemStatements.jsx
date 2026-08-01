import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Cpu, Layout, Server, ChevronRight, Star, Plus, Edit3, Trash2, ShieldCheck, Filter, PieChart, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminConsoleModal from '../../components/AdminConsoleModal.jsx';

const INITIAL_PROBLEM_DATA = [
  // 1. FRONTEND TRACK
  {
    id: 'prob-fe-01',
    title: 'Responsive CSS Grid & Breakpoint Engine',
    category: 'UI / UX',
    track: 'frontend',
    role: 'Frontend',
    difficulty: 'Easy',
    xp: 150,
    icon: <Layout className="text-pink-500 dark:text-pink-400" size={24} />,
    description: 'Build a dynamic grid layout that automatically computes column tracks based on viewport width without triggering layout reflows.',
  },
  {
    id: 'prob-fe-02',
    title: 'DOM Event Debouncing & Throttling',
    category: 'JavaScript',
    track: 'frontend',
    role: 'Frontend',
    difficulty: 'Medium',
    xp: 250,
    icon: <Cpu className="text-[#38bdf8]" size={24} />,
    description: 'Implement leading & trailing edge debounce and throttle wrapper functions for high-frequency input handlers.',
  },

  // 2. BACKEND TRACK
  {
    id: 'prob-be-01',
    title: 'O(1) LRU Cache Implementation',
    category: 'Data Structures',
    track: 'backend',
    role: 'Backend',
    difficulty: 'Medium',
    xp: 300,
    icon: <Server className="text-purple-500 dark:text-purple-400" size={24} />,
    description: 'Design a Least Recently Used (LRU) cache using a Doubly-Linked List and Hash Map with O(1) time complexity for get() and put().',
  },
  {
    id: 'prob-be-02',
    title: 'Token Bucket API Rate Limiter',
    category: 'Systems Design',
    track: 'backend',
    role: 'Backend',
    difficulty: 'Hard',
    xp: 450,
    icon: <ShieldCheck className="text-blue-500 dark:text-blue-400" size={24} />,
    description: 'Implement a thread-safe token bucket rate limiter algorithm restricting client requests to 100 req/min.',
  },

  // 3. FULL STACK TRACK
  {
    id: 'prob-fs-01',
    title: 'Real-Time Pub/Sub Event Bus',
    category: 'Systems Design',
    track: 'fullstack',
    role: 'Full Stack',
    difficulty: 'Hard',
    xp: 500,
    icon: <Layers className="text-amber-500 dark:text-amber-400" size={24} />,
    description: 'Architect an in-memory publish-subscribe event emitter with pattern matching, topic wildcards, and automatic dead-letter queueing.',
  },
  {
    id: 'prob-fs-02',
    title: 'Database 3NF Schema Normalization',
    category: 'Databases',
    track: 'fullstack',
    role: 'Full Stack',
    difficulty: 'Medium',
    xp: 280,
    icon: <Server className="text-emerald-500 dark:text-emerald-400" size={24} />,
    description: 'Normalize an un-indexed e-commerce order table into 3rd Normal Form (3NF) to eliminate transitive functional dependencies.',
  },

  // 4. DATA ANALYST TRACK
  {
    id: 'prob-da-01',
    title: 'SQL Window Functions & Cohort Analysis',
    category: 'SQL Analytics',
    track: 'data-analytics',
    role: 'Data Analyst',
    difficulty: 'Medium',
    xp: 320,
    icon: <PieChart className="text-purple-500 dark:text-purple-400" size={24} />,
    description: 'Write a SQL query using ROW_NUMBER() and NTILE(4) to compute monthly customer retention cohorts and median spending.',
  },
  {
    id: 'prob-da-02',
    title: 'CSV Data Normalizer & Outlier Removal',
    category: 'Data Wrangling',
    track: 'data-analytics',
    role: 'Data Analyst',
    difficulty: 'Easy',
    xp: 180,
    icon: <Cpu className="text-emerald-500 dark:text-emerald-400" size={24} />,
    description: 'Parse raw sensor CSV records, filter statistical z-score outliers, and calculate 7-day moving averages.',
  },
];

export default function ProblemStatements() {
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTrack, setActiveTrack] = useState('All');
  const [problems, setProblems] = useState(INITIAL_PROBLEM_DATA);

  // Admin Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    action: 'add',
    item: null,
  });

  const handleOpenAdminModal = (action, item = null) => {
    setModalConfig({
      isOpen: true,
      action,
      item,
    });
  };

  const handleAdminSave = ({ action, data, item, id }) => {
    if (action === 'delete') {
      setProblems((prev) => prev.filter((p) => p.id !== id));
    } else if (action === 'add') {
      const newProb = {
        id: `prob-${Date.now()}`,
        title: data.title,
        category: data.category || 'Algorithms',
        track: data.targetRole || 'fullstack',
        role: 'Full Stack',
        difficulty: data.difficulty,
        xp: data.xpReward || 200,
        icon: <Cpu className="text-indigo-500" size={24} />,
        description: data.description,
      };
      setProblems((prev) => [newProb, ...prev]);
    } else if (action === 'edit' && item) {
      setProblems((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? { ...p, title: data.title, description: data.description, difficulty: data.difficulty }
            : p
        )
      );
    }
  };

  const filteredProblems = problems.filter((prob) => {
    const matchesSearch =
      prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prob.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = activeTrack === 'All' || prob.track === activeTrack;
    return matchesSearch && matchesTrack;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 animate-in fade-in transition-colors duration-300">
      
      {/* Admin Action Bar */}
      {isAdmin && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck size={18} /> Admin Console Active • Problem Statements Control
          </div>
          <button
            onClick={() => handleOpenAdminModal('add')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus size={16} /> Add New Problem Statement
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Cpu className="text-purple-600 dark:text-purple-400" /> Problem Statements
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
            Master algorithms, system design, data structures, and SQL across 4 career tracks.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Career Track Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {[
          { id: 'All', label: 'All Tracks' },
          { id: 'frontend', label: 'Frontend' },
          { id: 'backend', label: 'Backend' },
          { id: 'fullstack', label: 'Full Stack' },
          { id: 'data-analytics', label: 'Data Analyst' },
        ].map((track) => (
          <button
            key={track.id}
            onClick={() => setActiveTrack(track.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTrack === track.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {track.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProblems.map((prob) => (
          <div
            key={prob.id}
            className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-50 dark:bg-[#0d1117] rounded-xl border border-slate-100 dark:border-slate-800">
                  {prob.icon}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                    {prob.difficulty}
                  </span>

                  {isAdmin && (
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                      <button
                        onClick={() => handleOpenAdminModal('edit', prob)}
                        className="p-1 text-slate-500 hover:text-blue-500 transition-colors"
                        title="Edit Problem"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenAdminModal('delete', prob)}
                        className="p-1 text-slate-500 hover:text-rose-500 transition-colors"
                        title="Delete Problem"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {prob.title}
              </h2>

              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                {prob.category} • {prob.role}
              </p>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {prob.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">+{prob.xp} XP</span>

              <Link
                to={`/problem/${prob.id}`}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
              >
                Solve Problem <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Modal */}
      <AdminConsoleModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        type="problem"
        action={modalConfig.action}
        item={modalConfig.item}
        onSave={handleAdminSave}
      />
    </div>
  );
}