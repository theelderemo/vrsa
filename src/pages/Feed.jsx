/**
 * Feed - The public "Cypher" feed showing published tracks
 * Pinterest-style masonry grid of lyric cards with AI roasts
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
  Zap,
  Info,
  Settings
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { 
  getFeedTracks, 
  likeTrack, 
  unlikeTrack,
  getUserLikedTrackIds 
} from '../lib/social';
import { generateTrackRoast } from '../lib/api';

/**
 * AI Roast Badge - Shows a snarky AI comment
 */
const AIRoastBadge = ({ hookSnippet, artistStyle }) => {
  const [roast, setRoast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRoast, setShowRoast] = useState(false);

  const fetchRoast = async () => {
    if (roast || loading) return;
    setLoading(true);
    try {
      const newRoast = await generateTrackRoast(hookSnippet, artistStyle);
      setRoast(newRoast);
    } catch {
      setRoast("No comment. 💀");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onMouseEnter={() => {
          setShowRoast(true);
          fetchRoast();
        }}
        onMouseLeave={() => setShowRoast(false)}
        className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-500 text-xs transition-colors"
      >
        <Zap size={12} />
        AI Roast
      </button>
      
      {showRoast && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-0 mb-2 p-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 min-w-48 max-w-64"
        >
          {loading ? (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" />
              Generating roast...
            </span>
          ) : (
            <p className="text-xs text-yellow-400 italic">"{roast}"</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

/**
 * FeedCard - Individual track card for the feed
 */
const FeedCard = ({ track, isLiked, onLike, onUnlike, onClick }) => {
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localFireCount, setLocalFireCount] = useState(track.fire_count || 0);

  useEffect(() => {
    setLocalLiked(isLiked);
  }, [isLiked]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    
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

  // Generate a subtle gradient based on mood or style
  const getCardGradient = () => {
    const mood = track.mood_tags?.[0]?.toLowerCase();
    if (mood?.includes('dark') || mood?.includes('angry')) {
      return 'from-red-900/20 to-slate-800/50';
    }
    if (mood?.includes('chill') || mood?.includes('smooth')) {
      return 'from-blue-900/20 to-slate-800/50';
    }
    if (mood?.includes('hype') || mood?.includes('energetic')) {
      return 'from-orange-900/20 to-slate-800/50';
    }
    return 'from-indigo-900/20 to-slate-800/50';
  };

  const isGhostMode = track.is_anonymous;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className={`bg-gradient-to-br ${getCardGradient()} border border-slate-700/50 rounded-xl overflow-hidden cursor-pointer hover:border-indigo-500/50 transition-all group break-inside-avoid mb-4`}
      onClick={() => onClick(track)}
    >
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
              {track.title}
            </h3>
            {isGhostMode ? (
              <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <Ghost size={12} />
                Anonymous
              </span>
            ) : (
              <Link 
                to={`/u/${track.profiles?.username}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1 mt-1"
              >
                <User size={12} />
                {track.profiles?.username || 'Unknown'}
              </Link>
            )}
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {track.primary_artist_style && (
            <span className="px-2 py-0.5 bg-indigo-600/20 text-indigo-400 text-xs rounded-full">
              {track.primary_artist_style}
            </span>
          )}
          {track.mood_tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-purple-600/20 text-purple-400 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Hook Snippet */}
      <div className="px-4 py-3">
        <p className="text-sm text-slate-300 italic whitespace-pre-line leading-relaxed line-clamp-4">
          "{track.hook_snippet || track.lyrics_content?.substring(0, 150) + '...'}"
        </p>
        <p className="text-xs text-indigo-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Click to read full lyrics →
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-900/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              localLiked 
                ? 'bg-orange-500/20 text-orange-400' 
                : 'hover:bg-slate-700/50 text-slate-400 hover:text-orange-400'
            }`}
          >
            <Flame size={16} className={localLiked ? 'fill-current' : ''} />
            <span className="text-sm font-medium">{localFireCount}</span>
          </button>
          
          {/* AI Roast Badge */}
          <div onClick={(e) => e.stopPropagation()}>
            <AIRoastBadge 
              hookSnippet={track.hook_snippet || track.lyrics_content?.substring(0, 100)} 
              artistStyle={track.primary_artist_style}
            />
          </div>
        </div>
        <span className="text-xs text-slate-500">
          {new Date(track.created_at).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
};

/**
 * TrackDetailModal - Full track view modal
 */
const TrackDetailModal = ({ track, isOpen, onClose, isLiked, onLike, onUnlike }) => {
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
          <div className="sticky top-0 z-10 bg-slate-900 px-6 py-4 border-b border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{track.title}</h2>
                <Link 
                  to={`/u/${track.profiles?.username}`}
                  className="text-sm text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1 mt-1"
                >
                  <User size={14} />
                  {track.profiles?.username || 'Unknown'}
                </Link>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Tags & Stats */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {track.primary_artist_style && (
                <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 text-sm rounded-full">
                  {track.primary_artist_style}
                </span>
              )}
              {track.mood_tags?.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full">
                  {tag}
                </span>
              ))}
              
              {/* Generation Settings Toggle */}
              {track.generation_settings && Object.keys(track.generation_settings).length > 0 && (
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`flex items-center gap-1 px-3 py-1 text-sm rounded-full transition-colors ${
                    showSettings 
                      ? 'bg-slate-600/30 text-white border border-slate-500' 
                      : 'bg-slate-700/30 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  <Info size={14} />
                  Settings
                </button>
              )}
            </div>
          </div>

          {/* Lyrics Content */}
          <div className="p-6 max-h-[50vh] overflow-y-auto">
            {/* Generation Settings Panel */}
            {showSettings && track.generation_settings && (
              <div className="mb-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Settings size={16} className="text-indigo-400" />
                  <h4 className="text-sm font-medium text-white">Generation Settings</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {track.generation_settings.artistName && (
                    <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                      <span className="text-slate-500">Artist Style:</span>
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
                      <span className="text-slate-500">Temperature:</span>
                      <span className="text-orange-400">{track.generation_settings.temperature}</span>
                    </div>
                  )}
                  {track.generation_settings.rhymeComplexity && (
                    <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                      <span className="text-slate-500">Rhyme Complexity:</span>
                      <span className="text-green-400">{track.generation_settings.rhymeComplexity}%</span>
                    </div>
                  )}
                  {track.generation_settings.syllableTarget && (
                    <div className="flex justify-between p-2 bg-slate-900/50 rounded">
                      <span className="text-slate-500">Syllable Target:</span>
                      <span className="text-cyan-400">{track.generation_settings.syllableTarget}</span>
                    </div>
                  )}
                  {track.generation_settings.coreTheme && (
                    <div className="col-span-2 p-2 bg-slate-900/50 rounded">
                      <span className="text-slate-500">Theme:</span>
                      <span className="text-slate-300 ml-2">{track.generation_settings.coreTheme}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <pre className="whitespace-pre-wrap text-slate-300 font-mono text-sm leading-relaxed">
              {track.lyrics_content}
            </pre>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-slate-900 px-6 py-4 border-t border-slate-700">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLikeClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  localLiked 
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-orange-400 border border-slate-700'
                }`}
              >
                <Flame size={18} className={localLiked ? 'fill-current' : ''} />
                <span className="font-medium">{localFireCount}</span>
              </button>
              
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              
              <button
                onClick={handleFork}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
              >
                <Music size={18} />
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
  const [tracks, setTracks] = useState([]);
  const [likedTrackIds, setLikedTrackIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('created_at');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    try {
      const { tracks: feedTracks } = await getFeedTracks({ 
        limit: 50, 
        sortBy 
      });
      setTracks(feedTracks || []);
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const fetchLikedTracks = useCallback(async () => {
    if (!user) return;
    const liked = await getUserLikedTrackIds(user.id);
    setLikedTrackIds(liked);
  }, [user]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  useEffect(() => {
    fetchLikedTracks();
  }, [fetchLikedTracks]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchTracks(), fetchLikedTracks()]);
    setRefreshing(false);
  };

  const handleLike = async (trackId) => {
    if (!user) return;
    await likeTrack(user.id, trackId);
    setLikedTrackIds(prev => new Set([...prev, trackId]));
  };

  const handleUnlike = async (trackId) => {
    if (!user) return;
    await unlikeTrack(user.id, trackId);
    setLikedTrackIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(trackId);
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">🔥</span>
              The Cypher
            </h1>
            <p className="text-slate-400 mt-1">
              Discover fire tracks from the community
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Toggle */}
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setSortBy('created_at')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  sortBy === 'created_at' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock size={16} />
                New
              </button>
              <button
                onClick={() => setSortBy('fire_count')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  sortBy === 'fire_count' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp size={16} />
                Hot
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-400 mb-4" />
            <p className="text-slate-400">Loading the cypher...</p>
          </div>
        ) : tracks.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Music size={64} className="text-slate-600 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              The cypher is empty
            </h2>
            <p className="text-slate-400 mb-6 max-w-md">
              Be the first to release a track and start the fire.
            </p>
            <Link
              to="/ghostwriter"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all"
            >
              Create Your First Track
            </Link>
          </div>
        ) : (
          /* Masonry Grid */
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            <AnimatePresence>
              {tracks.map((track) => (
                <FeedCard
                  key={track.id}
                  track={track}
                  isLiked={likedTrackIds.has(track.id)}
                  onLike={handleLike}
                  onUnlike={handleUnlike}
                  onClick={setSelectedTrack}
                />
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
          onLike={handleLike}
          onUnlike={handleUnlike}
        />
      </div>
    </div>
  );
};

export default Feed;
