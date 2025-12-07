/**
 * Admin Panel - Admin-only dashboard for VRS/A management
 * Only accessible by dickinsonc060@gmail.com
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Bell,
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
  Music,
  Heart,
  Wrench,
  BellRing,
  RefreshCw,
  Save,
  X,
  Check,
  AlertCircle,
  Loader2,
  Crown,
  TestTube,
  Calendar,
  TrendingUp,
  MessageSquare,
  Database,
  Bot,
  Send
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { Button } from '../components/ui/Button';
import {
  ADMIN_EMAIL,
  getAppStats,
  getRecentUsers,
  getAllDevNotes,
  createDevNote,
  updateDevNote,
  deleteDevNote,
  toggleDevNoteActive,
  updateUserProfile,
  getAllBotComments,
  updateBotComment,
  deleteBotComment,
  getAllBotRoasts,
  updateBotRoast,
  deleteBotRoast
} from '../lib/admin';
import { createBotPost } from '../lib/social';
import { generateBotPost } from '../lib/api';

// Notification type options
const NOTE_TYPES = [
  { value: 'update', label: 'Update', icon: Wrench, color: 'text-blue-400' },
  { value: 'feature', label: 'Feature', icon: Sparkles, color: 'text-yellow-400' },
  { value: 'music', label: 'Music', icon: Music, color: 'text-purple-400' },
  { value: 'thanks', label: 'Thanks', icon: Heart, color: 'text-pink-400' },
  { value: 'default', label: 'General', icon: BellRing, color: 'text-slate-400' },
];

// Expiry options
const EXPIRY_OPTIONS = [
  { value: null, label: 'Never expires' },
  { value: 1, label: '1 day' },
  { value: 3, label: '3 days' },
  { value: 7, label: '1 week' },
  { value: 14, label: '2 weeks' },
  { value: 30, label: '1 month' },
  { value: 90, label: '3 months' },
];

/**
 * Stats Card Component
 */
// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: IconComponent, label, value, trend, color = 'indigo' }) => (
  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-lg bg-${color}-600/20 flex items-center justify-center`}>
        <IconComponent size={20} className={`text-${color}-400`} />
      </div>
      {trend && (
        <span className="text-xs text-green-400 flex items-center gap-1">
          <TrendingUp size={12} />
          {trend}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-white mt-3">{value}</p>
    <p className="text-sm text-slate-400">{label}</p>
  </div>
);

/**
 * Notification Form Component
 */
const NotificationForm = ({ note, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: note?.type || 'update',
    title: note?.title || '',
    message: note?.message || '',
    link: note?.link || '',
    linkText: note?.link_text || '',
    expiryDays: null,
    priority: note?.priority || 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const expiresAt = formData.expiryDays 
      ? new Date(Date.now() + formData.expiryDays * 24 * 60 * 60 * 1000).toISOString()
      : null;
    
    await onSave({
      type: formData.type,
      title: formData.title,
      message: formData.message,
      link: formData.link || null,
      linkText: formData.linkText || null,
      expiresAt,
      priority: formData.priority,
    });
    
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {NOTE_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Expires</label>
          <select
            value={formData.expiryDays || ''}
            onChange={(e) => setFormData({ ...formData, expiryDays: e.target.value ? parseInt(e.target.value) : null })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {EXPIRY_OPTIONS.map(opt => (
              <option key={opt.label} value={opt.value || ''}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Notification title..."
          required
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Message *</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Notification message..."
          required
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Link URL (optional)</label>
          <input
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Link Text</label>
          <input
            type="text"
            value={formData.linkText}
            onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
            placeholder="Learn more"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Priority (higher = shows first)</label>
        <input
          type="number"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
          min={0}
          max={100}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
          {note ? 'Update' : 'Create'} Notification
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

/**
 * Main Admin Panel Component
 */
const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [devNotes, setDevNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Bot management state
  const [botComments, setBotComments] = useState([]);
  const [botRoasts, setBotRoasts] = useState([]);
  const [editingBotComment, setEditingBotComment] = useState(null);
  const [editingBotRoast, setEditingBotRoast] = useState(null);
  const [showCreateBotPost, setShowCreateBotPost] = useState(false);
  const [botPostPrompt, setBotPostPrompt] = useState('');
  const [creatingBotPost, setCreatingBotPost] = useState(false);

  // Check admin authorization
  useEffect(() => {
    if (!userLoading) {
      if (!user || user.email !== ADMIN_EMAIL) {
        navigate('/');
      } else {
        setAuthorized(true);
      }
    }
  }, [user, userLoading, navigate]);

  // Fetch all admin data
  const fetchData = useCallback(async () => {
    if (!authorized) return;
    
    setLoading(true);
    
    const [statsRes, usersRes, notesRes, commentsRes, roastsRes] = await Promise.all([
      getAppStats(),
      getRecentUsers(15),
      getAllDevNotes(),
      getAllBotComments(50),
      getAllBotRoasts(50)
    ]);
    
    if (statsRes.stats) setStats(statsRes.stats);
    if (usersRes.users) setRecentUsers(usersRes.users);
    if (notesRes.notes) setDevNotes(notesRes.notes);
    if (commentsRes.comments) setBotComments(commentsRes.comments);
    if (roastsRes.roasts) setBotRoasts(roastsRes.roasts);
    
    setLoading(false);
  }, [authorized]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleCreateNote = async (noteData) => {
    const { note, error } = await createDevNote(noteData);
    if (!error && note) {
      setDevNotes(prev => [note, ...prev]);
      setShowNoteForm(false);
    }
  };

  const handleUpdateNote = async (noteData) => {
    if (!editingNote) return;
    const { note, error } = await updateDevNote(editingNote.id, noteData);
    if (!error && note) {
      setDevNotes(prev => prev.map(n => n.id === note.id ? note : n));
      setEditingNote(null);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    const { success } = await deleteDevNote(id);
    if (success) {
      setDevNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    const { note, error } = await toggleDevNoteActive(id, !currentActive);
    if (!error && note) {
      setDevNotes(prev => prev.map(n => n.id === note.id ? note : n));
    }
  };

  const handleToggleUserStatus = async (userId, field, currentValue) => {
    const newValue = currentValue === 'true' ? 'false' : 'true';
    const { profile, error } = await updateUserProfile(userId, { [field]: newValue });
    if (!error && profile) {
      setRecentUsers(prev => prev.map(u => u.id === userId ? { ...u, [field]: newValue } : u));
    }
  };

  // Bot management handlers
  const handleUpdateBotComment = async (commentId, newContent) => {
    const { comment, error } = await updateBotComment(commentId, newContent);
    if (!error && comment) {
      setBotComments(prev => prev.map(c => c.id === commentId ? { ...c, content: newContent } : c));
      setEditingBotComment(null);
    }
  };

  const handleDeleteBotComment = async (commentId) => {
    if (!confirm('Delete this bot comment?')) return;
    const { success } = await deleteBotComment(commentId);
    if (success) {
      setBotComments(prev => prev.filter(c => c.id !== commentId));
    }
  };

  const handleUpdateBotRoast = async (roastId, newContent) => {
    const { roast, error } = await updateBotRoast(roastId, newContent);
    if (!error && roast) {
      setBotRoasts(prev => prev.map(r => r.id === roastId ? { ...r, content: newContent } : r));
      setEditingBotRoast(null);
    }
  };

  const handleDeleteBotRoast = async (roastId) => {
    if (!confirm('Delete this bot roast?')) return;
    const { success } = await deleteBotRoast(roastId);
    if (success) {
      setBotRoasts(prev => prev.filter(r => r.id !== roastId));
    }
  };

  const handleCreateBotPost = async () => {
    setCreatingBotPost(true);
    try {
      const content = await generateBotPost(botPostPrompt);
      const { post, error } = await createBotPost(content, 'public');
      if (!error && post) {
        alert('Bot post created successfully!');
        setBotPostPrompt('');
        setShowCreateBotPost(false);
      }
    } catch (err) {
      console.error('Error creating bot post:', err);
      alert('Failed to create bot post');
    } finally {
      setCreatingBotPost(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 size={32} className="text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  const getTypeIcon = (type) => {
    const found = NOTE_TYPES.find(t => t.value === type);
    return found ? found.icon : BellRing;
  };

  const getTypeColor = (type) => {
    const found = NOTE_TYPES.find(t => t.value === type);
    return found ? found.color : 'text-slate-400';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Crown className="text-yellow-400" />
              Admin Panel
            </h1>
            <p className="text-slate-400 mt-1">Manage VRS/A app settings and notifications</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700 pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'bot', label: 'Bot Management', icon: Bot },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Users" value={stats.total_users} />
              <StatCard icon={TrendingUp} label="Users This Week" value={stats.users_this_week} color="green" />
              <StatCard icon={MessageSquare} label="Active Sessions" value={stats.active_sessions} color="purple" />
              <StatCard icon={Bell} label="Active Notifications" value={stats.active_notifications} color="yellow" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Crown} label="Pro Users" value={stats.pro_users} color="yellow" />
              <StatCard icon={TestTube} label="Beta Users" value={stats.beta_users} color="cyan" />
              <StatCard icon={Database} label="Lyrics in Library" value={stats.total_lyrics_in_library} color="pink" />
              <StatCard icon={Music} label="Unique Artists" value={stats.unique_artists} color="purple" />
            </div>

            {/* Quick Stats Summary */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-green-400">{stats.users_today}</p>
                  <p className="text-sm text-slate-400">Today</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-indigo-400">{stats.users_this_week}</p>
                  <p className="text-sm text-slate-400">This Week</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-400">{stats.users_this_month}</p>
                  <p className="text-sm text-slate-400">This Month</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Create Notification Button */}
            {!showNoteForm && !editingNote && (
              <Button onClick={() => setShowNoteForm(true)}>
                <Plus size={16} className="mr-2" />
                New Notification
              </Button>
            )}

            {/* Notification Form */}
            {(showNoteForm || editingNote) && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {editingNote ? 'Edit Notification' : 'Create Notification'}
                </h3>
                <NotificationForm
                  note={editingNote}
                  onSave={editingNote ? handleUpdateNote : handleCreateNote}
                  onCancel={() => { setShowNoteForm(false); setEditingNote(null); }}
                />
              </div>
            )}

            {/* Notifications List */}
            <div className="space-y-3">
              {devNotes.map(note => {
                const Icon = getTypeIcon(note.type);
                const expired = isExpired(note.expires_at);
                
                return (
                  <div
                    key={note.id}
                    className={`bg-slate-800/50 border rounded-xl p-4 transition-all ${
                      !note.is_active || expired
                        ? 'border-slate-700/30 opacity-60'
                        : 'border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0 ${getTypeColor(note.type)}`}>
                        <Icon size={18} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white">{note.title}</h4>
                          {!note.is_active && (
                            <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">Inactive</span>
                          )}
                          {expired && (
                            <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded">Expired</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{note.message}</p>
                        {note.link && (
                          <a href={note.link} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:text-indigo-300">
                            {note.link_text || note.link} →
                          </a>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Created: {formatDate(note.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Expires: {note.expires_at ? formatDate(note.expires_at) : 'Never'}
                          </span>
                          <span>Priority: {note.priority}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleActive(note.id, note.is_active)}
                          className={`p-2 rounded-lg transition-colors ${
                            note.is_active
                              ? 'text-green-400 hover:bg-green-600/20'
                              : 'text-slate-400 hover:bg-slate-700'
                          }`}
                          title={note.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {note.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => setEditingNote(note)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {devNotes.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Bell size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Recent Users</h3>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-sm font-medium text-slate-400 p-4">Email</th>
                      <th className="text-left text-sm font-medium text-slate-400 p-4">Username</th>
                      <th className="text-left text-sm font-medium text-slate-400 p-4">Joined</th>
                      <th className="text-center text-sm font-medium text-slate-400 p-4">Pro</th>
                      <th className="text-center text-sm font-medium text-slate-400 p-4">Beta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map(user => (
                      <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-4 text-sm text-white">{user.email}</td>
                        <td className="p-4 text-sm text-slate-300">{user.username || '-'}</td>
                        <td className="p-4 text-sm text-slate-400">{formatDate(user.created_at)}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleUserStatus(user.id, 'is_pro', user.is_pro)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              user.is_pro === 'true'
                                ? 'text-yellow-400 bg-yellow-600/20'
                                : 'text-slate-500 hover:bg-slate-700'
                            }`}
                          >
                            <Crown size={16} />
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleUserStatus(user.id, 'is_beta', user.is_beta)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              user.is_beta === 'true'
                                ? 'text-cyan-400 bg-cyan-600/20'
                                : 'text-slate-500 hover:bg-slate-700'
                            }`}
                          >
                            <TestTube size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bot Management Tab */}
        {activeTab === 'bot' && (
          <div className="space-y-6">
            {/* Create Bot Post */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Send size={20} className="text-yellow-400" />
                Create Bot Post
              </h3>
              
              {!showCreateBotPost ? (
                <Button onClick={() => setShowCreateBotPost(true)}>
                  <Plus size={16} className="mr-2" />
                  New Bot Post
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Post Topic (optional)
                    </label>
                    <input
                      type="text"
                      value={botPostPrompt}
                      onChange={(e) => setBotPostPrompt(e.target.value)}
                      placeholder="e.g., 'creative process' or leave blank for random"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleCreateBotPost} disabled={creatingBotPost}>
                      {creatingBotPost ? (
                        <Loader2 size={16} className="animate-spin mr-2" />
                      ) : (
                        <Send size={16} className="mr-2" />
                      )}
                      Generate & Post
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateBotPost(false);
                        setBotPostPrompt('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Bot Comments Section */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-400" />
                Bot Post Comments ({botComments.length})
              </h3>
              
              <div className="space-y-3">
                {botComments.map(comment => (
                  <div key={comment.id} className="bg-slate-900/50 rounded-lg p-4">
                    {editingBotComment?.id === comment.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editingBotComment.content}
                          onChange={(e) => setEditingBotComment({ ...editingBotComment, content: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateBotComment(comment.id, editingBotComment.content)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Check size={14} />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingBotComment(null)}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm text-slate-300 mb-2">"{comment.content}"</p>
                            <p className="text-xs text-slate-500">
                              On post: {comment.post?.content?.substring(0, 60)}...
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              {formatDate(comment.created_at)}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingBotComment(comment)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteBotComment(comment.id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                {botComments.length === 0 && (
                  <p className="text-center py-8 text-slate-400">No bot comments yet</p>
                )}
              </div>
            </div>

            {/* Bot Roasts Section */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Music size={20} className="text-purple-400" />
                Bot Track Roasts ({botRoasts.length})
              </h3>
              
              <div className="space-y-3">
                {botRoasts.map(roast => (
                  <div key={roast.id} className="bg-slate-900/50 rounded-lg p-4">
                    {editingBotRoast?.id === roast.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editingBotRoast.content}
                          onChange={(e) => setEditingBotRoast({ ...editingBotRoast, content: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateBotRoast(roast.id, editingBotRoast.content)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Check size={14} />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingBotRoast(null)}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm text-slate-300 mb-2">"{roast.content}"</p>
                            <p className="text-xs text-slate-500">
                              On track: {roast.track?.title} - {roast.track?.artist}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              {formatDate(roast.created_at)}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingBotRoast(roast)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteBotRoast(roast.id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-600/20 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                {botRoasts.length === 0 && (
                  <p className="text-center py-8 text-slate-400">No bot roasts yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
