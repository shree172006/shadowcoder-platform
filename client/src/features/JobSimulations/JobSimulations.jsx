import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Code, Database, Server, Clock, ChevronRight, CheckCircle, Filter, Trash2, Edit3, Plus, ShieldCheck, Layout, Layers, PieChart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminConsoleModal from '../../components/AdminConsoleModal.jsx';

const INITIAL_SIMULATION_DATA = [
  // 1. FRONTEND DEVELOPER TRACK
  {
    id: 'sim-fe-01',
    title: 'React UI Performance & Re-render Bottleneck',
    role: 'Frontend Developer',
    track: 'frontend',
    difficulty: 'Junior',
    timeLimit: '40 mins',
    maxScore: 100,
    status: 'unsolved',
    icon: <Layout className="text-pink-500 dark:text-pink-400" size={24} />,
    description: 'A React dashboard component re-renders 500+ times per keystroke due to inline object creation. Refactor using useMemo, useCallback, and React.memo.',
  },
  {
    id: 'sim-fe-02',
    title: 'State Synchronization & Custom Hooks',
    role: 'Frontend Developer',
    track: 'frontend',
    difficulty: 'Senior',
    timeLimit: '55 mins',
    maxScore: 150,
    status: 'unsolved',
    icon: <Code className="text-[#38bdf8]" size={24} />,
    description: 'Build a custom useWebSocketSync hook to manage offline queued mutations, optimistic UI updates, and conflict resolution.',
  },

  // 2. BACKEND DEVELOPER TRACK
  {
    id: 'sim-be-01',
    title: 'Resolve Payment Desync & Mutex Lock',
    role: 'Backend Developer',
    track: 'backend',
    difficulty: 'Mid-Level',
    timeLimit: '45 mins',
    maxScore: 120,
    status: 'unsolved',
    icon: <Server className="text-blue-500 dark:text-blue-400" size={24} />,
    description: 'A race condition causes cart totals to desync under high concurrent load. Write a deterministic transaction function with mutex locks and 409 status returns.',
  },
  {
    id: 'sim-be-02',
    title: 'Distributed Auth & Token Rotation',
    role: 'Backend Developer',
    track: 'backend',
    difficulty: 'Senior',
    timeLimit: '60 mins',
    maxScore: 200,
    status: 'unsolved',
    icon: <ShieldCheck className="text-indigo-500" size={24} />,
    description: 'Implement JWT refresh token rotation, Redis blacklisting for logged-out tokens, and sliding session expiration.',
  },

  // 3. FULL STACK ENGINEER TRACK
  {
    id: 'sim-fs-01',
    title: 'Virtual File System & Stream ZIP Parser',
    role: 'Full Stack Engineer',
    track: 'fullstack',
    difficulty: 'Senior',
    timeLimit: '60 mins',
    maxScore: 250,
    status: 'unsolved',
    icon: <Layers className="text-amber-500 dark:text-amber-400" size={24} />,
    description: 'Build a stream-based ZIP extractor and virtual file system (VFS) tree builder connecting Node.js streams to a React Monaco editor.',
  },
  {
    id: 'sim-fs-02',
    title: 'Real-Time Order Bus & WebSockets',
    role: 'Full Stack Engineer',
    track: 'fullstack',
    difficulty: 'Lead Architect',
    timeLimit: '75 mins',
    maxScore: 350,
    status: 'unsolved',
    icon: <Server className="text-rose-500" size={24} />,
    description: 'Architect a Socket.io event bus linking Express database change streams to live client UI inventory notifications.',
  },

  // 4. DATA ANALYST TRACK
  {
    id: 'sim-da-01',
    title: 'Clean Customer Data & Timezone Normalizer',
    role: 'Data Analyst',
    track: 'data-analytics',
    difficulty: 'Junior',
    timeLimit: '30 mins',
    maxScore: 80,
    status: 'solved',
    icon: <PieChart className="text-purple-500 dark:text-purple-400" size={24} />,
    description: 'Parse a messy CSV payload, strip duplicates, normalize UTC timestamps, and validate phone number formats.',
  },
  {
    id: 'sim-da-02',
    title: 'SQL Performance Tuning & Window Aggregations',
    role: 'Data Analyst',
    track: 'data-analytics',
    difficulty: 'Mid-Level',
    timeLimit: '50 mins',
    maxScore: 160,
    status: 'unsolved',
    icon: <Database className="text-emerald-500 dark:text-emerald-400" size={24} />,
    description: 'Refactor slow nested subqueries into optimized SQL CTEs with ROW_NUMBER() and NTILE() window functions for revenue cohort analysis.',
  },
];

