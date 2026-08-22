import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactFlow, { 
  Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ArrowLeft, BookOpen, Lock, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

import { useAuth } from '../../../context/AuthContext.jsx';
import { getCourseById, renderTopicIcon } from '../data/coursesData.jsx';

export default function CourseRoadmapView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const course = useMemo(() => getCourseById(courseId), [courseId]);

  const [nodes, setNodes] = useState(() => course.nodes || []);
  const [edges, setEdges] = useState(() => course.edges || []);

  // Update nodes & edges whenever courseId changes in the URL (Browser Back/Forward support)
  useEffect(() => {
    const currentCourse = getCourseById(courseId);
    setNodes(currentCourse.nodes || []);
    setEdges(currentCourse.edges || []);
  }, [courseId]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Safe styling of nodes based on completion status
  const styledNodes = useMemo(() => {
    return nodes.map((node) => {
      const data = node.data || {};
      const isCompleted = data.status === 'completed';
      const isActive = data.status === 'active';

      return {
        ...node,
        data: {
          ...data,
          label: data.label || 'Module Lesson',
        },
        style: {
          background: isCompleted ? '#064e3b' : isActive ? '#78350f' : '#0f172a',
          color: '#ffffff',
          border: isCompleted ? '2px solid #10b981' : isActive ? '2px solid #f59e0b' : '2px solid #334155',
          borderRadius: '16px',
          padding: '12px 18px',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: isCompleted ? '0 0 15px rgba(16, 185, 129, 0.3)' : isActive ? '0 0 15px rgba(245, 158, 11, 0.3)' : 'none',
          cursor: 'pointer',
          minWidth: '220px',
        },
      };
    });
  }, [nodes]);

  const handleNodeClick = (_, node) => {
    if (node && node.id) {
      navigate(`/learn/${course.id || courseId}/lesson/${node.id}`);
    }
  };

  const completedCount = nodes.filter((n) => n.data?.status === 'completed').length;
  const totalCount = nodes.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 p-4 sm:p-8 flex flex-col transition-colors duration-300 select-none">
      
      {/* HEADER BAR */}
      <div className="max-w-7xl mx-auto w-full mb-6 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-3 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Roadmaps Catalog
          </Link>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/30">
              {renderTopicIcon(course.icon)}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {course.title} Roadmap
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>
        </div>

        {/* Course Progress Card */}
        <div className="w-full md:w-auto bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl min-w-[240px]">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
            <span>Syllabus Mastery</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono">{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-center text-[11px] font-bold text-slate-400 font-mono">
            {completedCount} of {totalCount} Modules Passed
          </div>
        </div>
      </div>

      {/* DESKTOP 2D FLOWCHART CANVAS */}
      <div className="max-w-7xl mx-auto w-full flex-1 min-h-[550px] bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative hidden md:block">
        <ReactFlow 
          key={courseId}
          nodes={styledNodes} 
          edges={edges} 
          onNodesChange={onNodesChange} 
          onEdgesChange={onEdgesChange} 
          onConnect={onConnect} 
          onNodeClick={handleNodeClick}
          panOnScroll={true} 
          panOnDrag={true} 
          zoomOnScroll={true} 
          nodesDraggable={isAdmin} 
          nodesConnectable={isAdmin} 
          elementsSelectable={true}
          fitView 
          fitViewOptions={{ padding: 0.3 }} 
          proOptions={{ hideAttribution: true }} 
        >
          <Background color="#64748b" gap={24} size={1} />
          <Controls className="!bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-800 !text-slate-900 dark:!text-white !rounded-xl" />
        </ReactFlow>
      </div>

      {/* MOBILE STEP-BY-STEP SYLLABUS TIMELINE */}
      <div className="md:hidden max-w-7xl mx-auto w-full space-y-4">
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-2">
          <BookOpen size={16} className="shrink-0" />
          <span>Tap any module to open its dedicated interactive lesson page & quiz!</span>
        </div>

        <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 dark:border-slate-800">
          {nodes.map((node, index) => {
            const data = node.data || {};
            const isCompleted = data.status === 'completed';
            const isActive = data.status === 'active';

            return (
              <div
                key={node.id}
                onClick={() => navigate(`/learn/${course.id || courseId}/lesson/${node.id}`)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/50 text-slate-900 dark:text-white'
                    : isActive
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/50 text-slate-900 dark:text-white'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                <div className={`absolute -left-[25px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 ${
                  isCompleted ? 'border-emerald-500 bg-emerald-500' :
                  isActive ? 'border-amber-500 bg-amber-500' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                }`} />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black font-mono text-slate-400">#{index + 1}</span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{data.label || 'Module Lesson'}</h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {data.overview || 'Tap to open lesson page'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase">Passed</span>
                    )}
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase">Active</span>
                    )}
                    {data.status === 'locked' && (
                      <Lock size={14} className="text-slate-400" />
                    )}
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
