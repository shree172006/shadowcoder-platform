import React, { useState } from 'react';
import { apiClient } from '../../lib/apiClient';
import { ShieldCheck, Upload, Plus, FileCode, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminPanel() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    companyName: 'ShadowCoder Labs',
    difficulty: 'Junior',
    targetRole: 'fullstack',
    requiredTier: 1,
    xpReward: 300,
    ticketsJson: JSON.stringify(
      [
        {
          id: 'TICK-101',
          title: 'Resolve Payment Race Condition',
          description: 'Implement mutex lock around cart calculation function.',
          type: 'bug',
          xp: 150,
        },
      ],
      null,
      2
    ),
  });

  const [zipFile, setZipFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setZipFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      if (!zipFile) {
        throw new Error('Please select a codebase starter archive (.zip)');
      }

      let parsedTickets = [];
      try {
        parsedTickets = JSON.parse(formData.ticketsJson);
      } catch (err) {
        throw new Error('Invalid JSON format in Jira Tickets field.');
      }

      const bodyData = new FormData();
      bodyData.append('title', formData.title);
      bodyData.append('slug', formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-'));
      bodyData.append('description', formData.description);
      bodyData.append('companyName', formData.companyName);
      bodyData.append('difficulty', formData.difficulty);
      bodyData.append('targetRole', formData.targetRole);
      bodyData.append('requiredTier', formData.requiredTier);
      bodyData.append('xpReward', formData.xpReward);
      bodyData.append('tickets', JSON.stringify(parsedTickets));
      bodyData.append('codebaseZip', zipFile);

      const response = await apiClient('/simulations', {
        method: 'POST',
        body: bodyData,
      });

      setStatusMsg({
        type: 'success',
        text: `Successfully published simulation '${response.scenario?.title}' to MongoDB!`,
      });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Failed to upload scenario.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck size={14} /> ShadowCoder Admin Scenario Studio
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Upload Job Simulation Environment</h1>
          <p className="text-slate-400 text-sm">
            Upload starter codebase ZIP files, define Jira tickets, and immediately sync new simulation scenarios across MongoDB.
          </p>
        </div>

        {statusMsg && (
          <div className={`p-4 rounded-xl border text-sm font-semibold flex items-center gap-3 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Scenario Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="E.g., High-Throughput Auth Microservice"
                required
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Unique Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="auth-microservice-v1"
                required
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the real-world engineering challenge..."
              required
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="Junior">Junior</option>
                <option value="Mid">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead Architect</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Required Unlocked Tier
              </label>
              <input
                type="number"
                name="requiredTier"
                value={formData.requiredTier}
                onChange={handleChange}
                min={1}
                max={10}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                XP Reward
              </label>
              <input
                type="number"
                name="xpReward"
                value={formData.xpReward}
                onChange={handleChange}
                min={50}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Upload Codebase Archive (.zip)
            </label>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              required
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Jira Tickets (JSON Array)
            </label>
            <textarea
              name="ticketsJson"
              value={formData.ticketsJson}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-emerald-400 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Upload size={18} /> Sync Scenario to Live MongoDB Platform
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
