/**
 * ProjectDashboard - A comprehensive project management dashboard for VRS/A
 * Allows users to view, manage, search, and organize their saved lyric projects
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderPlus,
  Search,
  Filter,
  Clock,
  Music,
  MoreVertical,
  Pencil,
  Trash2,
  Download,
  Copy,
  ChevronDown,
  Grid3X3,
  List,
  Calendar,
  MessageSquare,
  Settings2,
  ArrowUpDown,
  X,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import {
  getUserSessions,
  createChatSession,
  deleteChatSession,
  renameSession,
  getMessages
} from '../../lib/chatSessions';
import { exportConversationAsTxt, exportConversationAsJson } from '../../lib/exportUtils';

// Sort options for projects
const SORT_OPTIONS = [
  { value: 'updated_at', label: 'Last Modified', icon: Clock },
  { value: 'name', label: 'Name', icon: ArrowUpDown },
  { value: 'created_at', label: 'Date Created', icon: Calendar }
];

// Filter options for projects
const FILTER_OPTIONS = [
  { value: 'all', label: 'All Projects' },
  { value: 'with_memory', label: 'With Memory Enabled' },
  { value: 'recent', label: 'Recent (7 days)' }
];

/**
 * ProjectCard - Individual project card component
 */
const ProjectCard = ({ 
  project, 
  viewMode, 
  isSelected, 
  onSelect, 
  onOpen, 
  onRename, 
  onDelete, 
  onExport 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(project.name || '');

  const handleRename = () => {
    if (renameValue.trim() && renameValue !== project.name) {
      onRename(project.id, renameValue.trim());
    }
    setIsRenaming(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getProjectPreview = () => {
    if (project.settings?.coreTheme) {
      return project.settings.coreTheme;
    }
    if (project.settings?.artistName) {
      return `Style: ${project.settings.artistName}`;
    }
    return 'No description';
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`
          flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer
          ${isSelected 
            ? 'bg-indigo-600/20 border-indigo-500' 
            : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
          }
        `}
        onClick={() => onSelect(project.id)}
        onDoubleClick={() => onOpen(project.id)}
      >
        {/* Project Icon */}
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center shrink-0
          ${project.memory_enabled ? 'bg-indigo-600/30' : 'bg-slate-700/50'}
        `}>
          <Music size={20} className={project.memory_enabled ? 'text-indigo-400' : 'text-slate-400'} />
        </div>

        {/* Project Info */}
        <div className="flex-1 min-w-0">
          {isRenaming ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="flex-1 bg-slate-900 border border-indigo-500 rounded-lg px-3 py-1 text-white text-sm focus:outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') setIsRenaming(false);
                }}
              />
              <button onClick={handleRename} className="p-1 hover:bg-slate-700 rounded text-green-400">
                <Check size={16} />
              </button>
              <button onClick={() => setIsRenaming(false)} className="p-1 hover:bg-slate-700 rounded text-slate-400">
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-medium text-white truncate">
                {project.name || `Project ${formatDate(project.updated_at)}`}
              </h3>
              <p className="text-sm text-slate-400 truncate">{getProjectPreview()}</p>
            </>
          )}
        </div>

        {/* Meta Info */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
          {project.memory_enabled && (
            <span className="flex items-center gap-1 text-indigo-400">
              <MessageSquare size={12} />
              Memory
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatDate(project.updated_at)}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <MoreVertical size={18} />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <button
                    onClick={() => { onOpen(project.id); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-slate-700 transition-colors"
                  >
                    <Music size={16} className="text-indigo-400" />
                    Open Project
                  </button>
                  <button
                    onClick={() => { setIsRenaming(true); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-slate-700 transition-colors"
                  >
                    <Pencil size={16} className="text-slate-400" />
                    Rename
                  </button>
                  <button
                    onClick={() => { onExport(project.id, 'txt'); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-slate-700 transition-colors"
                  >
                    <Download size={16} className="text-slate-400" />
                    Export as TXT
                  </button>
                  <button
                    onClick={() => { onExport(project.id, 'json'); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-slate-700 transition-colors"
                  >
                    <Copy size={16} className="text-slate-400" />
                    Export as JSON
                  </button>
                  <div className="border-t border-slate-700" />
                  <button
                    onClick={() => { onDelete(project.id); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-600/20 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete Project
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        relative p-4 rounded-xl border transition-all cursor-pointer group
        ${isSelected 
          ? 'bg-indigo-600/20 border-indigo-500' 
          : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
        }
      `}
      onClick={() => onSelect(project.id)}
      onDoubleClick={() => onOpen(project.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center
          ${project.memory_enabled ? 'bg-indigo-600/30' : 'bg-slate-700/50'}
        `}>
          <Music size={20} className={project.memory_enabled ? 'text-indigo-400' : 'text-slate-400'} />
        </div>
        
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={16} />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-1 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <button
                    onClick={() => { onOpen(project.id); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-white hover:bg-slate-700 transition-colors"
                  >
                    <Music size={14} className="text-indigo-400" />
                    Open
                  </button>
                  <button
                    onClick={() => { setIsRenaming(true); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-white hover:bg-slate-700 transition-colors"
                  >
                    <Pencil size={14} className="text-slate-400" />
                    Rename
                  </button>
                  <button
                    onClick={() => { onExport(project.id, 'txt'); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-white hover:bg-slate-700 transition-colors"
                  >
                    <Download size={14} className="text-slate-400" />
                    Export TXT
                  </button>
                  <div className="border-t border-slate-700" />
                  <button
                    onClick={() => { onDelete(project.id); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-600/20 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      {isRenaming ? (
        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            className="w-full bg-slate-900 border border-indigo-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') setIsRenaming(false);
            }}
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsRenaming(false)} className="px-2 py-1 text-xs text-slate-400 hover:text-white">
              Cancel
            </button>
            <button onClick={handleRename} className="px-2 py-1 text-xs text-indigo-400 hover:text-indigo-300">
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-medium text-white truncate mb-1">
            {project.name || `Project ${formatDate(project.updated_at)}`}
          </h3>
          <p className="text-sm text-slate-400 truncate mb-3">{getProjectPreview()}</p>
          
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {formatDate(project.updated_at)}
            </span>
            {project.memory_enabled && (
              <span className="flex items-center gap-1 text-indigo-400">
                <MessageSquare size={12} />
              </span>
            )}
          </div>
        </>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-indigo-500" />
      )}
    </motion.div>
  );
};

/**
 * DeleteConfirmModal - Confirmation dialog for deleting projects
 */
const DeleteConfirmModal = ({ isOpen, projectName, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center shrink-0">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Delete Project?</h3>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete <span className="text-white font-medium">"{projectName}"</span>? 
              This action cannot be undone and all lyrics will be permanently lost.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
          >
            Delete Project
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * ProjectDashboard - Main dashboard component
 */
const ProjectDashboard = ({ onSelectProject, initialViewMode = 'grid' }) => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState(initialViewMode);
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    const { sessions, error: fetchError } = await getUserSessions(user.id);
    
    if (fetchError) {
      setError('Failed to load projects');
      console.error('Error fetching projects:', fetchError);
    } else {
      setProjects(sessions);
    }
    
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.settings?.coreTheme && p.settings.coreTheme.toLowerCase().includes(query)) ||
        (p.settings?.artistName && p.settings.artistName.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (filterBy === 'with_memory') {
      result = result.filter(p => p.memory_enabled);
    } else if (filterBy === 'recent') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(p => new Date(p.updated_at) >= weekAgo);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        const nameA = a.name || '';
        const nameB = b.name || '';
        comparison = nameA.localeCompare(nameB);
      } else if (sortBy === 'updated_at' || sortBy === 'created_at') {
        comparison = new Date(a[sortBy]) - new Date(b[sortBy]);
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    return result;
  }, [projects, searchQuery, filterBy, sortBy, sortOrder]);

  // Handle project actions
  const handleCreateProject = async () => {
    if (!user) return;
    
    const { id, error: createError } = await createChatSession(
      user.id,
      false,
      10,
      { name: `New Project ${new Date().toLocaleDateString()}` }
    );
    
    if (createError) {
      console.error('Failed to create project:', createError);
      return;
    }
    
    await fetchProjects();
    
    // Navigate to ghostwriter with the new project
    if (onSelectProject) {
      onSelectProject(id);
    } else {
      navigate('/ghostwriter');
    }
  };

  const handleOpenProject = (projectId) => {
    if (onSelectProject) {
      onSelectProject(projectId);
    } else {
      navigate('/ghostwriter');
    }
  };

  const handleRenameProject = async (projectId, newName) => {
    const { error: renameError } = await renameSession(projectId, newName);
    
    if (renameError) {
      console.error('Failed to rename project:', renameError);
      return;
    }
    
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, name: newName } : p
    ));
  };

  const handleDeleteProject = async (projectId) => {
    const { error: deleteError } = await deleteChatSession(projectId);
    
    if (deleteError) {
      console.error('Failed to delete project:', deleteError);
      return;
    }
    
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setDeleteConfirm(null);
    
    if (selectedProject === projectId) {
      setSelectedProject(null);
    }
  };

  const handleExportProject = async (projectId, format) => {
    const { messages, error: msgError } = await getMessages(projectId);
    
    if (msgError) {
      console.error('Failed to get messages for export:', msgError);
      return;
    }
    
    const project = projects.find(p => p.id === projectId);
    const projectName = project?.name || 'Project';
    
    if (format === 'txt') {
      exportConversationAsTxt(messages, projectName);
    } else if (format === 'json') {
      exportConversationAsJson(messages, projectName);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <Music size={48} className="text-slate-600 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Sign in to view your projects</h3>
        <p className="text-slate-400 mb-6">Create an account to save and manage your lyric projects</p>
        <button
          onClick={() => navigate('/auth')}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  const projectToDelete = projects.find(p => p.id === deleteConfirm);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Projects</h2>
          <p className="text-slate-400 text-sm mt-1">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        
        <button
          onClick={handleCreateProject}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
        >
          <FolderPlus size={18} />
          New Project
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          >
            <ArrowUpDown size={16} />
            <span className="hidden sm:inline">Sort</span>
            <ChevronDown size={14} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (sortBy === option.value) {
                          setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy(option.value);
                          setSortOrder('desc');
                        }
                        setShowSortMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                        sortBy === option.value 
                          ? 'bg-indigo-600/20 text-indigo-400' 
                          : 'text-white hover:bg-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <option.icon size={14} />
                        {option.label}
                      </span>
                      {sortBy === option.value && (
                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors ${
              filterBy !== 'all'
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600'
            }`}
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
            <ChevronDown size={14} className={`transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showFilterMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowFilterMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  {FILTER_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilterBy(option.value);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full flex items-center px-4 py-3 text-sm transition-colors ${
                        filterBy === option.value 
                          ? 'bg-indigo-600/20 text-indigo-400' 
                          : 'text-white hover:bg-slate-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-slate-800/50 border border-slate-700/50 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid3X3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-600/10 border border-red-600/30 rounded-xl mb-6">
          <AlertCircle size={20} className="text-red-400" />
          <p className="text-red-400">{error}</p>
          <button 
            onClick={fetchProjects}
            className="ml-auto text-sm text-red-400 hover:text-red-300 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {searchQuery || filterBy !== 'all' ? (
            <>
              <Search size={48} className="text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
              <p className="text-slate-400 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={() => { setSearchQuery(''); setFilterBy('all'); }}
                className="text-indigo-400 hover:text-indigo-300"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <FolderPlus size={48} className="text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
              <p className="text-slate-400 mb-6">Create your first project to get started</p>
              <button
                onClick={handleCreateProject}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
              >
                <FolderPlus size={18} />
                Create Project
              </button>
            </>
          )}
        </div>
      )}

      {/* Projects Grid/List */}
      <AnimatePresence mode="popLayout">
        {viewMode === 'grid' ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                isSelected={selectedProject === project.id}
                onSelect={setSelectedProject}
                onOpen={handleOpenProject}
                onRename={handleRenameProject}
                onDelete={(id) => setDeleteConfirm(id)}
                onExport={handleExportProject}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div layout className="space-y-2">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                isSelected={selectedProject === project.id}
                onSelect={setSelectedProject}
                onOpen={handleOpenProject}
                onRename={handleRenameProject}
                onDelete={(id) => setDeleteConfirm(id)}
                onExport={handleExportProject}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <DeleteConfirmModal
            isOpen={!!deleteConfirm}
            projectName={projectToDelete?.name || 'this project'}
            onConfirm={() => handleDeleteProject(deleteConfirm)}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDashboard;
