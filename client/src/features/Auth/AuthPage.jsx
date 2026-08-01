import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ShieldCheck, Mail, Lock, User, ArrowRight, Sparkles, Terminal, Code2, Cpu, CheckCircle2 } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.3 7.31 24 12 24z"/>
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 10.03 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
  </svg>
);

/**
 * Animated Particle Canvas Background for Cyberpunk Dark Aesthetic (Safely Guarded)
 */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 600),
      radius: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.8,
      dy: (Math.random() - 0.5) * 0.8,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#6366f1';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-60" />;
};

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    track: 'fullstack',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, triggerOAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isSignup) {
        if (!formData.name.trim()) throw new Error('Please enter your full name');
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] dark:bg-[#07090e] text-slate-100 flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Background Animated Glowing Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <ParticleCanvas />

      {/* Main Glassmorphism Auth Card */}
      <div className="relative z-10 w-full max-w-5xl bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-500">
        
        {/* Left Side: Hero Showcase */}
        <div className="lg:col-span-6 p-8 lg:p-12 bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-purple-950/30 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-6">
              <Sparkles size={14} className="animate-spin" /> Next-Gen Gamified Job Simulation
            </div>

            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
              Level Up Your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Engineering Mastery</span>
            </h1>

            <p className="text-slate-400 text-sm lg:text-base leading-relaxed mb-8">
              Experience real-world job simulations across 4 career tracks, solve Jira tickets, execute sandboxed code, and earn badges.
            </p>
          </div>

          {/* Micro Feature Cards */}
          <div className="space-y-4 my-6">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md flex items-center gap-4 hover:border-indigo-500/50 transition-all hover:scale-[1.02]">
              <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
                <Code2 size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Real Production Codebases</h4>
                <p className="text-xs text-slate-400">4 Specialization Career Tracks: Frontend, Backend, Full Stack & Data Analyst</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md flex items-center gap-4 hover:border-purple-500/50 transition-all hover:scale-[1.02]">
              <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400">
                <Cpu size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Staff Engineer AI Evaluation</h4>
                <p className="text-xs text-slate-400">AST static analysis & automated security audit reviews</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-4 border-t border-slate-800">
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-400" /> HTTP-Only Security</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Terminal size={16} className="text-indigo-400" /> 100+ Gamification Badges</span>
          </div>
        </div>

        {/* Right Side: Clean 1-Click Google + Email Form */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
              {isSignup ? 'Create Developer Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isSignup
                ? 'Join ShadowCoder to unlock simulations, earn XP, and level up.'
                : 'Sign in to access your dashboard, scenarios, and leaderboard rank.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium flex items-center gap-2">
              <ShieldCheck size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Free Google Sign-In Button */}
          <button
            type="button"
            onClick={() => triggerOAuth('google')}
            className="w-full mb-6 flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all shadow-md hover:scale-[1.01]"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full border-t border-slate-800" />
            <span className="absolute bg-[#0b0e14] px-4 text-xs uppercase tracking-widest text-slate-500 font-semibold">
              Or with Email & Password
            </span>
          </div>

          {/* Single Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Alex Mercer"
                    required={isSignup}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@shadowcoder.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  minLength={8}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Career Specialization Track
                </label>
                <select
                  name="track"
                  value={formData.track}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  <option value="fullstack">Full Stack Engineer</option>
                  <option value="frontend">Frontend Specialist (React/Vite)</option>
                  <option value="backend">Backend Specialist (Node/Express/MongoDB)</option>
                  <option value="data-analytics">Data Analyst (SQL/Python/Pandas)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  {isSignup ? 'Create Account' : 'Sign In to ShadowCoder'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Signup and Login */}
          <div className="mt-8 text-center text-sm text-slate-400">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-indigo-400 font-bold hover:underline transition-colors ml-1"
            >
              {isSignup ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
