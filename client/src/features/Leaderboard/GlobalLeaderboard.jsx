import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Search, ChevronRight, Star, Shield, Zap, Target, ArrowLeft, Filter } from 'lucide-react';

// --- EXTENDED MOCK DATA ---
const EXTENDED_LEADERBOARD = [
  { rank: 1, name: 'Shadow Monarch (You)', role: 'Apex Monarch', pts: 25000, lvl: 99, initial: '👑', badges: ['S-Rank Monarch', 'National Hunter', '100% Master'] },
  { rank: 2, name: 'Sarah Jenkins', role: 'Full Stack', pts: 14500, lvl: 42, initial: 'S', badges: ['Speed Demon', 'Bug Squasher'] },
  { rank: 3, name: 'David Chen', role: 'Backend', pts: 13200, lvl: 38, initial: 'D', badges: ['Algorithm Pro'] },
  { rank: 4, name: 'Elena Rodriguez', role: 'Frontend', pts: 12850, lvl: 35, initial: 'E', badges: ['UI Virtuoso'] },
  { rank: 5, name: 'Marcus Johnson', role: 'Frontend', pts: 11400, lvl: 31, initial: 'M', badges: ['React Master'] },
  { rank: 6, name: 'Priya Patel', role: 'Backend', pts: 10950, lvl: 29, initial: 'P', badges: ['Node Ninja'] },
  { rank: 7, name: 'Alexei Volkov', role: 'Data Analyst', pts: 10100, lvl: 27, initial: 'A', badges: ['Data Wrangler'] },
  { rank: 8, name: 'Maria Garcia', role: 'Frontend', pts: 9800, lvl: 25, initial: 'M', badges: ['CSS Wizard'] },
  { rank: 9, name: 'James Smith', role: 'Backend', pts: 9200, lvl: 22, initial: 'J', badges: ['DB Architect'] },
  { rank: 10, name: 'Linda Kim', role: 'Full Stack', pts: 8900, lvl: 21, initial: 'L', badges: ['Clean Code'] },
  { rank: 11, name: 'Robert Fox', role: 'DevOps', pts: 8400, lvl: 19, initial: 'R', badges: ['Pipeline Master'] },
  { rank: 12, name: 'Emily Chen', role: 'Frontend', pts: 8100, lvl: 18, initial: 'E', badges: ['Accessibility Pro'] },
];

const getRankTier = (pts) => {
  if (pts >= 20000) return { label: 'S-Rank Apex', border: 'border-amber-500/50', text: 'text-amber-500 font-black', bg: 'bg-amber-500/20' };
  if (pts >= 14000) return { label: 'S-Tier', border: 'border-amber-500/50', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/10' };
  if (pts >= 12000) return { label: 'A-Tier', border: 'border-fuchsia-500/50', text: 'text-fuchsia-600 dark:text-fuchsia-400', bg: 'bg-fuchsia-100 dark:bg-fuchsia-500/10' };
  if (pts >= 10000) return { label: 'B-Tier', border: 'border-blue-500/50', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/10' };
  if (pts >= 8000) return { label: 'C-Tier', border: 'border-emerald-500/50', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10' };
  return { label: 'D-Tier', border: 'border-slate-500/50', text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-500/10' };
};

export default function GlobalLeaderboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTier, setActiveTier] = useState('All Tiers'); // 💥 ADDED STATE FOR FILTER

  // Reusable Component: The Adaptive Hover Profile
  const MiniProfileCard = ({ user }) => {
    const tier = getRankTier(user.pts);
    return (
      <div className="absolute left-[30%] bottom-full mb-2 w-64 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none flex flex-col overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${tier.bg} ${tier.text} border ${tier.border}`}>
              {user.initial}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${tier.bg} ${tier.text}`}>
              {tier.label}
            </span>
          </div>
          <h4 className="text-slate-900 dark:text-white font-bold leading-tight">{user.name}</h4>
          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{user.role} Developer</span>
          
          <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-3"></div>
          
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Level {user.lvl}</span>
            <span className="text-amber-500 text-xs font-black flex items-center gap-1">
              <Star size={12} className="fill-amber-500" /> {user.pts} XP
            </span>
          </div>
        </div>
      </div>
    );
  };

  // 💥 UPDATED LOGIC: Now filters by BOTH Search Text and Tier Dropdown
  const filteredData = EXTENDED_LEADERBOARD.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTier === 'All Tiers') return matchesSearch;
    
    const userTier = getRankTier(user.pts).label;
    return matchesSearch && userTier === activeTier;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 md:px-8 animate-in fade-in transition-colors duration-300">
      
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold mb-6 transition-colors">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Trophy className="text-amber-500" size={32} /> Global Leaderboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">See how you stack up against the top engineers on ShadowCoder.</p>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-xl p-3 mb-8 shadow-sm flex flex-col md:flex-row gap-3 transition-colors">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-slate-400 dark:text-slate-500" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search developers by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 text-sm font-medium text-slate-900 dark:text-white transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
        
        {/* 💥 THE FIX: Replaced button with a fully functional Select Dropdown */}
        <select 
          value={activeTier}
          onChange={(e) => setActiveTier(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors outline-none focus:border-blue-500 cursor-pointer shrink-0"
        >
          <option value="All Tiers">All Tiers</option>
          <option value="S-Tier">S-Tier</option>
          <option value="A-Tier">A-Tier</option>
          <option value="B-Tier">B-Tier</option>
          <option value="C-Tier">C-Tier</option>
          <option value="D-Tier">D-Tier</option>
        </select>
      </div>

      {/* FULL LEADERBOARD TABLE */}
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-colors">
        
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-[#0d1117]/50 rounded-t-2xl">
          <div className="col-span-2 md:col-span-1">Rank</div>
          <div className="col-span-7 md:col-span-5">Developer</div>
          <div className="hidden md:block col-span-3">ShadowCoder</div>
          <div className="col-span-3 text-right">Points</div>
        </div>

        <div className="flex flex-col pb-2">
          {filteredData.length > 0 ? (
            filteredData.map((user) => {
              const tier = getRankTier(user.pts);
              return (
                <div key={user.rank} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-[#1a2133]/30 transition-colors items-center group relative cursor-pointer last:rounded-b-2xl">
                  
                  <MiniProfileCard user={user} />

                  <div className="col-span-2 md:col-span-1 font-black text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    #{user.rank}
                    {user.rank <= 3 && <Trophy size={14} className={user.rank === 1 ? 'text-amber-500' : user.rank === 2 ? 'text-slate-400' : 'text-orange-500'} />}
                  </div>

                  <div className="col-span-7 md:col-span-5 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${tier.bg} ${tier.text} border ${tier.border} shrink-0`}>
                      {user.initial}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-base text-slate-900 dark:text-white leading-tight">{user.name}</span>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">{user.role}</span>
                    </div>
                  </div>

                  <div className="hidden md:flex col-span-3 items-center">
                    <span className={`text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded ${tier.bg} ${tier.text}`}>
                      {tier.label}
                    </span>
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-1.5 font-black text-lg text-slate-700 dark:text-slate-300">
                    {user.pts.toLocaleString()} <span className="hidden sm:inline text-xs font-medium text-slate-400">XP</span>
                  </div>
                  
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
              No developers found matching your filters.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}