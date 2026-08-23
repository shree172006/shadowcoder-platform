import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Trophy, Code2, Zap, Award, CheckCircle2, ShieldCheck, Flame, Star, 
  Sparkles, Sword, Shield, Brain, Activity, Compass, Target, ChevronRight, 
  Lock, User, Crown, RefreshCw, X 
} from 'lucide-react';
import { BADGES_CATALOG, RARITY_TIERS } from '../Achievements/badgesCatalog.js';
import BadgeIcon from '../Achievements/BadgeIcon.jsx';

/**
 * Solo Leveling Hunter Rank Calculator
 */
const getSoloLevelingRank = (level = 1, xp = 0) => {
  if (level >= 80 || xp >= 10000) return { rank: 'S-RANK', title: 'SHADOW MONARCH', color: 'from-amber-400 via-rose-500 to-purple-600', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/50' };
  if (level >= 50 || xp >= 5000) return { rank: 'A-RANK', title: 'GRANDMASTER ARCHITECT', color: 'from-purple-500 to-pink-600', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/50' };
  if (level >= 30 || xp >= 2500) return { rank: 'B-RANK', title: 'SYSTEM MONARCH', color: 'from-blue-500 to-indigo-600', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/50' };
  if (level >= 15 || xp >= 1000) return { rank: 'C-RANK', title: 'BACKEND HUNTER', color: 'from-emerald-500 to-teal-600', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' };
  if (level >= 5 || xp >= 300) return { rank: 'D-RANK', title: 'NOVICE CODE SLAYER', color: 'from-cyan-500 to-blue-500', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' };
  return { rank: 'E-RANK', title: 'SHADOW PORTER', color: 'from-slate-400 to-slate-600', badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/50' };
};

export default function Profile() {
  const { user } = useAuth();
  const canvasRef = useRef(null);

  // Selected Badge Modal State
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Real Dynamic User Stats
  const userLevel = user?.level || 1;
  const userXp = user?.xp || 0;
  const streakCount = user?.streak?.currentCount || user?.streakDays || 0;
  const ticketsSolvedCount = user?.completedScenarios?.length || user?.stats?.ticketsSolvedCount || 0;
  const soloRank = getSoloLevelingRank(userLevel, userXp);

  // Real Unlocked Badges (Never force all unlocked on new users)
  const userBadgeIds = user?.badges && user.badges.length > 0 
    ? user.badges.map((b) => (typeof b === 'string' ? b : b.badgeId)) 
    : [];

  const unlockedCount = userBadgeIds.length;
  const totalBadgesCount = BADGES_CATALOG.length;

  // Particle Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 600),
      radius: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      color: ['#a855f7', '#6366f1', '#3b82f6', '#ec4899'][Math.floor(Math.random() * 4)],
      alpha: Math.random() * 0.6 + 0.2,
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
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Dynamic Character Stats Scaling from Real Progress
  const playerStats = [
    { 
      label: 'Intelligence (Algo Power)', 
      val: Math.min(100, Math.floor((userXp / 3000) * 75) + 25), 
      icon: <Brain className="text-purple-400" size={18} /> 
    },
    { 
      label: 'Agility (Code Speed)', 
      val: Math.min(100, Math.floor((ticketsSolvedCount / 10) * 75) + 20), 
      icon: <Zap className="text-amber-400" size={18} /> 
    },
    { 
      label: 'Endurance (Debug Resilience)', 
      val: Math.min(100, Math.floor((streakCount / 15) * 75) + 20), 
      icon: <Activity className="text-emerald-400" size={18} /> 
    },
    { 
      label: 'Strength (System Architecture)', 
      val: Math.min(100, Math.floor((userLevel / 30) * 75) + 20), 
      icon: <Sword className="text-rose-400" size={18} /> 
    },
    { 
      label: 'Mana Pool (XP Capacity)', 
      val: Math.min(100, Math.floor(((userXp % 500) / 500) * 100) + 10), 
      icon: <Sparkles className="text-cyan-400" size={18} /> 
    },
  ];

  const displayName = user?.name || user?.email?.split('@')[0] || 'Developer';
  const initialLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07090e] text-slate-100 p-4 sm:p-8 relative overflow-hidden select-none font-sans">
      
      {/* BACKGROUND PARTICLE CANVAS */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* ═══════════════════════════════════════════════════════ */}
        {/* TOP HUNTER BANNER CARD */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="bg-[#0b0f19] border-2 border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            
            {/* AVATAR & NAME INFO */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-indigo-600/30">
                  <div className="w-full h-full bg-[#0d111a] rounded-[22px] flex items-center justify-center text-3xl font-black text-white font-mono">
                    {initialLetter}
                  </div>
                </div>
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-black text-[10px] font-mono border-2 border-[#0b0f19]">
                  LVL {userLevel}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {displayName}
                  </h1>
                  <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase border tracking-wider ${soloRank.badgeColor}`}>
                    {soloRank.rank}
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
                    Rank #{user?.leaderboardRank || 1} National Hunter
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-400 flex-wrap">
                  <span className="text-purple-400 font-mono flex items-center gap-1">
                    <Crown size={14} /> {soloRank.title}
                  </span>
                  <span>•</span>
                  <span className="text-indigo-300 uppercase">Track: {user?.track || 'FULLSTACK'}</span>
                  <span>•</span>
                  <span className="text-orange-400 flex items-center gap-1 font-mono">
                    <Flame size={14} /> {streakCount} Day Streak
                  </span>
                </div>
              </div>
            </div>

            {/* SYSTEM XP & HUNTER SUMMARY CARD */}
            <div className="w-full lg:w-auto bg-[#07090e]/80 border border-slate-800 p-5 rounded-2xl min-w-[280px]">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-indigo-400 flex items-center gap-1.5">
                  <Sparkles size={14} /> SYSTEM XP
                </span>
                <span className="text-slate-200 font-mono">{userXp} / 500 XP</span>
              </div>

              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden mb-4 border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round(((userXp % 500) / 500) * 100))}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Completed Quests</span>
                  <div className="text-lg font-black text-white font-mono mt-0.5">{ticketsSolvedCount}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Shadow Badges</span>
                  <div className="text-lg font-black text-purple-400 font-mono mt-0.5">{unlockedCount}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* HUNTER PARAMETERS & DAILY SYSTEM QUESTS GRID */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* HUNTER PARAMETERS */}
          <div className="bg-[#0b0f19] border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Brain size={18} className="text-purple-400" /> Hunter Parameters
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase font-mono">
                Stat Points Active
              </span>
            </div>

            <div className="space-y-3.5">
              {playerStats.map((stat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-slate-300">
                      {stat.icon} {stat.label}
                    </span>
                    <span className="font-mono text-indigo-400">{stat.val} / 100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800/60">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${stat.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DAILY SYSTEM QUESTS */}
          <div className="bg-[#0b0f19] border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Target size={18} className="text-rose-400" /> Daily System Quests
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase font-mono">
                Resets Daily
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-white">Daily Code Ignition</h4>
                    <p className="text-[11px] text-slate-400">Solve 1 Problem Statement in DevStudio</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-xs font-mono">
                  +100 XP
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-amber-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-white">Ticket Execution</h4>
                    <p className="text-[11px] text-slate-400">Resolve 1 Production Simulation</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-xs font-mono">
                  +150 XP
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Flame size={18} className="text-orange-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs text-white">Consistency Streak</h4>
                    <p className="text-[11px] text-slate-400">Maintain 3-Day Coding Streak</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-xs font-mono">
                  +200 XP
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SHADOW ARTIFACTS & BADGES VAULT */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="bg-[#0b0f19] border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Award size={20} className="text-amber-400" /> Shadow Artifacts & Badges Vault
            </h3>
            <span className="text-xs font-mono font-bold text-indigo-400">
              {unlockedCount} / {totalBadgesCount} Artifacts Unlocked
            </span>
          </div>

          {/* BADGES GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {BADGES_CATALOG.map((badge) => {
              const isUnlocked = userBadgeIds.includes(badge.id);
              const rarity = RARITY_TIERS[badge.rarity] || RARITY_TIERS.common;

              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge({ ...badge, isUnlocked })}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between text-center relative group ${
                    isUnlocked
                      ? `${rarity.bgColor} ${rarity.borderColor} hover:scale-105 shadow-md`
                      : 'bg-slate-900/40 border-slate-800/80 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center mb-2 shadow-inner">
                    <BadgeIcon badgeId={badge.id} size={22} isLocked={!isUnlocked} />
                  </div>

                  <h4 className="font-bold text-xs text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {badge.title}
                  </h4>

                  <div className="mt-2">
                    {isUnlocked ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider">
                        Unlocked
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 text-[9px] font-bold uppercase flex items-center gap-1">
                        <Lock size={10} /> Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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