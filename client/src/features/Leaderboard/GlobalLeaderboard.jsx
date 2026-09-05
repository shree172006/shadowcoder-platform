import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, Search, ArrowLeft, Award, Crown, Loader2, User as UserIcon 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiClient } from '../../lib/apiClient.js';
import HunterCertificateModal from '../../components/IDE/HunterCertificateModal.jsx';

export default function GlobalLeaderboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTier, setActiveTier] = useState('All Tiers');
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [realUsers, setRealUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real registered users from MongoDB
  useEffect(() => {
    let isMounted = true;
    async function loadLeaderboard() {
      setIsLoading(true);
      try {
        const res = await apiClient('/auth/leaderboard');
        if (isMounted && res?.leaderboard) {
          setRealUsers(res.leaderboard);
        }
      } catch (err) {
        console.warn('Could not load remote leaderboard users:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadLeaderboard();
    return () => { isMounted = false; };
  }, []);

  // Compute full leaderboard including active user
  const leaderboardList = useMemo(() => {
    let list = [...realUsers];

    // If active user is logged in, ensure they are present and marked
    if (user) {
      const userXp = user?.xp || 0;
      const userLevel = user?.level || 1;
      const userName = user?.name || 'Developer';
      const userTrack = user?.track ? (user.track.charAt(0).toUpperCase() + user.track.slice(1)) + ' Engineer' : 'Full Stack Engineer';
      const userTier = (userLevel >= 8 || userXp >= 3500)
        ? 'Apex Shadow (Tier S)'
        : (userLevel >= 5 || userXp >= 1500)
        ? 'Senior Staff (Tier A)'
        : (userLevel >= 2 || userXp >= 500)
        ? 'Specialist (Tier B)'
        : 'Apprentice (Tier C)';

      const existingIndex = list.findIndex(u => u.id === user.id || u.id === user._id || (u.name === user.name && u.name !== 'Developer'));
      if (existingIndex >= 0) {
        list[existingIndex] = {
          ...list[existingIndex],
          name: `${userName} (You)`,
          isCurrentUser: true,
          pts: userXp,
          lvl: userLevel,
          tier: userTier,
        };
      } else {
        list.push({
          id: user.id || user._id || 'current-user',
          name: `${userName} (You)`,
          username: userName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          role: userTrack,
          pts: userXp,
          lvl: userLevel,
          initial: userName.charAt(0).toUpperCase(),
          isCurrentUser: true,
          tier: userTier,
          badges: user.badges && user.badges.length > 0 ? user.badges : ['Active Hunter', 'Verified Account'],
        });
      }
    }

    // Sort strictly by XP descending
    list.sort((a, b) => (b.pts || 0) - (a.pts || 0));

    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }, [realUsers, user]);

  const currentUserRank = useMemo(() => {
    return leaderboardList.find(u => u.isCurrentUser);
  }, [leaderboardList]);

  // Filter Logic
  const filteredData = useMemo(() => {
    return leaderboardList.filter(u => {
      const name = u.name || '';
      const role = u.role || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            role.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTier === 'All Tiers') return matchesSearch;
      return matchesSearch && u.tier === activeTier;
    });
  }, [leaderboardList, searchQuery, activeTier]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 md:px-8 animate-in fade-in select-none font-sans">
      
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 font-bold mb-6 transition-colors text-xs">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      {/* HEADER & SIGNED IN USER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Trophy className="text-amber-400" size={32} /> Global Hunter Leaderboard
          </h1>
          <p className="text-zinc-400 mt-2 text-sm font-medium">
            Live developer rankings based strictly on verified XP earned from DevStudio simulations & module tests.
          </p>
        </div>

        {/* Current User Standings Card */}
        {currentUserRank && (
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-700 flex items-center justify-between gap-6 shrink-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white font-black text-lg flex items-center justify-center font-mono">
                #{currentUserRank.rank}
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider block">Your Global Standing</span>
                <h3 className="font-bold text-white text-base">{currentUserRank.name}</h3>
                <span className="text-xs font-mono text-amber-400 font-bold">+{currentUserRank.pts} XP • Level {currentUserRank.lvl}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCertOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Award size={14} /> Claim Certificate
            </button>
          </div>
        )}
      </div>

      {/* SEARCH & TIER FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All Tiers', 'Apex Shadow (Tier S)', 'Senior Staff (Tier A)', 'Specialist (Tier B)', 'Apprentice (Tier C)'].map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTier === tier
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search engineers by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
            <p className="text-xs text-zinc-400">Loading verified developer accounts...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <UserIcon className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-300">No registered engineers found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Complete a DevStudio simulation or course module to earn XP and appear on the leaderboard.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400 font-mono">
                <tr>
                  <th className="py-3.5 px-6">Rank</th>
                  <th className="py-3.5 px-6">Hunter Engineer</th>
                  <th className="py-3.5 px-6">Specialization</th>
                  <th className="py-3.5 px-6">Hunter Tier</th>
                  <th className="py-3.5 px-6 text-right">Cumulative XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filteredData.map((eng) => {
                  const isTop3 = eng.rank <= 3;
                  const isCurrentUser = eng.isCurrentUser;

                  return (
                    <tr
                      key={eng.id || eng.rank}
                      className={`transition-colors ${
                        isCurrentUser
                          ? 'bg-zinc-800/60 border-l-4 border-l-indigo-500'
                          : 'hover:bg-zinc-800/30'
                      }`}
                    >
                      <td className="py-3.5 px-6 font-mono font-bold text-xs">
                        {eng.rank === 1 ? '🥇 #1' : eng.rank === 2 ? '🥈 #2' : eng.rank === 3 ? '🥉 #3' : `#${eng.rank}`}
                      </td>

                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-200 font-mono text-xs">
                            {eng.initial || 'D'}
                          </div>
                          <div>
                            <Link
                              to={`/u/${(eng.name || 'developer').toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                              className="font-bold text-zinc-100 hover:text-indigo-400 transition-colors flex items-center gap-1"
                            >
                              {eng.name}
                              {isTop3 && <Crown size={12} className="text-amber-400" />}
                            </Link>
                            <span className="text-[10px] text-zinc-500 font-mono block">Level {eng.lvl || 1}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-6 text-zinc-300 font-medium">{eng.role || 'Full Stack Engineer'}</td>

                      <td className="py-3.5 px-6">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          eng.tier?.includes('Apex') || eng.tier?.includes('Tier S')
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : eng.tier?.includes('Senior') || eng.tier?.includes('Tier A')
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}>
                          {eng.tier || 'Apprentice'}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right font-mono font-bold text-xs text-zinc-200">
                        +{(eng.pts || 0).toLocaleString()} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* HUNTER CERTIFICATE MODAL */}
      {isCertOpen && (
        <HunterCertificateModal
          isOpen={isCertOpen}
          onClose={() => setIsCertOpen(false)}
          userName={user?.name || 'Developer'}
          tier={currentUserRank?.tier || 'Apex Shadow (Tier S)'}
          userLevel={currentUserRank?.lvl || 1}
          userXp={currentUserRank?.pts || 0}
          track={user?.track || 'Full Stack Systems Architecture'}
        />
      )}

    </div>
  );
}