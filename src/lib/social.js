/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 *
 * Social features library for VRS/A
 * Handles published tracks, albums, likes, follows, comments, and public profiles
 */

import { supabase } from './supabase';

// Bot identifier for AI roast comments
export const VRSA_BOT_NAME = '@VRSA Official Bot';

// Official VRSA bot profile picture URL
export const VRSA_BOT_AVATAR_URL = 'https://hsujkvvbwcomdcdcmlfx.supabase.co/storage/v1/object/public/profile-pictures/officialvrsa.jpeg';

// ============================================
// FOLLOWERS SYSTEM
// ============================================

/**
 * Follow a user
 * @param {string} followerId - Current user's ID
 * @param {string} followingId - User to follow
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function followUser(followerId, followingId) {
  try {
    if (followerId === followingId) {
      return { success: false, error: new Error('Cannot follow yourself') };
    }
    
    const { error } = await supabase
      .from('followers')
      .insert({ follower_id: followerId, following_id: followingId });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    // Ignore duplicate key errors (already following)
    if (error.code === '23505') {
      return { success: true, error: null };
    }
    console.error('Error following user:', error);
    return { success: false, error };
  }
}

/**
 * Unfollow a user
 * @param {string} followerId - Current user's ID
 * @param {string} followingId - User to unfollow
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function unfollowUser(followerId, followingId) {
  try {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return { success: false, error };
  }
}

/**
 * Check if user is following another user
 * @param {string} followerId - Current user's ID
 * @param {string} followingId - User to check
 * @returns {Promise<boolean>}
 */
export async function isFollowing(followerId, followingId) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}

/**
 * Get follower and following counts for a user
 * @param {string} userId - User ID
 * @returns {Promise<{followers: number, following: number}>}
 */
export async function getFollowCounts(userId) {
  try {
    const [followersResult, followingResult] = await Promise.all([
      supabase
        .from('followers')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', userId),
      supabase
        .from('followers')
        .select('id', { count: 'exact', head: true })
        .eq('follower_id', userId)
    ]);

    return {
      followers: followersResult.count || 0,
      following: followingResult.count || 0
    };
  } catch (error) {
    console.error('Error getting follow counts:', error);
    return { followers: 0, following: 0 };
  }
}

/**
 * Get list of users following a specific user
 * @param {string} userId - User ID
 * @param {number} limit - Max results
 * @returns {Promise<{followers: array, error: Error | null}>}
 */
