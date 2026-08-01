import React, { useEffect } from 'react';
import { Trophy, Sparkles, X, CheckCircle2, Zap } from 'lucide-react';

/**
 * Surprise Achievement Unlock Celebration Modal
 * Displays "BOOM! 🎉 Achievement Unlocked!" popup when a user fulfills an achievement condition.
 */
export default function AchievementUnlockModal({ badge, onClose }) {
  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-b from-indigo-900/90 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-8 text-center shadow-2xl shadow-amber-500/20 overflow-hidden transform animate-in zoom-in-95 duration-300">
        
        {/* Ambient Celebration Glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Celebration Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs uppercase tracking-widest mb-6 animate-pulse">
          <Zap size={14} className="fill-amber-300" /> BOOM! ACHIEVEMENT UNLOCKED!
        </div>

        {/* Badge Icon Display */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-600 p-1 shadow-xl shadow-amber-500/30">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-5xl">
            {badge.icon || '🏆'}
          </div>
          <Sparkles className="absolute -top-2 -right-2 text-amber-400 animate-spin" size={24} />
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          {badge.title || 'Master Developer'}
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {badge.description || 'You successfully fulfilled a milestone challenge! Keep leveling up.'}
        </p>

        {/* XP Bonus Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-bold text-sm mb-6">
          <CheckCircle2 size={16} className="text-emerald-400" /> +{badge.xpBonus || 150} XP Claimed & Profile Updated!
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
        >
          BOOM! Continue Engineering
        </button>

      </div>
    </div>
  );
}
