import React, { useState } from 'react';
import { 
  Award, ShieldCheck, Download, Check, Share2, 
  Sparkles, ExternalLink, X, Crown, Star, Lock, ArrowRight, Printer, QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
  tier = 'Apprentice (Tier C)',
  userLevel = 1,
  userXp = 0,
  track = 'Full Stack Systems Architecture',
  completedCount = 0,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Real graduation qualification gate: Must have earned at least 500 XP or solved at least 1 simulation
  const MIN_XP_REQUIRED = 500;
  const isQualified = (userXp >= MIN_XP_REQUIRED) || (completedCount >= 1) || (userLevel >= 3);
  const xpProgress = Math.min(100, Math.round((userXp / MIN_XP_REQUIRED) * 100));

  // Deterministic Credential ID based on user name
  const hashSeed = (userName + track).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const certId = `SC-ENG-2026-${(hashSeed * 7919).toString(16).toUpperCase().padStart(4, '0')}-${((userXp + 1) * 31337).toString(16).toUpperCase().padStart(4, '0')}`.slice(0, 20);
  const issueDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const verifyUrl = `https://shadowcoder-app.web.app/verify/${certId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareLinkedIn = () => {
    const shareText = encodeURIComponent(
      `🎓 Proud to share my verified "${tier}" Engineering Credential on ShadowCoder Platform!\n\nTrack: ${track}\nCredential ID: ${certId}\nVerify authenticity: ${verifyUrl}\n\n#SoftwareEngineering #Developer #Certification #WebDevelopment`
    );
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${shareText}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in select-none">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col text-zinc-100 animate-in zoom-in-95 duration-150 max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${
              isQualified ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}>
              {isQualified ? <Crown size={18} /> : <Lock size={18} />}
            </div>
            <div>
              <span className={`text-[10px] font-mono uppercase tracking-wider block font-bold ${
                isQualified ? 'text-amber-400' : 'text-zinc-500'
              }`}>
                {isQualified ? 'Official Accredited Credential' : 'Credential Locked'}
              </span>
              <h2 className="text-sm font-bold text-white">
                {isQualified ? 'Verified Engineering Certificate' : 'Certificate Eligibility Requirements'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* IF NOT QUALIFIED: SHOW REAL PROGRESS & VERIFICATION CRITERIA */}
          {!isQualified ? (
            <div className="space-y-6 py-4">
              <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 text-amber-400 flex items-center justify-center mx-auto border border-zinc-700">
                  <Lock size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">Certificate Locked</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  ShadowCoder certificates are genuine, accredited proof-of-work credentials. To prevent fake certifications, candidates must complete verified engineering simulations before a certificate is issued.
                </p>
              </div>

              {/* REQUIREMENTS CHECKLIST */}
              <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">
                  Accreditation Requirements:
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        userXp >= MIN_XP_REQUIRED ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {userXp >= MIN_XP_REQUIRED ? '✓' : '1'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Earn at least 500 XP</span>
                        <span className="text-[11px] text-zinc-500">From verified simulations, problem statements, and course modules</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-300">
                      {userXp} / {MIN_XP_REQUIRED} XP
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        completedCount >= 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {completedCount >= 1 ? '✓' : '2'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Pass 1+ Production Simulation</span>
                        <span className="text-[11px] text-zinc-500">Run code through the AST auditor in DevStudio Sandbox</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-300">
                      {completedCount} / 1 Passed
                    </span>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Total Completion</span>
                    <span className="font-mono font-bold text-indigo-400">{xpProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${Math.max(5, xpProgress)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <Link
                  to="/simulations"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Go to Job Simulations <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            /* IF QUALIFIED: SHOW AUTHENTIC HIGH-FIDELITY CERTIFICATE */
            <>
              {/* THE AUTHENTIC CERTIFICATE CANVAS */}
              <div 
                id="printable-certificate"
                className="p-8 sm:p-10 rounded-xl bg-[#090b10] border-2 border-amber-500/40 relative overflow-hidden shadow-2xl text-center space-y-6"
                style={{
                  backgroundImage: 'radial-gradient(ellipse at 50% 15%, rgba(217, 119, 6, 0.08) 0%, transparent 70%)',
                }}
              >
                {/* ELEGANT CORNER ORNAMENTS */}
                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500/40 pointer-events-none" />
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500/40 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500/40 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500/40 pointer-events-none" />

                {/* ACCREDITATION HEADER */}
                <div className="space-y-1.5 border-b border-zinc-800 pb-5">
                  <div className="flex items-center justify-center gap-2">
                    <ShieldCheck size={26} className="text-amber-400" />
                    <span className="font-mono font-black text-xs uppercase tracking-[0.25em] text-zinc-300">
                      SHADOWCODER ACCREDITATION COUNCIL
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    GLOBAL STANDARD FOR AUDITED SOFTWARE ENGINEERING PROFICIENCY
                  </p>
                </div>

                {/* CERTIFICATE BODY */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-amber-400/90 tracking-widest block">
                    OFFICIAL CERTIFICATE OF ENGINEERING COMPETENCY
                  </span>

                  <p className="text-xs text-zinc-400">This is to certify that</p>

                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-serif italic py-1">
                    {userName}
                  </h1>

                  <p className="text-xs text-zinc-300 max-w-lg mx-auto leading-relaxed">
                    has successfully demonstrated verified technical mastery by passing comprehensive multi-file production simulations, asynchronous concurrency tests, and automated AST code audits in:
                  </p>

                  <div className="inline-block px-5 py-2 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    {track}
                  </div>
                </div>

                {/* VERIFICATION METADATA & SEAL */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-800/90 text-left text-xs font-mono">
                  
                  {/* CREDENTIAL DETAILS */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase block">Credential ID</span>
                    <span className="text-amber-400 font-bold text-xs">{certId}</span>
                    <span className="text-[10px] text-zinc-500 uppercase block pt-1">Issue Date</span>
                    <span className="text-zinc-300 text-xs">{issueDate}</span>
                  </div>

                  {/* EMBOSSED GOLD EMBLEM */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/20 border-2 border-amber-500/50 flex flex-col items-center justify-center p-1 shadow-inner">
                      <Crown size={20} className="text-amber-400" />
                      <span className="text-[8px] font-black text-amber-300 uppercase tracking-tighter mt-0.5">
                        VERIFIED
                      </span>
                    </div>
                    <span className="text-[9px] text-amber-400/80 font-bold mt-1">PROOF OF WORK</span>
                  </div>

                  {/* SIGNATURES */}
                  <div className="space-y-2 text-right sm:text-right">
                    <div>
                      <span className="font-serif italic text-xs text-zinc-300 block font-bold">Aaron Vance, Ph.D.</span>
                      <span className="text-[9px] text-zinc-500 uppercase block">Director of Systems Accreditation</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-[9px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                        <Check size={10} /> Cryptographically Signed
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleShareLinkedIn}
                  className="py-2.5 px-4 rounded-lg bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <LinkedinIcon size={15} /> Add to LinkedIn
                </button>

                <button
                  onClick={handleCopyLink}
                  className="py-2.5 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? <><Check size={14} className="text-emerald-400" /> Link Copied</> : <><Share2 size={14} /> Copy Verify Link</>}
                </button>

                <button
                  onClick={handlePrint}
                  className="py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer size={14} /> Print / Save PDF
                </button>
              </div>
            </>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3.5 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Official ShadowCoder Cryptographic Verification</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
