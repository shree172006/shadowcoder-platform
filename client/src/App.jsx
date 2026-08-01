import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layouts/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Lazy-Load Route Components for Instant Ultra-Fast Initial Page Loads
const AuthPage = lazy(() => import('./features/Auth/AuthPage.jsx'));
const Dashboard = lazy(() => import('./features/Dashboard/Dashboard.jsx'));
const GlobalLeaderboard = lazy(() => import('./features/Leaderboard/GlobalLeaderboard.jsx'));
const JobSimulations = lazy(() => import('./features/JobSimulations/JobSimulations.jsx'));
const SimulationWorkspace = lazy(() => import('./features/JobSimulations/SimulationWorkspace.jsx'));
const Learn = lazy(() => import('./features/Learn/Learn.jsx'));
const AdminPanel = lazy(() => import('./features/Admin/AdminPanel.jsx'));
const ProblemStatements = lazy(() => import('./features/ProblemStatements/ProblemStatements.jsx'));
const ProblemWorkspace = lazy(() => import('./features/ProblemStatements/ProblemWorkspace.jsx'));
const Profile = lazy(() => import('./features/Profile/Profile.jsx'));
const Settings = lazy(() => import('./features/Settings/Settings.jsx'));

// Fast Loading Spinner Fallback
const FastPageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 space-y-3 animate-in fade-in">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
    <span className="text-xs font-mono font-bold tracking-wider text-slate-500">Loading Module...</span>
  </div>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
        <Navbar />
        
        <main>
          <Suspense fallback={<FastPageLoader />}>
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leaderboard" element={<GlobalLeaderboard />} />
              <Route path="/simulations" element={<JobSimulations />} />
              <Route path="/task/:id" element={<SimulationWorkspace />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/problems" element={<ProblemStatements />} />
              <Route path="/problem/:id" element={<ProblemWorkspace />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />

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
          </Suspense>
        </main>
      </div>
    </Router>
  );
}