export async function getFollowers(userId, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        id,
        created_at,
        follower:follower_id (
          id,
          username
        )
      `)
      .eq('following_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { followers: data?.map(f => f.follower) || [], error: null };
  } catch (error) {
    console.error('Error fetching followers:', error);
    return { followers: [], error };
  }
}

/**
 * Get list of users that a specific user is following
 * @param {string} userId - User ID
 * @param {number} limit - Max results
 * @returns {Promise<{following: array, error: Error | null}>}
 */
export async function getFollowing(userId, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select(`
        id,
        created_at,
        following:following_id (
          id,
          username
        )
      `)
      .eq('follower_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { following: data?.map(f => f.following) || [], error: null };
  } catch (error) {
    console.error('Error fetching following:', error);
    return { following: [], error };
  }
}

// ============================================
// COMMENTS SYSTEM
// ============================================

/**
 * Add a comment to a track
 * @param {object} commentData - Comment data
 * @returns {Promise<{comment: object, error: Error | null}>}
 */
export async function addComment({ trackId, userId, content, parentCommentId = null }) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        track_id: trackId,
        user_id: userId,
        content,
        parent_comment_id: parentCommentId,
        is_bot_roast: false
      })
      .select(`
        *,
        profiles:user_id (
          id,
          username
        )
      `)
      .single();

    if (error) throw error;
    return { comment: data, error: null };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { comment: null, error };
  }
}

/**
 * Delete a comment (user can only delete their own)
 * @param {string} commentId - Comment ID
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function deleteComment(commentId) {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error };
  }
}

/**
 * Get comments for a track with threading support
 * @param {string} trackId - Track ID
 * @returns {Promise<{comments: array, error: Error | null}>}
 */
export async function getTrackComments(trackId) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (
          id,
          username
        )
      `)
      .eq('track_id', trackId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Organize into threaded structure
    const commentsMap = new Map();
    const rootComments = [];

    // First pass: create map of all comments
    data?.forEach(comment => {
      commentsMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into tree
    data?.forEach(comment => {
      const commentWithReplies = commentsMap.get(comment.id);
      if (comment.parent_comment_id) {
        const parent = commentsMap.get(comment.parent_comment_id);
        if (parent) {
          parent.replies.push(commentWithReplies);
        } else {
          // Orphan comment, treat as root
          rootComments.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return { comments: rootComments, error: null };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { comments: [], error };
  }
}

/**
 * Get comment count for a track
 * @param {string} trackId - Track ID
 * @returns {Promise<number>}
 */
export async function getCommentCount(trackId) {
  try {
    const { count, error } = await supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('track_id', trackId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting comment count:', error);
    return 0;
  }
}

/**
 * Check if a track already has a bot roast comment
 * @param {string} trackId - Track ID
 * @returns {Promise<{hasRoast: boolean, roast: object | null}>}
 */
export async function checkBotRoast(trackId) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('track_id', trackId)
      .eq('is_bot_roast', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return { hasRoast: !!data, roast: data };
  } catch (error) {
    console.error('Error checking bot roast:', error);
    return { hasRoast: false, roast: null };
  }
}

/**
 * Add bot roast comment to a track (should only be called once per track)
 * Note: This should be called from an Edge Function with service role
 * @param {string} trackId - Track ID
 * @param {string} roastContent - The roast content
 * @returns {Promise<{comment: object, error: Error | null}>}
 */
export async function addBotRoast(trackId, roastContent) {
  try {
    // First check if roast already exists
    const { hasRoast } = await checkBotRoast(trackId);
    if (hasRoast) {
      return { comment: null, error: new Error('Track already has a bot roast') };
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        track_id: trackId,
        user_id: null,
        content: roastContent,
        is_bot_roast: true,
        bot_name: VRSA_BOT_NAME
      })
      .select()
      .single();

    if (error) throw error;
    return { comment: data, error: null };
  } catch (error) {
    console.error('Error adding bot roast:', error);
    return { comment: null, error };
  }
}

// ============================================
// PUBLISHED TRACKS
// ============================================

/**
 * Publish a track to the public feed
 * @param {object} trackData - Track data to publish
 * @returns {Promise<{track: object, error: Error | null}>}
 */
export async function publishTrack({
  userId,
  sessionId,
  albumId = null,
  title,
  lyricsContent,
  hookSnippet,
  primaryArtistStyle,
  moodTags = [],
  generationSettings = {},
  isAnonymous = false
}) {
  try {
    const { data, error } = await supabase
      .from('published_tracks')
      .insert({
        user_id: userId,
        original_session_id: sessionId,
        album_id: albumId,
        title,
        lyrics_content: lyricsContent,
        hook_snippet: hookSnippet,
        primary_artist_style: primaryArtistStyle,
        mood_tags: moodTags,
        generation_settings: generationSettings,
        is_anonymous: isAnonymous
      })
      .select()
      .single();

    if (error) throw error;
    return { track: data, error: null };
  } catch (error) {
    console.error('Error publishing track:', error);
    return { track: null, error };
  }
}

/**
 * Get published tracks for the feed
 * @param {object} options - Query options
 * @returns {Promise<{tracks: array, error: Error | null}>}
 */
export async function getFeedTracks({ 
  limit = 20, 
  offset = 0, 
  sortBy = 'created_at' 
}) {
  try {
    // First get the tracks
    const { data: tracks, error: tracksError } = await supabase
      .from('published_tracks')
      .select('*')
      .order(sortBy, { ascending: false })
      .range(offset, offset + limit - 1);

    if (tracksError) throw tracksError;
    
    if (!tracks || tracks.length === 0) {
      return { tracks: [], error: null };
    }

    // Get unique user IDs
    const userIds = [...new Set(tracks.map(t => t.user_id))];
    
    // Fetch profiles for those users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, profile_picture_url')
      .in('id', userIds);
    
    if (profilesError) {
      console.warn('Could not fetch profiles:', profilesError);
    }
    
    // Map profiles to tracks
    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    const tracksWithProfiles = tracks.map(track => ({
      ...track,
      profiles: profileMap.get(track.user_id) || { username: 'Anonymous', id: track.user_id }
    }));

    return { tracks: tracksWithProfiles, error: null };
  } catch (error) {
    console.error('Error fetching feed tracks:', error);
    return { tracks: [], error };
  }
}

/**
 * Get tracks by user ID (for public profile)
 * @param {string} userId - User ID
 * @returns {Promise<{tracks: array, error: Error | null}>}
 */
export async function getTracksByUser(userId) {
  try {
    const { data, error } = await supabase
      .from('published_tracks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { tracks: data, error: null };
  } catch (error) {
    console.error('Error fetching user tracks:', error);
    return { tracks: [], error };
  }
}

/**
 * Get a single published track by ID
 * @param {string} trackId - Track ID
 * @returns {Promise<{track: object, error: Error | null}>}
 */
export async function getTrackById(trackId) {
  try {
    const { data: track, error } = await supabase
      .from('published_tracks')
      .select('*')
      .eq('id', trackId)
      .single();

    if (error) throw error;
    
    // Fetch profile separately
    if (track?.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, profile_picture_url')
        .eq('id', track.user_id)
        .single();
      
      track.profiles = profile || { username: 'Anonymous', id: track.user_id };
    }

    return { track, error: null };
  } catch (error) {
    console.error('Error fetching track:', error);
    return { track: null, error };
  }
}

/**
 * Delete a published track
 * @param {string} trackId - Track ID
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function deletePublishedTrack(trackId) {
  try {
    const { error } = await supabase
      .from('published_tracks')
      .delete()
      .eq('id', trackId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting track:', error);
    return { success: false, error };
  }
}

/**
 * Increment view count for a track
 * @param {string} trackId - Track ID
 */
export async function incrementViewCount(trackId) {
  try {
    await supabase.rpc('increment_view_count', { track_id: trackId });
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

// ============================================
// LIKES ("FIRE" RATINGS)
// ============================================

/**
 * Like a track
 * @param {string} userId - User ID
 * @param {string} trackId - Track ID
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function likeTrack(userId, trackId) {
  try {
    const { error } = await supabase
      .from('likes')
      .insert({ user_id: userId, track_id: trackId });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    // Ignore duplicate key errors (user already liked)
    if (error.code === '23505') {
      return { success: true, error: null };
    }
    console.error('Error liking track:', error);
    return { success: false, error };
  }
}

/**
 * Unlike a track
 * @param {string} userId - User ID
 * @param {string} trackId - Track ID
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function unlikeTrack(userId, trackId) {
  try {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('track_id', trackId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error unliking track:', error);
    return { success: false, error };
  }
}

/**
 * Check if user has liked a track
 * @param {string} userId - User ID
 * @param {string} trackId - Track ID
 * @returns {Promise<boolean>}
 */
export async function hasUserLikedTrack(userId, trackId) {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('user_id')
      .eq('user_id', userId)
      .eq('track_id', trackId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking like status:', error);
    return false;
  }
}

/**
 * Get user's liked track IDs
 * @param {string} userId - User ID
 * @returns {Promise<Set<string>>}
 */
export async function getUserLikedTrackIds(userId) {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('track_id')
      .eq('user_id', userId);

    if (error) throw error;
    return new Set(data.map(row => row.track_id));
  } catch (error) {
    console.error('Error fetching user likes:', error);
    return new Set();
  }
}

// ============================================
// ALBUMS
// ============================================

/**
 * Create a new album
 * @param {object} albumData - Album data
 * @returns {Promise<{album: object, error: Error | null}>}
 */
export async function createAlbum({
  userId,
  title,
  description = '',
  coverArtUrl = null,
  genreTag = null,
  isPublic = false
}) {
  try {
    const { data, error } = await supabase
      .from('albums')
      .insert({
        user_id: userId,
        title,
        description,
        cover_art_url: coverArtUrl,
        genre_tag: genreTag,
        is_public: isPublic
      })
      .select()
      .single();

    if (error) throw error;
    return { album: data, error: null };
  } catch (error) {
    console.error('Error creating album:', error);
    return { album: null, error };
  }
}

/**
 * Get user's albums
 * @param {string} userId - User ID
 * @returns {Promise<{albums: array, error: Error | null}>}
 */
export async function getUserAlbums(userId) {
  try {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { albums: data, error: null };
  } catch (error) {
    console.error('Error fetching albums:', error);
    return { albums: [], error };
  }
}

/**
 * Update an album
 * @param {string} albumId - Album ID
 * @param {object} updates - Fields to update
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function updateAlbum(albumId, updates) {
  try {
    const { error } = await supabase
      .from('albums')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', albumId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating album:', error);
    return { success: false, error };
  }
}

/**
 * Delete an album
 * @param {string} albumId - Album ID
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function deleteAlbum(albumId) {
  try {
    const { error } = await supabase
      .from('albums')
      .delete()
      .eq('id', albumId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting album:', error);
    return { success: false, error };
  }
}

// ============================================
// PUBLIC PROFILES
// ============================================

/**
 * Get public profile by username
 * @param {string} username - Username
 * @returns {Promise<{profile: object, error: Error | null}>}
 */
export async function getPublicProfileByUsername(username) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, created_at, membership_tier, profile_picture_url')
      .eq('username', username)
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return { profile: null, error };
  }
}

/**
 * Get user stats for public profile
 * @param {string} userId - User ID
 * @returns {Promise<object>}
 */
export async function getUserStats(userId) {
  try {
    // Get track count and total fire
    const { data: tracks, error: tracksError } = await supabase
      .from('published_tracks')
      .select('id, fire_count, generation_settings')
      .eq('user_id', userId);

    if (tracksError) throw tracksError;

    const trackCount = tracks?.length || 0;
    const totalFire = tracks?.reduce((sum, t) => sum + (t.fire_count || 0), 0) || 0;
    
    // Calculate average rhyme density from generation settings
    const rhymeDensities = tracks
      ?.map(t => t.generation_settings?.rhymeDensity)
      .filter(d => typeof d === 'number') || [];
    const avgRhymeDensity = rhymeDensities.length > 0
      ? Math.round(rhymeDensities.reduce((a, b) => a + b, 0) / rhymeDensities.length)
      : null;

    return {
      trackCount,
      totalFire,
      avgRhymeDensity
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { trackCount: 0, totalFire: 0, avgRhymeDensity: null };
  }
}

/**
 * Get public albums by user ID
 * @param {string} userId - User ID
 * @returns {Promise<{albums: array, error: Error | null}>}
 */
export async function getPublicAlbumsByUser(userId) {
  try {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('user_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { albums: data, error: null };
  } catch (error) {
    console.error('Error fetching public albums:', error);
    return { albums: [], error };
  }
}

// ============================================
// POSTS (Social Media Posts)
// ============================================

/**
 * Create a new post
 * @param {object} postData - Post data
 * @returns {Promise<{post: object, error: Error | null}>}
 */
export async function createPost({ userId, content, privacy = 'public' }) {
  try {
    // Insert the post
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content,
        privacy
      })
      .select('*')
      .single();

    if (error) throw error;

    // Fetch the profile separately
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, profile_picture_url')
      .eq('id', userId)
      .single();

    return { 
      post: { ...post, profiles: profile || { id: userId, username: 'Unknown' } }, 
      error: null 
    };
  } catch (error) {
    console.error('Error creating post:', error);
    return { post: null, error };
  }
}

/**
 * Get a single post by ID
 * @param {string} postId - Post ID
 * @returns {Promise<{post: object, error: Error | null}>}
 */
export async function getPostById(postId) {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) throw error;

    // Fetch the profile separately
    if (post?.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, profile_picture_url')
        .eq('id', post.user_id)
        .single();
      
      post.profiles = profile || { id: post.user_id, username: 'Unknown' };
    }

    return { post, error: null };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { post: null, error };
  }
}

/**
 * Delete a post
 * @param {string} postId - Post ID
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function deletePost(postId) {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error };
  }
}

/**
 * Like a post
 * @param {string} userId - User ID
 * @param {string} postId - Post ID
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function likePost(userId, postId) {
  try {
    const { error } = await supabase
      .from('post_likes')
      .insert({ user_id: userId, post_id: postId });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    // Ignore duplicate key errors (user already liked)
    if (error.code === '23505') {
      return { success: true, error: null };
    }
    console.error('Error liking post:', error);
    return { success: false, error };
  }
}

/**
 * Unlike a post
 * @param {string} userId - User ID
 * @param {string} postId - Post ID
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function unlikePost(userId, postId) {
  try {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error unliking post:', error);
    return { success: false, error };
  }
}

/**
 * Get user's liked post IDs
 * @param {string} userId - User ID
 * @returns {Promise<Set<string>>}
 */
export async function getUserLikedPostIds(userId) {
  try {
    const { data, error } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId);

    if (error) throw error;
    return new Set(data.map(row => row.post_id));
  } catch (error) {
    console.error('Error fetching user post likes:', error);
    return new Set();
  }
}

/**
 * Get IDs of users that the current user is following
 * @param {string} userId - User ID
 * @returns {Promise<Set<string>>}
 */
export async function getUserFollowingIds(userId) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('following_id')
      .eq('follower_id', userId);

    if (error) throw error;
    return new Set(data.map(row => row.following_id));
  } catch (error) {
    console.error('Error fetching following IDs:', error);
    return new Set();
  }
}

