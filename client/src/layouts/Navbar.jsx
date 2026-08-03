import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Code, User as UserIcon, Settings, LogOut, ShieldCheck, Sun, Moon, 
  Terminal, LayoutGrid, Menu, X, Trophy, BookOpen, Briefcase, FileCode, Star
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

  // Authenticated Links (Shown AFTER signing in)
  const authNavLinks = [
    { title: 'Dashboard', path: '/dashboard', icon: <LayoutGrid size={16} /> },
    { title: 'Job Simulations', path: '/simulations', icon: <Briefcase size={16} /> },
    { title: 'Problem Statements', path: '/problems', icon: <FileCode size={16} /> },
    { title: 'Learn Roadmaps', path: '/learn', icon: <BookOpen size={16} /> },
  ];

  // Public Links (Shown BEFORE signing in)
  const publicNavLinks = [
    { title: 'Home', path: '/' },
    { title: 'Job Simulations', path: '/simulations' },
    { title: 'Problem Statements', path: '/problems' },
    { title: 'Learn Roadmaps', path: '/learn' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#07090e]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 h-16 transition-colors duration-300 select-none">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        
        {/* LOGO */}
        <Link to={user ? "/dashboard" : "/"} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5">
          <img 
            src="/shadowcoder-logo.png" 
            alt="ShadowCoder Logo" 
            className="w-9 h-9 rounded-xl border border-indigo-500/30 shadow-md shadow-indigo-600/20 object-cover"
          />
          <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
            Shadow<span className="text-indigo-600 dark:text-indigo-400">Coder</span>
          </span>
        </Link>

        {/* DESKTOP CENTER NAVIGATION LINKS */}
        <div className="hidden lg:flex items-center gap-1">
          {user ? (
            // Authenticated Navigation Links
            authNavLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path === '/dashboard' && location.pathname === '/');
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
            })
          ) : (
            // Public Navigation Links (BEFORE Sign In)
            publicNavLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.title}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.title}
                </Link>
              );
            })
          )}
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

          {/* User Profile (AFTER SIGN IN) vs Sign In CTAs (BEFORE SIGN IN) */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all border border-slate-200 dark:border-slate-800"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:flex flex-col text-left pr-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-none">{user.name || 'Engineer'}</span>
                  <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5 mt-0.5">
                    <Star size={10} className="fill-amber-500" /> Level {user.level || 1} ({user.xp || 0} XP)
                  </span>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  <Link 
                    to="/profile" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <UserIcon size={14} className="text-indigo-500" /> Profile Overview
                  </Link>

                  <Link 
                    to="/leaderboard" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <Trophy size={14} className="text-amber-500" /> Global Leaderboard
                  </Link>

                  <Link 
                    to="/settings" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <Settings size={14} className="text-slate-400" /> Settings
                  </Link>

                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <ShieldCheck size={14} /> Admin Monarch Panel
                    </Link>
                  )}

                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // PUBLIC CTAS (BEFORE SIGN IN)
            <div className="flex items-center gap-2">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* MOBILE HAMBURGER MENU BUTTON */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0d1117] border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          {user ? (
            authNavLinks.map((link) => (
              <Link 
                key={link.title}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {link.icon}
                <span>{link.title}</span>
              </Link>
            ))
          ) : (
            publicNavLinks.map((link) => (
              <Link 
                key={link.title}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {link.title}
              </Link>
            ))
          )}
        </div>
      )}
    </nav>
  );
}