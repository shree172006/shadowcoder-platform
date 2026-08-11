import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Trophy, Award, Zap, ShieldCheck, Flame, Star, Sparkles, Sword, 
  Target, Lock, CheckCircle2, ChevronRight, Filter, Search, Crown, Info, X
} from 'lucide-react';
import { BADGES_CATALOG, BADGE_CATEGORIES, RARITY_TIERS } from './badgesCatalog.js';

export default function AchievementsPage() {
  const { user } = useAuth();
  const canvasRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeRarity, setActiveRarity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState(null);

  // User unlocked badge IDs (defaults to all unlocked if user has default sample profile or user.badges)
  const userBadgeIds = user?.badges && user.badges.length > 0 
    ? user.badges.map((b) => b.badgeId) 
    : BADGES_CATALOG.slice(0, 24).map((b) => b.id); // Default sample profile has 24 badges unlocked

  const unlockedCount = userBadgeIds.length;
  const totalCount = BADGES_CATALOG.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Calculate total XP earned from unlocked badges
  const totalAchievementXp = BADGES_CATALOG
    .filter((b) => userBadgeIds.includes(b.id))
    .reduce((acc, b) => acc + (b.xpReward || 100), 0);

  // Animated Background Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 600),
      radius: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      color: ['#a855f7', '#6366f1', '#3b82f6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Filtered Badges List
  const filteredBadges = BADGES_CATALOG.filter((badge) => {
    const matchesCategory = activeCategory === 'all' || badge.category === activeCategory;
    const matchesRarity = activeRarity === 'all' || badge.rarity === activeRarity;
    const matchesSearch = badge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          badge.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesRarity && matchesSearch;
  });

  // Recommended "Next Up" Target Badges (Top 3 locked badges closest to unlock)
  const lockedBadges = BADGES_CATALOG.filter((b) => !userBadgeIds.includes(b.id));
  const recommendedTargets = lockedBadges.slice(0, 3);

  // Top Global Collectors Mock Data for Competition
  const topCollectors = [
    { rank: 1, name: 'ShadowMonarch', level: 99, badges: 36, score: '18,450 XP', avatar: '👑' },
    { rank: 2, name: 'Alex Mercer (You)', level: user?.level || 99, badges: unlockedCount, score: `${totalAchievementXp.toLocaleString()} XP`, avatar: '⚡' },
    { rank: 3, name: 'CyberKratos', level: 84, badges: 31, score: '14,200 XP', avatar: '🔥' },
    { rank: 4, name: 'DevGuru_99', level: 72, badges: 28, score: '11,900 XP', avatar: '🔮' },
    { rank: 5, name: 'ByteSlayer', level: 65, badges: 25, score: '9,800 XP', avatar: '🛡️' },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-8 px-4 sm:px-8 select-none transition-colors duration-300">
      
      {/* HEADER HERO BANNER */}
      <div className="relative max-w-7xl mx-auto mb-10 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/70 border border-slate-800/80 p-6 sm:p-10 shadow-2xl overflow-hidden backdrop-blur-xl">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-50" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-widest mb-4 shadow-inner">
              <Crown size={14} className="animate-bounce" /> S-RANK SHADOW MONARCH SYSTEM
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Engineering <span className="bg-gradient-to-r from-amber-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">Achievements & Trophies</span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-medium leading-relaxed">
              Unlock high-tier badges by clearing job simulations, closing Jira tickets, maintaining streaks, and writing zero-smell production code.
            </p>
          </div>

          {/* Achievement Progress Stats Card */}
          <div className="w-full lg:w-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mastery Completion</span>
              <span className="text-sm font-black text-amber-400 font-mono">{completionPercentage}%</span>
            </div>

            {/* Glowing Progress Bar */}
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-4 border border-slate-700/50">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full transition-all duration-700 shadow-lg shadow-amber-500/20"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-center">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unlocked</span>
                <span className="text-xl font-black text-white font-mono">{unlockedCount} <span className="text-slate-500 text-xs font-normal">/ {totalCount}</span></span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trophy XP</span>
                <span className="text-xl font-black text-amber-400 font-mono">+{totalAchievementXp.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-10">

        {/* RECOMMENDED TARGET ACHIEVEMENTS */}
        {recommendedTargets.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <Target className="text-rose-500 animate-pulse" size={22} />
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">Recommended Targets to Unlock</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">Closest to completion</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {recommendedTargets.map((badge) => {
                const tierInfo = RARITY_TIERS[badge.rarity] || RARITY_TIERS.common;
                return (
                  <div 
                    key={badge.id}
                    onClick={() => setSelectedBadge(badge)}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group flex flex-col justify-between hover:scale-[1.02] shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl p-2.5 rounded-2xl bg-slate-900 border border-slate-800">{badge.icon}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${tierInfo.badgeBg}`}>
                          {tierInfo.label}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">{badge.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{badge.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 font-mono">+{badge.xpReward} XP</span>
                      <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1">
                        Inspect <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FILTERS & SEARCH BAR */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {BADGE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* RARITY FILTER PILLS */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Filter size={14} /> Rarity Tier:
          </span>
          <button
            onClick={() => setActiveRarity('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeRarity === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Tiers
          </button>

          {Object.entries(RARITY_TIERS).map(([key, tier]) => (
            <button
              key={key}
              onClick={() => setActiveRarity(key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                activeRarity === key ? tier.badgeBg + ' shadow-md' : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{tier.icon}</span>
              <span>{tier.label}</span>
            </button>
          ))}
        </div>

        {/* MAIN HOLOGRAPHIC BADGES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBadges.map((badge) => {
            const isUnlocked = userBadgeIds.includes(badge.id);
            const tier = RARITY_TIERS[badge.rarity] || RARITY_TIERS.common;

            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`relative rounded-3xl p-6 border transition-all cursor-pointer group flex flex-col justify-between overflow-hidden shadow-xl ${
                  isUnlocked
                    ? `bg-slate-900/90 ${tier.borderColor} ${tier.glowColor} hover:scale-[1.03] backdrop-blur-xl`
                    : 'bg-slate-950/60 border-slate-900 opacity-60 hover:opacity-90 hover:border-slate-800'
                }`}
              >
                {/* Rarity Shimmer Top Bar */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${tier.badgeBg}`}>
                    {tier.label}
                  </span>
                  
                  <span className="text-xs font-mono font-bold text-amber-400">
                    +{badge.xpReward || 100} XP
                  </span>
                </div>

                {/* Badge Icon Showcase */}
                <div className="my-4 flex flex-col items-center text-center">
                  <div className={`relative p-5 rounded-3xl mb-3 border text-4xl shadow-inner transition-transform group-hover:scale-110 ${
                    isUnlocked ? `${tier.bgColor} ${tier.borderColor}` : 'bg-slate-900 border-slate-800 grayscale'
                  }`}>
                    {badge.icon}

                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-slate-950/80 rounded-3xl flex items-center justify-center text-slate-500">
                        <Lock size={22} />
                      </div>
                    )}
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-indigo-400 transition-colors leading-snug">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                    {badge.description}
                  </p>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">{badge.rarityPct || '5.0%'} hold</span>
                  
                  {isUnlocked ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase flex items-center gap-1">
                      <CheckCircle2 size={12} /> Unlocked
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-500 border border-slate-800 text-[10px] font-bold uppercase flex items-center gap-1">
                      <Lock size={10} /> Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* HALL OF LEGENDS COMPETITION LEADERBOARD */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Trophy className="text-amber-400" size={24} />
              <div>
                <h3 className="text-xl font-black text-white">Hall of Legends — Top Trophy Collectors</h3>
                <p className="text-xs text-slate-400">Compete with engineers globally to collect all 40+ achievements.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {topCollectors.map((collector) => (
              <div 
                key={collector.rank}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  collector.name.includes('(You)')
                    ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                    collector.rank === 1 ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/30' :
                    collector.rank === 2 ? 'bg-slate-300 text-slate-950 font-extrabold' :
                    collector.rank === 3 ? 'bg-amber-700 text-white font-extrabold' :
                    'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}>
                    #{collector.rank}
                  </span>

                  <span className="text-2xl">{collector.avatar}</span>

                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {collector.name}
                      {collector.name.includes('(You)') && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold">You</span>
                      )}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">Level {collector.level} Engineer</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-sm font-black text-amber-400 font-mono">{collector.badges} Badges</span>
                  <span className="text-xs text-slate-500 font-mono">{collector.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* INTERACTIVE INSPECT BADGE MODAL */}
      {selectedBadge && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#0f172a] border-2 border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in zoom-in-95">
            
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute right-5 top-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="p-6 rounded-3xl bg-slate-900 border-2 border-indigo-500/40 text-5xl mb-4 shadow-xl">
                {selectedBadge.icon}
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 border ${
                (RARITY_TIERS[selectedBadge.rarity] || RARITY_TIERS.common).badgeBg
              }`}>
                {(RARITY_TIERS[selectedBadge.rarity] || RARITY_TIERS.common).label} Achievement
              </span>

              <h3 className="text-2xl font-black text-white">{selectedBadge.title}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{selectedBadge.description}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500 font-bold">XP Reward:</span>
                <span className="font-mono font-black text-amber-400">+{selectedBadge.xpReward || 100} XP</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500 font-bold">Global Holder Rate:</span>
                <span className="font-mono font-bold text-indigo-400">{selectedBadge.rarityPct || '4.5%'} of Engineers</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500 font-bold">Requirements:</span>
                <span className="font-mono text-emerald-400">{selectedBadge.requirementText || 'Complete criteria'}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