/**
 * Get unified feed with both posts and tracks
 * RLS handles privacy filtering for followers_only posts
 * @param {object} options - Query options
 * @returns {Promise<{items: array, error: Error | null}>}
 */
export async function getUnifiedFeed({ 
  limit = 30, 
  sortBy = 'created_at'
}) {
  try {
    // Fetch posts - RLS will automatically filter based on privacy
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (postsError) throw postsError;

    // Fetch tracks (published_tracks don't have privacy, all are public)
    const { data: tracks, error: tracksError } = await supabase
      .from('published_tracks')
      .select('*')
      .order(sortBy, { ascending: false })
      .limit(limit);

    if (tracksError) throw tracksError;

    // Get unique user IDs from both posts and tracks
    const postUserIds = posts?.map(p => p.user_id) || [];
    const trackUserIds = tracks?.map(t => t.user_id) || [];
    const allUserIds = [...new Set([...postUserIds, ...trackUserIds])];

    // Fetch profiles for all users
    let profileMap = new Map();
    if (allUserIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, profile_picture_url')
        .in('id', allUserIds);

      if (!profilesError && profiles) {
        profileMap = new Map(profiles.map(p => [p.id, p]));
      }
    }

    // Transform posts to unified format
    const postItems = (posts || []).map(post => ({
      ...post,
      type: 'post',
      profiles: profileMap.get(post.user_id) || { username: 'Unknown', id: post.user_id }
    }));

    // Transform tracks to unified format
    const trackItems = (tracks || []).map(track => ({
      ...track,
      type: 'track',
      profiles: profileMap.get(track.user_id) || { username: 'Anonymous', id: track.user_id }
    }));

    // Combine and sort by created_at
    const allItems = [...postItems, ...trackItems].sort((a, b) => {
      if (sortBy === 'fire_count') {
        // For fire_count, only tracks have this field
        const aFire = a.type === 'track' ? (a.fire_count || 0) : (a.like_count || 0);
        const bFire = b.type === 'track' ? (b.fire_count || 0) : (b.like_count || 0);
        return bFire - aFire;
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

    // Limit to requested number
    return { items: allItems.slice(0, limit), error: null };
  } catch (error) {
    console.error('Error fetching unified feed:', error);
    return { items: [], error };
  }
}

/**
 * Get posts by a specific user
 * @param {string} userId - User ID
 * @param {number} limit - Max results
 * @returns {Promise<{posts: array, error: Error | null}>}
 */
export async function getPostsByUser(userId, limit = 20) {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Fetch the profile for this user
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, profile_picture_url')
      .eq('id', userId)
      .single();

    // Add profile to each post
    const postsWithProfile = (posts || []).map(post => ({
      ...post,
      profiles: profile || { id: userId, username: 'Unknown' }
    }));

    return { posts: postsWithProfile, error: null };
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return { posts: [], error };
  }
}

// ============================================
// POST COMMENTS
// ============================================

/**
 * Add a comment to a post
 * @param {object} commentData - Comment data
 * @returns {Promise<{comment: object, error: Error | null}>}
 */
export async function addPostComment({ postId, userId, content, parentCommentId = null }) {
  try {
    const { data: comment, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content,
        parent_comment_id: parentCommentId
      })
      .select('*')
      .single();

    if (error) throw error;

    // Fetch the profile separately
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, profile_picture_url')
      .eq('id', userId)
      .single();

    return { 
      comment: { ...comment, profiles: profile || { id: userId, username: 'Unknown' } }, 
      error: null 
    };
  } catch (error) {
    console.error('Error adding post comment:', error);
    return { comment: null, error };
  }
}

/**
 * Delete a post comment (user can only delete their own)
 * @param {string} commentId - Comment ID
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function deletePostComment(commentId) {
  try {
    const { error } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting post comment:', error);
    return { success: false, error };
  }
}

/**
 * Get comments for a post with threading support
 * @param {string} postId - Post ID
 * @returns {Promise<{comments: array, error: Error | null}>}
 */
export async function getPostComments(postId) {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Get unique user IDs
    const userIds = [...new Set(data?.map(c => c.user_id).filter(Boolean) || [])];
    
    // Fetch profiles
    let profileMap = new Map();
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, profile_picture_url')
        .in('id', userIds);
      
      if (profiles) {
        profileMap = new Map(profiles.map(p => [p.id, p]));
      }
    }

    // Add profiles and organize into threaded structure
    const commentsMap = new Map();
    const rootComments = [];

    // First pass: create map of all comments with profiles
    data?.forEach(comment => {
      commentsMap.set(comment.id, { 
        ...comment, 
        profiles: profileMap.get(comment.user_id) || { id: comment.user_id, username: 'Unknown' },
        replies: [] 
      });
    });

    // Second pass: organize into tree
    data?.forEach(comment => {
      const commentWithReplies = commentsMap.get(comment.id);
      if (comment.parent_comment_id) {
        const parent = commentsMap.get(comment.parent_comment_id);
        if (parent) {
          parent.replies.push(commentWithReplies);
        } else {
          rootComments.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return { comments: rootComments, error: null };
  } catch (error) {
    console.error('Error fetching post comments:', error);
    return { comments: [], error };
  }
}

/**
 * Get comment count for a post
 * @param {string} postId - Post ID
 * @returns {Promise<number>}
 */
export async function getPostCommentCount(postId) {
  try {
    const { count, error } = await supabase
      .from('post_comments')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting post comment count:', error);
    return 0;
  }
}

// ============================================
// POST BOT COMMENTS
// ============================================

/**
 * Check if a post already has a bot comment
 * @param {string} postId - Post ID
 * @returns {Promise<{hasComment: boolean, comment: object | null}>}
 */
export async function checkPostBotComment(postId) {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_bot_comment', true)
      .maybeSingle();

    if (error) throw error;
    return { hasComment: !!data, comment: data };
  } catch (error) {
    console.error('Error checking post bot comment:', error);
    return { hasComment: false, comment: null };
  }
}

/**
 * Add bot comment to a post (should only be called once per post)
 * @param {string} postId - Post ID
 * @param {string} content - The bot comment content
 * @returns {Promise<{comment: object, error: Error | null}>}
 */
export async function addPostBotComment(postId, content) {
  try {
    // First check if bot comment already exists
    const { hasComment } = await checkPostBotComment(postId);
    if (hasComment) {
      return { comment: null, error: new Error('Post already has a bot comment') };
    }

    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: null,
        content,
        is_bot_comment: true,
        bot_name: VRSA_BOT_NAME
      })
      .select()
      .single();

    if (error) throw error;
    return { comment: data, error: null };
  } catch (error) {
    console.error('Error adding post bot comment:', error);
    return { comment: null, error };
  }
}

