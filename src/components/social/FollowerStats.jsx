/* eslint-disable no-unused-vars */
/**
 * FollowerStats - Display follower and following counts
 * MySpace-inspired social stats display
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCheck, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFollowCounts, getFollowers, getFollowing } from '../../lib/social';

/**
 * Follower/Following List Modal
 */
const FollowListModal = ({ isOpen, onClose, userId, type }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      const result = type === 'followers' 
        ? await getFollowers(userId)
        : await getFollowing(userId);
      
      setUsers(type === 'followers' ? result.followers : result.following);
      setLoading(false);
    };

    fetchUsers();
  }, [isOpen, userId, type]);

  if (!isOpen) return null;

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
          className="relative w-full max-w-md max-h-[70vh] overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-slate-900 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white capitalize">
              {type}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* List */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <Users size={32} className="mx-auto text-slate-600 mb-2" />
                <p className="text-sm text-slate-500">
                  {type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {users.map((user) => (
                  <Link
                    key={user.id}
                    to={`/u/${user.username}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <UserCheck size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">
                        @{user.username}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Main FollowerStats Component
 */
const FollowerStats = ({ userId, className = '' }) => {
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(null); // 'followers' | 'following' | null

  useEffect(() => {
    const fetchCounts = async () => {
      if (!userId) return;
      
      setLoading(true);
      const result = await getFollowCounts(userId);
      setCounts(result);
      setLoading(false);
    };

    fetchCounts();
  }, [userId]);

  // Expose method to update counts externally
  const updateCount = (type, delta) => {
    setCounts(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="animate-pulse bg-slate-700/50 rounded-lg h-6 w-20" />
        <div className="animate-pulse bg-slate-700/50 rounded-lg h-6 w-20" />
      </div>
    );
  }

  return (
    <>
      <div className={`flex items-center gap-6 ${className}`}>
        <button
          onClick={() => setShowModal('followers')}
          className="flex items-center gap-2 text-slate-300 hover:text-indigo-400 transition-colors group"
        >
          <span className="text-lg font-bold text-white group-hover:text-indigo-400">
            {counts.followers.toLocaleString()}
          </span>
          <span className="text-sm text-slate-400 group-hover:text-indigo-400">
            Followers
          </span>
        </button>

        <button
          onClick={() => setShowModal('following')}
          className="flex items-center gap-2 text-slate-300 hover:text-indigo-400 transition-colors group"
        >
          <span className="text-lg font-bold text-white group-hover:text-indigo-400">
            {counts.following.toLocaleString()}
          </span>
          <span className="text-sm text-slate-400 group-hover:text-indigo-400">
            Following
          </span>
        </button>
      </div>

      {/* Modal */}
      <FollowListModal
        isOpen={!!showModal}
        onClose={() => setShowModal(null)}
        userId={userId}
        type={showModal || 'followers'}
      />
    </>
  );
};

// Export both components and the update helper
export default FollowerStats;
export { FollowListModal };
