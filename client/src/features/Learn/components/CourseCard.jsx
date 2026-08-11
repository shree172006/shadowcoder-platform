import React from 'react';
import { ChevronRight, Trash2 } from 'lucide-react';
import { renderTopicIcon } from '../data/coursesData.jsx';

export default function CourseCard({ item, onSelectTopic, isAdmin, onDeleteTopic }) {
  return (
    <div
      onClick={() => onSelectTopic(item)}
      className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between relative"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-slate-50 dark:bg-[#0d1117] rounded-xl border border-slate-100 dark:border-slate-800">
            {renderTopicIcon(item.icon)}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {item.modules} Modules
            </span>

            {isAdmin && onDeleteTopic && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTopic(item.id);
                }}
                className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg bg-slate-50 dark:bg-slate-800"
                title="Delete Roadmap"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {item.title}
        </h3>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${(item.completed / item.modules) * 100}%` }}
          />
        </div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {item.completed} of {item.modules} completed ({Math.round((item.completed / item.modules) * 100)}%)
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Explore Pathway</span>
        <ChevronRight size={16} className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