/**
 * Create a bot post (admin function)
 * @param {string} content - The post content
 * @param {string} privacy - Privacy setting ('public' or 'followers_only')
 * @returns {Promise<{post: object, error: Error | null}>}
 */
export async function createBotPost(content, privacy = 'public') {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_id: null,  // null user_id indicates bot post
        content,
        privacy,
        is_bot_post: true
      })
      .select('*')
      .single();

    if (error) throw error;

    // Return post with bot profile info
    return { 
      post: { 
        ...post, 
        profiles: { 
          id: 'vrsa-bot', 
          username: 'VRSA', 
          profile_picture_url: VRSA_BOT_AVATAR_URL 
        } 
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error creating bot post:', error);
    return { post: null, error };
  }
}

// ============================================
// NOTIFICATIONS SYSTEM
// ============================================

/**
 * Create a notification for a user
 * @param {object} notificationData - Notification data
 * @returns {Promise<{notification: object, error: Error | null}>}
 */
export async function createNotification({
  userId,
  type,
  content,
  sourceType = null,
  sourceId = null,
  fromUserId = null
}) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        content,
        source_type: sourceType,
        source_id: sourceId,
        from_user_id: fromUserId
      })
      .select()
      .single();

    if (error) throw error;
    return { notification: data, error: null };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { notification: null, error };
  }
}

