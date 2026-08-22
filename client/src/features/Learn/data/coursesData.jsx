import React from 'react';
import { 
  BookOpen, Code2, Database, Terminal, Layout, Server, PieChart, Layers, FileJson 
} from 'lucide-react';

import { FRONTEND_COURSE } from '../courses/FrontendCourse.jsx';
import { BACKEND_COURSE } from '../courses/BackendCourse.jsx';
import { FULLSTACK_COURSE } from '../courses/FullStackCourse.jsx';
import { DATA_ANALYTICS_COURSE } from '../courses/DataAnalyticsCourse.jsx';
import { REACT_COURSE } from '../courses/ReactCourse.jsx';
import { SQL_COURSE } from '../courses/SqlCourse.jsx';
import { HTML_CSS_COURSE } from '../courses/HtmlCssCourse.jsx';
import { JAVASCRIPT_COURSE } from '../courses/JavascriptCourse.jsx';
import { PYTHON_COURSE } from '../courses/PythonCourse.jsx';

export const INITIAL_CAREER_PATHS = [
  { id: 'frontend', title: 'Frontend Developer', icon: 'frontend', modules: 9, completed: 3 },
  { id: 'backend', title: 'Backend Developer', icon: 'backend', modules: 5, completed: 2 },
  { id: 'data-analytics', title: 'Data Analytics', icon: 'data-analytics', modules: 2, completed: 1 },
  { id: 'fullstack', title: 'Full Stack Engineer', icon: 'fullstack', modules: 3, completed: 2 },
];

export const INITIAL_SKILL_PATHS = [
  { id: 'react', title: 'React.js', icon: 'react', modules: 4, completed: 2 },
  { id: 'sql', title: 'SQL / Databases', icon: 'sql', modules: 3, completed: 2 },
  { id: 'html-css', title: 'HTML & CSS', icon: 'html-css', modules: 3, completed: 2 },
  { id: 'javascript', title: 'JavaScript', icon: 'javascript', modules: 3, completed: 2 },
  { id: 'python', title: 'Python', icon: 'python', modules: 3, completed: 2 },
];

export const COURSES_MAP = {
  frontend: FRONTEND_COURSE,
  backend: BACKEND_COURSE,
  fullstack: FULLSTACK_COURSE,
  'data-analytics': DATA_ANALYTICS_COURSE,
  react: REACT_COURSE,
  sql: SQL_COURSE,
  'html-css': HTML_CSS_COURSE,
  javascript: JAVASCRIPT_COURSE,
  python: PYTHON_COURSE,
};

export const getCourseById = (courseId) => {
  if (!courseId) return FRONTEND_COURSE;
  const normalizedId = courseId.toLowerCase().trim();
  return COURSES_MAP[normalizedId] || FRONTEND_COURSE;
};

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
      return <Terminal className="text-emerald-500" size={32} />;
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
