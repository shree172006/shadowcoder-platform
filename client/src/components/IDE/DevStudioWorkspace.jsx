import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Folder, Search, Cpu, Settings, Play, CheckCircle2, 
  TerminalSquare, Send, Sparkles, ChevronLeft, ChevronRight, 
  Layers, ShieldCheck, Brain, ClipboardList, Maximize2, Minimize2 
} from 'lucide-react';
import FileTreeExplorer from './FileTreeExplorer.jsx';
import MonacoEditorPane from './MonacoEditorPane.jsx';
import IntegratedTerminal from './IntegratedTerminal.jsx';
import VSCodeStatusBar from './VSCodeStatusBar.jsx';
import AiReviewModal from './AiReviewModal.jsx';
import TaskInstructionsPanel from './TaskInstructionsPanel.jsx';

export default function DevStudioWorkspace({
  title = 'Project Workspace',
  subtitle = 'Job Simulation Sandbox',
  branchName = 'main',
  initialFiles = {},
  onRunEvaluation,
  onSubmitSolution,
  isEvaluating = false,
  evaluationResults = null,
  logs = [],
  onClearLogs,
  extraTopRightActions = null,
  scenarioContext = null,
}) {
  const [files, setFiles] = useState(initialFiles);
  const [openTabs, setOpenTabs] = useState(() => {
    const keys = Object.keys(initialFiles);
    return keys.length > 0 ? [keys[0]] : ['src/App.jsx'];
  });
  const [activeFile, setActiveFile] = useState(() => {
    const keys = Object.keys(initialFiles);
    return keys.length > 0 ? keys[0] : 'src/App.jsx';
  });
  const [dirtyFiles, setDirtyFiles] = useState(new Set());
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });

  // Activity Bar and Sidebar State: 'instructions' (Task Specs) | 'explorer' (Files)
  const [activeSidebarTab, setActiveSidebarTab] = useState('instructions');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(340);
  const [isExpandedSidebar, setIsExpandedSidebar] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(220);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Sync initialFiles if props change
  useEffect(() => {
    if (initialFiles && Object.keys(initialFiles).length > 0) {
      setFiles(initialFiles);
      const keys = Object.keys(initialFiles);
      if (!keys.includes(activeFile)) {
        setActiveFile(keys[0]);
        setOpenTabs((prev) => (prev.length > 0 ? prev : [keys[0]]));
      }
    }
  }, [initialFiles]);

  // Handle Tab and File Selection
  const handleSelectFile = useCallback((filePath) => {
    setActiveFile(filePath);
    setOpenTabs((prev) => (prev.includes(filePath) ? prev : [...prev, filePath]));
  }, []);

  const handleCloseTab = useCallback((filePath) => {
    setOpenTabs((prev) => {
      const filtered = prev.filter((p) => p !== filePath);
      if (activeFile === filePath && filtered.length > 0) {
        setActiveFile(filtered[filtered.length - 1]);
      }
      return filtered;
    });
  }, [activeFile]);

  // Code Mutation Handler
  const handleCodeChange = useCallback((filePath, newCode) => {
    setFiles((prev) => ({
      ...prev,
      [filePath]: newCode,
    }));
    setDirtyFiles((prev) => new Set(prev).add(filePath));
  }, []);

  // Save File
  const handleSave = useCallback(() => {
    setDirtyFiles(new Set());
  }, []);

  // File Creation, Rename, Delete
  const handleCreateFile = useCallback((filePath, initialContent = '') => {
    setFiles((prev) => ({
      ...prev,
      [filePath]: initialContent,
    }));
    handleSelectFile(filePath);
  }, [handleSelectFile]);

  const handleDeleteFile = useCallback((filePath) => {
    setFiles((prev) => {
      const copy = { ...prev };
      delete copy[filePath];
      return copy;
    });
    handleCloseTab(filePath);
  }, [handleCloseTab]);

  const handleRenameFile = useCallback((oldPath, newPath) => {
    setFiles((prev) => {
      const copy = { ...prev };
      const content = copy[oldPath] ?? '';
      delete copy[oldPath];
      copy[newPath] = content;
      return copy;
    });
    setOpenTabs((prev) => prev.map((p) => (p === oldPath ? newPath : p)));
    if (activeFile === oldPath) setActiveFile(newPath);
  }, [activeFile]);

  // Toggle Sidebar width (standard 340px vs wide 460px)
  const toggleExpandSidebar = () => {
    if (isExpandedSidebar) {
      setSidebarWidth(340);
      setIsExpandedSidebar(false);
    } else {
      setSidebarWidth(460);
      setIsExpandedSidebar(true);
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+B / Cmd+B: Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
      // Ctrl+` / Cmd+`: Toggle Terminal
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
      // Ctrl+Enter / Cmd+Enter: Run Tests
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onRunEvaluation?.(files);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [files, onRunEvaluation]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full bg-[#07090e] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* ═══════════════════════════════════════════════════════ */}
      {/* TOP WORKSPACE ACTION HEADER */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#090d14] border-b border-slate-800 text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="font-black text-white tracking-tight">{title}</h2>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">{subtitle}</span>
        </div>

        <div className="flex items-center gap-2">
          {extraTopRightActions}

          {/* AI Staff Review Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Sparkles size={13} className="text-purple-400" /> AI Review
          </button>

          {/* Quick Run Test Suite Button */}
          <button
            onClick={() => onRunEvaluation?.(files)}
            disabled={isEvaluating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
          >
            {isEvaluating ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play size={13} className="fill-white" />
            )}
            Run Tests
          </button>

          {/* Submit Pull Request / Final Solution */}
          {onSubmitSolution && (
            <button
              onClick={() => onSubmitSolution?.(files)}
              disabled={isEvaluating}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
            >
              <Send size={13} /> Submit Solution
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MAIN WORKSPACE BODY */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 1. LEFT ACTIVITY BAR */}
        <div className="w-12 bg-[#090d14] border-r border-slate-800/80 flex flex-col items-center justify-between py-3 shrink-0 select-none">
          <div className="flex flex-col items-center gap-3">
            {[
              { id: 'instructions', icon: <ClipboardList size={18} />, label: 'Task Specs & Jira Ticket' },
              { id: 'explorer', icon: <Folder size={18} />, label: 'File Explorer' },
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => {
                  if (activeSidebarTab === act.id && isSidebarOpen) {
                    setIsSidebarOpen(false);
                  } else {
                    setActiveSidebarTab(act.id);
                    setIsSidebarOpen(true);
                  }
                }}
                title={act.label}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  activeSidebarTab === act.id && isSidebarOpen
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {act.icon}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            title="Toggle Sidebar (Ctrl+B)"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* 2. COLLAPSIBLE & EXPANDABLE SIDEBAR PANEL */}
        {isSidebarOpen && (
          <div
            style={{ width: `${sidebarWidth}px` }}
            className="h-full bg-[#0b0e14] border-r border-slate-800 shrink-0 overflow-hidden relative flex flex-col transition-all duration-150"
          >
            {/* Top Quick Tab Selector */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#080b11] border-b border-slate-800 text-[11px] font-bold">
              <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveSidebarTab('instructions')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeSidebarTab === 'instructions'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ClipboardList size={12} /> Jira Ticket
                </button>

                <button
                  onClick={() => setActiveSidebarTab('explorer')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeSidebarTab === 'explorer'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Folder size={12} /> Files ({Object.keys(files).length})
                </button>
              </div>

              {/* Expand / Minimize Width Toggle */}
              <button
                onClick={toggleExpandSidebar}
                title={isExpandedSidebar ? 'Compact Sidebar' : 'Expand Sidebar'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {isExpandedSidebar ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-hidden">
              {activeSidebarTab === 'instructions' ? (
                <TaskInstructionsPanel
                  scenarioContext={scenarioContext}
                  title={title}
                  subtitle={subtitle}
                  activeFile={activeFile}
                  onOpenFile={handleSelectFile}
                />
              ) : (
                <FileTreeExplorer
                  files={files}
                  activeFile={activeFile}
                  onSelectFile={handleSelectFile}
                  onCreateFile={handleCreateFile}
                  onDeleteFile={handleDeleteFile}
                  onRenameFile={handleRenameFile}
                  dirtyFiles={dirtyFiles}
                />
              )}
            </div>
          </div>
        )}

        {/* 3. CENTER EDITOR & BOTTOM TERMINAL AREA */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* MONACO EDITOR PANE */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditorPane
              files={files}
              openTabs={openTabs}
              activeFile={activeFile}
              onSelectTab={setActiveFile}
              onCloseTab={handleCloseTab}
              onCodeChange={handleCodeChange}
              onCursorChange={setCursorPos}
              dirtyFiles={dirtyFiles}
              onSave={handleSave}
            />
          </div>

          {/* INTEGRATED TERMINAL DRAWER */}
          {isTerminalOpen && (
            <div
              style={{ height: `${terminalHeight}px` }}
              className="w-full shrink-0 border-t border-slate-800 overflow-hidden"
            >
              <IntegratedTerminal
                logs={logs}
                testResults={evaluationResults}
                isExecuting={isEvaluating}
                onRunTests={() => onRunEvaluation?.(files)}
                onClearLogs={onClearLogs}
                files={files}
                activeFile={activeFile}
              />
            </div>
          )}

        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* VS CODE BOTTOM STATUS BAR */}
      {/* ═══════════════════════════════════════════════════════ */}
      <VSCodeStatusBar
        activeFile={activeFile}
        cursorPos={cursorPos}
        branchName={branchName}
        isConnected={true}
        errorCount={evaluationResults && evaluationResults.score < 80 ? 1 : 0}
        warningCount={0}
        onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
      />

      {/* AI STAFF REVIEW MODAL */}
      {isAiModalOpen && (
        <AiReviewModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          files={files}
          scenarioTitle={title}
          scenarioRole={subtitle}
          difficulty="Senior"
          testResults={evaluationResults}
        />
      )}

    </div>
  );
}
