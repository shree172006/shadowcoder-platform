import React, { useState } from 'react';
import { 
  Folder, FolderOpen, ChevronRight, ChevronDown, Plus, Trash2, 
  Edit2, FilePlus, FolderPlus, Search, RefreshCw, Check, X 
} from 'lucide-react';
import { getFileIcon } from './fileUtils.jsx';

export default function FileTreeExplorer({
  files = {},
  activeFile = '',
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
  dirtyFiles = new Set(),
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFolders, setOpenFolders] = useState({ src: true, components: true, tests: true, services: true });
  const [creatingItem, setCreatingItem] = useState(null); // { type: 'file' | 'folder', parent: '' }
  const [newItemName, setNewItemName] = useState('');
  const [renamingPath, setRenamingPath] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const toggleFolder = (folderPath) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  // Convert flat files object { 'src/App.jsx': 'code', ... } into hierarchical tree
  const buildTree = () => {
    const root = { name: 'root', type: 'folder', children: {}, path: '' };

    Object.keys(files).forEach((filePath) => {
      if (searchQuery && !filePath.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }

      const parts = filePath.split('/');
      let current = root;

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        const currentPath = parts.slice(0, index + 1).join('/');

        if (isFile) {
          current.children[part] = {
            name: part,
            type: 'file',
            path: currentPath,
          };
        } else {
          if (!current.children[part]) {
            current.children[part] = {
              name: part,
              type: 'folder',
              path: currentPath,
              children: {},
            };
          }
          current = current.children[part];
        }
      });
    });

    return root;
  };

  const handleStartCreate = (type, parent = '') => {
    setCreatingItem({ type, parent });
    setNewItemName('');
  };

  const handleConfirmCreate = () => {
    if (!newItemName.trim()) {
      setCreatingItem(null);
      return;
    }
    const fullPath = creatingItem.parent
      ? `${creatingItem.parent}/${newItemName.trim()}`
      : newItemName.trim();

    if (creatingItem.type === 'file') {
      onCreateFile?.(fullPath, '// New file\n');
      onSelectFile?.(fullPath);
    }
    setCreatingItem(null);
    setNewItemName('');
  };

  const handleStartRename = (e, path) => {
    e.stopPropagation();
    setRenamingPath(path);
    setRenameValue(path.split('/').pop());
  };

  const handleConfirmRename = () => {
    if (renameValue.trim() && renamingPath) {
      const parts = renamingPath.split('/');
      parts.pop();
      const newPath = parts.length > 0 ? `${parts.join('/')}/${renameValue.trim()}` : renameValue.trim();
      onRenameFile?.(renamingPath, newPath);
    }
    setRenamingPath(null);
    setRenameValue('');
  };

  const renderNode = (node, depth = 0) => {
    if (node.type === 'folder') {
      const isOpen = openFolders[node.path] ?? true;
      const childKeys = Object.keys(node.children).sort((a, b) => {
        const aIsFolder = node.children[a].type === 'folder';
        const bIsFolder = node.children[b].type === 'folder';
        if (aIsFolder && !bIsFolder) return -1;
        if (!aIsFolder && bIsFolder) return 1;
        return a.localeCompare(b);
      });

      return (
        <div key={node.path || 'root'} className="w-full select-none">
          {node.path && (
            <div
              onClick={() => toggleFolder(node.path)}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-slate-800/60 cursor-pointer text-slate-300 text-xs font-semibold group transition-colors"
            >
              <div className="flex items-center gap-1.5 truncate">
                {isOpen ? <ChevronDown size={14} className="text-slate-400 shrink-0" /> : <ChevronRight size={14} className="text-slate-400 shrink-0" />}
                {isOpen ? <FolderOpen size={15} className="text-amber-400 shrink-0" /> : <Folder size={15} className="text-amber-400 shrink-0" />}
                <span className="truncate">{node.name}</span>
              </div>
              <div className="hidden group-hover:flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); handleStartCreate('file', node.path); }}
                  title="New File inside folder"
                  className="p-0.5 hover:text-white text-slate-400"
                >
                  <FilePlus size={13} />
                </button>
              </div>
            </div>
          )}

          {isOpen && (
            <div className="flex flex-col">
              {childKeys.map((childKey) => renderNode(node.children[childKey], depth + (node.path ? 1 : 0)))}
            </div>
          )}
        </div>
      );
    }

    // File Node
    const isActive = activeFile === node.path;
    const isDirty = dirtyFiles.has(node.path);

    if (renamingPath === node.path) {
      return (
        <div
          key={node.path}
          style={{ paddingLeft: `${depth * 12 + 16}px` }}
          className="flex items-center gap-1 py-1 px-2 bg-slate-800 rounded-md"
        >
          {getFileIcon(node.name, 14)}
          <input
            type="text"
            value={renameValue}
            autoFocus
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirmRename();
              if (e.key === 'Escape') setRenamingPath(null);
            }}
            className="w-full bg-slate-950 px-1 py-0.5 text-xs text-white rounded border border-indigo-500 outline-none"
          />
          <button onClick={handleConfirmRename} className="text-emerald-400 hover:text-emerald-300">
            <Check size={13} />
          </button>
          <button onClick={() => setRenamingPath(null)} className="text-slate-400 hover:text-rose-400">
            <X size={13} />
          </button>
        </div>
      );
    }

    return (
      <div
        key={node.path}
        onClick={() => onSelectFile?.(node.path)}
        style={{ paddingLeft: `${depth * 12 + 16}px` }}
        className={`flex items-center justify-between py-1 px-2 rounded-md cursor-pointer text-xs font-medium group transition-all ${
          isActive
            ? 'bg-indigo-600/30 text-white font-bold border-l-2 border-indigo-500'
            : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {getFileIcon(node.name, 15)}
          <span className="truncate">{node.name}</span>
          {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />}
        </div>

        <div className="hidden group-hover:flex items-center gap-1">
          <button
            onClick={(e) => handleStartRename(e, node.path)}
            title="Rename File"
            className="p-0.5 text-slate-500 hover:text-indigo-300 transition-colors"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteFile?.(node.path);
            }}
            title="Delete File"
            className="p-0.5 text-slate-500 hover:text-rose-400 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    );
  };

  const tree = buildTree();

  return (
    <div className="h-full flex flex-col bg-[#0b0e14] border-r border-slate-800 text-slate-300 select-none text-xs font-mono">
      {/* EXPLORER TOP HEADER */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 bg-[#0d1117]">
        <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400">
          Explorer
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleStartCreate('file')}
            title="New File"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <FilePlus size={14} />
          </button>
          <button
            onClick={() => handleStartCreate('folder')}
            title="New Folder"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <FolderPlus size={14} />
          </button>
          <button
            onClick={() => setOpenFolders({ src: true, components: true, tests: true, services: true })}
            title="Expand All"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* QUICK FILE SEARCH */}
      <div className="p-2 border-b border-slate-800/60">
        <div className="relative">
          <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 placeholder-slate-600 text-[11px] focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* INLINE NEW ITEM INPUT */}
      {creatingItem && (
        <div className="p-2 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5">
          {creatingItem.type === 'file' ? <FilePlus size={14} className="text-indigo-400" /> : <FolderPlus size={14} className="text-amber-400" />}
          <input
            type="text"
            placeholder={creatingItem.type === 'file' ? 'filename.js' : 'folder_name'}
            value={newItemName}
            autoFocus
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirmCreate();
              if (e.key === 'Escape') setCreatingItem(null);
            }}
            className="flex-1 bg-slate-950 px-2 py-0.5 text-xs text-white rounded border border-indigo-500 outline-none"
          />
          <button onClick={handleConfirmCreate} className="p-1 text-emerald-400 hover:text-emerald-300">
            <Check size={14} />
          </button>
          <button onClick={() => setCreatingItem(null)} className="p-1 text-slate-400 hover:text-rose-400">
            <X size={14} />
          </button>
        </div>
      )}

      {/* TREE VIEW */}
      <div className="flex-1 overflow-y-auto p-1 py-2 space-y-0.5 custom-scrollbar">
        {renderNode(tree)}
      </div>

      {/* WORKSPACE FOOTER STATS */}
      <div className="p-2 border-t border-slate-800/80 bg-[#090d14] text-[10px] text-slate-500 flex items-center justify-between">
        <span>{Object.keys(files).length} Files</span>
        <span className="text-indigo-400 font-bold">VFS Active</span>
      </div>
    </div>
  );
}
