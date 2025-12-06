/* eslint-disable no-unused-vars */
/**
 * FollowButton - Button to follow/unfollow users
 * MySpace-inspired styling with modern interactions
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import { followUser, unfollowUser, isFollowing } from '../../lib/social';

const FollowButton = ({ 
  targetUserId, 
  targetUsername,
  onFollowChange,
  size = 'default', // 'small', 'default', 'large'
  variant = 'default' // 'default', 'outline', 'ghost'
}) => {
  const { user } = useUser();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Check initial follow status
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !targetUserId || user.id === targetUserId) {
        setLoading(false);
        return;
      }

      const status = await isFollowing(user.id, targetUserId);
      setFollowing(status);
      setLoading(false);
    };

    checkFollowStatus();
  }, [user, targetUserId]);

  const handleClick = async () => {
    if (!user || actionLoading) return;

    setActionLoading(true);
    
    if (following) {
      const { success } = await unfollowUser(user.id, targetUserId);
      if (success) {
        setFollowing(false);
        onFollowChange?.(-1);
      }
    } else {
      const { success } = await followUser(user.id, targetUserId);
      if (success) {
        setFollowing(true);
        onFollowChange?.(1);
      }
    }

    setActionLoading(false);
  };

  // Don't show button for own profile or if not logged in
  if (!user || user.id === targetUserId) {
    return null;
  }

  // Size variants
  const sizeClasses = {
    small: 'px-3 py-1 text-xs gap-1',
    default: 'px-4 py-2 text-sm gap-2',
    large: 'px-6 py-3 text-base gap-2'
  };

  const iconSizes = {
    small: 12,
    default: 16,
    large: 20
  };

  // Variant classes
  const getVariantClasses = () => {
    if (following) {
      return 'bg-slate-700/50 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-600 hover:border-red-500/50';
    }
    
    switch (variant) {
      case 'outline':
        return 'bg-transparent hover:bg-indigo-500/10 text-indigo-400 border border-indigo-500/50 hover:border-indigo-400';
      case 'ghost':
        return 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-indigo-400';
      default:
        return 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      disabled={loading || actionLoading}
      className={`
        flex items-center justify-center font-medium rounded-lg transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${getVariantClasses()}
      `}
    >
      {loading || actionLoading ? (
        <Loader2 size={iconSizes[size]} className="animate-spin" />
      ) : following ? (
        <>
          <UserMinus size={iconSizes[size]} />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus size={iconSizes[size]} />
          <span>Follow</span>
        </>
      )}
    </motion.button>
  );
};

export default FollowButton;
