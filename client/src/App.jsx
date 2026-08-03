import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './layouts/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';

// Direct Feature Imports for Instant 0ms Route Transitions & Zero Black Screen Flashes
import LandingPage from './features/Landing/LandingPage.jsx';
import AuthPage from './features/Auth/AuthPage.jsx';
import Dashboard from './features/Dashboard/Dashboard.jsx';
import GlobalLeaderboard from './features/Leaderboard/GlobalLeaderboard.jsx';
import JobSimulations from './features/JobSimulations/JobSimulations.jsx';
import SimulationWorkspace from './features/JobSimulations/SimulationWorkspace.jsx';
import Learn from './features/Learn/Learn.jsx';
import AdminPanel from './features/Admin/AdminPanel.jsx';
import ProblemStatements from './features/ProblemStatements/ProblemStatements.jsx';
import ProblemWorkspace from './features/ProblemStatements/ProblemWorkspace.jsx';
import Profile from './features/Profile/Profile.jsx';
import Settings from './features/Settings/Settings.jsx';

function RootRouteController() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <span className="text-xs font-mono font-bold tracking-wider text-slate-500">Initializing Session...</span>
      </div>
    );
  }

  // BEFORE Sign In -> Landing Page; AFTER Sign In -> Developer Dashboard
  return user ? <Dashboard /> : <LandingPage />;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            
            <Route path="/" element={<RootRouteController />} />
            
            {/* Authenticated Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/simulations" element={<JobSimulations />} />
            <Route path="/task/:id" element={<SimulationWorkspace />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/problems" element={<ProblemStatements />} />
            <Route path="/problem/:id" element={<ProblemWorkspace />} />
            <Route path="/leaderboard" element={<ProtectedRoute><GlobalLeaderboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* RBAC Protected Admin Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}