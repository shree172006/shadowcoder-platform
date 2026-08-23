import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  X, Plus, Code2, ChevronRight, FileCode, Check, Save, AlignLeft 
} from 'lucide-react';
import { getFileIcon, getMonacoLanguage } from './fileUtils.jsx';

export default function MonacoEditorPane({
  files = {},
  openTabs = [],
  activeFile = '',
  onSelectTab,
  onCloseTab,
  onCodeChange,
  onCursorChange,
  dirtyFiles = new Set(),
  onSave,
}) {
  const editorRef = useRef(null);

  const activeContent = files[activeFile] ?? '';
  const language = getMonacoLanguage(activeFile);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure custom dark theme matching ShadowCoder aesthetics
    monaco.editor.defineTheme('shadowcoder-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'function', foreground: '60a5fa' },
        { token: 'variable', foreground: 'f8fafc' },
        { token: 'type', foreground: '38bdf8' },
      ],
      colors: {
        'editor.background': '#07090e',
        'editor.foreground': '#f8fafc',
        'editor.lineHighlightBackground': '#1e293b40',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#a855f7',
        'editorCursor.foreground': '#a855f7',
        'editor.selectionBackground': '#6366f140',
        'editorIndentGuide.background': '#1e293b80',
        'editorIndentGuide.activeBackground': '#6366f160',
      },
    });
    monaco.editor.setTheme('shadowcoder-dark');

    // Track Cursor Position for Bottom Status Bar
    editor.onDidChangeCursorPosition((e) => {
      onCursorChange?.({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });

    // Keyboard Shortcut: Ctrl+S to Save & Format
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.();
      editor.getAction('editor.action.formatDocument')?.run();
    });
  };

  const handleFormatCode = () => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run();
  };

  // Breadcrumbs string split
  const breadcrumbs = activeFile ? activeFile.split('/') : ['workspace'];

  return (
    <div className="h-full flex flex-col bg-[#07090e] border-r border-slate-800 select-none overflow-hidden">
      
      {/* TABS BAR */}
      <div className="flex items-center justify-between bg-[#0d1117] border-b border-slate-800/80 overflow-x-auto custom-scrollbar">
        <div className="flex items-center flex-1 overflow-x-auto">
          {openTabs.map((filePath) => {
            const isActive = filePath === activeFile;
            const fileName = filePath.split('/').pop();
            const isDirty = dirtyFiles.has(filePath);

            return (
              <div
                key={filePath}
                onClick={() => onSelectTab?.(filePath)}
                className={`flex items-center gap-2 px-3.5 py-2 border-r border-slate-800/80 text-xs font-mono cursor-pointer shrink-0 transition-colors group ${
                  isActive
                    ? 'bg-[#07090e] text-white border-t-2 border-t-indigo-500 font-bold'
                    : 'bg-[#0a0d14] text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`}
              >
                {getFileIcon(fileName, 14)}
                <span className="truncate max-w-[140px]">{fileName}</span>

                {isDirty ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab?.(filePath);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:bg-slate-800 p-0.5 rounded text-slate-400 hover:text-white transition-opacity"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* FORMAT CODE BUTTON */}
        <div className="px-2 flex items-center gap-1 shrink-0">
          <button
            onClick={handleFormatCode}
            title="Format Code (Shift+Alt+F)"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <AlignLeft size={14} />
          </button>
        </div>
      </div>

      {/* BREADCRUMBS BAR */}
      <div className="flex items-center gap-1.5 px-4 py-1 bg-[#090d14] border-b border-slate-800/60 text-[11px] font-mono text-slate-500">
        <span>workspace</span>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight size={11} className="text-slate-600" />
            <span className={idx === breadcrumbs.length - 1 ? 'text-indigo-400 font-bold' : 'text-slate-400'}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* MONACO EDITOR CANVAS */}
      <div className="flex-1 w-full h-full relative">
        <Editor
          height="100%"
          language={language}
          value={activeContent}
          theme="shadowcoder-dark"
          onChange={(newVal) => onCodeChange?.(activeFile, newVal ?? '')}
          onMount={handleEditorMount}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
            fontLigatures: true,
            tabSize: 2,
            insertSpaces: true,
            minimap: { enabled: true, scale: 0.75 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
}
