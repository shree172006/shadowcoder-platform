import { Link } from 'react-router-dom';
import { 
  Sparkles, Briefcase, FileCode, BookOpen, Trophy, ArrowRight, ShieldCheck, 
  Terminal, Code2, Cpu, CheckCircle2, Zap, Layout, Server, Layers, PieChart, Star
} from 'lucide-react';

const CAREER_TRACKS = [
  { id: 'frontend', title: 'Frontend Developer', icon: <Layout className="text-pink-500" size={28} />, desc: 'HTML5, CSS Grid, React 18, Vite, Testing & Next.js App Router.', modules: '9 Modules' },
  { id: 'backend', title: 'Backend Developer', icon: <Server className="text-blue-500" size={28} />, desc: 'Node.js, Express, PostgreSQL, MongoDB Aggregations & JWT Security.', modules: '8 Modules' },
  { id: 'fullstack', title: 'Full Stack Engineer', icon: <Layers className="text-amber-500" size={28} />, desc: 'Monorepos, Socket.io WebSockets, Docker Sandboxing & CI/CD Pipelines.', modules: '12 Modules' },
  { id: 'data-analytics', title: 'Data Analyst', icon: <PieChart className="text-purple-500" size={28} />, desc: 'Advanced SQL Window Functions, Python Pandas, NumPy & Data Analytics.', modules: '7 Modules' },
];

const FEATURES = [
  { icon: <Briefcase className="text-indigo-500" size={24} />, title: 'Real-World Job Simulations', desc: 'Debug real codebase tickets, submit pull requests, and pass executive code audits.' },
  { icon: <Terminal className="text-emerald-500" size={24} />, title: 'In-Browser JS/Python Studio', desc: 'Write, execute, and verify solutions in a safe WebWorker code execution engine.' },
  { icon: <BookOpen className="text-amber-500" size={24} />, title: 'Official Roadmap.sh Paths', desc: 'Follow step-by-step career flowcharts with interactive module verification tests.' },
  { icon: <Trophy className="text-purple-500" size={24} />, title: 'Global S-Rank Leaderboards', desc: 'Earn XP, level up your hunter rank, and compete against top global engineers.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-hidden select-none">
      
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs mb-8 shadow-sm animate-pulse">
          <Sparkles size={14} className="text-amber-400 fill-amber-400" />
          <span>The Next-Gen Developer Career & Job Simulation Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 max-w-5xl mx-auto">
          Level Up Your Software Career Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Real-World Simulations</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
          Solve production bug tickets, pass executive code audits, master official career roadmaps, and compete on global leaderboards.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 hover:scale-105"
          >
            Get Started Free <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-sm hover:border-indigo-500 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Sign In to Your Account
          </Link>
        </div>

        {/* METRICS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl mx-auto">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">4</h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Career Tracks</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">100%</h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Client JS Engine</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">+500</h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Engineers Playing</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">S-Rank</h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Monarch Audits</p>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="py-16 bg-slate-100/50 dark:bg-[#090d14] border-y border-slate-200 dark:border-slate-800/80 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Why Engineers Choose ShadowCoder
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              Everything you need to level up from junior coder to senior staff engineer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="p-6 rounded-3xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="p-3 w-fit rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAREER TRACKS PREVIEW */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Select Your Specialization Track
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Curated roadmap learning paths, problem statements, and real-world job simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAREER_TRACKS.map((track) => (
            <div key={track.id} className="p-6 rounded-3xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    {track.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {track.modules}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{track.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{track.desc}</p>
              </div>

              <Link
                to="/signup"
                className="w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all text-center block"
              >
                Enroll Track
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Ready to Master Software Engineering?</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Join developers worldwide and level up your skills today.</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20"
          >
            Create Free Account <ArrowRight size={16} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
