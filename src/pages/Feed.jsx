/**
 * Feed - Social media feed showing posts and tracks
 * Compact Twitter-style layout with unified content
 * Features: Posts, Tracks, Comments, Likes, Following integration
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Music, 
  Loader2, 
  TrendingUp,
  Clock,
  RefreshCw,
  Copy,
  Check,
  X,
  User,
  Ghost,
  MessageCircle,
  Heart,
  Settings,
  Sparkles,
  Users,
  FileText,
  Trash2
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { 
  getUnifiedFeed,
  likeTrack, 
  unlikeTrack,
  likePost,
  unlikePost,
  deletePost,
  getUserLikedTrackIds,
  getUserLikedPostIds,
  getCommentCount,
  checkBotRoast,
  addBotRoast,
  checkPostBotComment,
  addPostBotComment,
  VRSA_BOT_NAME,
  VRSA_BOT_AVATAR_URL
} from '../lib/social';
import { generateTrackRoast, generatePostComment } from '../lib/api';
import CommentSection from '../components/social/CommentSection';
import PostCommentSection from '../components/social/PostCommentSection';
import CreatePost from '../components/social/CreatePost';
import FollowButton from '../components/social/FollowButton';

/**
 * Compact Post Card - For regular text posts
 */
const PostCard = ({ post, isLiked, onLike, onUnlike, onDelete, user }) => {
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localLikeCount, setLocalLikeCount] = useState(post.like_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [botComment, setBotComment] = useState(null);
  const commentCount = post.comment_count || 0;
  const isOwnPost = user && post.user_id === user.id;

  useEffect(() => {
    setLocalLiked(isLiked);
  }, [isLiked]);

  // Fetch existing bot comment on mount (don't generate new ones)
  useEffect(() => {
    const fetchBotComment = async () => {
      const { hasComment, comment } = await checkPostBotComment(post.id);
      if (hasComment && comment) {
        setBotComment(comment.content);
      }
    };

    fetchBotComment();
  }, [post.id]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (!user) return;
    
    if (localLiked) {
      setLocalLiked(false);
      setLocalLikeCount(prev => Math.max(0, prev - 1));
      await onUnlike(post.id);
    } else {
      setLocalLiked(true);
      setLocalLikeCount(prev => prev + 1);
      await onLike(post.id);
    }
  };

  const isFollowersOnly = post.privacy === 'followers_only';
  const isBotPost = post.is_bot_post;
  
  // Use bot info if it's a bot post, otherwise use profile info
  const displayName = isBotPost ? (post.bot_display_name || VRSA_BOT_NAME) : `@${post.profiles?.username || 'Unknown'}`;
  const profilePicUrl = isBotPost ? VRSA_BOT_AVATAR_URL : post.profiles?.profile_picture_url;
  const profileLink = isBotPost ? '#' : `/u/${post.profiles?.username}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden hover:border-slate-600/50 transition-all"
    >
      <div className="p-4">
        {/* Header: Avatar + Username + Timestamp */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <Link to={profileLink} className="flex-shrink-0" onClick={(e) => isBotPost && e.preventDefault()}>
            {profilePicUrl ? (
              <img 
                src={profilePicUrl} 
                alt={displayName}
                className={`w-10 h-10 rounded-full object-cover border-2 ${isBotPost ? 'border-yellow-500/50' : 'border-slate-700'}`}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
            )}
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Username & Timestamp Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link 
                to={profileLink}
                onClick={(e) => isBotPost && e.preventDefault()}
                className={`font-semibold hover:text-indigo-400 transition-colors text-sm ${isBotPost ? 'text-yellow-400' : 'text-white'}`}
              >
                {displayName}
              </Link>
              {isBotPost && (
                <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                  Bot
                </span>
              )}
              <span className="text-slate-500 text-xs">·</span>
              <span className="text-slate-500 text-xs">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              {/* Privacy Badge */}
              {isFollowersOnly && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded">
                  <Users size={10} />
                  Followers
                </span>
              )}
            </div>

            {/* Post Content */}
            <p className="text-slate-200 text-sm mt-1.5 whitespace-pre-wrap break-words leading-relaxed">
              {post.content}
            </p>

            {/* Bot Comment - Compact */}
            {botComment && (
              <div className="flex items-start gap-2 mt-3 p-2 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
                <img 
                  src={VRSA_BOT_AVATAR_URL} 
                  alt="VRSA Bot"
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-yellow-400">{VRSA_BOT_NAME}</span>
                  <p className="text-xs text-yellow-200/80 italic mt-0.5 line-clamp-2">"{botComment}"</p>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700/30">
              {/* Like Button */}
              <button
                onClick={handleLikeClick}
                disabled={!user}
                className={`flex items-center gap-1.5 text-sm transition-all ${
                  localLiked 
                    ? 'text-pink-400' 
                    : 'text-slate-500 hover:text-pink-400'
                } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Heart size={16} className={localLiked ? 'fill-current' : ''} />
                <span>{localLikeCount}</span>
              </button>

              {/* Comment Toggle */}
              <button
                onClick={() => setShowComments(!showComments)}
                className={`flex items-center gap-1.5 text-sm transition-all ${
                  showComments ? 'text-indigo-400' : 'text-slate-500 hover:text-indigo-400'
                }`}
              >
                <MessageCircle size={16} />
                <span>{commentCount}</span>
              </button>

              {/* Follow Button */}
              {/* Follow Button - only show for non-bot posts */}
            {post.profiles?.id && !isBotPost && (
                <FollowButton 
                  targetUserId={post.profiles.id}
                  targetUsername={post.profiles.username}
                  size="small"
                  variant="ghost"
                />
              )}

              {/* Delete Button - Only for own posts */}
              {isOwnPost && (
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!confirm('Delete this post? This cannot be undone.')) return;
                    setIsDeleting(true);
                    await onDelete(post.id);
                    setIsDeleting(false);
                  }}
                  disabled={isDeleting}
                  className="ml-auto flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-400 transition-all disabled:opacity-50"
                  title="Delete post"
                >
                  {isDeleting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section - Expandable */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700/50"
          >
            <PostCommentSection postId={post.id} postContent={post.content} isExpanded={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * Compact Track Card - For lyrics posts
 */
const TrackCard = ({ track, isLiked, onLike, onUnlike, onClick, user }) => {
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localFireCount, setLocalFireCount] = useState(track.fire_count || 0);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [botRoast, setBotRoast] = useState(null);
  const [loadingRoast, setLoadingRoast] = useState(false);

  useEffect(() => {
    setLocalLiked(isLiked);
  }, [isLiked]);

  // Fetch comment count and bot roast on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      const count = await getCommentCount(track.id);
      setCommentCount(count);
      
      // Check for existing bot roast
      const { hasRoast, roast } = await checkBotRoast(track.id);
      if (hasRoast && roast) {
        setBotRoast(roast.content);
      } else {
        // Generate and save bot roast (only once per track)
        generateRoast();
      }
    };
    
    const generateRoast = async () => {
      setLoadingRoast(true);
      try {
        const hookSnippet = track.hook_snippet || track.lyrics_content?.substring(0, 100);
        const roastContent = await generateTrackRoast(hookSnippet, track.primary_artist_style);
        
        const { comment, error } = await addBotRoast(track.id, roastContent);
        if (!error && comment) {
          setBotRoast(roastContent);
          setCommentCount(prev => prev + 1);
        } else if (error?.message === 'Track already has a bot roast') {
          const { roast: existingRoast } = await checkBotRoast(track.id);
          if (existingRoast) setBotRoast(existingRoast.content);
        }
      } catch (err) {
        console.error('Error generating roast:', err);
      } finally {
        setLoadingRoast(false);
      }
    };

    fetchMetadata();
  }, [track.id, track.hook_snippet, track.lyrics_content, track.primary_artist_style]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (!user) return;
    
    if (localLiked) {
      setLocalLiked(false);
      setLocalFireCount(prev => Math.max(0, prev - 1));
      await onUnlike(track.id);
    } else {
      setLocalLiked(true);
      setLocalFireCount(prev => prev + 1);
      await onLike(track.id);
    }
  };

  const isGhostMode = track.is_anonymous;
  const profilePicUrl = track.profiles?.profile_picture_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden hover:border-indigo-500/30 transition-all"
    >
      <div className="p-4">
        {/* Header: Avatar + Username + Timestamp + Badge */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {isGhostMode ? (
              <div className="w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600 flex items-center justify-center">
                <Ghost size={18} className="text-slate-400" />
              </div>
            ) : profilePicUrl ? (
              <Link to={`/u/${track.profiles?.username}`}>
                <img 
                  src={profilePicUrl} 
                  alt={track.profiles?.username || 'User'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-700"
                />
              </Link>
            ) : (
              <Link to={`/u/${track.profiles?.username}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
              </Link>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Username & Timestamp Row */}
            <div className="flex items-center gap-2 flex-wrap">
              {isGhostMode ? (
                <span className="text-slate-400 font-medium text-sm">Anonymous</span>
              ) : (
                <Link 
                  to={`/u/${track.profiles?.username}`}
                  className="font-semibold text-white hover:text-indigo-400 transition-colors text-sm"
                >
                  @{track.profiles?.username || 'Unknown'}
                </Link>
              )}
              <span className="text-slate-500 text-xs">·</span>
              <span className="text-slate-500 text-xs">
                {new Date(track.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              {/* Lyrics Badge */}
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs rounded">
                <Music size={10} />
                Lyrics
              </span>
            </div>

            {/* Track Title */}
            <h3 
              className="font-bold text-white mt-1 cursor-pointer hover:text-indigo-400 transition-colors text-base"
              onClick={() => onClick(track)}
            >
              {track.title}
            </h3>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {track.primary_artist_style && (
                <span className="px-2 py-0.5 bg-indigo-600/20 text-indigo-400 text-xs rounded-full">
                  🎤 {track.primary_artist_style}
                </span>
              )}
              {track.mood_tags?.slice(0, 2).map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-0.5 bg-purple-600/20 text-purple-400 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Hook Snippet */}
            <div 
              className="bg-slate-900/50 rounded-lg p-3 mt-3 cursor-pointer hover:bg-slate-900/70 transition-colors"
              onClick={() => onClick(track)}
            >
              <p className="text-slate-300 italic text-sm line-clamp-2 leading-relaxed">
                "{track.hook_snippet || track.lyrics_content?.substring(0, 120) + '...'}"
              </p>
            </div>

            {/* Bot Roast - Compact */}
            {(botRoast || loadingRoast) && (
              <div className="flex items-start gap-2 mt-3 p-2 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
                <img 
                  src={VRSA_BOT_AVATAR_URL} 
                  alt="VRSA Bot"
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-yellow-400">{VRSA_BOT_NAME}</span>
                  {loadingRoast ? (
                    <p className="text-xs text-yellow-200/60 italic flex items-center gap-1 mt-0.5">
                      <Loader2 size={10} className="animate-spin" />
                      Cooking...
                    </p>
                  ) : (
                    <p className="text-xs text-yellow-200/80 italic mt-0.5 line-clamp-2">"{botRoast}"</p>
                  )}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700/30">
              {/* Fire/Like Button */}
              <button
                onClick={handleLikeClick}
                disabled={!user}
                className={`flex items-center gap-1.5 text-sm transition-all ${
                  localLiked 
                    ? 'text-orange-400' 
                    : 'text-slate-500 hover:text-orange-400'
                } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Flame size={16} className={localLiked ? 'fill-current' : ''} />
                <span>{localFireCount}</span>
              </button>

              {/* Comment Toggle */}
              <button
                onClick={() => setShowComments(!showComments)}
                className={`flex items-center gap-1.5 text-sm transition-all ${
                  showComments ? 'text-indigo-400' : 'text-slate-500 hover:text-indigo-400'
                }`}
              >
                <MessageCircle size={16} />
                <span>{commentCount}</span>
              </button>

              {/* View Full */}
              <button
                onClick={() => onClick(track)}
                className="text-xs text-slate-500 hover:text-indigo-400 transition-colors ml-auto"
              >
                View Lyrics →
              </button>

              {/* Follow Button */}
              {!isGhostMode && track.profiles?.id && (
                <FollowButton 
                  targetUserId={track.profiles.id}
                  targetUsername={track.profiles.username}
                  size="small"
                  variant="ghost"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section - Expandable */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700/50"
          >
            <CommentSection trackId={track.id} isExpanded={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * TrackDetailModal - Full track view modal with comments
 */
const TrackDetailModal = ({ track, isOpen, onClose, isLiked, onLike, onUnlike, user }) => {
  const [copied, setCopied] = useState(false);
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localFireCount, setLocalFireCount] = useState(track?.fire_count || 0);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (track) {
      setLocalLiked(isLiked);
      setLocalFireCount(track.fire_count || 0);
    }
  }, [track, isLiked]);

  if (!isOpen || !track) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(track.lyrics_content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLikeClick = async () => {
    if (!user) return;
    
    if (localLiked) {
      setLocalLiked(false);
      setLocalFireCount(prev => Math.max(0, prev - 1));
      await onUnlike(track.id);
    } else {
      setLocalLiked(true);
      setLocalFireCount(prev => prev + 1);
      await onLike(track.id);
    }
  };

  const handleFork = () => {
    const forkSettings = track.generation_settings || {};
    sessionStorage.setItem('forkSettings', JSON.stringify(forkSettings));
    window.location.href = '/ghostwriter?fork=true';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-slate-900 px-5 py-4 border-b border-slate-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{track.title}</h2>
                  <Link 
                    to={`/u/${track.profiles?.username}`}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    @{track.profiles?.username || 'Unknown'}
                  </Link>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {track.primary_artist_style && (
                <span className="px-2 py-1 bg-indigo-600/20 text-indigo-400 text-xs rounded-full">
                  {track.primary_artist_style}
                </span>
              )}
              {track.mood_tags?.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded-full">
                  {tag}
                </span>
              ))}
              
              {track.generation_settings && Object.keys(track.generation_settings).length > 0 && (
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-colors ${
                    showSettings 
                      ? 'bg-slate-600/30 text-white border border-slate-500' 
                      : 'bg-slate-700/30 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  <Settings size={12} />
                  Settings
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[55vh]">
            {showSettings && track.generation_settings && (
              <div className="mx-5 mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {track.generation_settings.artistName && (
                    <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                      <span className="text-slate-500">Artist:</span>
                      <span className="text-indigo-400">{track.generation_settings.artistName}</span>
                    </div>
                  )}
                  {track.generation_settings.moodTag && (
                    <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                      <span className="text-slate-500">Mood:</span>
                      <span className="text-purple-400">{track.generation_settings.moodTag}</span>
                    </div>
                  )}
                  {track.generation_settings.temperature && (
                    <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                      <span className="text-slate-500">Temp:</span>
                      <span className="text-orange-400">{track.generation_settings.temperature}</span>
                    </div>
                  )}
                  {track.generation_settings.rhymeComplexity && (
                    <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                      <span className="text-slate-500">Rhyme:</span>
                      <span className="text-green-400">{track.generation_settings.rhymeComplexity}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="p-5">
              <pre className="whitespace-pre-wrap text-slate-300 font-mono text-sm leading-relaxed">
                {track.lyrics_content}
              </pre>
            </div>

            <div className="px-5 pb-5">
              <CommentSection trackId={track.id} isExpanded={true} />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-slate-900 px-5 py-3 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <button
                onClick={handleLikeClick}
                disabled={!user}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                  localLiked 
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-orange-400 border border-slate-700'
                } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Flame size={16} className={localLiked ? 'fill-current' : ''} />
                <span>{localFireCount}</span>
              </button>
              
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors text-sm"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              
              <button
                onClick={handleFork}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all text-sm"
              >
                <Music size={16} />
                Fork This Flow
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Main Feed Component
 */
const Feed = () => {
  const { user } = useUser();
  const [feedItems, setFeedItems] = useState([]);
  const [likedTrackIds, setLikedTrackIds] = useState(new Set());
  const [likedPostIds, setLikedPostIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('created_at');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    document.title = 'Feed - Community Posts & Tracks | VRS/A';
  }, []);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await getUnifiedFeed({ 
        limit: 50, 
        sortBy 
      });
      setFeedItems(items || []);
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const fetchLikedItems = useCallback(async () => {
    if (!user) return;
    const [trackLikes, postLikes] = await Promise.all([
      getUserLikedTrackIds(user.id),
      getUserLikedPostIds(user.id)
    ]);
    setLikedTrackIds(trackLikes);
    setLikedPostIds(postLikes);
  }, [user]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  useEffect(() => {
    fetchLikedItems();
  }, [fetchLikedItems]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchFeed(), fetchLikedItems()]);
    setRefreshing(false);
  };

  const handleLikeTrack = async (trackId) => {
    if (!user) return;
    await likeTrack(user.id, trackId);
    setLikedTrackIds(prev => new Set([...prev, trackId]));
  };

  const handleUnlikeTrack = async (trackId) => {
    if (!user) return;
    await unlikeTrack(user.id, trackId);
    setLikedTrackIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(trackId);
      return newSet;
    });
  };

  const handleLikePost = async (postId) => {
    if (!user) return;
    await likePost(user.id, postId);
    setLikedPostIds(prev => new Set([...prev, postId]));
  };

  const handleUnlikePost = async (postId) => {
    if (!user) return;
    await unlikePost(user.id, postId);
    setLikedPostIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
  };

  const handleDeletePost = async (postId) => {
    if (!user) return;
    const { success } = await deletePost(postId);
    if (success) {
      setFeedItems(prev => prev.filter(item => !(item.type === 'post' && item.id === postId)));
    }
  };

  const handlePostCreated = async (newPost) => {
    // Add the new post to the top of the feed
    setFeedItems(prev => [{ ...newPost, type: 'post' }, ...prev]);
    
    // Generate bot comment for the new post
    try {
      const commentContent = await generatePostComment(newPost.content);
      await addPostBotComment(newPost.id, commentContent);
    } catch (err) {
      console.error('Error generating bot comment for new post:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
              🔥 The Cypher
            </span>
          </h1>
          <p className="text-slate-500 text-sm">
            Posts & lyrics from the community
          </p>
        </div>

        {/* Create Post */}
        <div className="mb-6">
          <CreatePost onPostCreated={handlePostCreated} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 mb-4 bg-slate-800/30 p-2 rounded-xl border border-slate-700/30">
          {/* Sort Toggle */}
          <div className="flex items-center gap-1 bg-slate-900/50 rounded-lg p-1">
            <button
              onClick={() => setSortBy('created_at')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === 'created_at' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock size={14} />
              New
            </button>
            <button
              onClick={() => setSortBy('fire_count')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === 'fire_count' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp size={14} />
              Hot
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Feed Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mb-3" />
            <p className="text-slate-500 text-sm">Loading the cypher...</p>
          </div>
        ) : feedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-800/20 rounded-xl border border-slate-700/30">
            <FileText size={48} className="text-slate-600 mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">
              The cypher is empty
            </h2>
            <p className="text-slate-400 text-sm mb-4 max-w-xs">
              Be the first to share something or release a track.
            </p>
            <Link
              to="/ghostwriter"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all text-sm"
            >
              Create a Track
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {feedItems.map((item) => (
                item.type === 'post' ? (
                  <PostCard
                    key={`post-${item.id}`}
                    post={item}
                    isLiked={likedPostIds.has(item.id)}
                    onLike={handleLikePost}
                    onUnlike={handleUnlikePost}
                    onDelete={handleDeletePost}
                    user={user}
                  />
                ) : (
                  <TrackCard
                    key={`track-${item.id}`}
                    track={item}
                    isLiked={likedTrackIds.has(item.id)}
                    onLike={handleLikeTrack}
                    onUnlike={handleUnlikeTrack}
                    onClick={setSelectedTrack}
                    user={user}
                  />
                )
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Track Detail Modal */}
        <TrackDetailModal
          track={selectedTrack}
          isOpen={!!selectedTrack}
          onClose={() => setSelectedTrack(null)}
          isLiked={selectedTrack ? likedTrackIds.has(selectedTrack.id) : false}
          onLike={handleLikeTrack}
          onUnlike={handleUnlikeTrack}
          user={user}
        />
      </div>
    </div>
  );
};

export default Feed;
