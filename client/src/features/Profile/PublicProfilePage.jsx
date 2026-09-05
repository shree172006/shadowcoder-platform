import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, Award, Trophy, Star, CheckCircle2, Zap, Flame, 
  ExternalLink, Code2, Briefcase, Sparkles, Brain, 
  Activity, Sword, Share2, Copy, Check, ArrowLeft, Crown 
} from 'lucide-react';
import BadgeIcon from '../Achievements/BadgeIcon.jsx';
import { BADGES_CATALOG, RARITY_TIERS } from '../Achievements/badgesCatalog.js';

export default function PublicProfilePage() {
  const { username } = useParams();
  const [copiedLink, setCopiedLink] = useState(false);

  // Formatted public profile data
  const devData = useMemo(() => {
    const formattedName = username 
      ? username.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Apex Engineer';

    return {
      username: username || 'developer',
      name: formattedName,
      tier: 'Pro Hunter (Apex)',
      badgeTier: '🏆 Pro Hunter Pack',
      level: 14,
      xp: 3450,
      streakDays: 12,
      track: 'Full-Stack Systems Architecture',
      rankPosition: '#4 National Hunter',
      verifiedTimestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      completedSimulations: [
        { id: 'sim-be-01', title: 'Payment Mutex Synchronization', role: 'Backend Developer', score: 98, date: 'Aug 2026', passed: true },
        { id: 'sim-fe-01', title: 'React Virtual DOM Re-render Engine', role: 'Frontend Engineer', score: 95, date: 'Aug 2026', passed: true },
        { id: 'sim-fs-01', title: 'Virtual File System Stream Parser', role: 'Full Stack Engineer', score: 92, date: 'Aug 2026', passed: true },
      ],
      skills: [
        { name: 'Concurrency & Locking', level: 95 },
        { name: 'React 19 & State Architecture', level: 92 },
        { name: 'PostgreSQL & Query Optimization', level: 88 },
        { name: 'System Design & Event Buses', level: 90 },
      ],
      badges: ['sim_first', 'sim_5', 'track_junior', 'track_mid', 'streak_7', 'audit_perfect', 'pr_approved'],
    };
  }, [username]);

  const handleCopyProfileUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareLinkedIn = () => {
    const shareText = encodeURIComponent(
      `Check out my verified developer portfolio & audited proof-of-work on ShadowCoder Platform: ${window.location.href}\n\n#SoftwareEngineering #WebDevelopment #Developer #Portfolio`
    );
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${shareText}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 sm:p-8 font-sans select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* TOP RECRUITER VERIFICATION HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={16} /> Back to ShadowCoder
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyProfileUrl}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:border-slate-700"
            >
              {copiedLink ? <><Check size={14} className="text-emerald-400" /> Copied Profile Link</> : <><Copy size={14} /> Copy Link</>}
            </button>

            <button
              onClick={handleShareLinkedIn}
              className="px-4 py-1.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Share2 size={14} /> Share to LinkedIn
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* PUBLIC VERIFIED DEVELOPER PROFILE HERO */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="bg-[#0b0f19] border-2 border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* AVATAR & IDENTITY */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-400 p-0.5 shadow-xl shadow-indigo-600/20">
                <div className="w-full h-full bg-[#0d111a] rounded-[22px] flex items-center justify-center text-3xl font-black text-white font-mono">
                  {devData.name.charAt(0)}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{devData.name}</h1>
                  <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs uppercase">
                    {devData.badgeTier}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 font-mono">
                  <span>@{devData.username}</span>
                  <span>•</span>
                  <span className="text-indigo-400 font-bold">{devData.track}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck size={14} /> Cryptographically Verified
                  </span>
                </div>
              </div>
            </div>

            {/* QUICK STATS PILL */}
            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
              <div className="text-center px-3 border-r border-slate-800">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Level</span>
                <span className="text-base font-black text-white font-mono">{devData.level}</span>
              </div>
              <div className="text-center px-3 border-r border-slate-800">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Total XP</span>
                <span className="text-base font-black text-amber-400 font-mono">+{devData.xp}</span>
              </div>
              <div className="text-center px-3">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Streak</span>
                <span className="text-base font-black text-orange-400 font-mono flex items-center gap-0.5 justify-center">
                  <Flame size={14} /> {devData.streakDays}d
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* VERIFIED AUDIT REPORTS & PRODUCTION SIMULATIONS */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="bg-[#0b0f19] border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-400" /> Audited Production Simulations (Proof of Work)
            </h2>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              100% Verified Pass Rate
            </span>
          </div>

          <div className="space-y-3">
            {devData.completedSimulations.map((sim) => (
              <div
                key={sim.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-700"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{sim.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                      <span>{sim.role}</span>
                      <span>•</span>
                      <span>Completed {sim.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-slate-400 block">AST Code Score</span>
                    <span className="text-base font-black text-emerald-400">{sim.score} / 100</span>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase border border-emerald-500/30">
                    Passed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SKILLS RADAR & SHADOW BADGES VAULT */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* TECHNICAL CAPABILITIES */}
          <div className="bg-[#0b0f19] border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Brain size={18} className="text-purple-400" /> Audited Engineering Competencies
            </h3>

            <div className="space-y-3.5">
              {devData.skills.map((skill, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">{skill.name}</span>
                    <span className="text-indigo-400 font-mono">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VERIFIED SHADOW BADGES */}
          <div className="bg-[#0b0f19] border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award size={18} className="text-amber-400" /> Verified Achievements
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {devData.badges.map((badgeId) => {
                const badge = BADGES_CATALOG.find((b) => b.id === badgeId);
                if (!badge) return null;

                return (
                  <div
                    key={badgeId}
                    className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center text-center space-y-1.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-inner">
                      <BadgeIcon badgeId={badge.id} size={20} isLocked={false} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 line-clamp-1">
                      {badge.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* FOOTER CALL TO ACTION */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 text-center space-y-3">
          <h3 className="font-black text-lg text-white">Want to test your real production engineering skills?</h3>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Practice real multi-file codebases, solve concurrency bugs in DevStudio IDE, and earn your verified Hunter portfolio.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20"
          >
            Join ShadowCoder Free <ExternalLink size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
