import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ShieldCheck, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import AuthSidebarShowcase from './components/AuthSidebarShowcase.jsx';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.3 7.31 24 12 24z"/>
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 10.03 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
  </svg>
);

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

  const { login, register, loginWithFirebaseGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const { signInWithGoogle } = await import('../../lib/firebase');
      const firebaseUser = await signInWithGoogle();
      const idToken = await firebaseUser.getIdToken();
      await loginWithFirebaseGoogle(idToken, firebaseUser);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return;
      }
      setError(
        err.code === 'auth/invalid-api-key' || err.code === 'auth/network-request-failed' || err.code === 'auth/configuration-not-found'
          ? 'Firebase Configuration Error: Please check VITE_FIREBASE_API_KEY inside client/.env'
          : err.message || 'Google Sign-In failed.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      let errMsg = err.message || 'Authentication failed. Please check your details.';
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            errMsg = 'An account with this email address already exists.';
            break;
          case 'auth/weak-password':
            errMsg = 'The password must be at least 6 characters long.';
            break;
          case 'auth/invalid-email':
            errMsg = 'Please enter a valid email address.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errMsg = 'Invalid email or password. Please try again.';
            break;
          case 'auth/network-request-failed':
            errMsg = 'Network connection error. Please verify your connection.';
            break;
        }
      }
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans select-none">
      
      {/* Top back button */}
      <div className="w-full max-w-4xl mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
        >
          <ArrowLeft size={14} /> Back to ShadowCoder
        </Link>
      </div>

      {/* Main Auth Container */}
      <div className="w-full max-w-4xl bg-[#0b0e14] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Context & Proof of Work */}
        <AuthSidebarShowcase />

        {/* Right Column: Clean Form */}
        <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center bg-[#080b11]">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight mb-1">
              {isSignup ? 'Create your developer account' : 'Sign in to ShadowCoder'}
            </h2>
            <p className="text-slate-400 text-xs">
              {isSignup
                ? 'Join thousands of engineers practicing production codebases.'
                : 'Welcome back. Access your workspace and simulations.'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
              <ShieldCheck size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full mb-5 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-white font-medium text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className="relative flex items-center justify-center mb-5">
            <div className="w-full border-t border-slate-800" />
            <span className="absolute bg-[#080b11] px-3 text-[10px] uppercase tracking-wider text-slate-500 font-mono">
              Or with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignup && (
              <div>
                <label className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Full Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Alex Mercer"
                    required={isSignup}
                    className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Career Track
                </label>
                <select
                  name="track"
                  value={formData.track}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="frontend">Frontend Architecture</option>
                  <option value="backend">Distributed Backend Systems</option>
                  <option value="fullstack">Full-Stack Cloud Engineering</option>
                  <option value="data-analytics">Data Systems & Pipelines</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isSignup ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-5 text-center space-y-3">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer block w-full"
            >
              {isSignup ? (
                <>
                  Already have an account? <span className="text-indigo-400 font-medium underline">Sign in</span>
                </>
              ) : (
                <>
                  Don't have an account? <span className="text-indigo-400 font-medium underline">Sign up free</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck size={13} className="text-indigo-400" /> Enter Developer / Admin Portal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
