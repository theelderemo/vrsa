/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 *
 * Social features library for VRS/A
 * Handles published tracks, albums, likes, and public profiles
 */

import { supabase } from './supabase';

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
      .select('id, username')
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
        .select('id, username')
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
      .select('id, username, created_at, membership_tier')
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
