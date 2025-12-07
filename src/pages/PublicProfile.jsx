/* eslint-disable no-unused-vars */
/**
 * PublicProfile - Public-facing artist profile page
 * Displays user's published tracks, stats, and public albums
 * Route: /u/:username
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Music, 
  Calendar, 
  Award,
  Loader2,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Moon,
  Feather,
  Star,
  MessageCircle,
  Heart,
  User,
  FileText
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { 
  getPublicProfileByUsername, 
  getTracksByUser, 
  getUserStats,
  getPublicAlbumsByUser,
  getFollowCounts,
  getPostsByUser,
  likePost,
  unlikePost,
  getUserLikedPostIds
} from '../lib/social';
import FollowButton from '../components/social/FollowButton';
import PostCommentSection from '../components/social/PostCommentSection';

/**
 * Achievement Badge - Display an earned badge
 */
const AchievementBadge = ({ icon: IconComponent, title, description, color, earned = true }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
    earned 
      ? `bg-${color}-500/10 border-${color}-500/30` 
      : 'bg-slate-800/30 border-slate-700/30 opacity-50'
  }`}>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
      earned ? `bg-${color}-500/20` : 'bg-slate-700/50'
    }`}>
      <IconComponent size={20} className={earned ? `text-${color}-400` : 'text-slate-500'} />
    </div>
    <div>
      <h4 className={`font-medium ${earned ? 'text-white' : 'text-slate-500'}`}>{title}</h4>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  </div>
);

/**
 * Calculate achievements based on stats and tracks
 */
const calculateAchievements = (stats, tracks) => {
  const achievements = [];
  
  // Flow Master - high rhyme density (if we have that metric)
  if (stats?.avgRhymeDensity && stats.avgRhymeDensity > 80) {
    achievements.push({
      id: 'flow-master',
      icon: Zap,
      title: 'Flow Master',
      description: `Avg rhyme density: ${stats.avgRhymeDensity}%`,
      color: 'yellow',
      earned: true
    });
  }
  
  // Prolific - generated many tracks
  if (stats?.trackCount >= 10) {
    achievements.push({
      id: 'prolific',
      icon: Feather,
      title: 'Prolific',
      description: `${stats.trackCount} tracks published`,
      color: 'green',
      earned: true
    });
  }
  
  // Fire Starter - accumulated fires
  if (stats?.totalFires >= 50) {
    achievements.push({
      id: 'fire-starter',
      icon: Flame,
      title: 'Fire Starter',
      description: `${stats.totalFires} total fires earned`,
      color: 'orange',
      earned: true
    });
  }
  
  // Dark Poet - mood tag analysis (check if most used is dark/melancholy)
  const moodCounts = {};
  tracks.forEach(track => {
    (track.mood_tags || []).forEach(tag => {
      moodCounts[tag.toLowerCase()] = (moodCounts[tag.toLowerCase()] || 0) + 1;
    });
  });
  const darkMoods = ['dark', 'melancholy', 'sad', 'angry', 'aggressive'];
  const darkCount = darkMoods.reduce((sum, mood) => sum + (moodCounts[mood] || 0), 0);
  if (darkCount >= 5) {
    achievements.push({
      id: 'dark-poet',
      icon: Moon,
      title: 'Dark Poet',
      description: 'Prefers melancholy vibes',
      color: 'purple',
      earned: true
    });
  }
  
  // Rising Star - new account with potential
  if (stats?.trackCount >= 3 && stats?.trackCount < 10) {
    achievements.push({
      id: 'rising-star',
      icon: Star,
      title: 'Rising Star',
      description: 'New artist on the rise',
      color: 'cyan',
      earned: true
    });
  }
  
  return achievements;
};

/**
 * TrackCard - Individual track display card
 */
