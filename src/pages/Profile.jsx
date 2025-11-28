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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Key, Shield, Crown, Beaker, LogOut, Save, X } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { supabase } from '../lib/supabase';

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
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Shield size={20} className="text-indigo-400" />
            Account Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account Type:</span>
              <div className="flex items-center gap-2">
                {profile?.is_pro === 'true' ? (
                  <>
                    <Crown size={16} className="text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Studio Pass</span>
                  </>
                ) : (
                  <span className="text-slate-300">Free</span>
                )}
              </div>
            </div>
            {profile?.is_beta === 'true' && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Beta Access:</span>
                <div className="flex items-center gap-2">
                  <Beaker size={16} className="text-cyan-400" />
                  <span className="text-cyan-400 font-medium">Enabled</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Username Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <User size={20} className="text-indigo-400" />
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
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Mail size={20} className="text-indigo-400" />
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
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Key size={20} className="text-indigo-400" />
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
      </div>
    </div>
  );
};

export default Profile;
