import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Cpu, Layout, Server, ChevronRight, Star, Plus, Edit3, Trash2, ShieldCheck, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminConsoleModal from '../../components/AdminConsoleModal.jsx';

const INITIAL_PROBLEM_DATA = [
  {
    id: 'prob-001',
    title: 'LRU Cache Implementation',
    category: 'Data Structures',
    role: 'Backend',
    difficulty: 'Medium',
    xp: 300,
    icon: <Cpu className="text-purple-500 dark:text-purple-400" size={24} />,
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
  },
  {
    id: 'prob-002',
    title: 'Responsive Grid Layout',
    category: 'UI/UX',
    role: 'Frontend',
    difficulty: 'Medium',
    xp: 250,
    icon: <Layout className="text-pink-500 dark:text-pink-400" size={24} />,
    description: 'Build a CSS Grid layout that dynamically adjusts from 1 to 4 columns based on screen width.',
  },
  {
    id: 'prob-003',
    title: 'Database Normalization',
    category: 'Data Structures',
    role: 'Backend',
    difficulty: 'Medium',
    xp: 300,
    icon: <Server className="text-emerald-500 dark:text-emerald-400" size={24} />,
    description: 'Normalize the provided e-commerce database schema to 3NF to eliminate data redundancy.',
  },
  {
    id: 'prob-004',
    title: 'API Rate Limiter',
    category: 'Systems Design',
    role: 'Full Stack',
    difficulty: 'Hard',
    xp: 500,
    icon: <Server className="text-amber-500 dark:text-amber-400" size={24} />,
    description: 'Implement a sliding window counter rate limiter for an Express API gateway.',
  },
];

export default function ProblemStatements() {
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
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
    const matchesCategory = activeCategory === 'All' || prob.category === activeCategory;
    return matchesSearch && matchesCategory;
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
            Master data structures, algorithms, system design, and API optimization.
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

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {['All', 'Data Structures', 'UI/UX', 'Systems Design'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat}
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

              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
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