const TrackCard = ({ track, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden cursor-pointer hover:border-indigo-500/50 transition-all group"
      onClick={() => onClick(track)}
    >
      {/* Track Header */}
      <div className="p-4 pb-2">
        <h3 className="font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
          {track.title}
        </h3>
        {track.primary_artist_style && (
          <p className="text-xs text-slate-500 mt-1">
            Style: {track.primary_artist_style}
          </p>
        )}
      </div>

      {/* Hook Snippet */}
      <div className="px-4 pb-3">
        <p className="text-sm text-slate-400 italic line-clamp-3 whitespace-pre-line">
          "{track.hook_snippet || track.lyrics_content?.substring(0, 150) + '...'}"
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-1 text-orange-400">
          <Flame size={16} />
          <span className="text-sm font-medium">{track.fire_count || 0}</span>
        </div>
        <span className="text-xs text-slate-500">
          {new Date(track.created_at).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
};

/**
 * StatBadge - Display a single stat
 */
const StatBadge = ({ icon: IconComponent, label, value, color = 'indigo' }) => (
  <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
    <IconComponent size={24} className={`text-${color}-400 mb-2`} />
    <span className="text-2xl font-bold text-white">{value}</span>
    <span className="text-xs text-slate-400">{label}</span>
  </div>
);

/**
 * TrackModal - Full lyrics display modal
 */
const TrackModal = ({ track, isOpen, onClose, onFork }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !track) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(track.lyrics_content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
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
        <div className="sticky top-0 z-10 bg-slate-900 px-6 py-4 border-b border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{track.title}</h2>
              {track.primary_artist_style && (
                <p className="text-sm text-slate-400 mt-1">
                  Style: {track.primary_artist_style}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                title="Copy lyrics"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1 text-orange-400">
              <Flame size={16} />
              {track.fire_count || 0} fire
            </span>
            <span className="text-slate-500">
              {new Date(track.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Lyrics Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <pre className="whitespace-pre-wrap text-slate-300 font-mono text-sm leading-relaxed">
            {track.lyrics_content}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-900 px-6 py-4 border-t border-slate-700">
          <button
            onClick={onFork}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all"
          >
            <Music size={18} />
            Fork This Flow
          </button>
          <p className="text-xs text-slate-500 text-center mt-2">
            Use these settings to start your own track
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PublicProfile = () => {
  const { username } = useParams();
  const { user } = useUser();
  
  const [profile, setProfile] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [posts, setPosts] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [stats, setStats] = useState({ trackCount: 0, totalFire: 0, avgRhymeDensity: null });
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [likedPostIds, setLikedPostIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'tracks'

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch profile by username
        const { profile: profileData, error: profileError } = await getPublicProfileByUsername(username);
        if (profileError || !profileData) {
          setError('Profile not found');
          return;
        }
        setProfile(profileData);

        // Fetch tracks, stats, albums, posts, and follow counts in parallel
        const [tracksResult, statsResult, albumsResult, followCounts, postsResult] = await Promise.all([
          getTracksByUser(profileData.id),
          getUserStats(profileData.id),
          getPublicAlbumsByUser(profileData.id),
          getFollowCounts(profileData.id),
          getPostsByUser(profileData.id)
        ]);

        setTracks(tracksResult.tracks || []);
        setStats(statsResult);
        setAlbums(albumsResult.albums || []);
        setFollowStats(followCounts);
        setPosts(postsResult.posts || []);

        // Fetch liked posts for current user
        if (user) {
          const likedIds = await getUserLikedPostIds(user.id);
          setLikedPostIds(likedIds);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileData();
    }
  }, [username, user]);

  const handleFork = (track) => {
    // Store fork settings in sessionStorage and navigate to Ghostwriter
    const forkSettings = track.generation_settings || {};
    sessionStorage.setItem('forkSettings', JSON.stringify(forkSettings));
    window.location.href = '/ghostwriter?fork=true';
  };

  const handleLikePost = async (postId) => {
    if (!user) return;
    await likePost(user.id, postId);
    setLikedPostIds(prev => new Set([...prev, postId]));
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, like_count: (p.like_count || 0) + 1 } : p
    ));
  };

  const handleUnlikePost = async (postId) => {
    if (!user) return;
    await unlikePost(user.id, postId);
    setLikedPostIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, like_count: Math.max(0, (p.like_count || 0) - 1) } : p
    ));
  };

  const isOwnProfile = user && profile && user.id === profile.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Profile Not Found</h2>
        <p className="text-slate-400 mb-6">
          The user "{username}" doesn't exist or hasn't published any tracks yet.
        </p>
        <Link
          to="/feed"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
        >
          Browse the Feed
        </Link>
      </div>
    );
  }

  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="min-h-screen bg-slate-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link
          to="/feed"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Feed
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            {profile.profile_picture_url ? (
              <img 
                src={profile.profile_picture_url}
                alt={profile.username}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
                {profile.username?.charAt(0).toUpperCase() || '?'}
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                {/* Follow Button - only show if not own profile */}
                {!isOwnProfile && profile.id && (
                  <FollowButton 
                    targetUserId={profile.id}
                    targetUsername={profile.username}
                    onFollowChange={(delta) => setFollowStats(prev => ({
                      ...prev,
                      followers: Math.max(0, prev.followers + delta)
                    }))}
                    size="default"
                    variant="default"
                  />
                )}
              </div>
              
              {/* Follower/Following counts */}
              <div className="flex items-center gap-6 mt-3">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-white">{followStats.followers}</span>
                  <span className="text-sm text-slate-400">Followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-white">{followStats.following}</span>
                  <span className="text-sm text-slate-400">Following</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Member since {memberSince}
                </span>
                {profile.membership_tier && profile.membership_tier !== 'free' && (
                  <span className="px-2 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-xs font-medium">
                    {profile.membership_tier}
                  </span>
                )}
              </div>
              
              {isOwnProfile && (
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1 mt-3 text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Edit Profile <ExternalLink size={14} />
                </Link>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <StatBadge 
              icon={Music} 
              label="Tracks Released" 
              value={stats.trackCount}
              color="indigo"
            />
            <StatBadge 
              icon={Flame} 
              label="Total Fire" 
              value={stats.totalFire}
              color="orange"
            />
            {stats.avgRhymeDensity !== null && (
              <StatBadge 
                icon={Award} 
                label="Avg Rhyme Density" 
                value={`${stats.avgRhymeDensity}%`}
                color="purple"
              />
            )}
            <StatBadge 
              icon={Award} 
              label="Albums" 
              value={albums.length}
              color="green"
            />
          </div>

          {/* Achievement Badges */}
          {(() => {
            const achievements = calculateAchievements(stats, tracks);
            if (achievements.length === 0) return null;
            return (
              <div className="mt-8 pt-6 border-t border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Award size={20} className="text-yellow-400" />
                  Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {achievements.map((badge) => (
                    <AchievementBadge key={badge.id} {...badge} />
                  ))}
                </div>
              </div>
            );
          })()}
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'posts'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <FileText size={18} />
            Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('tracks')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'tracks'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Music size={18} />
            Tracks ({tracks.length})
          </button>
        </div>

        {/* Posts Section */}
        <AnimatePresence mode="wait">
          {activeTab === 'posts' && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {posts.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <FileText size={48} className="mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400">No posts yet</p>
                  {isOwnProfile && (
                    <Link
                      to="/feed"
                      className="inline-block mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Create Your First Post
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <ProfilePostCard 
                      key={post.id}
                      post={post}
                      isLiked={likedPostIds.has(post.id)}
                      onLike={handleLikePost}
                      onUnlike={handleUnlikePost}
                      user={user}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Tracks Section */}
          {activeTab === 'tracks' && (
            <motion.div
              key="tracks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {tracks.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <Music size={48} className="mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400">No tracks released yet</p>
                  {isOwnProfile && (
                    <Link
                      to="/ghostwriter"
                      className="inline-block mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Create Your First Track
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tracks.map((track) => (
                    <TrackCard 
                      key={track.id} 
                      track={track}
                      onClick={setSelectedTrack}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Track Modal */}
        <TrackModal
          track={selectedTrack}
          isOpen={!!selectedTrack}
          onClose={() => setSelectedTrack(null)}
          onFork={() => handleFork(selectedTrack)}
        />
      </div>
    </div>
  );
};

/**
 * Profile Post Card - For displaying posts on a user's profile
 */
const ProfilePostCard = ({ post, isLiked, onLike, onUnlike, user }) => {
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localLikeCount, setLocalLikeCount] = useState(post.like_count || 0);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    setLocalLiked(isLiked);
  }, [isLiked]);

  const handleLikeClick = async () => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden"
    >
      <div className="p-4">
        {/* Post Content */}
        <p className="text-slate-200 text-sm whitespace-pre-wrap break-words leading-relaxed">
          {post.content}
        </p>

        {/* Timestamp */}
        <p className="text-xs text-slate-500 mt-3">
          {new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          })}
        </p>

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
            <span>{post.comment_count || 0}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
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

export default PublicProfile;
