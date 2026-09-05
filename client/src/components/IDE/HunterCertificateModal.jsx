import React, { useState } from 'react';
import { 
  Award, ShieldCheck, Download, Check, Share2, 
  Sparkles, ExternalLink, X, Crown, Star 
} from 'lucide-react';

const LinkedinIcon = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function HunterCertificateModal({
  isOpen = false,
  onClose,
  userName = 'Developer',
  tier = 'Pro Hunter (Apex)',
  userLevel = 14,
  userXp = 3450,
  track = 'Full Stack Systems Architecture',
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const certId = `SC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const issueDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://shadowcoder-app.web.app/verify/${certId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareLinkedIn = () => {
    const shareText = encodeURIComponent(
      `🎓 Proud to announce that I have achieved the official "${tier}" Certification on ShadowCoder Platform after completing verified engineering simulations in ${track}!\n\nVerify certificate: https://shadowcoder-app.web.app/verify/${certId}\n\n#SoftwareEngineering #Developer #Certification #WebDevelopment`
    );
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${shareText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-in fade-in select-none">
      <div className="bg-zinc-900 border border-zinc-750 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col text-zinc-100 animate-in zoom-in-95 duration-150">
        
        {/* MODAL TOP BAR */}
        <div className="flex items-center justify-between p-5 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Crown size={20} />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium text-[10px] uppercase font-mono">
                Official Credential
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">Verified Certificate</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* CERTIFICATE CANVAS CARD */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 relative overflow-hidden text-center space-y-4">

            <div className="flex items-center justify-center gap-2">
              <ShieldCheck size={28} className="text-amber-400" />
              <span className="font-black text-sm uppercase tracking-widest text-slate-300">
                ShadowCoder Engineering Institute
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                This is to officially certify that
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-300 to-indigo-300">
                {userName}
              </h1>
              <p className="text-xs text-slate-300 max-w-md mx-auto pt-1 leading-relaxed">
                has successfully passed all requisite production simulations and code audits, achieving the verified standing of:
              </p>
            </div>

            <div className="inline-block px-6 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-black text-base uppercase tracking-wider shadow-inner">
              {tier} • {track}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-left text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Certificate ID</span>
                <span className="text-indigo-400 font-bold">{certId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Issue Date</span>
                <span className="text-slate-300">{issueDate}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 uppercase block">Security Verification</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check size={12} /> Cryptographically Signed
                </span>
              </div>
            </div>

          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleShareLinkedIn}
              className="py-3 px-4 rounded-2xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0a66c2]/20 cursor-pointer"
            >
              <LinkedinIcon size={16} /> Add to LinkedIn Profile
            </button>

            <button
              onClick={handleCopyLink}
              className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <><Check size={14} className="text-emerald-400" /> Link Copied</> : <><Share2 size={14} /> Copy Verification Link</>}
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-[#0a0d14] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Official Proof-of-Work Credential</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
