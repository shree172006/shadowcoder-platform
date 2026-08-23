import React from 'react';
import { 
  FileCode, FileJson, FileText, Layout, Code2, Database, Terminal, 
  Settings, Folder, FolderOpen, GitBranch, Cpu, Layers 
} from 'lucide-react';

/**
 * Returns an icon and color based on the file extension/filename.
 */
export const getFileIcon = (filename = '', size = 16) => {
  const lower = filename.toLowerCase();

  if (lower.endsWith('.jsx') || lower.endsWith('.tsx')) {
    return <Code2 size={size} className="text-cyan-400 shrink-0" />;
  }
  if (lower.endsWith('.js') || lower.endsWith('.mjs') || lower.endsWith('.cjs')) {
    return <FileCode size={size} className="text-yellow-400 shrink-0" />;
  }
  if (lower.endsWith('.ts')) {
    return <FileCode size={size} className="text-blue-400 shrink-0" />;
  }
  if (lower.endsWith('.py')) {
    return <Terminal size={size} className="text-emerald-400 shrink-0" />;
  }
  if (lower.endsWith('.json')) {
    return <FileJson size={size} className="text-amber-400 shrink-0" />;
  }
  if (lower.endsWith('.css') || lower.endsWith('.scss') || lower.endsWith('.tailwind')) {
    return <Layout size={size} className="text-pink-400 shrink-0" />;
  }
  if (lower.endsWith('.html') || lower.endsWith('.htm')) {
    return <Layout size={size} className="text-orange-400 shrink-0" />;
  }
  if (lower.endsWith('.sql')) {
    return <Database size={size} className="text-emerald-400 shrink-0" />;
  }
  if (lower.endsWith('.md') || lower.endsWith('.txt')) {
    return <FileText size={size} className="text-slate-400 shrink-0" />;
  }
  if (lower.endsWith('.env') || lower.includes('config')) {
    return <Settings size={size} className="text-slate-400 shrink-0" />;
  }

  return <FileCode size={size} className="text-indigo-400 shrink-0" />;
};

/**
 * Maps a file extension to its Monaco Editor language identifier.
 */
export const getMonacoLanguage = (filename = '') => {
  const lower = filename.toLowerCase();

  if (lower.endsWith('.jsx') || lower.endsWith('.tsx') || lower.endsWith('.js') || lower.endsWith('.ts')) {
    return 'javascript';
  }
  if (lower.endsWith('.py')) {
    return 'python';
  }
  if (lower.endsWith('.json')) {
    return 'json';
  }
  if (lower.endsWith('.html') || lower.endsWith('.htm')) {
    return 'html';
  }
  if (lower.endsWith('.css') || lower.endsWith('.scss')) {
    return 'css';
  }
  if (lower.endsWith('.sql')) {
    return 'sql';
  }
  if (lower.endsWith('.md')) {
    return 'markdown';
  }

  return 'javascript';
};
