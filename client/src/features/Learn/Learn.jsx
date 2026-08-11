import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Code2, Database, Terminal, Search, Plus, Trash2, X, ChevronRight, Layers, Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { INITIAL_CAREER_PATHS, INITIAL_SKILL_PATHS } from './data/coursesData.jsx';
import CourseCard from './components/CourseCard.jsx';

export default function Learn() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [careerPaths, setCareerPaths] = useState(() => {
    const saved = localStorage.getItem('shadowcoder_career_paths');
    return saved ? JSON.parse(saved) : INITIAL_CAREER_PATHS;
  });

  const [skillPaths, setSkillPaths] = useState(() => {
    const saved = localStorage.getItem('shadowcoder_skill_paths');
    return saved ? JSON.parse(saved) : INITIAL_SKILL_PATHS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('career');

  // Modal State for Adding New Topic (Admin Only)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTopicData, setNewTopicData] = useState({
    title: '',
    category: 'career',
    icon: 'frontend',
    modules: 5,
  });

  const handleSelectCourse = (course) => {
    navigate(`/learn/${course.id}`);
  };

  const handleAddTopicSubmit = (e) => {
    e.preventDefault();
    const newPath = {
      id: newTopicData.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      title: newTopicData.title,
      icon: newTopicData.icon,
      modules: parseInt(newTopicData.modules) || 5,
      completed: 0,
    };

    if (newTopicData.category === 'career') {
      const updated = [...careerPaths, newPath];
      setCareerPaths(updated);
      localStorage.setItem('shadowcoder_career_paths', JSON.stringify(updated));
    } else {
      const updated = [...skillPaths, newPath];
      setSkillPaths(updated);
      localStorage.setItem('shadowcoder_skill_paths', JSON.stringify(updated));
    }

    setIsAddModalOpen(false);
    setNewTopicData({ title: '', category: 'career', icon: 'frontend', modules: 5 });
  };

  const handleDeleteTopic = (id, category) => {
    if (category === 'career') {
      const updated = careerPaths.filter((item) => item.id !== id);
      setCareerPaths(updated);
      localStorage.setItem('shadowcoder_career_paths', JSON.stringify(updated));
    } else {
      const updated = skillPaths.filter((item) => item.id !== id);
      setSkillPaths(updated);
      localStorage.setItem('shadowcoder_skill_paths', JSON.stringify(updated));
    }
  };

  const filterPaths = (list) =>
    list.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 p-4 sm:p-8 select-none transition-colors duration-300">
      
      {/* HEADER HERO BANNER */}
      <div className="max-w-7xl mx-auto mb-10 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-purple-950/70 border border-slate-800 p-6 sm:p-10 shadow-2xl text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} /> Interactive Developer Learning Paths
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Production <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Engineering Roadmaps</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed font-medium">
            Select a career track or skill roadmap to explore production architecture flowcharts, copy live code playbooks, and solve interactive module verification tests.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* CONTROLS BAR (SEARCH & ADMIN ADD BUTTON) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#0f172a] p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          
          {/* Tab Selection */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('career')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'career'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Career Tracks
            </button>
            <button
              onClick={() => setActiveTab('skill')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'skill'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Skill Technologies
            </button>
          </div>

          {/* Search Box & Admin Add Button */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search roadmaps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {isAdmin && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
              >
                <Plus size={16} /> Add Roadmap
              </button>
            )}
          </div>
        </div>

        {/* ROADMAP CARDS CATALOG GRID */}
        {activeTab === 'career' ? (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="text-indigo-500" size={20} /> Career Tracks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filterPaths(careerPaths).map((item) => (
                <CourseCard
                  key={item.id}
                  item={item}
                  onSelectTopic={handleSelectCourse}
                  isAdmin={isAdmin}
                  onDeleteTopic={() => handleDeleteTopic(item.id, 'career')}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Code2 className="text-indigo-500" size={20} /> Skill Technologies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filterPaths(skillPaths).map((item) => (
                <CourseCard
                  key={item.id}
                  item={item}
                  onSelectTopic={handleSelectCourse}
                  isAdmin={isAdmin}
                  onDeleteTopic={() => handleDeleteTopic(item.id, 'skill')}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ADMIN ADD TOPIC MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <form onSubmit={handleAddTopicSubmit} className="bg-white dark:bg-[#161b22] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Learning Roadmap</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Roadmap Title</label>
              <input
                type="text"
                value={newTopicData.title}
                onChange={(e) => setNewTopicData({ ...newTopicData, title: e.target.value })}
                placeholder="e.g. Next.js Architecture"
                required
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
              <select
                value={newTopicData.category}
                onChange={(e) => setNewTopicData({ ...newTopicData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="career">Career Track</option>
                <option value="skill">Skill Technology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Icon Style</label>
              <select
                value={newTopicData.icon}
                onChange={(e) => setNewTopicData({ ...newTopicData, icon: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="frontend">Frontend (Layout)</option>
                <option value="backend">Backend (Server)</option>
                <option value="fullstack">Full Stack (Layers)</option>
                <option value="data-analytics">Data Analytics (PieChart)</option>
                <option value="react">React (Code2)</option>
                <option value="sql">SQL (Database)</option>
                <option value="javascript">JavaScript (FileJson)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Module Count</label>
              <input
                type="number"
                min="1"
                max="30"
                value={newTopicData.modules}
                onChange={(e) => setNewTopicData({ ...newTopicData, modules: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20"
            >
              Save Roadmap
            </button>
          </form>
        </div>
      )}

    </div>
  );
}