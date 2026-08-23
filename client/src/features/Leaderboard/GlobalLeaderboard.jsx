import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, Search, ChevronRight, Star, Shield, Zap, Target, 
  ArrowLeft, Filter, User as UserIcon, Award, Crown, ExternalLink, Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import HunterCertificateModal from '../../components/IDE/HunterCertificateModal.jsx';

const GLOBAL_ENGINEERS = [
  { id: 'eng-1', name: 'Sarah Jenkins', role: 'Full Stack Engineer', pts: 14500, lvl: 42, initial: 'S', tier: 'Pro Hunter (Apex)', badges: ['Speed Demon', 'Bug Squasher'] },
  { id: 'eng-2', name: 'David Chen', role: 'Backend Developer', pts: 13200, lvl: 38, initial: 'D', tier: 'Pro Hunter (Apex)', badges: ['Algorithm Pro'] },
  { id: 'eng-3', name: 'Elena Rodriguez', role: 'Frontend Developer', pts: 12850, lvl: 35, initial: 'E', tier: 'Pro Hunter (Apex)', badges: ['UI Virtuoso'] },
  { id: 'eng-4', name: 'Marcus Johnson', role: 'Frontend Developer', pts: 11400, lvl: 31, initial: 'M', tier: 'Pro Hunter (Apex)', badges: ['React Master'] },
  { id: 'eng-5', name: 'Priya Patel', role: 'Backend Developer', pts: 4950, lvl: 14, initial: 'P', tier: 'Hunter (Standard)', badges: ['Node Ninja'] },
  { id: 'eng-6', name: 'Alexei Volkov', role: 'Data Analyst', pts: 4100, lvl: 12, initial: 'A', tier: 'Hunter (Standard)', badges: ['Data Wrangler'] },
  { id: 'eng-7', name: 'Maria Garcia', role: 'Frontend Developer', pts: 3800, lvl: 11, initial: 'M', tier: 'Hunter (Standard)', badges: ['CSS Wizard'] },
  { id: 'eng-8', name: 'James Smith', role: 'Backend Developer', pts: 920, lvl: 3, initial: 'J', tier: 'Porter (Apprentice)', badges: ['DB Architect'] },
  { id: 'eng-9', name: 'Linda Kim', role: 'Full Stack Engineer', pts: 890, lvl: 2, initial: 'L', tier: 'Porter (Apprentice)', badges: ['Clean Code'] },
];

export default function GlobalLeaderboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTier, setActiveTier] = useState('All Tiers');
  const [isCertOpen, setIsCertOpen] = useState(false);

  // Real User Data Integration
  const leaderboardList = useMemo(() => {
    const userXp = user?.xp || 0;
    const userLevel = user?.level || 1;
    const userName = user?.name || 'Developer';
    const userRole = user?.track ? (user.track.charAt(0).toUpperCase() + user.track.slice(1)) : 'Full Stack';
    const userInitial = userName.charAt(0).toUpperCase();

    const userTier = userLevel >= 8 || userXp >= 1500
      ? 'Pro Hunter (Apex)'
      : userLevel >= 4 || userXp >= 500
      ? 'Hunter (Standard)'
      : 'Porter (Apprentice)';

    const realUserEntry = {
      id: 'current-user',
      name: `${userName} (You)`,
      username: userName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      role: userRole,
      pts: userXp,
      lvl: userLevel,
      initial: userInitial,
      isCurrentUser: true,
      tier: userTier,
      badges: ['Active Hunter', 'Verified Account']
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
      return matchesSearch && u.tier === activeTier;
    });
  }, [leaderboardList, searchQuery, activeTier]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 md:px-8 animate-in fade-in transition-colors duration-300 select-none font-sans">
      
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 font-bold mb-6 transition-colors text-xs">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      {/* HEADER & SIGNED IN USER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Trophy className="text-amber-400" size={32} /> Global Hunter Leaderboard
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">
            Live engineer rankings based on verified XP earned from DevStudio job simulations & test audits.
          </p>
        </div>

        {/* Current User Standings Card */}
        {currentUserRank && (
          <div className="p-4 rounded-3xl bg-[#0b0f19] border-2 border-indigo-500/30 flex items-center justify-between gap-6 shrink-0 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md font-mono">
                #{currentUserRank.rank}
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider block">Your Global Standing</span>
                <h3 className="font-black text-white text-base">{currentUserRank.name}</h3>
                <span className="text-xs font-mono text-amber-400 font-bold">+{currentUserRank.pts} XP • {currentUserRank.tier}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCertOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500/25 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Award size={14} /> Claim Certificate
            </button>
          </div>
        )}
      </div>

      {/* SEARCH & TIER FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All Tiers', 'Pro Hunter (Apex)', 'Hunter (Standard)', 'Porter (Apprentice)'].map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTier === tier
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search engineers by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#07090e] border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
              <tr>
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Hunter Engineer</th>
                <th className="py-4 px-6">Specialization</th>
                <th className="py-4 px-6">Hunter Tier</th>
                <th className="py-4 px-6 text-right">Cumulative XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredData.map((eng) => {
                const isTop3 = eng.rank <= 3;
                const isCurrentUser = eng.isCurrentUser;

                return (
                  <tr
                    key={eng.id}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-indigo-950/40 border-l-4 border-l-indigo-500'
                        : 'hover:bg-slate-900/50'
                    }`}
                  >
                    <td className="py-4 px-6 font-mono font-black text-sm">
                      {eng.rank === 1 ? '🥇 #1' : eng.rank === 2 ? '🥈 #2' : eng.rank === 3 ? '🥉 #3' : `#${eng.rank}`}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-white font-mono">
                          {eng.initial}
                        </div>
                        <div>
                          <Link
                            to={`/u/${eng.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            className="font-bold text-white hover:text-indigo-400 transition-colors flex items-center gap-1"
                          >
                            {eng.name}
                            {isTop3 && <Crown size={12} className="text-amber-400" />}
                          </Link>
                          <span className="text-[10px] text-slate-500 font-mono block">Level {eng.lvl}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-300 font-medium">{eng.role}</td>

                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        eng.tier.includes('Apex')
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : eng.tier.includes('Standard')
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {eng.tier}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right font-mono font-black text-sm text-indigo-400">
                      +{eng.pts.toLocaleString()} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* HUNTER CERTIFICATE MODAL */}
      {isCertOpen && (
        <HunterCertificateModal
          isOpen={isCertOpen}
          onClose={() => setIsCertOpen(false)}
          userName={user?.name || 'Developer'}
          tier={currentUserRank?.tier || 'Pro Hunter (Apex)'}
          userLevel={currentUserRank?.lvl || 1}
          userXp={currentUserRank?.pts || 0}
          track={user?.track || 'Full Stack Systems Architecture'}
        />
      )}

    </div>
  );
}