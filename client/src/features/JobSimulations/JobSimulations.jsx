import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Code, Database, Server, Clock, ChevronRight, CheckCircle, Filter, Trash2, Edit3, Plus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminConsoleModal from '../../components/AdminConsoleModal.jsx';

const INITIAL_SIMULATION_DATA = [
  {
    id: 'sim-001',
    title: 'Resolve Payment Desync Bug',
    role: 'Software Engineer',
    difficulty: 'Medium',
    timeLimit: '45 mins',
    maxScore: 100,
    status: 'unsolved',
    icon: <Code className="text-blue-500 dark:text-blue-400" size={24} />,
    description: 'A race condition is causing cart totals to desync during checkout. Write a deterministic calculation function to fix the pipeline.',
  },
  {
    id: 'sim-002',
    title: 'Optimize API Payload',
    role: 'Backend Developer',
    difficulty: 'Hard',
    timeLimit: '60 mins',
    maxScore: 150,
    status: 'unsolved',
    icon: <Server className="text-purple-500 dark:text-purple-400" size={24} />,
    description: 'The user analytics endpoint is timing out. Refactor the data aggregation logic to reduce payload size by 60%.',
  },
  {
    id: 'sim-003',
    title: 'Clean Customer Data Pipeline',
    role: 'Data Analyst',
    difficulty: 'Easy',
    timeLimit: '30 mins',
    maxScore: 50,
    status: 'solved',
    icon: <Database className="text-emerald-500 dark:text-emerald-400" size={24} />,
    description: 'Parse a messy CSV of user data, remove duplicates, and normalize the timezone strings.',
  },
];

export default function JobSimulations() {
  const { isAdmin } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
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
        role: data.category || 'Software Engineer',
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
    if (activeFilter === 'Solved') return sim.status === 'solved';
    if (activeFilter === 'Unsolved') return sim.status === 'unsolved';
    return true;
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
            <Briefcase className="text-blue-600 dark:text-blue-400" /> Job Simulations
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
            Experience real production codebases, debug live tickets, and run automated test suites.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/50 self-start md:self-auto">
          <Filter size={16} className="text-slate-400 ml-2" />
          {['All', 'Unsolved', 'Solved'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === filter
                  ? 'bg-white dark:bg-[#0d1117] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {filter}
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
                    sim.difficulty === 'Hard' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' :
                    sim.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
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
              
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
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
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
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