/**
 * Get notifications for a user
 * @param {string} userId - User ID
 * @param {number} limit - Max results
 * @param {boolean} unreadOnly - Only get unread notifications
 * @returns {Promise<{notifications: array, error: Error | null}>}
 */
export async function getUserNotifications(userId, limit = 50, unreadOnly = false) {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // Fetch profiles for from_user_id separately
    const fromUserIds = [...new Set(data?.filter(n => n.from_user_id).map(n => n.from_user_id) || [])];
    let profileMap = new Map();
    
    if (fromUserIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, profile_picture_url')
        .in('id', fromUserIds);
      
      if (profiles) {
        profileMap = new Map(profiles.map(p => [p.id, p]));
      }
    }
    
    // Add profile data to notifications
    const notificationsWithProfiles = data?.map(notif => ({
      ...notif,
      from_user: notif.from_user_id ? profileMap.get(notif.from_user_id) : null
    })) || [];

    return { notifications: notificationsWithProfiles, error: null };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { notifications: [], error };
  }
}

/**
 * Get unread notification count for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>}
 */
export async function getUnreadNotificationCount(userId) {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    return 0;
  }
}

/**
 * Mark a notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function markNotificationRead(notificationId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error };
  }
}

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function markAllNotificationsRead(userId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error };
  }
}

/**
 * Parse @ mentions from text and return array of usernames
 * @param {string} text - Text to parse
 * @returns {string[]} Array of mentioned usernames (without @)
 */
