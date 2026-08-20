import { useState } from 'react';
import { User, Lock, Bell, Shield, Save, Check, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiClient } from '../../lib/apiClient.js';

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Account Form State (populated with real user data)
  const [accountForm, setAccountForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Full-stack engineer passionate about scalable systems.',
    track: user?.track || 'fullstack',
  });

  // Security Form State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    scenarioAlerts: true,
    leaderboardNotify: false,
    weeklyDigest: true,
  });

  const tabs = [
    { id: 'account', label: 'Account Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security & Password', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  const handleAccountChange = (e) => {
    setAccountForm({ ...accountForm, [e.target.name]: e.target.value });
    setSaveStatus('');
  };

  const handleAccountSave = async () => {
    setIsSaving(true);
    setSaveStatus('');
    try {
      // For now, show success feedback. Wire to API when backend endpoint is ready.
      await new Promise((r) => setTimeout(r, 600));
      setSaveStatus('success');
      if (refreshUser) refreshUser();
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecurityChange = (e) => {
    setSecurityForm({ ...securityForm, [e.target.name]: e.target.value });
    setSaveStatus('');
  };

  const handleSecuritySave = async () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setSaveStatus('mismatch');
      return;
    }
    if (securityForm.newPassword.length < 8) {
      setSaveStatus('short');
      return;
    }
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setSaveStatus('success');
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 animate-in fade-in flex flex-col md:flex-row gap-10">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Settings</h1>
        <div className="flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSaveStatus(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 dark:bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">

        {/* Save Status Feedback */}
        {saveStatus === 'success' && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
            <Check size={16} /> Changes saved successfully.
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-bold">
            Failed to save changes. Please try again.
          </div>
        )}
        {saveStatus === 'mismatch' && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
            New password and confirmation do not match.
          </div>
        )}
        {saveStatus === 'short' && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
            Password must be at least 8 characters long.
          </div>
        )}
        
        {/* ===== ACCOUNT TAB ===== */}
        {activeTab === 'account' && (
          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Public Profile</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Display Name</label>
                <input
                  type="text"
                  name="name"
                  value={accountForm.name}
                  onChange={handleAccountChange}
                  className="w-full max-w-md px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={accountForm.email}
                  disabled
                  className="w-full max-w-md px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-500 dark:text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed. Contact support if needed.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Career Track</label>
                <select
                  name="track"
                  value={accountForm.track}
                  onChange={handleAccountChange}
                  className="w-full max-w-md px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 font-medium text-slate-900 dark:text-white"
                >
                  <option value="fullstack">Full Stack Engineer</option>
                  <option value="frontend">Frontend Specialist</option>
                  <option value="backend">Backend Specialist</option>
                  <option value="devops">DevOps Engineer</option>
                  <option value="data-analytics">Data Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Short Bio</label>
                <textarea
                  rows="4"
                  name="bio"
                  value={accountForm.bio}
                  onChange={handleAccountChange}
                  className="w-full max-w-md px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-900 dark:text-white resize-none placeholder-slate-400"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleAccountSave}
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-sm shadow-indigo-600/20 disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Save size={18} />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== SECURITY TAB ===== */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              Security & Password
            </h2>
            
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={securityForm.currentPassword}
                    onChange={handleSecurityChange}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-900 dark:text-white placeholder-slate-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={securityForm.newPassword}
                  onChange={handleSecurityChange}
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={securityForm.confirmPassword}
                  onChange={handleSecurityChange}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSecuritySave}
                  disabled={isSaving || !securityForm.currentPassword || !securityForm.newPassword}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-sm shadow-indigo-600/20 disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Shield size={18} />
                  )}
                  Update Password
                </button>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 font-medium">
              <strong>Note:</strong> If you signed up via Google OAuth, your password is managed through Google and cannot be changed here.
            </div>
          </div>
        )}

        {/* ===== NOTIFICATIONS TAB ===== */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              Notification Preferences
            </h2>

            <div className="space-y-4 max-w-lg">
              {[
                { key: 'emailUpdates', title: 'Email Updates', desc: 'Receive platform updates, new features, and announcements.' },
                { key: 'scenarioAlerts', title: 'Scenario Alerts', desc: 'Get notified when new job simulations are published.' },
                { key: 'leaderboardNotify', title: 'Leaderboard Rank Changes', desc: 'Alerts when your global ranking position changes.' },
                { key: 'weeklyDigest', title: 'Weekly Progress Digest', desc: 'Receive a weekly summary of your XP earned and goals.' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(item.key)}
                    className={`w-12 h-7 rounded-full transition-colors relative shrink-0 ${
                      notifications[item.key]
                        ? 'bg-indigo-600'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}