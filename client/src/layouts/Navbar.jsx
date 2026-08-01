import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Code, User as UserIcon, Settings, LogOut, ShieldCheck, Sun, Moon, 
  Terminal, LayoutGrid, Menu, X, Trophy, BookOpen, Briefcase, FileCode 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Light / Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('shadowcoder_theme') === 'dark' ||
      (!('shadowcoder_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('shadowcoder_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('shadowcoder_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { title: 'Dashboard', path: '/', icon: <LayoutGrid size={16} /> },
    { title: 'Job Simulations', path: '/simulations', icon: <Briefcase size={16} /> },
    { title: 'Problem Statements', path: '/problems', icon: <FileCode size={16} /> },
    { title: 'Learn Roadmaps', path: '/learn', icon: <BookOpen size={16} /> },
    { title: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={16} /> },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#07090e]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 h-16 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5">
          <img 
            src="/shadowcoder-logo.png" 
            alt="ShadowCoder Logo" 
            className="w-9 h-9 rounded-xl border border-indigo-500/30 shadow-md shadow-indigo-600/20 object-cover"
          />
          <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
            Shadow<span className="text-indigo-600 dark:text-indigo-400">Coder</span>
          </span>
        </Link>

        {/* DESKTOP CENTER LINKS */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.title}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 font-extrabold' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.title}
              </Link>
            );
          })}
        </div>

        {/* RIGHT CONTROLS: Theme Toggle + Auth / Profile + Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-105"
          >
            {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
          </button>

          {/* User Profile / Auth */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 sm:gap-3 p-1 sm:pl-3 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all"
              >
                <div className="text-right hidden sm:block">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">{user.name}</span>
                  <span className="block text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">Level {user.level || 1} • {user.xp || 0} XP</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'D'}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Role: {user.role}
                    </span>
                  </div>

                  <div className="py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <UserIcon size={14} /> Profile & Unlocked Badges
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                        <ShieldCheck size={14} /> Admin Studio
                      </Link>
                    )}
                  </div>

                  <div className="py-1">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                to="/login"
                className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
              >
                Sign In / Join
              </Link>
            </div>
          )}

          {/* MOBILE HAMBURGER MENU BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* MOBILE NAVIGATION DROPDOWN DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-2 z-50 animate-in slide-in-from-top-3 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.title}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 font-extrabold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.icon}
                  <span>{link.title}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 px-2">
            <span>ShadowCoder Platform</span>
            <span>v1.0.0</span>
          </div>
        </div>
      )}
    </nav>
  );
}