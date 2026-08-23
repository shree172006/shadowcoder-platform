import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Trophy, Award, Zap, ShieldCheck, Flame, Star, Sparkles, Sword, 
  Target, Lock, CheckCircle2, ChevronRight, Filter, Search, Crown, Info, X 
} from 'lucide-react';
import { BADGES_CATALOG, BADGE_CATEGORIES, RARITY_TIERS } from './badgesCatalog.js';
import BadgeIcon from './BadgeIcon.jsx';

export default function AchievementsPage() {
  const { user } = useAuth();
  const canvasRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeRarity, setActiveRarity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Real user unlocked badge IDs (No mock 24 unlock defaults for new users!)
  const userBadgeIds = user?.badges && user.badges.length > 0 
    ? user.badges.map((b) => (typeof b === 'string' ? b : b.badgeId)) 
    : [];

  const unlockedCount = userBadgeIds.length;
  const totalCount = BADGES_CATALOG.length;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  // Calculate total XP earned from actually unlocked badges
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

  // Filtered badges list
  const filteredBadges = BADGES_CATALOG.filter((badge) => {
    const matchCategory = activeCategory === 'all' || badge.category === activeCategory;
    const matchRarity = activeRarity === 'all' || badge.rarity === activeRarity;
    const matchSearch =
      searchQuery === '' ||
      badge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchRarity && matchSearch;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07090e] text-slate-100 p-4 sm:p-8 relative overflow-hidden select-none font-sans">
      
      {/* CANVAS BACKGROUND */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* ═══════════════════════════════════════════════════════ */}
        {/* TOP ACHIEVEMENTS HEADER BANNER */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="bg-[#0b0f19] border-2 border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 w-fit">
                <Crown size={14} /> Solo Leveling Shadow Monarch System
              </span>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3">
                Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-indigo-400">Achievements</span> & Trophies
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                Unlock prestigious SVG insignias by solving production simulations, closing Jira tickets, maintaining streaks, and writing audited code.
              </p>
            </div>

            {/* PROGRESS SUMMARY CARD */}
            <div className="w-full lg:w-auto bg-[#07090e]/80 border border-slate-800 p-5 rounded-2xl min-w-[280px]">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-400">Mastery Completion</span>
                <span className="text-indigo-400 font-mono">{completionPercentage}%</span>
              </div>

              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden mb-4 border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Unlocked</span>
                  <div className="text-lg font-black text-white font-mono mt-0.5">{unlockedCount} / {totalCount}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Trophy XP</span>
                  <div className="text-lg font-black text-amber-400 font-mono mt-0.5">+{totalAchievementXp}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* FILTERS & SEARCH CONTROLS */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="bg-[#0b0f19] border border-slate-800 p-4 sm:p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Rarity Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto custom-scrollbar pb-1 md:pb-0">
              <button
                onClick={() => setActiveRarity('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeRarity === 'all'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                All Rarities
              </button>
              {Object.keys(RARITY_TIERS).map((key) => {
                const tier = RARITY_TIERS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setActiveRarity(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 capitalize cursor-pointer ${
                      activeRarity === key
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BADGES GRID */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredBadges.map((badge) => {
            const isUnlocked = userBadgeIds.includes(badge.id);
            const rarity = RARITY_TIERS[badge.rarity] || RARITY_TIERS.common;

            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge({ ...badge, isUnlocked })}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between text-center relative group ${
                  isUnlocked
                    ? `${rarity.bgColor} ${rarity.borderColor} hover:scale-105 shadow-xl`
                    : 'bg-slate-900/40 border-slate-800/80 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center mb-3 shadow-inner">
                  <BadgeIcon badgeId={badge.id} size={26} isLocked={!isUnlocked} />
                </div>

                <div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${rarity.color}`}>
                    {badge.rarity}
                  </span>
                  <h4 className="font-bold text-xs text-white line-clamp-1 mt-1 group-hover:text-indigo-300 transition-colors">
                    {badge.title}
                  </h4>
                </div>

                <div className="mt-3">
                  {isUnlocked ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                      Unlocked
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-500 text-[10px] font-bold uppercase flex items-center gap-1">
                      <Lock size={10} /> Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* BADGE INSPECTION MODAL */}
      {/* ═══════════════════════════════════════════════════════ */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#0f172a] border-2 border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-950 border-2 border-indigo-500/40 flex items-center justify-center shadow-xl shadow-indigo-600/20">
              <BadgeIcon badgeId={selectedBadge.id} size={40} isLocked={!selectedBadge.isUnlocked} />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-[10px] uppercase">
                  {selectedBadge.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] uppercase">
                  {selectedBadge.rarity}
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-2">{selectedBadge.title}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedBadge.description}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-left space-y-1">
              <div className="text-slate-400 font-bold uppercase text-[10px]">Unlock Requirement:</div>
              <div className="text-indigo-300 font-semibold">{selectedBadge.requirementText || 'Complete engineering scenarios'}</div>
              <div className="text-amber-400 text-[11px] font-bold mt-1">+ {selectedBadge.xpReward || 100} XP Awarded on Unlock</div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
