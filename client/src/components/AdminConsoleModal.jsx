import React, { useState, useEffect } from 'react';
import { X, Plus, Edit3, Trash2, ShieldCheck, Upload, Save, CheckCircle2, AlertCircle, FileCode, Layers, Ticket } from 'lucide-react';

/**
 * Admin Console Modal for Inline Add / Edit / Delete Operations
 * Includes a User-Friendly Visual Form Builder for Jira Tickets (No JSON required!).
 */
export default function AdminConsoleModal({ isOpen, onClose, type, action, item, onSave }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    title: item?.title || '',
    slug: item?.slug || '',
    description: item?.description || '',
    companyName: item?.companyName || 'ShadowCoder Labs',
    difficulty: item?.difficulty || 'Junior',
    targetRole: item?.targetRole || item?.category || 'fullstack',
    requiredTier: item?.requiredTier || 1,
    xpReward: item?.xpReward || 300,
    tags: item?.tags ? item.tags.join(', ') : '',
  });

  // Friendly Visual Tickets Array (No JSON needed!)
  const [tickets, setTickets] = useState(
    item?.tickets || [
      {
        id: 'TICK-101',
        title: 'Resolve Production Race Condition',
        description: 'Implement mutex lock and state validation around transaction endpoints.',
        type: 'bug',
        xp: 150,
      },
    ]
  );

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        slug: item.slug || '',
        description: item.description || '',
        companyName: item.companyName || 'ShadowCoder Labs',
        difficulty: item.difficulty || 'Junior',
        targetRole: item.targetRole || item.category || 'fullstack',
        requiredTier: item.requiredTier || 1,
        xpReward: item.xpReward || 300,
        tags: item.tags ? item.tags.join(', ') : '',
      });
      setTickets(
        item.tickets || [
          {
            id: 'TICK-101',
            title: 'Resolve Production Race Condition',
            description: 'Implement mutex lock and state validation around transaction endpoints.',
            type: 'bug',
            xp: 150,
          },
        ]
      );
    }
  }, [item]);

  const [codebaseZip, setCodebaseZip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const getTypeLabel = () => {
    switch (type) {
      case 'job_sim':
        return 'Job Simulation Scenario';
      case 'problem':
        return 'Problem Statement';
      case 'learn':
        return 'Learn Roadmap Topic';
      default:
        return 'Item';
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCodebaseZip(e.target.files[0]);
    }
  };

  // --- VISUAL TICKET FORM BUILDER HANDLERS ---
  const handleAddTicket = () => {
    const newId = `TICK-${100 + tickets.length + 1}`;
    setTickets([
      ...tickets,
      {
        id: newId,
        title: `Task #${tickets.length + 1}: Implement Feature`,
        description: 'Describe task requirement and acceptance criteria...',
        type: 'feature',
        xp: 100,
      },
    ]);
  };

  const handleTicketChange = (index, field, value) => {
    const updated = [...tickets];
    updated[index][field] = value;
    setTickets(updated);
  };

  const handleDeleteTicket = (index) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const finalData = {
        ...formData,
        tickets,
        codebaseZip,
      };

      if (action === 'delete') {
        onSave && onSave({ action: 'delete', id: item?.id });
        setStatusMsg({ type: 'success', text: `${getTypeLabel()} deleted successfully!` });
      } else {
        onSave && onSave({ action, type, data: finalData, item });
        setStatusMsg({ type: 'success', text: `${getTypeLabel()} ${action === 'add' ? 'created' : 'updated'} & synced!` });
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck size={18} /> Admin Console • {action.toUpperCase()} {getTypeLabel()}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {statusMsg && (
          <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {action === 'delete' ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl">
              <Trash2 size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete {getTypeLabel()}?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Are you sure you want to delete <span className="font-bold text-slate-800 dark:text-slate-200">'{item?.title}'</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={`Enter ${getTypeLabel()} title...`}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. ShadowCoder Labs..."
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Description / Overview
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="Describe scenario objectives, tasks, and requirements..."
                required
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Difficulty Level
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="Junior">Junior / Easy</option>
                  <option value="Mid">Mid-Level / Medium</option>
                  <option value="Senior">Senior / Hard</option>
                  <option value="Lead">Lead Architect</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Target Track
                </label>
                <select
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="fullstack">Full Stack</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="devops">DevOps</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  XP Reward
                </label>
                <input
                  type="number"
                  name="xpReward"
                  value={formData.xpReward}
                  onChange={handleChange}
                  min={50}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* FRIENDLY VISUAL JIRA TICKETS BUILDER (NO JSON!) */}
            {type === 'job_sim' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Ticket size={16} className="text-indigo-500" /> Scenario Jira Tickets & Tasks ({tickets.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTicket}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1 hover:bg-indigo-100 transition-all"
                  >
                    <Plus size={14} /> Add Ticket
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {tickets.map((t, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-indigo-500 font-mono">Ticket #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteTicket(idx)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Delete Ticket"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={t.title}
                          onChange={(e) => handleTicketChange(idx, 'title', e.target.value)}
                          placeholder="Ticket Title (e.g. Fix Auth Bug)..."
                          required
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 text-xs"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={t.type || 'bug'}
                            onChange={(e) => handleTicketChange(idx, 'type', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 text-xs"
                          >
                            <option value="bug">Bug Fix</option>
                            <option value="feature">Feature</option>
                            <option value="security">Security</option>
                            <option value="refactor">Refactor</option>
                          </select>
                          <input
                            type="number"
                            value={t.xp || 100}
                            onChange={(e) => handleTicketChange(idx, 'xp', Number(e.target.value))}
                            placeholder="XP Points"
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 text-xs"
                          />
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        value={t.description}
                        onChange={(e) => handleTicketChange(idx, 'description', e.target.value)}
                        placeholder="Task description and requirements..."
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {type === 'job_sim' && action === 'add' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Codebase Starter Archive (.zip)
                </label>
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 text-xs"
                />
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Syncing...' : (action === 'add' ? 'Create & Sync' : 'Save Scenario Content')}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
