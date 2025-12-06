/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogOut, 
  Save, 
  X, 
  Plus, 
  Disc3, 
  ExternalLink, 
  Trash2, 
  Pencil,
  Music,
  Flame,
  Loader2,
  Image
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { supabase } from '../lib/supabase';
import { 
  getUserAlbums, 
  createAlbum, 
  updateAlbum,
  deleteAlbum,
  getUserStats,
  getTracksByUser
} from '../lib/social';

const Profile = () => {
  const { user, profile, signOut, loading, refreshProfile } = useUser();
  const navigate = useNavigate();
  
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  
  const [editingPassword, setEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');

  // Discography state
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingDiscography, setLoadingDiscography] = useState(true);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumGenre, setNewAlbumGenre] = useState('');
  const [albumError, setAlbumError] = useState('');
  const [editingAlbum, setEditingAlbum] = useState(null);

  // Load discography data
  useEffect(() => {
    if (user) {
      loadDiscography();
    }
  }, [user]);

  const loadDiscography = async () => {
    setLoadingDiscography(true);
    try {
      const [albumsResult, tracksResult, statsResult] = await Promise.all([
        getUserAlbums(user.id),
        getTracksByUser(user.id),
        getUserStats(user.id)
      ]);
      
      setAlbums(albumsResult.albums || []);
      setTracks(tracksResult.tracks || []);
      setStats(statsResult.stats);
    } catch (err) {
      console.error('Error loading discography:', err);
    } finally {
      setLoadingDiscography(false);
    }
  };

  const handleCreateAlbum = async () => {
    if (!newAlbumTitle.trim()) {
      setAlbumError('Album title is required');
      return;
    }
    
    setAlbumError('');
    
    const { album, error } = await createAlbum({
      userId: user.id,
      title: newAlbumTitle.trim(),
      genreTag: newAlbumGenre.trim() || null,
      isPublic: false
    });
    
    if (error) {
      setAlbumError(error.message || 'Failed to create album');
      return;
    }
    
    setAlbums([album, ...albums]);
    setNewAlbumTitle('');
    setNewAlbumGenre('');
    setShowCreateAlbum(false);
  };

  const handleUpdateAlbum = async (albumId, updates) => {
    const { error } = await updateAlbum(albumId, updates);
    if (!error) {
      setAlbums(albums.map(a => a.id === albumId ? { ...a, ...updates } : a));
      setEditingAlbum(null);
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!confirm('Delete this album? Tracks will be unlinked but not deleted.')) return;
    
    const { error } = await deleteAlbum(albumId);
    if (!error) {
      setAlbums(albums.filter(a => a.id !== albumId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <div className="text-slate-400">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Not Logged In</h2>
        <p className="text-slate-400 mb-6">Please log in to view your profile.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleUpdateEmail = async () => {
    setEmailError('');
    setEmailSuccess('');
    
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      
      setEmailSuccess('Email update initiated. Please check your inbox for confirmation.');
      setEditingEmail(false);
      setNewEmail('');
    } catch (error) {
      setEmailError(error.message || 'Failed to update email');
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      setPasswordSuccess('Password updated successfully');
      setEditingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(error.message || 'Failed to update password');
    }
  };

  const handleUpdateUsername = async () => {
    setUsernameError('');
    setUsernameSuccess('');
    
    if (!newUsername.trim()) {
      setUsernameError('Username cannot be empty');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername.trim() })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUsernameSuccess('Username updated successfully');
      setEditingUsername(false);
      setNewUsername('');
      // Refresh profile
      if (refreshProfile) {
        await refreshProfile();
      }
    } catch (error) {
      setUsernameError(error.message || 'Failed to update username');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-900 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-slate-400">Manage your account information and preferences</p>
        </div>

        {/* Account Status */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">
            Account Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account Type:</span>
              <span className={profile?.is_pro === 'true' ? 'text-yellow-400 font-medium' : 'text-slate-300'}>
                {profile?.is_pro === 'true' ? 'Studio Pass' : 'Free'}
              </span>
            </div>
            {profile?.is_beta === 'true' && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Beta Access:</span>
                <span className="text-cyan-400 font-medium">Enabled</span>
              </div>
            )}
          </div>
        </div>

        {/* Username Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">
            Username
          </h2>
          
          {!editingUsername ? (
            <div className="flex items-center justify-between">
              <span className="text-slate-300">{profile?.username || 'Not set'}</span>
              <button
                onClick={() => {
                  setEditingUsername(true);
                  setNewUsername(profile?.username || '');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Change Username
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="New username"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {usernameError && <p className="text-red-400 text-sm">{usernameError}</p>}
              {usernameSuccess && <p className="text-green-400 text-sm">{usernameSuccess}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateUsername}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingUsername(false);
                    setUsernameError('');
                    setUsernameSuccess('');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Email Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">
            Email Address
          </h2>
          
          {!editingEmail ? (
            <div className="flex items-center justify-between">
              <span className="text-slate-300">{user.email}</span>
              <button
                onClick={() => setEditingEmail(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Change Email
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New email address"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {emailError && <p className="text-red-400 text-sm">{emailError}</p>}
              {emailSuccess && <p className="text-green-400 text-sm">{emailSuccess}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateEmail}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingEmail(false);
                    setEmailError('');
                    setEmailSuccess('');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Password Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">
            Password
          </h2>
          
          {!editingPassword ? (
            <div className="flex items-center justify-between">
              <span className="text-slate-300">••••••••</span>
              <button
                onClick={() => setEditingPassword(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Change Password
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-400 text-sm">{passwordSuccess}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleUpdatePassword}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingPassword(false);
                    setPasswordError('');
                    setPasswordSuccess('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sign Out Section */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Sign Out</h2>
          <div className="flex items-center justify-between">
            <p className="text-slate-400">Sign out of your account on this device</p>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

        {/* My Discography Section */}
        <div className="bg-slate-800 rounded-lg p-6 mt-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">My Discography</h2>
              <p className="text-sm text-slate-400 mt-1">
                Manage your albums and published tracks
              </p>
            </div>
            <div className="flex items-center gap-3">
              {profile?.username && (
                <Link
                  to={`/u/${profile.username}`}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                >
                  <ExternalLink size={16} />
                  View Public Profile
                </Link>
              )}
              <button
                onClick={() => setShowCreateAlbum(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
                New Album
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-900/50 rounded-lg p-4 text-center border border-slate-700/50">
                <Music className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                <span className="text-2xl font-bold text-white block">{stats.trackCount || 0}</span>
                <span className="text-xs text-slate-400">Published Tracks</span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center border border-slate-700/50">
                <Disc3 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <span className="text-2xl font-bold text-white block">{albums.length}</span>
                <span className="text-xs text-slate-400">Albums</span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center border border-slate-700/50">
                <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <span className="text-2xl font-bold text-white block">{stats.totalFires || 0}</span>
                <span className="text-xs text-slate-400">Total Fires</span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center border border-slate-700/50">
                <Music className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <span className="text-2xl font-bold text-white block">{stats.forkCount || 0}</span>
                <span className="text-xs text-slate-400">Times Forked</span>
              </div>
            </div>
          )}

          {/* Create Album Modal */}
          {showCreateAlbum && (
            <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-indigo-500/50">
              <h3 className="text-lg font-semibold text-white mb-4">Create New Album</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Album Title *</label>
                  <input
                    type="text"
                    value={newAlbumTitle}
                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                    placeholder="My Mixtape Vol. 1"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Genre (optional)</label>
                  <input
                    type="text"
                    value={newAlbumGenre}
                    onChange={(e) => setNewAlbumGenre(e.target.value)}
                    placeholder="Hip-Hop, R&B, etc."
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {albumError && <p className="text-red-400 text-sm">{albumError}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateAlbum}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    <Save size={16} />
                    Create Album
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateAlbum(false);
                      setNewAlbumTitle('');
                      setNewAlbumGenre('');
                      setAlbumError('');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {loadingDiscography ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              <span className="ml-2 text-slate-400">Loading discography...</span>
            </div>
          ) : (
            <>
              {/* Albums Grid */}
              {albums.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Albums</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {albums.map(album => (
                      <div
                        key={album.id}
                        className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-4 hover:border-indigo-500/50 transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          {album.cover_art_url ? (
                            <img 
                              src={album.cover_art_url} 
                              alt={album.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center">
                              <Disc3 className="w-8 h-8 text-slate-600" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            {editingAlbum === album.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  defaultValue={album.title}
                                  className="w-full px-2 py-1 bg-slate-800 border border-indigo-500 rounded text-white text-sm focus:outline-none"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleUpdateAlbum(album.id, { title: e.target.value });
                                    }
                                    if (e.key === 'Escape') {
                                      setEditingAlbum(null);
                                    }
                                  }}
                                  autoFocus
                                />
                              </div>
                            ) : (
                              <>
                                <h4 className="font-medium text-white truncate">{album.title}</h4>
                                {album.genre_tag && (
                                  <span className="text-xs text-slate-500">{album.genre_tag}</span>
                                )}
                                <div className="flex items-center gap-1 mt-1">
                                  <span className={`text-xs ${album.is_public ? 'text-green-400' : 'text-slate-500'}`}>
                                    {album.is_public ? 'Public' : 'Private'}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingAlbum(album.id)}
                              className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleUpdateAlbum(album.id, { is_public: !album.is_public })}
                              className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                              title={album.is_public ? 'Make Private' : 'Make Public'}
                            >
                              <ExternalLink size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteAlbum(album.id)}
                              className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Published Tracks */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Published Tracks</h3>
                {tracks.length > 0 ? (
                  <div className="space-y-2">
                    {tracks.map(track => (
                      <Link
                        key={track.id}
                        to="/feed"
                        className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-indigo-500/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                          <Music size={18} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate">{track.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            {track.primary_artist_style && (
                              <span className="text-indigo-400">{track.primary_artist_style}</span>
                            )}
                            <span>•</span>
                            <span>{new Date(track.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Flame size={16} className="text-orange-400" />
                          <span className="text-sm">{track.fire_count || 0}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Music className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No published tracks yet</p>
                    <p className="text-sm mt-1">Use Ghostwriter to create and publish your first track!</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
