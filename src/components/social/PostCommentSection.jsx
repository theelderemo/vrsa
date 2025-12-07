/* eslint-disable no-unused-vars */
/**
 * PostCommentSection - Threaded comments for social posts
 * Features: Add comments, reply to comments, delete own comments, @ mentions, bot responses
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
  User
} from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import {
  getPostComments,
  addPostComment,
  deletePostComment,
  processMentions,
  isBotMentioned,
  VRSA_BOT_NAME,
  VRSA_BOT_AVATAR_URL
} from '../../lib/social';
import { generateBotMentionResponse } from '../../lib/api';
import MentionInput from '../ui/MentionInput';

/**
 * Single Comment Component with reply support
 */
const PostComment = ({ 
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

  const isBotComment = comment.is_bot_comment;
  const isOwnComment = currentUserId && comment.user_id === currentUserId;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 3;

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
    ? VRSA_BOT_NAME 
    : (comment.profiles?.username || 'Anonymous');
  
  const profilePicUrl = isBotComment 
    ? null 
    : comment.profiles?.profile_picture_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-slate-700/50' : ''}`}
    >
      <div className={`p-3 rounded-xl mb-2 border ${
        isBotComment 
          ? 'bg-yellow-500/5 border-yellow-500/20' 
          : 'bg-slate-800/50 border-slate-700/30'
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
                alt={displayName}
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
        <p className="text-sm leading-relaxed text-slate-300">
          {comment.content}
        </p>

        {/* Reply Button */}
        {depth < maxDepth && currentUserId && (
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
              <MentionInput
                value={replyContent}
                onChange={setReplyContent}
                onSubmit={handleSubmitReply}
                placeholder="Write a reply... (use @ to mention)"
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
                  <PostComment
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
 * Main Post Comment Section Component
 */
const PostCommentSection = ({ postId, postContent = '', isExpanded = false }) => {
  const { user, profile } = useUser();
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
      const { comments: fetchedComments } = await getPostComments(postId);
      setComments(fetchedComments);
      setLoading(false);
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // Helper to build conversation thread for bot context
  const buildCommentThread = (comments, targetCommentId) => {
    let thread = [];
    let targetComment = null;

    // Recursively find the target comment in the tree
    const findComment = (commentList, id) => {
      for (const comment of commentList) {
        if (comment.id === id) return comment;
        if (comment.replies?.length > 0) {
          const found = findComment(comment.replies, id);
          if (found) return found;
        }
      }
      return null;
    };

    // Find all comments in a flat map for easier parent lookup
    const flattenComments = (commentList, map = new Map()) => {
      commentList.forEach(comment => {
        map.set(comment.id, comment);
        if (comment.replies?.length > 0) {
          flattenComments(comment.replies, map);
        }
      });
      return map;
    };

    const commentMap = flattenComments(comments);
    targetComment = commentMap.get(targetCommentId);

    if (!targetComment) return [];

    // Build thread by tracing back through parents
    let current = targetComment;
    while (current) {
      const userName = current.is_bot_comment 
        ? current.bot_name 
        : current.profiles?.display_name || current.profiles?.username || 'User';
      
      thread.unshift({
        userName,
        content: current.content,
        isBot: current.is_bot_comment || false
      });

      // Move to parent
      if (current.parent_comment_id) {
        current = commentMap.get(current.parent_comment_id);
      } else {
        break;
      }
    }

    return thread;
  };

  // Helper to add a bot reply to a comment
  const addBotReplyToComment = async (commentId, mentionContent) => {
    try {
      // Build conversation thread for context
      const commentThread = buildCommentThread(comments, commentId);
      const botResponse = await generateBotMentionResponse(mentionContent, postContent, commentThread);
      
      // Add bot comment as a reply
      const { data: botComment, error } = await import('../../lib/supabase').then(({ supabase }) => 
        supabase
          .from('post_comments')
          .insert({
            post_id: postId,
            user_id: null,
            content: botResponse,
            parent_comment_id: commentId,
            is_bot_comment: true,
            bot_name: VRSA_BOT_NAME
          })
          .select()
          .single()
      );

      if (!error && botComment) {
        const botReply = { 
          ...botComment, 
          is_bot_comment: true,
          bot_name: VRSA_BOT_NAME,
          replies: [] 
        };
        setComments(prev => addReplyToTree(prev, commentId, botReply));
      }
    } catch (err) {
      console.error('Error adding bot reply:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user || submitting) return;

    setSubmitting(true);
    const commentContent = newComment.trim();
    
    const { comment, error } = await addPostComment({
      postId,
      userId: user.id,
      content: commentContent
    });

    if (!error && comment) {
      setComments(prev => [...prev, { ...comment, replies: [] }]);
      setNewComment('');
      
      // Process @ mentions and create notifications
      const username = profile?.username || 'Someone';
      await processMentions(commentContent, user.id, 'post_comment', comment.id, username);
      
      // Check if bot was mentioned and generate response
      if (isBotMentioned(commentContent)) {
        setTimeout(() => addBotReplyToComment(comment.id, commentContent), 1000);
      }
    }
    setSubmitting(false);
  };

  const handleReply = async (parentCommentId, content) => {
    if (!user) return;

    const { comment, error } = await addPostComment({
      postId,
      userId: user.id,
      content,
      parentCommentId
    });

    if (!error && comment) {
      setComments(prev => addReplyToTree(prev, parentCommentId, { ...comment, replies: [] }));
      
      // Process @ mentions and create notifications
      const username = profile?.username || 'Someone';
      await processMentions(content, user.id, 'post_comment', comment.id, username);
      
      // Check if bot was mentioned and generate response
      if (isBotMentioned(content)) {
        setTimeout(() => addBotReplyToComment(comment.id, content), 1000);
      }
    }
  };

  const handleDelete = async (commentId) => {
    setDeletingId(commentId);
    const { success } = await deletePostComment(commentId);
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
                  <MentionInput
                    value={newComment}
                    onChange={setNewComment}
                    onSubmit={handleAddComment}
                    placeholder="Add a comment... (use @ to mention)"
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
                      <PostComment
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

export default PostCommentSection;
