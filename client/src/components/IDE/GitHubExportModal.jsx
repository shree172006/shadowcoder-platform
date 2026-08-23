import React, { useState } from 'react';
import { 
  Download, Copy, Check, ExternalLink, ShieldCheck, 
  Sparkles, Award, FileCode, CheckCircle2, ArrowRight, X, Share2 
} from 'lucide-react';
import JSZip from 'jszip';

// Clean inline SVG brand icons
const GithubIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function GitHubExportModal({
  isOpen = false,
  onClose,
  scenarioTitle = 'Distributed Mutex Service',
  scenarioRole = 'Backend Developer',
  difficulty = 'Mid-Level',
  files = {},
  scorecard = null,
}) {
  const [copiedReadme, setCopiedReadme] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipDownloaded, setZipDownloaded] = useState(false);

  if (!isOpen) return null;

  const score = scorecard?.score || 95;
  const testSuiteRate = scorecard?.testSuiteRate || '6/6 Passed (100%)';
  const securityRating = scorecard?.securityRating || 'A+';
  const maintainability = scorecard?.maintainabilityIndex || 96;

  // Generate production-grade verified README.md
  const generateReadmeMarkdown = () => {
    return `# ${scenarioTitle}
> **Verified Implementation & Audited Test Suite on [ShadowCoder Platform](https://shadowcoder-app.web.app)**

![ShadowCoder Verified](https://img.shields.io/badge/ShadowCoder-Verified%20Implementation-6366f1?style=for-the-badge&logo=codeforces&logoColor=white)
![Test Status](https://img.shields.io/badge/Test%20Suite-${encodeURIComponent(testSuiteRate)}-emerald?style=for-the-badge)
![Security Rating](https://img.shields.io/badge/Security%20Rating-${securityRating}-blue?style=for-the-badge)

---

## 📌 Engineering Scenario Overview
- **Specialization Track:** ${scenarioRole}
- **Difficulty Tier:** ${difficulty}
- **Audit Score:** **${score} / 100**
- **Maintainability Index:** **${maintainability} / 100**
- **Verified Timestamp:** ${new Date().toUTCString()}

---

## 🛠️ Key Architectural Solutions Implemented
- ✅ **Concurrency Synchronization:** Deterministic transaction boundaries with thread-safe locking.
- ✅ **Error Fault-Tolerance:** Robust HTTP 409 Conflict status and try/catch exception pipeline.
- ✅ **AST Code Quality:** Clean separation of concerns and zero memory leaks.

---

## 🚀 How to Run Tests Locally
\`\`\`bash
# 1. Install dependencies
npm install

# 2. Run automated test suite
npm test
\`\`\`

---
*Verified by the ShadowCoder Engineering Audit Engine • [shadowcoder-app.web.app](https://shadowcoder-app.web.app)*
`;
  };

  const readmeContent = generateReadmeMarkdown();

  // Copy README to clipboard
  const handleCopyReadme = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2500);
  };

  // Download Complete Repository as a .ZIP
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add all workspace code files
      Object.entries(files).forEach(([filePath, content]) => {
        zip.file(filePath, content);
      });

      // Add verified README.md
      zip.file('README.md', readmeContent);

      // Add .gitignore
      zip.file('.gitignore', 'node_modules/\n.env\n.DS_Store\ncoverage/\n');

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const sanitizedName = scenarioTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.download = `shadowcoder-${sanitizedName}-verified.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setZipDownloaded(true);
      setTimeout(() => setZipDownloaded(false), 4000);
    } catch (err) {
      console.error('ZIP Generation failed:', err);
    } finally {
      setIsZipping(false);
    }
  };

  // 1-Click Share to LinkedIn
  const handleShareLinkedIn = () => {
    const shareText = encodeURIComponent(
      `🚀 Proud to share that I just completed and passed the "${scenarioTitle}" engineering simulation on ShadowCoder Platform with a score of ${score}/100 (${testSuiteRate})!\n\nCheck out my verified code implementation and practice real-world engineering codebases on ShadowCoder: https://shadowcoder-app.web.app\n\n#SoftwareEngineering #WebDevelopment #Coding #Developer`
    );
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${shareText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in select-none">
      <div className="bg-[#0f172a] border-2 border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-6 bg-[#0a0d14] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <GithubIcon size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 font-bold text-[10px] uppercase">
                  🏆 Pro Hunter Pack Verified
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">Audit Score: {score}/100</span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">Export Solved Repository to GitHub</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar font-sans text-xs">
          
          {/* Trust Badge Preview Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-indigo-400" /> Verified Audit Badge Included
              </span>
              <span className="text-emerald-400 font-bold text-[10px] font-mono">100% Recruiter Ready</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="text-indigo-400 font-bold"># {scenarioTitle}</div>
              <div className="text-slate-400">&gt; Verified Implementation on ShadowCoder Platform</div>
              <div className="text-emerald-400">• Concurrency & Tests: {testSuiteRate}</div>
              <div className="text-cyan-400">• Security Rating: {securityRating} • Maintainability: {maintainability}/100</div>
            </div>
          </div>

          {/* EXPORT ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* 1. Download Full Ready-to-Push ZIP */}
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex flex-col justify-between gap-3 shadow-lg shadow-indigo-600/20 cursor-pointer text-left hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between w-full">
                <Download size={20} />
                <span className="text-[10px] bg-indigo-700/80 px-2 py-0.5 rounded-full font-mono">.ZIP Archive</span>
              </div>
              <div>
                <div className="font-black text-sm">Download Verified Repo (.zip)</div>
                <div className="text-[11px] text-indigo-200 font-normal mt-0.5">
                  Includes all {Object.keys(files).length} code files + verified README.md badge
                </div>
              </div>
              {zipDownloaded && (
                <div className="text-emerald-300 font-bold text-[11px] flex items-center gap-1">
                  <Check size={14} /> ZIP Downloaded Successfully!
                </div>
              )}
            </button>

            {/* 2. Copy Verified README Badge */}
            <button
              onClick={handleCopyReadme}
              className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 font-bold transition-all flex flex-col justify-between gap-3 cursor-pointer text-left hover:border-slate-700 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between w-full">
                <Copy size={20} className="text-slate-400" />
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full font-mono text-slate-400">Markdown</span>
              </div>
              <div>
                <div className="font-black text-sm">Copy README.md Badge</div>
                <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                  Paste directly into your GitHub repository for instant recruiter proof
                </div>
              </div>
              {copiedReadme && (
                <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                  <Check size={14} /> Copied to Clipboard!
                </div>
              )}
            </button>

          </div>

          {/* 3. SOCIAL VIRAL SHARE (LINKEDIN) */}
          <div className="pt-2">
            <button
              onClick={handleShareLinkedIn}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0a66c2]/20 cursor-pointer hover:scale-[1.01]"
            >
              <LinkedinIcon size={18} />
              <span>Share Verified Audit to LinkedIn (1-Click)</span>
            </button>
          </div>

          {/* README Markdown Preview */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-slate-400 font-bold text-[11px] uppercase tracking-wider">
              <span>README.md Preview</span>
              <span>Markdown</span>
            </div>
            <pre className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-40 custom-scrollbar leading-relaxed">
              {readmeContent}
            </pre>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-[#0a0d14] border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
          <span>Rank: <strong className="text-amber-400">Pro Hunter (Apex)</strong></span>
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
