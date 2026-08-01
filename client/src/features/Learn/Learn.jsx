import { useState, useCallback, useEffect } from 'react';
import React, { isValidElement } from 'react';
import ReactFlow, { Background, addEdge, applyNodeChanges, applyEdgeChanges, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  BookOpen, Code2, Database, Terminal, ArrowLeft, CheckCircle, Lock, 
  Play, Plus, Layout, Server, PieChart, Layers, FileJson, Check, Zap, Search,
  ShieldCheck, Edit3, Trash2, Save, X, Link2, Move, Menu, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminConsoleModal from '../../components/AdminConsoleModal.jsx';
import { apiClient } from '../../lib/apiClient.js';

// --- ICON RENDER HELPER ---
const renderTopicIcon = (icon) => {
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

// --- INITIAL DEFAULT DATA ---
const INITIAL_CAREER_PATHS = [
  { id: 'frontend', title: 'Frontend Developer', icon: 'frontend', modules: 24, completed: 0 },
  { id: 'backend', title: 'Backend Developer', icon: 'backend', modules: 28, completed: 5 },
  { id: 'data-analytics', title: 'Data Analytics', icon: 'data-analytics', modules: 18, completed: 0 },
  { id: 'fullstack', title: 'Full Stack Engineer', icon: 'fullstack', modules: 42, completed: 12 },
];

const INITIAL_SKILL_PATHS = [
  { id: 'python', title: 'Python', icon: 'python', modules: 12, completed: 12 },
  { id: 'react', title: 'React', icon: 'react', modules: 8, completed: 4 },
  { id: 'sql', title: 'SQL / Databases', icon: 'sql', modules: 5, completed: 5 },
  { id: 'html-css', title: 'HTML & CSS', icon: 'html-css', modules: 10, completed: 10 },
  { id: 'javascript', title: 'JavaScript', icon: 'javascript', modules: 15, completed: 8 },
];

const INITIAL_NODES = [
  { 
    id: '1', 
    position: { x: 350, y: 50 }, 
    data: { 
      label: 'Variables & Types', 
      status: 'completed',
      overview: 'Master variable declarations (const, let, var), primitive data types, type coercion, and memory allocation in JavaScript/Python.',
      codeSnippet: `// Variables & Types Overview\nconst name = "ShadowCoder Engineer";\nlet xp = 450;\ntypeof xp; // "number"`
    }, 
    type: 'default' 
  },
  { 
    id: '2', 
    position: { x: 350, y: 150 }, 
    data: { 
      label: 'Control Flow', 
      status: 'completed',
      overview: 'Understand execution branch logic using if-else statements, switch cases, ternary operators, and loop iterations.',
      codeSnippet: `// Control Flow Example\nif (xp > 400) {\n  console.log("Level Up Unlocked!");\n}`
    } 
  },
  { 
    id: '3', 
    position: { x: 350, y: 250 }, 
    data: { 
      label: 'Data Structures', 
      status: 'active',
      overview: 'Explore arrays, hash maps, sets, queues, and tree traversals for efficient memory & time complexity.',
      codeSnippet: `// Hash Map Example\nconst cache = new Map();\ncache.set("user_101", { name: "Elena" });`
    } 
  },
  { 
    id: '4', 
    position: { x: 150, y: 350 }, 
    data: { 
      label: 'OOP Basics', 
      status: 'locked',
      overview: 'Encapsulation, inheritance, polymorphism, and class constructors.',
      codeSnippet: `class Developer {\n  constructor(name) { this.name = name; }\n}`
    } 
  },
  { 
    id: '5', 
    position: { x: 550, y: 350 }, 
    data: { 
      label: 'Functional Programming', 
      status: 'locked',
      overview: 'Pure functions, immutability, higher-order functions (map, filter, reduce), and function composition.',
      codeSnippet: `const doubleXp = (xpList) => xpList.map(x => x * 2);`
    } 
  },
  { 
    id: '6', 
    position: { x: 350, y: 450 }, 
    data: { 
      label: 'Final Project', 
      status: 'locked',
      overview: 'Build a production-ready asynchronous job simulation microservice.',
      codeSnippet: `// Final Project Execution\nconsole.log("Deploying Production Microservice...");`
    } 
  },
];

const INITIAL_EDGES = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', style: { stroke: '#000', strokeWidth: 3 } },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } }, 
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
  { id: 'e3-5', source: '3', target: '5', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
  { id: 'e4-6', source: '4', target: '6', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
  { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' } },
];

export default function Learn() {
  const { isAdmin } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [mobileSyllabusOpen, setMobileSyllabusOpen] = useState(false);

  // Persistent States
  const [careerPaths, setCareerPaths] = useState(() => {
    try {
      const saved = localStorage.getItem('shadowcoder_career_paths');
      return saved ? JSON.parse(saved) : INITIAL_CAREER_PATHS;
    } catch (e) {
      return INITIAL_CAREER_PATHS;
    }
  });

  const [skillPaths, setSkillPaths] = useState(() => {
    try {
      const saved = localStorage.getItem('shadowcoder_skill_paths');
      return saved ? JSON.parse(saved) : INITIAL_SKILL_PATHS;
    } catch (e) {
      return INITIAL_SKILL_PATHS;
    }
  });

  const [nodes, setNodes] = useState(() => {
    try {
      const saved = localStorage.getItem('shadowcoder_learn_nodes');
      return saved ? JSON.parse(saved) : INITIAL_NODES;
    } catch (e) {
      return INITIAL_NODES;
    }
  });

  const [edges, setEdges] = useState(() => {
    try {
      const saved = localStorage.getItem('shadowcoder_learn_edges');
      return saved ? JSON.parse(saved) : INITIAL_EDGES;
    } catch (e) {
      return INITIAL_EDGES;
    }
  });

  // Save changes to localStorage automatically
  useEffect(() => {
    localStorage.setItem('shadowcoder_career_paths', JSON.stringify(careerPaths));
  }, [careerPaths]);

  useEffect(() => {
    localStorage.setItem('shadowcoder_skill_paths', JSON.stringify(skillPaths));
  }, [skillPaths]);

  useEffect(() => {
    localStorage.setItem('shadowcoder_learn_nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('shadowcoder_learn_edges', JSON.stringify(edges));
  }, [edges]);

  // Sync with MongoDB backend API
  const syncWithBackend = async (updatedNodes, updatedEdges) => {
    try {
      if (selectedTopic) {
        await apiClient(`/learn/${selectedTopic.id || 'default'}`, {
          method: 'PUT',
          body: {
            title: selectedTopic.title,
            nodes: updatedNodes || nodes,
            edges: updatedEdges || edges,
          },
        });
      }
    } catch (err) {
      console.warn('Backend sync warning:', err.message);
    }
  };

  // Admin Roadmaps Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    action: 'add',
    item: null,
  });

  // Admin Node & Content Editor Modal State
  const [nodeEditorModal, setNodeEditorModal] = useState({
    isOpen: false,
    node: null,
    isNew: false,
  });

  const [nodeFormData, setNodeFormData] = useState({
    label: '',
    status: 'active',
    parentId: '',
    overview: '',
    codeSnippet: '',
  });

  const handleOpenNodeEditor = (node = null, isNew = false) => {
    if (node) {
      const parentEdge = edges.find((e) => e.target === node.id);
      setNodeFormData({
        label: node.data?.label || '',
        status: node.data?.status || 'active',
        parentId: parentEdge ? parentEdge.source : '',
        overview: node.data?.overview || 'Module overview content...',
        codeSnippet: node.data?.codeSnippet || '// Code example',
      });
    } else {
      const lastNode = nodes[nodes.length - 1];
      setNodeFormData({
        label: 'New Learning Module',
        status: 'active',
        parentId: lastNode ? lastNode.id : '',
        overview: 'Write lesson explanation and requirements here...',
        codeSnippet: '// Write code example here',
      });
    }
    setNodeEditorModal({ isOpen: true, node, isNew });
  };

  const handleSaveNode = async (e) => {
    e.preventDefault();
    let updatedNodes = [...nodes];
    let updatedEdges = [...edges];

    if (nodeEditorModal.isNew) {
      const newNodeId = `${Date.now()}`;
      const parentNode = nodes.find((n) => n.id === nodeFormData.parentId);
      const newX = parentNode ? parentNode.position.x : 350;
      const newY = parentNode ? parentNode.position.y + 120 : (nodes.length * 100 + 50);

      const newNode = {
        id: newNodeId,
        position: { x: newX, y: newY },
        data: {
          label: nodeFormData.label,
          status: nodeFormData.status,
          overview: nodeFormData.overview,
          codeSnippet: nodeFormData.codeSnippet,
        },
      };

      updatedNodes = [...nodes, newNode];

      if (nodeFormData.parentId) {
        updatedEdges = [
          ...edges,
          {
            id: `e${nodeFormData.parentId}-${newNodeId}`,
            source: nodeFormData.parentId,
            target: newNodeId,
            type: 'smoothstep',
            style: { stroke: '#3b82f6', strokeWidth: 3 },
          },
        ];
      }

      setNodes(updatedNodes);
      setEdges(updatedEdges);
      showToast("New Node & Link Created!");
    } else if (nodeEditorModal.node) {
      const targetId = nodeEditorModal.node.id;

      updatedNodes = nodes.map((n) =>
        n.id === targetId
          ? {
              ...n,
              data: {
                ...n.data,
                label: nodeFormData.label,
                status: nodeFormData.status,
                overview: nodeFormData.overview,
                codeSnippet: nodeFormData.codeSnippet,
              },
            }
          : n
      );

      const filtered = edges.filter((e) => e.target !== targetId);
      if (nodeFormData.parentId) {
        updatedEdges = [
          ...filtered,
          {
            id: `e${nodeFormData.parentId}-${targetId}`,
            source: nodeFormData.parentId,
            target: targetId,
            type: 'smoothstep',
            style: { stroke: '#3b82f6', strokeWidth: 3 },
          },
        ];
      } else {
        updatedEdges = filtered;
      }

      setNodes(updatedNodes);
      setEdges(updatedEdges);

      if (activeLesson && activeLesson.id === targetId) {
        setActiveLesson({
          ...activeLesson,
          data: {
            ...activeLesson.data,
            label: nodeFormData.label,
            status: nodeFormData.status,
            overview: nodeFormData.overview,
            codeSnippet: nodeFormData.codeSnippet,
          },
        });
      }
      showToast("Node Content & Connections Saved!");
    }

    await syncWithBackend(updatedNodes, updatedEdges);
    setNodeEditorModal({ isOpen: false, node: null, isNew: false });
  };

  const handleDeleteNode = async (nodeId) => {
    if (window.confirm("Are you sure you want to delete this node and its connections?")) {
      const updatedNodes = nodes.filter((n) => n.id !== nodeId);
      const updatedEdges = edges.filter((e) => e.source !== nodeId && e.target !== nodeId);

      setNodes(updatedNodes);
      setEdges(updatedEdges);

      if (activeLesson?.id === nodeId) {
        setActiveLesson(null);
      }
      setNodeEditorModal({ isOpen: false, node: null, isNew: false });
      await syncWithBackend(updatedNodes, updatedEdges);
      showToast("Node deleted.");
    }
  };

  const handleOpenAdminModal = (action, item = null) => {
    setModalConfig({
      isOpen: true,
      action,
      item,
    });
  };

  const handleAdminSave = ({ action, data, item, id }) => {
    if (action === 'delete') {
      setCareerPaths((prev) => prev.filter((p) => p.id !== id));
      setSkillPaths((prev) => prev.filter((p) => p.id !== id));
      showToast("Roadmap topic deleted.");
    } else if (action === 'add') {
      const newTopic = {
        id: `topic-${Date.now()}`,
        title: data.title,
        icon: 'book',
        modules: 10,
        completed: 0,
      };
      setSkillPaths((prev) => [newTopic, ...prev]);
      showToast("New Roadmap topic created.");
    } else if (action === 'edit' && item) {
      const updater = (list) =>
        list.map((p) => (p.id === item.id ? { ...p, title: data.title } : p));
      setCareerPaths(updater);
      setSkillPaths(updater);
      showToast("Roadmap title updated.");
    }
  };

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => {
      const updated = applyNodeChanges(changes, nds);
      localStorage.setItem('shadowcoder_learn_nodes', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => {
      const updated = applyEdgeChanges(changes, eds);
      localStorage.setItem('shadowcoder_learn_edges', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const updated = addEdge({ ...params, type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 3 } }, eds);
        localStorage.setItem('shadowcoder_learn_edges', JSON.stringify(updated));
        return updated;
      });
      showToast("Nodes Connected!");
    },
    []
  );

  const handleNodeClick = (event, node) => {
    if (node.data.status === 'locked' && !isAdmin) {
      showToast("This module is locked. Complete previous modules first.");
    } else {
      setActiveLesson(node);
      setMobileSyllabusOpen(false);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCompleteLesson = () => {
    setNodes((nds) => nds.map((n) => (n.id === activeLesson.id ? { ...n, data: { ...n.data, status: 'completed' } } : n)));
    setActiveLesson((prev) => ({ ...prev, data: { ...prev.data, status: 'completed' } }));
    showToast("+ 50 XP Earned! Module Completed.");
  };

  const handleUndoComplete = () => {
    setNodes((nds) => nds.map((n) => (n.id === activeLesson.id ? { ...n, data: { ...n.data, status: 'active' } } : n)));
    setActiveLesson((prev) => ({ ...prev, data: { ...prev.data, status: 'active' } }));
    showToast("Progress reverted. XP removed.");
  };

  const styledNodes = nodes.map(node => {
    let nodeClass = "font-black text-sm uppercase tracking-wide px-6 py-3 rounded-lg min-w-[180px] text-center border-[3px] transition-colors shadow-md ";
    
    if (node.data.status === 'completed') {
      nodeClass += "bg-[#bef264] text-[#0f172a] border-[#0f172a] shadow-[4px_4px_0px_0px_#0f172a]";
    } else if (node.data.status === 'active') {
      nodeClass += "bg-[#facc15] text-[#0f172a] border-[#0f172a] shadow-[4px_4px_0px_0px_#0f172a]";
    } else {
      nodeClass += "bg-slate-50 dark:bg-[#1e293b] text-slate-500 dark:text-slate-400 border-dashed border-slate-300 dark:border-slate-700";
    }

    return {
      ...node,
      className: nodeClass,
      data: {
        ...node.data,
        label: (
          <div className="flex items-center justify-center gap-2">
            {node.data.status === 'completed' && <CheckCircle size={18} className="text-[#0f172a]" />}
            {node.data.status === 'active' && <Play size={18} className="text-[#0f172a] fill-[#0f172a]" />}
            {node.data.status === 'locked' && <Lock size={18} className="text-slate-400 dark:text-slate-500" />}
            {node.data.label}
          </div>
        )
      }
    };
  });

  const RoadmapCard = ({ item }) => (
    <div onClick={() => setSelectedTopic(item)} className="bg-white dark:bg-[#161b22] border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(59,130,246,0.5)] hover:border-slate-900 dark:hover:border-blue-500 cursor-pointer transition-all group relative">
      <div className="flex items-center justify-between mb-6">
        <div className="bg-slate-50 dark:bg-[#0d1117] w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform">
          {renderTopicIcon(item.icon)}
        </div>

        {isAdmin && (
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleOpenAdminModal('edit', item)}
              className="p-1 text-slate-500 hover:text-blue-500 transition-colors"
              title="Edit Roadmap Topic"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={() => handleOpenAdminModal('delete', item)}
              className="p-1 text-slate-500 hover:text-rose-500 transition-colors"
              title="Delete Roadmap Topic"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">{item.title}</h2>
      <div className="flex items-center gap-4 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 transition-colors"><span className="flex items-center gap-1.5"><BookOpen size={16}/> {item.modules} Modules</span></div>
      <div>
        <div className="flex justify-between text-xs font-bold mb-2"><span className="text-slate-700 dark:text-slate-400 transition-colors">Progress</span><span className="text-blue-600 dark:text-blue-400">{Math.round((item.completed / item.modules) * 100)}%</span></div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 transition-colors"><div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style={{ width: `${(item.completed / item.modules) * 100}%` }}></div></div>
      </div>
    </div>
  );

  const Toast = () => {
    if (!toastMessage) return null;
    return (
      <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 bg-slate-900 dark:bg-slate-800 border dark:border-slate-700 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50 text-xs sm:text-sm">
        <Zap className="text-amber-400" size={18} />
        <span className="font-bold">{toastMessage}</span>
      </div>
    );
  };

  const filteredCareerPaths = careerPaths.filter(path => path.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredSkillPaths = skillPaths.filter(path => path.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // --- VIEW 3: CROSS-PLATFORM (MOBILE + DESKTOP) LESSON VIEWER ---
  if (activeLesson) {
    return (
      <div className="fixed inset-0 z-[100] w-screen h-screen flex flex-col md:flex-row bg-white dark:bg-[#0d1117] animate-in fade-in overflow-hidden transition-colors duration-300">
        <Toast /> 
        
        {/* Mobile Header Bar */}
        <div className="md:hidden h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161b22] px-4 flex items-center justify-between shrink-0">
          <button onClick={() => setActiveLesson(null)} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold text-xs">
            <ArrowLeft size={16} /> Roadmap
          </button>
          <span className="font-black text-slate-900 dark:text-white text-xs truncate max-w-[180px]">
            {activeLesson.data.label}
          </span>
          <button
            onClick={() => setMobileSyllabusOpen(!mobileSyllabusOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Syllabus Sidebar (Desktop + Mobile Slide-over Drawer) */}
        <div className={`
          fixed md:relative inset-y-0 left-0 z-50 w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161b22] flex flex-col shrink-0 transition-transform duration-300
          ${mobileSyllabusOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161b22] transition-colors flex items-center justify-between">
            <div>
              <button onClick={() => setActiveLesson(null)} className="hidden md:flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition-colors text-xs mb-3">
                <ArrowLeft size={14} /> Back to Roadmap
              </button>
              <h3 className="font-black text-slate-900 dark:text-white text-base leading-tight">
                {selectedTopic?.title || 'Roadmap'} Syllabus
              </h3>
            </div>

            <button onClick={() => setMobileSyllabusOpen(false)} className="md:hidden p-1 text-slate-400">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {nodes.map((n) => (
              <div key={n.id} className="group relative flex items-center gap-1">
                <button 
                  onClick={() => handleNodeClick(null, n)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold transition-colors ${
                    activeLesson.id === n.id ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm' : 
                    n.data.status === 'locked' ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed' : 
                    'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {n.data.status === 'completed' && <CheckCircle size={16} className="text-emerald-500 shrink-0" />}
                  {n.data.status === 'active' && <Play size={16} className="text-amber-500 shrink-0" />}
                  {n.data.status === 'locked' && <Lock size={16} className="text-slate-300 dark:text-slate-600 shrink-0" />}
                  <span className="truncate">{n.data.label}</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => handleOpenNodeEditor(n, false)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 transition-all shrink-0"
                    title="Edit Node Content"
                  >
                    <Edit3 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Lesson Content Area */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-[#0d1117] transition-colors p-6 sm:p-12 lg:p-16">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-6 flex items-start justify-between">
              <div>
                <span className="text-blue-600 dark:text-blue-400 font-black text-xs tracking-widest uppercase mb-2 flex items-center gap-2">
                  <BookOpen size={14}/> Module {activeLesson.id}
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{activeLesson.data.label}</h1>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleOpenNodeEditor(activeLesson, false)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Edit3 size={14} /> Edit Content
                </button>
              )}
            </div>
            
            <div className="prose prose-slate dark:prose-invert prose-base sm:prose-lg max-w-none">
              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8">
                {activeLesson.data.overview || `Welcome to the ${activeLesson.data.label} module. Here you will learn the core concepts required to master this topic.`}
              </p>
              
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">Code Example & Reference</h3>
              
              <div className="bg-[#0f172a] rounded-2xl p-4 sm:p-6 my-6 shadow-xl border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-slate-400 text-xs ml-3 font-mono font-bold">example.js</span>
                  </div>
                </div>

                <pre className="text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto m-0 p-0">
                  <code>
                    {activeLesson.data.codeSnippet || `// Example Implementation\nfunction initializeConcept(data) {\n  console.log("Ready to learn!");\n}`}
                  </code>
                </pre>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              {activeLesson.data.status === 'completed' ? (
                <div className="flex items-center gap-4">
                  <button onClick={handleUndoComplete} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold text-xs transition-colors underline">Undo Complete</button>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 text-xs"><CheckCircle size={16} /> Completed</div>
                </div>
              ) : (
                <button onClick={handleCompleteLesson} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 sm:px-8 rounded-xl flex items-center gap-2 text-xs sm:text-sm transition-colors shadow-lg"><Check size={18} /> Mark as Completed</button>
              )}
            </div>

          </div>
        </div>

        {/* Node & Content Editor Modal */}
        {nodeEditorModal.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck size={18} /> Admin Console • {nodeEditorModal.isNew ? 'Add New Node' : 'Edit Node'}
                </div>
                <button
                  onClick={() => setNodeEditorModal({ isOpen: false, node: null, isNew: false })}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveNode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Node Title / Label
                  </label>
                  <input
                    type="text"
                    value={nodeFormData.label}
                    onChange={(e) => setNodeFormData({ ...nodeFormData, label: e.target.value })}
                    placeholder="Enter node title (e.g. Async / Await)..."
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Link2 size={14} /> Connect From Parent Node
                    </label>
                    <select
                      value={nodeFormData.parentId}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, parentId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">(No Parent Connection)</option>
                      {nodes
                        .filter((n) => !nodeEditorModal.node || n.id !== nodeEditorModal.node.id)
                        .map((n) => (
                          <option key={n.id} value={n.id}>
                            Node {n.id}: {n.data.label}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Node Status
                    </label>
                    <select
                      value={nodeFormData.status}
                      onChange={(e) => setNodeFormData({ ...nodeFormData, status: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="active">Active (Unlocked)</option>
                      <option value="completed">Completed</option>
                      <option value="locked">Locked</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Lesson Explanation / Overview
                  </label>
                  <textarea
                    rows={3}
                    value={nodeFormData.overview}
                    onChange={(e) => setNodeFormData({ ...nodeFormData, overview: e.target.value })}
                    placeholder="Enter detailed lesson content and explanation..."
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Code Example Snippet
                  </label>
                  <textarea
                    rows={3}
                    value={nodeFormData.codeSnippet}
                    onChange={(e) => setNodeFormData({ ...nodeFormData, codeSnippet: e.target.value })}
                    placeholder="Enter code snippet example..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-3">
                  {!nodeEditorModal.isNew && nodeEditorModal.node && (
                    <button
                      type="button"
                      onClick={() => handleDeleteNode(nodeEditorModal.node.id)}
                      className="px-4 py-2.5 rounded-xl bg-rose-600/10 border border-rose-500/30 text-rose-500 font-bold text-xs hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
                    >
                      <Trash2 size={14} /> Delete Node
                    </button>
                  )}

                  <div className="flex items-center gap-3 ml-auto">
                    <button
                      type="button"
                      onClick={() => setNodeEditorModal({ isOpen: false, node: null, isNew: false })}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-colors flex items-center gap-2"
                    >
                      <Save size={14} /> Save Graph & Content
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- VIEW 1: CATEGORIZED ROADMAP GRID ---
  if (!selectedTopic) {
    return (
      <div className="py-8 animate-in fade-in max-w-7xl mx-auto px-4 transition-colors duration-300">
        
        {/* Admin Action Bar */}
        {isAdmin && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck size={18} /> Admin Console Active • Developer Roadmaps Control
            </div>
            <button
              onClick={() => handleOpenAdminModal('add')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-105"
            >
              <Plus size={16} /> Add New Learn Topic
            </button>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Developer Roadmaps</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-base sm:text-lg transition-colors">Step-by-step guides and paths to learn tools or a complete role.</p>
        </div>

        <div className="mb-10 relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-slate-400 dark:text-slate-500" size={20} />
          </div>
          <input
            type="text"
            placeholder="Search for a role or skill (e.g., Frontend, Python)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#161b22] border-2 border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-600 text-sm font-bold text-slate-800 dark:text-slate-200 shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {filteredCareerPaths.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6"><h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors">Role-Based Roadmaps</h2><div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4 transition-colors"></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredCareerPaths.map((path) => <RoadmapCard key={path.id} item={path} />)}
            </div>
          </div>
        )}

        {filteredSkillPaths.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6"><h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors">Skill-Based Roadmaps</h2><div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4 transition-colors"></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredSkillPaths.map((path) => <RoadmapCard key={path.id} item={path} />)}
            </div>
          </div>
        )}

        {filteredCareerPaths.length === 0 && filteredSkillPaths.length === 0 && (
          <div className="text-center py-16 px-4 bg-slate-50 dark:bg-[#161b22] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl transition-colors">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No roadmaps found</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">We couldn't find anything matching "{searchQuery}". Try a different term.</p>
          </div>
        )}

        {/* Admin Console Modal */}
        <AdminConsoleModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          type="learn"
          action={modalConfig.action}
          item={modalConfig.item}
          onSave={handleAdminSave}
        />
      </div>
    );
  }

  // --- VIEW 2: CROSS-PLATFORM ROADMAP SYLLABUS & GRAPH ---
  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#f8fafc] dark:bg-[#0d1117] animate-in fade-in flex flex-col pt-4 sm:pt-8 overflow-hidden transition-colors duration-300">
      <Toast /> 
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 relative z-10 px-4 sm:px-6 w-full shrink-0">
        <div>
          <button onClick={() => setSelectedTopic(null)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition-colors mb-2 text-xs sm:text-sm">
            <ArrowLeft size={16} /> Back to Roadmaps
          </button>
          <div className="flex items-center gap-3">
            {renderTopicIcon(selectedTopic.icon)}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white transition-colors">{selectedTopic.title}</h1>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Move size={14} /> Drag nodes to reposition • Draw lines to connect
            </div>
            <button
              onClick={() => handleOpenNodeEditor(null, true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-105"
            >
              <Plus size={16} /> Add Node & Connection
            </button>
          </div>
        )}
      </div>

      {/* DESKTOP 2D CANVAS GRAPH VIEW (Hidden on Mobile) */}
      <div className="hidden md:block flex-1 w-full relative">
        <ReactFlow 
          nodes={styledNodes} 
          edges={edges} 
          onNodesChange={onNodesChange} 
          onEdgesChange={onEdgesChange} 
          onConnect={onConnect} 
          onNodeClick={handleNodeClick}
          panOnScroll={true} 
          panOnDrag={true} 
          zoomOnScroll={true} 
          zoomOnPinch={true} 
          zoomOnDoubleClick={true}
          nodesDraggable={isAdmin} 
          nodesConnectable={isAdmin} 
          elementsSelectable={true}
          fitView 
          fitViewOptions={{ padding: 0.3 }} 
          proOptions={{ hideAttribution: true }} 
        >
          <Background color="#94a3b8" gap={30} size={1.5} />
          <Controls className="!bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-800 !text-slate-900 dark:!text-white !rounded-xl" />
        </ReactFlow>
      </div>

      {/* MOBILE RESPONSIVE STEP-BY-STEP SYLLABUS TIMELINE (Shown on Mobile) */}
      <div className="md:hidden flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-2">
          <BookOpen size={16} className="shrink-0" />
          <span>Tap any module below to open the lesson & start learning!</span>
        </div>

        <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 dark:border-slate-800">
          {nodes.map((node, index) => (
            <div
              key={node.id}
              onClick={(e) => handleNodeClick(e, node)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                node.data.status === 'completed'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/50 text-slate-900 dark:text-white'
                  : node.data.status === 'active'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/50 text-slate-900 dark:text-white'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              {/* Bullet Node Indicator */}
              <div className={`absolute -left-[25px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 ${
                node.data.status === 'completed' ? 'border-emerald-500 bg-emerald-500' :
                node.data.status === 'active' ? 'border-amber-500 bg-amber-500' : 'border-slate-300 dark:border-slate-700'
              }`} />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black font-mono text-slate-400">#{index + 1}</span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{node.data.label}</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {node.data.overview || 'Tap to view lesson content'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {node.data.status === 'completed' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase">Done</span>
                  )}
                  {node.data.status === 'active' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase">Active</span>
                  )}
                  {node.data.status === 'locked' && (
                    <Lock size={14} className="text-slate-400" />
                  )}
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node & Content Editor Modal */}
      {nodeEditorModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck size={18} /> Admin Console • {nodeEditorModal.isNew ? 'Add New Node & Link' : 'Edit Node, Content & Connections'}
              </div>
              <button
                onClick={() => setNodeEditorModal({ isOpen: false, node: null, isNew: false })}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Node Title / Label
                </label>
                <input
                  type="text"
                  value={nodeFormData.label}
                  onChange={(e) => setNodeFormData({ ...nodeFormData, label: e.target.value })}
                  placeholder="Enter node title (e.g. Async / Await)..."
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Link2 size={14} /> Connect From Parent Node
                  </label>
                  <select
                    value={nodeFormData.parentId}
                    onChange={(e) => setNodeFormData({ ...nodeFormData, parentId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">(No Parent Connection)</option>
                    {nodes
                      .filter((n) => !nodeEditorModal.node || n.id !== nodeEditorModal.node.id)
                      .map((n) => (
                        <option key={n.id} value={n.id}>
                          Node {n.id}: {n.data.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Node Status
                  </label>
                  <select
                    value={nodeFormData.status}
                    onChange={(e) => setNodeFormData({ ...nodeFormData, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="active">Active (Unlocked)</option>
                    <option value="completed">Completed</option>
                    <option value="locked">Locked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Lesson Explanation / Overview
                </label>
                <textarea
                  rows={3}
                  value={nodeFormData.overview}
                  onChange={(e) => setNodeFormData({ ...nodeFormData, overview: e.target.value })}
                  placeholder="Enter detailed lesson content and explanation..."
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Code Example Snippet
                </label>
                <textarea
                  rows={3}
                  value={nodeFormData.codeSnippet}
                  onChange={(e) => setNodeFormData({ ...nodeFormData, codeSnippet: e.target.value })}
                  placeholder="Enter code snippet example..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-3">
                {!nodeEditorModal.isNew && nodeEditorModal.node && (
                  <button
                    type="button"
                    onClick={() => handleDeleteNode(nodeEditorModal.node.id)}
                    className="px-4 py-2.5 rounded-xl bg-rose-600/10 border border-rose-500/30 text-rose-500 font-bold text-xs hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Trash2 size={14} /> Delete Node
                  </button>
                )}

                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setNodeEditorModal({ isOpen: false, node: null, isNew: false })}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-colors flex items-center gap-2"
                  >
                    <Save size={14} /> Save Graph & Content
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}