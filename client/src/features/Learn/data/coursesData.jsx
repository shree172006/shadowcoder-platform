import React from 'react';
import { 
  BookOpen, Code2, Database, Terminal, Layout, Server, PieChart, Layers, FileJson 
} from 'lucide-react';

export const INITIAL_CAREER_PATHS = [
  { id: 'frontend', title: 'Frontend Developer', icon: 'frontend', modules: 9, completed: 3 },
  { id: 'backend', title: 'Backend Developer', icon: 'backend', modules: 5, completed: 2 },
  { id: 'data-analytics', title: 'Data Analytics', icon: 'data-analytics', modules: 2, completed: 1 },
  { id: 'fullstack', title: 'Full Stack Engineer', icon: 'fullstack', modules: 3, completed: 2 },
];

export const INITIAL_SKILL_PATHS = [
  { id: 'react', title: 'React', icon: 'react', modules: 8, completed: 4 },
  { id: 'sql', title: 'SQL / Databases', icon: 'sql', modules: 5, completed: 5 },
  { id: 'html-css', title: 'HTML & CSS', icon: 'html-css', modules: 10, completed: 10 },
  { id: 'javascript', title: 'JavaScript', icon: 'javascript', modules: 15, completed: 8 },
];

export const renderTopicIcon = (icon) => {
  if (React.isValidElement(icon)) return icon;
  const iconStr = typeof icon === 'string' ? icon.toLowerCase() : '';
  switch (iconStr) {
    case 'frontend':
    case 'layout':
    case 'html-css':
      return <Layout className="text-pink-500" size={32} />;
    case 'backend':
    case 'server':
      return <Server className="text-blue-500" size={32} />;
    case 'data-analytics':
    case 'piechart':
      return <PieChart className="text-purple-500" size={32} />;
    case 'fullstack':
    case 'layers':
      return <Layers className="text-amber-500" size={32} />;
    case 'python':
    case 'terminal':
      return <Terminal className="text-blue-600" size={32} />;
    case 'react':
    case 'code2':
      return <Code2 className="text-cyan-500" size={32} />;
    case 'sql':
    case 'database':
      return <Database className="text-emerald-500" size={32} />;
    case 'javascript':
    case 'filejson':
      return <FileJson className="text-yellow-500" size={32} />;
    default:
      return <BookOpen className="text-indigo-500" size={32} />;
  }
};
