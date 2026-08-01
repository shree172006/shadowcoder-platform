import { useState } from 'react';
import { User, Lock, Bell, Shield, Save } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security & Password', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 animate-in fade-in flex flex-col md:flex-row gap-10">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <h1 className="text-3xl font-black text-slate-900 mb-6">Settings</h1>
        <div className="flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        
        {activeTab === 'account' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Public Profile</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
                <input type="text" defaultValue="Developer" className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input type="email" defaultValue="you@example.com" className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Short Bio</label>
                <textarea rows="4" defaultValue="Full-stack engineer passionate about scalable systems." className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium resize-none"></textarea>
              </div>

              <div className="pt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'account' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm text-center flex flex-col items-center justify-center">
            <Shield size={48} className="text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Section Under Construction</h3>
            <p className="text-slate-500">This settings module is currently being built by our engineering team.</p>
          </div>
        )}

      </div>
    </div>
  );
}