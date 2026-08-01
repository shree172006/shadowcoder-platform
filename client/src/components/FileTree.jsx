import React, { useState } from 'react';

/**
 * FileTreeNode - Renders an individual file or directory item with recursive nested tree logic.
 */
const FileTreeNode = ({ node, activeFilePath, onSelectFile, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isDirectory = node.type === 'directory';
  const isSelected = activeFilePath === node.path;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(node.path);
    }
  };

  const getFileIcon = (ext) => {
    switch (ext) {
      case 'js':
      case 'jsx':
        return <span className="text-yellow-400 font-bold text-xs">JS</span>;
      case 'ts':
      case 'tsx':
        return <span className="text-blue-400 font-bold text-xs">TS</span>;
      case 'json':
        return <span className="text-emerald-400 font-bold text-xs">{}</span>;
      case 'css':
      case 'html':
        return <span className="text-pink-400 font-bold text-xs">#</span>;
      case 'md':
        return <span className="text-purple-400 font-bold text-xs">M↓</span>;
      default:
        return <span className="text-slate-400 text-xs">📄</span>;
    }
  };

  return (
    <div className="select-none">
      <div
        onClick={handleToggle}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        className={`flex items-center gap-2 py-1 pr-3 text-sm cursor-pointer rounded transition-colors ${
          isSelected
            ? 'bg-indigo-600/30 text-indigo-300 font-medium border-l-2 border-indigo-500'
            : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
        }`}
      >
        {isDirectory ? (
          <>
            <span className="text-slate-400 text-xs w-4 text-center">
              {isOpen ? '📂' : '📁'}
            </span>
            <span className="truncate">{node.name}</span>
          </>
        ) : (
          <>
            <span className="w-4 flex items-center justify-center">
              {getFileIcon(node.extension)}
            </span>
            <span className="truncate">{node.name}</span>
          </>
        )}
      </div>

      {isDirectory && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              activeFilePath={activeFilePath}
              onSelectFile={onSelectFile}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * FileTree - Navigable hierarchical VFS Tree component.
 */
export const FileTree = ({ vfsTree = [], activeFilePath, onSelectFile }) => {
  if (!vfsTree || vfsTree.length === 0) {
    return (
      <div className="p-4 text-xs text-slate-500 text-center">
        No VFS codebase loaded.
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 border-r border-slate-800 h-full overflow-y-auto py-2">
      <div className="px-3 pb-2 mb-2 border-b border-slate-800 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
        <span>VFS Explorer</span>
      </div>
      <div className="space-y-0.5">
        {vfsTree.map((node) => (
          <FileTreeNode
            key={node.path}
            node={node}
            activeFilePath={activeFilePath}
            onSelectFile={onSelectFile}
            level={0}
          />
        ))}
      </div>
    </div>
  );
};

export default FileTree;
