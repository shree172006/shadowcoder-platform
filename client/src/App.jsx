import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layouts/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Direct Feature Imports for Instant 0ms Route Transitions & Zero Black Screen Flashes
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

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
        <Navbar />
        
        <main>
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
        </main>
      </div>
    </Router>
  );
}