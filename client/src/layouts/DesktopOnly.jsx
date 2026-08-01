import { MonitorX, Laptop, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * DesktopOnly Wrapper Component
 * Restricts complex desktop features (Docker IDE Workspaces, Interactive Node Graph Canvas) on mobile screens (<768px/1024px)
 * while gracefully displaying a PC-Required notice with dark/light mode support.
 */
export default function DesktopOnly({ children, backLink = '/', backText = 'Back to Dashboard' }) {
  return (
    <>
      {/* MOBILE RESTRICTION NOTICE (Hidden on Desktop) */}
      <div className="md:hidden flex flex-col items-center justify-center min-h-[80vh] p-6 text-center animate-in fade-in transition-colors duration-300">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 shadow-xl shadow-indigo-600/10">
          <MonitorX size={40} />
        </div>

        <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 font-extrabold text-xs uppercase tracking-widest mb-3">
          Desktop Screen Required
        </span>

        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          PC / Laptop Required for Workspaces
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
          Docker terminal terminals, multi-pane code editors, AST code evaluation engines, and 2D canvas graphs are optimized strictly for desktop screens (min 768px width).
        </p>

        <Link 
          to={backLink} 
          className="w-full max-w-xs py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <ArrowLeft size={16} /> {backText}
        </Link>
      </div>

      {/* DESKTOP CONTENT (Hidden on Mobile) */}
      <div className="hidden md:block h-full">
        {children}
      </div>
    </>
  );
}