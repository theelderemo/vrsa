/* eslint-disable no-unused-vars */
/**
 * CreatePost - Component for creating new social posts
 * Supports text posts with privacy settings (public/followers-only)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Globe, Users, Loader2, X } from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import { createPost } from '../../lib/social';
import MentionTextarea from '../ui/MentionTextarea';

const MAX_CHARACTERS = 500;

const CreatePost = ({ onPostCreated, compact = false }) => {
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const characterCount = content.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { post, error: postError } = await createPost({
        userId: user.id,
        content: content.trim(),
        privacy
      });

      if (postError) throw postError;

      setContent('');
      setPrivacy('public');
      setIsFocused(false);
      onPostCreated?.(post);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  if (!user) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
        <p className="text-slate-400 text-sm">
          Sign in to share your thoughts
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden transition-all ${
        isFocused ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : ''
      }`}
    >
      <div className="p-4">
        {/* User Avatar & Input Row */}
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {user.email?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>

          {/* Input Area */}
          <div className="flex-1 min-w-0">
            <MentionTextarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind?"
              className={`w-full bg-transparent text-white placeholder-slate-500 resize-none outline-none text-sm leading-relaxed ${
                compact ? 'min-h-[60px]' : 'min-h-[80px]'
              }`}
              rows={compact ? 2 : 3}
            />

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-400 text-xs mt-2"
                >
                  <X size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Actions Row - Show when focused or has content */}
        <AnimatePresence>
          {(isFocused || content.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-slate-700/50"
            >
              <div className="flex items-center justify-between">
                {/* Privacy Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPrivacy('public')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      privacy === 'public'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-slate-700/50 text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <Globe size={14} />
                    Public
                  </button>
                  <button
                    onClick={() => setPrivacy('followers_only')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      privacy === 'followers_only'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-slate-700/50 text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <Users size={14} />
                    Followers
                  </button>
                </div>

                {/* Character Count & Submit */}
                <div className="flex items-center gap-3">
                  {/* Character Count */}
                  <span className={`text-xs ${
                    isOverLimit 
                      ? 'text-red-400' 
                      : characterCount > MAX_CHARACTERS * 0.9 
                        ? 'text-yellow-400' 
                        : 'text-slate-500'
                  }`}>
                    {characterCount}/{MAX_CHARACTERS}
                  </span>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      canSubmit
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                        : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    Post
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CreatePost;