export default function JobSimulations() {
  const { isAdmin } = useAuth();
  const [activeTrack, setActiveTrack] = useState('all');
  const [simulations, setSimulations] = useState(INITIAL_SIMULATION_DATA);

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
      setSimulations((prev) => prev.filter((s) => s.id !== id));
    } else if (action === 'add') {
      const newSim = {
        id: `sim-${Date.now()}`,
        title: data.title,
        role: data.companyName || 'Software Engineer',
        track: data.targetRole || 'fullstack',
        difficulty: data.difficulty,
        timeLimit: '45 mins',
        maxScore: data.xpReward || 100,
        status: 'unsolved',
        icon: <Code className="text-indigo-500" size={24} />,
        description: data.description,
      };
      setSimulations((prev) => [newSim, ...prev]);
    } else if (action === 'edit' && item) {
      setSimulations((prev) =>
        prev.map((s) =>
          s.id === item.id
            ? { ...s, title: data.title, description: data.description, difficulty: data.difficulty }
            : s
        )
      );
    }
  };

  const filteredSimulations = simulations.filter((sim) => {
    if (activeTrack === 'all') return true;
    return sim.track === activeTrack;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 animate-in fade-in transition-colors duration-300">
      
      {/* Admin Action Console Bar */}
      {isAdmin && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck size={18} /> Admin Console Active • Job Simulations Control
          </div>
          <button
            onClick={() => handleOpenAdminModal('add')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus size={16} /> Add New Job Simulation
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Briefcase className="text-blue-600 dark:text-blue-400" /> Real-World Job Simulations
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
            Experience real production codebases across 4 specialization career tracks.
          </p>
        </div>

        {/* Career Track Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-x-auto self-start md:self-auto max-w-full">
          {[
            { id: 'all', label: 'All Tracks' },
            { id: 'frontend', label: 'Frontend' },
            { id: 'backend', label: 'Backend' },
            { id: 'fullstack', label: 'Full Stack' },
            { id: 'data-analytics', label: 'Data Analyst' },
          ].map((track) => (
            <button
              key={track.id}
              onClick={() => setActiveTrack(track.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTrack === track.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSimulations.map((sim) => (
          <div
            key={sim.id}
            className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-50 dark:bg-[#0d1117] rounded-xl border border-slate-100 dark:border-slate-800">
                  {sim.icon}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    sim.difficulty === 'Hard' || sim.difficulty === 'Lead Architect' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' :
                    sim.difficulty === 'Medium' || sim.difficulty === 'Senior' || sim.difficulty === 'Mid-Level' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                  }`}>
                    {sim.difficulty}
                  </span>

                  {/* Admin Controls */}
                  {isAdmin && (
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                      <button
                        onClick={() => handleOpenAdminModal('edit', sim)}
                        className="p-1 text-slate-500 hover:text-blue-500 transition-colors"
                        title="Edit Simulation"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenAdminModal('delete', sim)}
                        className="p-1 text-slate-500 hover:text-rose-500 transition-colors"
                        title="Delete Simulation"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {sim.title}
              </h2>
              
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                {sim.role}
              </p>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {sim.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Clock size={14} /> {sim.timeLimit}
              </div>

              <Link
                to={`/task/${sim.id}`}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
              >
                Enter Scenario <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Modal */}
      <AdminConsoleModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        type="job_sim"
        action={modalConfig.action}
        item={modalConfig.item}
        onSave={handleAdminSave}
      />
    </div>
  );
}