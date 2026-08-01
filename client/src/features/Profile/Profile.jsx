import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  Trophy, Code2, Zap, Award, CheckCircle2, ShieldCheck, Flame, Star, 
  Sparkles, Sword, Shield, Brain, Activity, Compass, Target, ChevronRight, Lock
} from 'lucide-react';
import { BADGES_CATALOG } from '../Achievements/badgesCatalog';

/**
 * Solo Leveling Rank Calculator
 */
const getSoloLevelingRank = (level = 1, xp = 0) => {
  if (level >= 80 || xp >= 10000) return { rank: 'S-RANK', title: 'SHADOW MONARCH', color: 'from-amber-400 via-rose-500 to-purple-600', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/50' };
  if (level >= 50 || xp >= 5000) return { rank: 'A-RANK', title: 'GRANDMASTER ARCHITECT', color: 'from-purple-500 to-pink-600', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/50' };
  if (level >= 30 || xp >= 2500) return { rank: 'B-RANK', title: 'SYSTEM MONARCH', color: 'from-blue-500 to-indigo-600', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/50' };
  if (level >= 15 || xp >= 1000) return { rank: 'C-RANK', title: 'BACKEND NECROMANCER', color: 'from-emerald-500 to-teal-600', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' };
  if (level >= 5 || xp >= 300) return { rank: 'D-RANK', title: 'NOVICE CODE SLAYER', color: 'from-cyan-500 to-blue-500', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' };
  return { rank: 'E-RANK', title: 'SHADOW TRAINEE', color: 'from-slate-400 to-slate-600', badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/50' };
};

export default function Profile() {
  const { user } = useAuth();
  const canvasRef = useRef(null);

  // Selected Badge Modal State
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Apex Max Level Player Defaults
  const userLevel = user?.level || 99;
  const userXp = user?.xp || 9850;
  const streakCount = user?.streak?.currentCount || 30;
  const ticketsSolvedCount = user?.stats?.ticketsSolvedCount || 52;
  const soloRank = getSoloLevelingRank(userLevel, userXp);

  const userBadgeIds = user?.badges && user.badges.length > 0 
    ? user.badges.map((b) => b.badgeId) 
    : BADGES_CATALOG.map((b) => b.id);
  const unlockedBadges = BADGES_CATALOG.filter((b) => userBadgeIds.includes(b.id));

  // Particle Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
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

  // Solo Leveling Character Stats (Apex Max Level)
  const playerStats = [
    { label: 'Intelligence (Algo Power)', val: 99, icon: <Brain className="text-purple-400" size={18} /> },
    { label: 'Agility (Code Speed)', val: 98, icon: <Zap className="text-amber-400" size={18} /> },
    { label: 'Endurance (Debug Resilience)', val: 100, icon: <Activity className="text-emerald-400" size={18} /> },
    { label: 'Strength (System Architecture)', val: 99, icon: <Sword className="text-rose-400" size={18} /> },
    { label: 'Mana Pool (XP Capacity)', val: 100, icon: <Sparkles className="text-cyan-400" size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 p-4 lg:p-8 relative overflow-hidden transition-colors duration-300">
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* ======================================================== */}
        {/* 1. STABLE HUNTER STATUS CARD (NO MOUSE MOVEMENT) */}
        {/* ======================================================== */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl p-6 sm:p-8">
          
          {/* Subtle Canvas Aura Background */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            
            {/* Left: Avatar & Hunter Specs */}
            <div className="flex items-center gap-6">
              
              {/* Avatar Circle */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-1 shadow-lg">
                  <div className="w-full h-full rounded-[14px] bg-[#090d16] flex items-center justify-center text-4xl font-black text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-black text-amber-400 tracking-wider uppercase shadow-md">
                  LVL {userLevel}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-black text-white tracking-tight">
                    {user?.name || 'Shadow Hunter'}
                  </h1>

                  {/* Solo Leveling Rank Pill & Rank #1 Crown */}
                  <span className={`px-3 py-0.5 rounded-full border text-xs font-black tracking-widest uppercase shadow-sm ${soloRank.badgeColor}`}>
                    {soloRank.rank}
                  </span>

                  <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 text-amber-300 text-xs font-black tracking-widest uppercase shadow-lg shadow-amber-500/10 flex items-center gap-1">
                    👑 RANK #1 NATIONAL HUNTER
                  </span>
                </div>

                <p className="text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 uppercase tracking-wider">
                  ⚔️ {soloRank.title}
                </p>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5"><Shield className="text-indigo-400" size={14} /> Track: {user?.track ? user.track.toUpperCase() : 'Full Stack'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5"><Flame className="text-rose-500" size={14} /> {streakCount} Day Streak</span>
                </div>
              </div>
            </div>

            {/* Right: XP Bar & Stats Panel */}
            <div className="w-full lg:w-80 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" /> System XP
                </span>
                <span className="text-amber-400 font-mono">{userXp} / {userLevel * 500} XP</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 rounded-full h-2.5 p-0.5 border border-slate-800 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.min(100, (userXp / (userLevel * 500)) * 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Completed Quests</span>
                  <span className="text-lg font-black text-white">{ticketsSolvedCount}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Shadow Badges</span>
                  <span className="text-lg font-black text-purple-400">{unlockedBadges.length}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. STAT PARAMETERS & DAILY QUEST BOARD */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Attributes (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-wide uppercase">
                <Brain size={20} className="text-indigo-400" /> Hunter Parameters
              </h2>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Stat Points Active
              </span>
            </div>

            <div className="space-y-4">
              {playerStats.map((stat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300 flex items-center gap-2">{stat.icon} {stat.label}</span>
                    <span className="text-indigo-400 font-mono">{stat.val} / 100</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2.5 border border-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${stat.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Daily Quest System (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-wide uppercase">
                  <Target size={20} className="text-rose-500" /> Daily System Quests
                </h2>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20 uppercase tracking-widest">
                  Resets Daily
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Daily Code Ignition</h4>
                      <p className="text-[10px] text-slate-400">Solve 1 Problem Statement</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">+100 XP</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity size={18} className="text-amber-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Ticket Execution</h4>
                      <p className="text-[10px] text-slate-400">Resolve 1 Production Ticket</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">+150 XP</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flame size={18} className="text-rose-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Consistency Streak</h4>
                      <p className="text-[10px] text-slate-400">Maintain 3-Day Coding Streak</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">+200 XP</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 text-center">
              <span className="text-xs font-bold text-purple-300 block">⚠️ Warning: Quest Penalty System Active</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Failure to complete daily coding quests prevents rank advancement.</span>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 3. SHADOW BADGE VAULT */}
        {/* ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white flex items-center gap-2 tracking-wide uppercase">
              <Award size={22} className="text-amber-400" /> Shadow Artifacts & Badges Vault
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {unlockedBadges.length} / {BADGES_CATALOG.length} Artifacts Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {BADGES_CATALOG.slice(0, 12).map((badge) => {
              const isUnlocked = userBadgeIds.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className={`group relative p-4 rounded-3xl border text-center cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isUnlocked
                      ? 'bg-slate-900/80 border-indigo-500/40 shadow-xl shadow-indigo-600/10 hover:border-indigo-400'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-50 grayscale hover:grayscale-0'
                  }`}
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl mb-3 shadow-inner group-hover:scale-110 transition-transform">
                      {isUnlocked ? badge.icon : <Lock size={20} className="text-slate-600" />}
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">{badge.title}</h4>
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase">
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BADGE DETAILS INSPECTION MODAL */}
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-600/20 border border-indigo-500/30 text-5xl flex items-center justify-center shadow-xl">
                {selectedBadge.icon}
              </div>

              <div>
                <h3 className="text-xl font-black text-white mb-1">{selectedBadge.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedBadge.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-widest">Category</span>
                <span className="text-indigo-400 capitalize">{selectedBadge.category}</span>
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors"
              >
                Close Artifact Inspection
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}