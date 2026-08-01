import { useState, useCallback, useEffect } from 'react';
import React, { isValidElement } from 'react';
import ReactFlow, { Background, addEdge, applyNodeChanges, applyEdgeChanges, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  BookOpen, Code2, Database, Terminal, ArrowLeft, CheckCircle, Lock, 
  Play, Plus, Layout, Server, PieChart, Layers, FileJson, Check, Zap, Search,
  ShieldCheck, Edit3, Trash2, Save, X, Link2, Move, Menu, ChevronRight, HelpCircle, AlertCircle, Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminConsoleModal from '../../components/AdminConsoleModal.jsx';

// --- IMPORT MODULAR COURSE ROADMAPS ---
import { FRONTEND_COURSE } from './courses/FrontendCourse.jsx';
import { BACKEND_COURSE } from './courses/BackendCourse.jsx';
import { FULLSTACK_COURSE } from './courses/FullStackCourse.jsx';
import { DATA_ANALYTICS_COURSE } from './courses/DataAnalyticsCourse.jsx';

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

const INITIAL_CAREER_PATHS = [
  { id: 'frontend', title: 'Frontend Developer', icon: 'frontend', modules: 9, completed: 3 },
  { id: 'backend', title: 'Backend Developer', icon: 'backend', modules: 5, completed: 2 },
  { id: 'data-analytics', title: 'Data Analytics', icon: 'data-analytics', modules: 2, completed: 1 },
  { id: 'fullstack', title: 'Full Stack Engineer', icon: 'fullstack', modules: 3, completed: 2 },
];

const INITIAL_SKILL_PATHS = [
  { id: 'react', title: 'React', icon: 'react', modules: 8, completed: 4 },
  { id: 'sql', title: 'SQL / Databases', icon: 'sql', modules: 5, completed: 5 },
  { id: 'html-css', title: 'HTML & CSS', icon: 'html-css', modules: 10, completed: 10 },
  { id: 'javascript', title: 'JavaScript', icon: 'javascript', modules: 15, completed: 8 },
];

export default function Learn() {
  const { isAdmin } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [mobileSyllabusOpen, setMobileSyllabusOpen] = useState(false);

  // Quiz State for Active Lesson
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isQuizCorrect, setIsQuizCorrect] = useState(false);

  // Reset quiz state when activeLesson changes
  useEffect(() => {
    setSelectedAnswerIndex(null);
    setQuizSubmitted(false);
    setIsQuizCorrect(false);
  }, [activeLesson]);

  // Persistent States
  const [careerPaths, setCareerPaths] = useState(INITIAL_CAREER_PATHS);
  const [skillPaths, setSkillPaths] = useState(INITIAL_SKILL_PATHS);
  const [nodes, setNodes] = useState(FRONTEND_COURSE.nodes);
  const [edges, setEdges] = useState(FRONTEND_COURSE.edges || []);

  // Admin Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    action: 'add',
    item: null,
  });

  // Active Node Inspector Drawer Modal State
  const [nodeEditorState, setNodeEditorState] = useState({
    isOpen: false,
    isCreatingNew: false,
    targetNode: null,
    label: '',
    status: 'locked',
    overview: '',
    codeSnippet: '',
  });

  // Filtered Paths for Search
  const filteredCareerPaths = careerPaths.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredSkillPaths = skillPaths.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Node Change Handlers for ReactFlow Canvas
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', style: { stroke: '#3b82f6', strokeWidth: 3 } }, eds)),
    []
  );

  const handleSelectTopic = (path) => {
    setSelectedTopic(path);
    if (path.id === 'backend') {
      setNodes(BACKEND_COURSE.nodes);
      setEdges(BACKEND_COURSE.edges || []);
    } else if (path.id === 'fullstack') {
      setNodes(FULLSTACK_COURSE.nodes);
      setEdges(FULLSTACK_COURSE.edges || []);
    } else if (path.id === 'data-analytics') {
      setNodes(DATA_ANALYTICS_COURSE.nodes);
      setEdges(DATA_ANALYTICS_COURSE.edges || []);
    } else {
      setNodes(FRONTEND_COURSE.nodes);
      setEdges(FRONTEND_COURSE.edges || []);
    }
  };

  const handleNodeClick = (_, node) => {
    setActiveLesson(node);
  };

  const handleOpenNodeEditor = (node, isCreatingNew = false) => {
    if (!isAdmin) return;
    if (isCreatingNew) {
      setNodeEditorState({
        isOpen: true,
        isCreatingNew: true,
        targetNode: null,
        label: '',
        status: 'locked',
        overview: '',
        codeSnippet: '',
      });
    } else if (node) {
      setNodeEditorState({
        isOpen: true,
        isCreatingNew: false,
        targetNode: node,
        label: node.data?.label || '',
        status: node.data?.status || 'locked',
        overview: node.data?.overview || '',
        codeSnippet: node.data?.codeSnippet || '',
      });
    }
  };

  const handleSaveNodeData = (e) => {
    e.preventDefault();
    const { isCreatingNew, targetNode, label, status, overview, codeSnippet } = nodeEditorState;

    if (isCreatingNew) {
      const newNodeId = `node_${Date.now()}`;
      const newNode = {
        id: newNodeId,
        position: { x: 350, y: (nodes.length + 1) * 100 },
        data: { label, status, overview, codeSnippet },
      };

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);

      if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1];
        setEdges((eds) => [
          ...eds,
          {
            id: `e${lastNode.id}-${newNodeId}`,
            source: lastNode.id,
            target: newNodeId,
            type: 'smoothstep',
            style: { stroke: '#94a3b8', strokeWidth: 3, strokeDasharray: '5,5' },
          },
        ]);
      }

      setToastMessage(`Created node "${label}"`);
    } else if (targetNode) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === targetNode.id
            ? { ...n, data: { ...n.data, label, status, overview, codeSnippet } }
            : n
        )
      );
      setToastMessage(`Updated "${label}"`);
    }

    setNodeEditorState((prev) => ({ ...prev, isOpen: false }));
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAdminSave = ({ action, data, item, id }) => {
    if (action === 'delete') {
      setCareerPaths((prev) => prev.filter((p) => p.id !== id));
      setSkillPaths((prev) => prev.filter((p) => p.id !== id));
      setToastMessage('Roadmap removed');
    } else if (action === 'add') {
      const newPath = {
        id: `path_${Date.now()}`,
        title: data.title,
        icon: data.category?.toLowerCase() || 'code2',
        modules: 10,
        completed: 0,
      };
      if (data.type === 'skill') {
        setSkillPaths((prev) => [...prev, newPath]);
      } else {
        setCareerPaths((prev) => [...prev, newPath]);
      }
      setToastMessage(`Added roadmap "${data.title}"`);
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuizSubmit = () => {
    if (selectedAnswerIndex === null || !activeLesson?.data?.testQuestion) return;

    const correct = selectedAnswerIndex === activeLesson.data.testQuestion.correctIndex;
    setIsQuizCorrect(correct);
    setQuizSubmitted(true);

    if (correct) {
      const currentIndex = nodes.findIndex(n => n.id === activeLesson.id);
      
      setNodes(prevNodes => prevNodes.map((n, idx) => {
        if (n.id === activeLesson.id) {
          return { ...n, data: { ...n.data, status: 'completed' } };
        }
        if (idx === currentIndex + 1 && n.data.status === 'locked') {
          return { ...n, data: { ...n.data, status: 'active' } };
        }
        return n;
      }));

      setToastMessage(`🎉 Correct! Node Passed & Next Roadmap Step Unlocked! (+50 XP)`);
    } else {
      setToastMessage(`❌ Incorrect. Review the overview and try again.`);
    }

    setTimeout(() => setToastMessage(null), 4000);
  };

  // Styled ReactFlow Nodes
  const styledNodes = nodes.map((node) => {
    const isCompleted = node.data.status === 'completed';
    const isActive = node.data.status === 'active';
    const isLocked = node.data.status === 'locked';

    let bgColor = 'bg-slate-50 dark:bg-[#161b22] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800';
    if (isCompleted) bgColor = 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20';
    if (isActive) bgColor = 'bg-amber-500 text-slate-950 border-amber-600 shadow-lg shadow-amber-500/30 animate-pulse';

    return {
      ...node,
      data: {
        ...node.data,
        label: (
          <div className="flex items-center justify-between gap-3 px-1 py-0.5">
            <div className="flex items-center gap-2">
              {isCompleted ? <CheckCircle size={16} className="text-white" /> : isLocked ? <Lock size={16} className="text-slate-400" /> : <Play size={16} className="fill-slate-950 text-slate-950" />}
              <span className="font-bold text-xs sm:text-sm tracking-tight">{node.data.label}</span>
            </div>
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenNodeEditor(node, false);
                }}
                className="p-1 rounded-md bg-black/20 hover:bg-black/40 text-white transition-colors ml-2"
                title="Edit Node"
              >
                <Edit3 size={12} />
              </button>
            )}
          </div>
        ),
      },
      className: `!rounded-2xl !p-3 !border-2 !font-sans transition-all ${bgColor}`,
    };
  });

  const RoadmapCard = ({ item }) => (
    <div
      onClick={() => handleSelectTopic(item)}
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

            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdminSave({ action: 'delete', id: item.id });
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

  const Toast = () => toastMessage ? (
    <div className="fixed bottom-6 right-6 z-[110] px-5 py-3 rounded-2xl bg-slate-900 border-2 border-indigo-500 text-white font-bold text-xs shadow-2xl animate-in slide-in-from-bottom-4 flex items-center gap-2">
      <Zap size={16} className="text-amber-400 fill-amber-400" />
      <span>{toastMessage}</span>
    </div>
  ) : null;

  // --- VIEW 1: CATALOG OVERVIEW ---
  if (!selectedTopic) {
    return (
      <div className="py-8 max-w-7xl mx-auto px-4 animate-in fade-in transition-colors duration-300">
        <Toast />

        {isAdmin && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck size={18} /> Admin Console Active • Learn Roadmaps Control
            </div>
            <button
              onClick={() => setModalConfig({ isOpen: true, action: 'add', item: null })}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-105"
            >
              <Plus size={16} /> Add New Roadmap
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <BookOpen className="text-indigo-600 dark:text-indigo-400" /> Developer Roadmaps
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
              Structured learning pathways designed for software engineering roles and core technologies.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search roadmaps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {filteredCareerPaths.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors">Role-Based Roadmaps</h2>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4 transition-colors"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredCareerPaths.map((path) => <RoadmapCard key={path.id} item={path} />)}
            </div>
          </div>
        )}

        {filteredSkillPaths.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors">Skill-Based Roadmaps</h2>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-4 transition-colors"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredSkillPaths.map((path) => <RoadmapCard key={path.id} item={path} />)}
            </div>
          </div>
        )}

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

  // --- VIEW 2: CROSS-PLATFORM ROADMAP SYLLABUS & 2D GRAPH ---
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

      {/* DESKTOP 2D CANVAS GRAPH VIEW */}
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

      {/* MOBILE RESPONSIVE STEP-BY-STEP SYLLABUS TIMELINE */}
      <div className="md:hidden flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-2">
          <BookOpen size={16} className="shrink-0" />
          <span>Tap any module to view lesson & pass verification test to unlock next!</span>
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
                      {node.data.overview || 'Tap to view lesson & test'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {node.data.status === 'completed' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase">Passed</span>
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

      {/* ACTIVE NODE LESSON & VERIFICATION TEST MODAL DRAWER */}
      {activeLesson && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#161b22] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest block mb-1">Active Lesson Module</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{activeLesson.data.label}</h3>
              </div>
              <button onClick={() => setActiveLesson(null)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <BookOpen size={14} className="text-indigo-400" /> Module Overview
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {activeLesson.data.overview || 'Master key principles for this milestone.'}
              </p>
            </div>

            {activeLesson.data.codeSnippet && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Code2 size={14} className="text-emerald-400" /> Playbook Code Example
                </h4>
                <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
                  <pre>{activeLesson.data.codeSnippet}</pre>
                </div>
              </div>
            )}

            {activeLesson.data.testQuestion && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 pt-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-wider">
                  <Award size={16} /> Module Verification Test Challenge
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {activeLesson.data.testQuestion.question}
                </h4>

                <div className="space-y-2">
                  {activeLesson.data.testQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => !quizSubmitted && setSelectedAnswerIndex(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                        selectedAnswerIndex === idx
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold text-[10px]">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    </button>
                  ))}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={selectedAnswerIndex === null}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    Submit Test Answer
                  </button>
                ) : (
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
                    isQuizCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    <p className="font-bold">{isQuizCorrect ? '✅ Verification Test Passed!' : '❌ Incorrect Answer'}</p>
                    <p>{activeLesson.data.testQuestion.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* NODE EDITOR MODAL (ADMIN ONLY) */}
      {nodeEditorState.isOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <form onSubmit={handleSaveNodeData} className="bg-white dark:bg-[#161b22] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {nodeEditorState.isCreatingNew ? 'Add New Node' : 'Edit Node Data'}
              </h3>
              <button type="button" onClick={() => setNodeEditorState((prev) => ({ ...prev, isOpen: false }))} className="p-1 text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Node Title</label>
              <input
                type="text"
                value={nodeEditorState.label}
                onChange={(e) => setNodeEditorState({ ...nodeEditorState, label: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
              <select
                value={nodeEditorState.status}
                onChange={(e) => setNodeEditorState({ ...nodeEditorState, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="completed">Completed (Passed)</option>
                <option value="active">Active</option>
                <option value="locked">Locked</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Overview Description</label>
              <textarea
                value={nodeEditorState.overview}
                onChange={(e) => setNodeEditorState({ ...nodeEditorState, overview: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Code Playbook Snippet</label>
              <textarea
                value={nodeEditorState.codeSnippet}
                onChange={(e) => setNodeEditorState({ ...nodeEditorState, codeSnippet: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 bg-[#0d1117] border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setNodeEditorState((prev) => ({ ...prev, isOpen: false }))} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md">
                Save Node Data
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}