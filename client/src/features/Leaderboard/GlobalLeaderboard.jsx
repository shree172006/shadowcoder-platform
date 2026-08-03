import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Search, ChevronRight, Star, Shield, Zap, Target, ArrowLeft, Filter, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const GLOBAL_ENGINEERS = [
  { id: 'eng-1', name: 'Sarah Jenkins', role: 'Full Stack', pts: 14500, lvl: 42, initial: 'S', badges: ['Speed Demon', 'Bug Squasher'] },
  { id: 'eng-2', name: 'David Chen', role: 'Backend', pts: 13200, lvl: 38, initial: 'D', badges: ['Algorithm Pro'] },
  { id: 'eng-3', name: 'Elena Rodriguez', role: 'Frontend', pts: 12850, lvl: 35, initial: 'E', badges: ['UI Virtuoso'] },
  { id: 'eng-4', name: 'Marcus Johnson', role: 'Frontend', pts: 11400, lvl: 31, initial: 'M', badges: ['React Master'] },
  { id: 'eng-5', name: 'Priya Patel', role: 'Backend', pts: 10950, lvl: 29, initial: 'P', badges: ['Node Ninja'] },
  { id: 'eng-6', name: 'Alexei Volkov', role: 'Data Analyst', pts: 10100, lvl: 27, initial: 'A', badges: ['Data Wrangler'] },
  { id: 'eng-7', name: 'Maria Garcia', role: 'Frontend', pts: 9800, lvl: 25, initial: 'M', badges: ['CSS Wizard'] },
  { id: 'eng-8', name: 'James Smith', role: 'Backend', pts: 9200, lvl: 22, initial: 'J', badges: ['DB Architect'] },
  { id: 'eng-9', name: 'Linda Kim', role: 'Full Stack', pts: 8900, lvl: 21, initial: 'L', badges: ['Clean Code'] },
  { id: 'eng-10', name: 'Robert Fox', role: 'DevOps', pts: 8400, lvl: 19, initial: 'R', badges: ['Pipeline Master'] },
  { id: 'eng-11', name: 'Emily Chen', role: 'Frontend', pts: 8100, lvl: 18, initial: 'E', badges: ['Accessibility Pro'] },
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
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTier, setActiveTier] = useState('All Tiers');

  // Real User Data Integration
  const leaderboardList = useMemo(() => {
    const userXp = user?.xp || 450;
    const userLevel = user?.level || Math.max(1, Math.floor(userXp / 100));
    const userName = user?.name || 'Developer';
    const userRole = user?.track ? (user.track.charAt(0).toUpperCase() + user.track.slice(1)) : 'Full Stack';
    const userInitial = userName.charAt(0).toUpperCase();

    const realUserEntry = {
      id: 'current-user',
      name: `${userName} (You)`,
      role: userRole,
      pts: userXp,
      lvl: userLevel,
      initial: userInitial,
      isCurrentUser: true,
      badges: ['Active Engineer', 'Verified Account']
    };

    const combined = [...GLOBAL_ENGINEERS, realUserEntry];
    combined.sort((a, b) => b.pts - a.pts);

    return combined.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
  }, [user]);

  const currentUserRank = useMemo(() => {
    return leaderboardList.find(u => u.isCurrentUser);
  }, [leaderboardList]);

  // Filter Logic
  const filteredData = useMemo(() => {
    return leaderboardList.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            u.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTier === 'All Tiers') return matchesSearch;
      
      const userTier = getRankTier(u.pts).label;
      return matchesSearch && userTier === activeTier;
    });
  }, [leaderboardList, searchQuery, activeTier]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 md:px-8 animate-in fade-in transition-colors duration-300 select-none">
      
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold mb-6 transition-colors text-xs">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      {/* HEADER & SIGNED IN USER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Trophy className="text-amber-500" size={32} /> Global Leaderboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm font-medium">
            Live engineer rankings based on verified XP earned from job simulations & test audits.
          </p>
        </div>

        {/* Current User Standings Card */}
        {currentUserRank && (
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-600/10 border-2 border-indigo-500/40 flex items-center gap-4 shrink-0 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
              #{currentUserRank.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900 dark:text-white">{user?.name || 'Engineer'}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px] uppercase">You</span>
              </div>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                Level {currentUserRank.lvl} • {currentUserRank.pts.toLocaleString()} XP
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 mb-8 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search engineers by name or track..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-xs font-medium text-slate-900 dark:text-white transition-colors"
          />
        </div>
        
        <select 
          value={activeTier}
          onChange={(e) => setActiveTier(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 cursor-pointer shrink-0"
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
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-[#0d1117]/50">
          <div className="col-span-2 md:col-span-1">Rank</div>
          <div className="col-span-7 md:col-span-5">Engineer</div>
          <div className="hidden md:block col-span-3">Tier Rating</div>
          <div className="col-span-3 text-right">XP Points</div>
        </div>

        <div className="flex flex-col">
          {filteredData.length > 0 ? (
            filteredData.map((u) => {
              const tier = getRankTier(u.pts);
              const isYou = u.isCurrentUser;

              return (
                <div 
                  key={u.id} 
                  className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 last:border-0 transition-all items-center ${
                    isYou 
                      ? 'bg-indigo-50/80 dark:bg-indigo-600/15 border-l-4 border-l-indigo-600 font-bold' 
                      : 'hover:bg-slate-50 dark:hover:bg-[#1a2133]/30'
                  }`}
                >
                  <div className="col-span-2 md:col-span-1 font-black text-slate-500 dark:text-slate-400 flex items-center gap-2 text-xs sm:text-sm">
                    #{u.rank}
                    {u.rank <= 3 && <Trophy size={14} className={u.rank === 1 ? 'text-amber-500' : u.rank === 2 ? 'text-slate-400' : 'text-orange-500'} />}
                  </div>

                  <div className="col-span-7 md:col-span-5 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${tier.bg} ${tier.text} border ${tier.border} shrink-0`}>
                      {u.initial}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">{u.name}</span>
                        {isYou && <span className="px-2 py-0.2 rounded-full bg-indigo-600 text-white font-black text-[9px] uppercase">You</span>}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">{u.role} Developer</span>
                    </div>
                  </div>

                  <div className="hidden md:flex col-span-3 items-center">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${tier.bg} ${tier.text}`}>
                      {tier.label}
                    </span>
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-1.5 font-black text-sm sm:text-base text-slate-900 dark:text-white font-mono">
                    {u.pts.toLocaleString()} <span className="hidden sm:inline text-xs font-bold text-amber-500">XP</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs font-bold">
              No engineers found matching filter criteria.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}