export function parseMentions(text) {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const matches = text.match(mentionRegex);
  if (!matches) return [];
  return [...new Set(matches.map(m => m.substring(1)))];
}

/**
 * Check if VRSA bot is mentioned in text
 * @param {string} text - Text to check
 * @returns {boolean}
 */
export function isBotMentioned(text) {
  const botMentions = ['@vrsa', '@vrsabot', '@vrsa_bot', '@vrsaofficial'];
  const lowerText = text.toLowerCase();
  return botMentions.some(mention => lowerText.includes(mention));
}

/**
 * Get user ID by username
 * @param {string} username - Username to lookup
 * @returns {Promise<string | null>}
 */
export async function getUserIdByUsername(username) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.id || null;
  } catch (error) {
    console.error('Error looking up user by username:', error);
    return null;
  }
}

/**
 * Process mentions in a comment and create notifications
 * @param {string} content - Comment content
 * @param {string} fromUserId - User who made the comment
 * @param {string} sourceType - 'post_comment' or 'track_comment'
 * @param {string} sourceId - ID of the comment
 * @param {string} fromUsername - Username of commenter (for notification content)
 * @returns {Promise<{mentionedBot: boolean, notificationsSent: number}>}
 */
export async function processMentions(content, fromUserId, sourceType, sourceId, fromUsername) {
  const mentions = parseMentions(content);
  const mentionedBot = isBotMentioned(content);
  let notificationsSent = 0;

  for (const username of mentions) {
    // Skip bot mentions (handled separately)
    if (['vrsa', 'vrsabot', 'vrsa_bot', 'vrsaofficial'].includes(username.toLowerCase())) {
      continue;
    }

    const mentionedUserId = await getUserIdByUsername(username);
    if (mentionedUserId && mentionedUserId !== fromUserId) {
      await createNotification({
        userId: mentionedUserId,
        type: 'mention',
        content: `@${fromUsername} mentioned you in a comment`,
        sourceType,
        sourceId,
        fromUserId
      });
      notificationsSent++;
    }
  }

  return { mentionedBot, notificationsSent };
}

/**
 * Search for users by username prefix (for @ mention autocomplete)
 * @param {string} query - Username prefix to search for
 * @param {number} limit - Max results
 * @returns {Promise<{users: array, error: Error | null}>}
 */
export async function searchUsersByUsername(query, limit = 10) {
  try {
    if (!query || query.length < 1) {
      return { users: [], error: null };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, profile_picture_url')
      .ilike('username', `${query}%`)
      .limit(limit);

    if (error) throw error;
    return { users: data || [], error: null };
  } catch (error) {
    console.error('Error searching users:', error);
    return { users: [], error };
  }
}

// Bot accounts for @ mention autocomplete
export const BOT_ACCOUNTS = [
  { id: 'vrsa-bot', username: 'VRSA', profile_picture_url: VRSA_BOT_AVATAR_URL, isBot: true },
];
