import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './layouts/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';

// Core Essential Routes (Loaded Immediately for 0ms First Paint)
import LandingPage from './features/Landing/LandingPage.jsx';
import AuthPage from './features/Auth/AuthPage.jsx';
import Dashboard from './features/Dashboard/Dashboard.jsx';
import GlobalLeaderboard from './features/Leaderboard/GlobalLeaderboard.jsx';
import JobSimulations from './features/JobSimulations/JobSimulations.jsx';
import ProblemStatements from './features/ProblemStatements/ProblemStatements.jsx';
import Profile from './features/Profile/Profile.jsx';
import Settings from './features/Settings/Settings.jsx';

// Lazy Loaded Heavy Workspace Routes (Fetched On-Demand for Maximum Speed)
const SimulationWorkspace = lazy(() => import('./features/JobSimulations/SimulationWorkspace.jsx'));
const Learn = lazy(() => import('./features/Learn/Learn.jsx'));
const CourseRoadmapView = lazy(() => import('./features/Learn/views/CourseRoadmapView.jsx'));
const LessonWorkspaceView = lazy(() => import('./features/Learn/views/LessonWorkspaceView.jsx'));
const ProblemWorkspace = lazy(() => import('./features/ProblemStatements/ProblemWorkspace.jsx'));
const AdminPanel = lazy(() => import('./features/Admin/AdminPanel.jsx'));
const AchievementsPage = lazy(() => import('./features/Achievements/AchievementsPage.jsx'));

const RouteFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 space-y-3">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
    <span className="text-xs font-mono font-bold tracking-wider text-slate-500">Loading Workspace...</span>
  </div>
);

function RootRouteController() {
  const { user } = useAuth();
  // BEFORE Sign In -> Landing Page; AFTER Sign In -> Developer Dashboard
  return user ? <Dashboard /> : <LandingPage />;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
        <Navbar />
        
        <main>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Public Discovery Routes (0ms First Paint, Open for All Visitors) */}
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/" element={<RootRouteController />} />

              {/* Browseable Catalog Routes (Anyone can explore available challenges & roadmaps) */}
              <Route path="/simulations" element={<JobSimulations />} />
              <Route path="/problems" element={<ProblemStatements />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/:courseId" element={<CourseRoadmapView />} />

              {/* Protected Execution Workspaces (Requires Login -> Seamless Redirect) */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/task/:id" element={<ProtectedRoute><SimulationWorkspace /></ProtectedRoute>} />
              <Route path="/problem/:id" element={<ProtectedRoute><ProblemWorkspace /></ProtectedRoute>} />
              <Route path="/learn/:courseId/lesson/:lessonId" element={<ProtectedRoute><LessonWorkspaceView /></ProtectedRoute>} />
              <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
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

              {/* 404 Catch-All */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
                  <h1 className="text-6xl font-black text-slate-300 dark:text-slate-700">404</h1>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Page not found. The route you're looking for doesn't exist.</p>
                  <a href="/" className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all">Go Home</a>
                </div>
              } />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}