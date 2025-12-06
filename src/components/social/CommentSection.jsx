/* eslint-disable no-unused-vars */
/**
 * CommentSection - Threaded comments for published tracks
 * Features: Add comments, reply to comments, delete own comments
 * MySpace-inspired styling with modern UX
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Send,
  Trash2,
  Reply,
  ChevronDown,
  ChevronUp,
  Loader2,
  User,
  Sparkles
} from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import {
  getTrackComments,
  addComment,
  deleteComment,
  VRSA_BOT_NAME,
  VRSA_BOT_AVATAR_URL
} from '../../lib/social';

/**
 * Single Comment Component with reply support
 */
const Comment = ({ 
  comment, 
  onDelete, 
  onReply, 
  currentUserId, 
  depth = 0,
  isDeleting 
}) => {
  const [showReplies, setShowReplies] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const isOwnComment = currentUserId && comment.user_id === currentUserId;
  const isBotComment = comment.is_bot_roast;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 3; // Limit nesting depth

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || submittingReply) return;

    setSubmittingReply(true);
    await onReply(comment.id, replyContent.trim());
    setReplyContent('');
    setIsReplying(false);
    setSubmittingReply(false);
  };

  const displayName = isBotComment 
    ? comment.bot_name || VRSA_BOT_NAME
    : comment.profiles?.username || 'Anonymous';
  
  const profilePicUrl = comment.profiles?.profile_picture_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-slate-700/50' : ''}`}
    >
      <div className={`p-3 rounded-xl mb-2 ${
        isBotComment 
          ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20' 
          : 'bg-slate-800/50 border border-slate-700/30'
      }`}>
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isBotComment ? (
              <img 
                src={VRSA_BOT_AVATAR_URL} 
                alt="VRSA Bot"
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : profilePicUrl ? (
              <img 
                src={profilePicUrl} 
                alt={comment.profiles?.username || 'User'}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <User size={14} className="text-indigo-400" />
              </div>
            )}
            
            {isBotComment ? (
              <span className="text-sm font-medium text-yellow-400">
                {displayName}
              </span>
            ) : (
              <Link 
                to={`/u/${comment.profiles?.username}`}
                className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors"
              >
                @{displayName}
              </Link>
            )}
            
            <span className="text-xs text-slate-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {isOwnComment && !isBotComment && (
              <button
                onClick={() => onDelete(comment.id)}
                disabled={isDeleting}
                className="p-1 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50"
                title="Delete comment"
              >
                {isDeleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Comment Content */}
        <p className={`text-sm leading-relaxed ${
          isBotComment ? 'text-yellow-200/90 italic' : 'text-slate-300'
        }`}>
          {comment.content}
        </p>

        {/* Reply Button */}
        {depth < maxDepth && currentUserId && !isBotComment && (
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1 mt-2 text-xs text-slate-500 hover:text-indigo-400 transition-colors"
          >
            <Reply size={12} />
            Reply
          </button>
        )}

        {/* Reply Form */}
        <AnimatePresence>
          {isReplying && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmitReply}
              className="mt-3 flex gap-2"
            >
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                autoFocus
              />
              <button
                type="submit"
                disabled={!replyContent.trim() || submittingReply}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                {submittingReply ? (
                  <Loader2 size={16} className="animate-spin text-white" />
                ) : (
                  <Send size={16} className="text-white" />
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Replies Toggle & Display */}
      {hasReplies && (
        <div className="mt-1">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2"
          >
            {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
          </button>

          <AnimatePresence>
            {showReplies && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {comment.replies.map((reply) => (
                  <Comment
                    key={reply.id}
                    comment={reply}
                    onDelete={onDelete}
                    onReply={onReply}
                    currentUserId={currentUserId}
                    depth={depth + 1}
                    isDeleting={isDeleting}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Main Comment Section Component
 */
const CommentSection = ({ trackId, isExpanded = false }) => {
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [expanded, setExpanded] = useState(isExpanded);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const { comments: fetchedComments } = await getTrackComments(trackId);
      setComments(fetchedComments);
      setLoading(false);
    };

    if (trackId) {
      fetchComments();
    }
  }, [trackId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user || submitting) return;

    setSubmitting(true);
    const { comment, error } = await addComment({
      trackId,
      userId: user.id,
      content: newComment.trim()
    });

    if (!error && comment) {
      setComments(prev => [...prev, { ...comment, replies: [] }]);
      setNewComment('');
    }
    setSubmitting(false);
  };

  const handleReply = async (parentCommentId, content) => {
    if (!user) return;

    const { comment, error } = await addComment({
      trackId,
      userId: user.id,
      content,
      parentCommentId
    });

    if (!error && comment) {
      // Update the comment tree
      setComments(prev => addReplyToTree(prev, parentCommentId, { ...comment, replies: [] }));
    }
  };

  const handleDelete = async (commentId) => {
    setDeletingId(commentId);
    const { success } = await deleteComment(commentId);
    if (success) {
      setComments(prev => removeFromTree(prev, commentId));
    }
    setDeletingId(null);
  };

  // Helper to add reply to nested structure
  const addReplyToTree = (comments, parentId, newReply) => {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...(comment.replies || []), newReply] };
      }
      if (comment.replies?.length > 0) {
        return { ...comment, replies: addReplyToTree(comment.replies, parentId, newReply) };
      }
      return comment;
    });
  };

  // Helper to remove comment from nested structure
  const removeFromTree = (comments, commentId) => {
    return comments
      .filter(comment => comment.id !== commentId)
      .map(comment => ({
        ...comment,
        replies: comment.replies ? removeFromTree(comment.replies, commentId) : []
      }));
  };

  const totalComments = countComments(comments);

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-indigo-400" />
          <span className="text-sm font-medium text-white">
            Comments ({totalComments})
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={18} className="text-slate-400" />
        ) : (
          <ChevronDown size={18} className="text-slate-400" />
        )}
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700/50"
          >
            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="p-4 border-b border-slate-700/30">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin text-white" />
                    ) : (
                      <>
                        <Send size={16} className="text-white" />
                        <span className="text-sm text-white hidden sm:inline">Post</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 text-center border-b border-slate-700/30">
                <p className="text-sm text-slate-400">
                  <Link to="/login" className="text-indigo-400 hover:underline">
                    Sign in
                  </Link>{' '}
                  to leave a comment
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle size={32} className="mx-auto text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500">No comments yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {comments.map((comment) => (
                      <Comment
                        key={comment.id}
                        comment={comment}
                        onDelete={handleDelete}
                        onReply={handleReply}
                        currentUserId={user?.id}
                        isDeleting={deletingId === comment.id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper to count total comments including replies
const countComments = (comments) => {
  return comments.reduce((total, comment) => {
    return total + 1 + (comment.replies ? countComments(comment.replies) : 0);
  }, 0);
};

export default CommentSection;
