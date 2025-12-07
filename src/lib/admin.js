/**
 * Admin API Functions
 * Admin-only functions for managing VRS/A
 */

import { supabase } from './supabase';

// Admin email for role-based access
export const ADMIN_EMAIL = 'dickinsonc060@gmail.com';

/**
 * Check if current user is admin
 */
export async function isAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === ADMIN_EMAIL;
}

/**
 * Get app statistics (admin only)
 */
export async function getAppStats() {
  const { data, error } = await supabase.rpc('get_app_stats');
  
  if (error) {
    console.error('Error fetching app stats:', error);
    return { stats: null, error };
  }
  
  return { stats: data, error: null };
}

/**
 * Get recent users (admin only)
 */
export async function getRecentUsers(limit = 10) {
  const { data, error } = await supabase.rpc('get_recent_users', { limit_count: limit });
  
  if (error) {
    console.error('Error fetching recent users:', error);
    return { users: [], error };
  }
  
  return { users: data || [], error: null };
}

/**
 * Get all dev notes (admin only - includes inactive)
 */
export async function getAllDevNotes() {
  const { data, error } = await supabase
    .from('dev_notes')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching dev notes:', error);
    return { notes: [], error };
  }
  
  return { notes: data || [], error: null };
}

/**
 * Get active dev notes (public - for notification component)
 */
export async function getActiveDevNotes() {
  const { data, error } = await supabase
    .from('dev_notes')
    .select('*')
    .eq('is_active', true)
    .or('expires_at.is.null,expires_at.gt.now()')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching active dev notes:', error);
    return { notes: [], error };
  }
  
  return { notes: data || [], error: null };
}

/**
 * Create a new dev note (admin only)
 */
export async function createDevNote({ type, title, message, link, linkText, expiresAt, priority = 0 }) {
  const { data, error } = await supabase
    .from('dev_notes')
    .insert({
      type,
      title,
      message,
      link,
      link_text: linkText,
      expires_at: expiresAt,
      priority,
      is_active: true
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating dev note:', error);
    return { note: null, error };
  }
  
  return { note: data, error: null };
}

/**
 * Update a dev note (admin only)
 */
export async function updateDevNote(id, updates) {
  const updateData = {};
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.message !== undefined) updateData.message = updates.message;
  if (updates.link !== undefined) updateData.link = updates.link;
  if (updates.linkText !== undefined) updateData.link_text = updates.linkText;
  if (updates.expiresAt !== undefined) updateData.expires_at = updates.expiresAt;
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
  if (updates.priority !== undefined) updateData.priority = updates.priority;

  const { data, error } = await supabase
    .from('dev_notes')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating dev note:', error);
    return { note: null, error };
  }
  
  return { note: data, error: null };
}

/**
 * Delete a dev note (admin only)
 */
export async function deleteDevNote(id) {
  const { error } = await supabase
    .from('dev_notes')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting dev note:', error);
    return { success: false, error };
  }
  
  return { success: true, error: null };
}

/**
 * Toggle dev note active status (admin only)
 */
export async function toggleDevNoteActive(id, isActive) {
  return updateDevNote(id, { isActive });
}

/**
 * Update user profile (admin only) - for granting pro/beta status
 */
export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user profile:', error);
    return { profile: null, error };
  }
  
  return { profile: data, error: null };
}

// ============================================
// BOT MANAGEMENT FUNCTIONS
// ============================================

/**
 * Get all bot comments (admin only)
 */
export async function getAllBotComments(limit = 50) {
  const { data, error } = await supabase
    .from('post_comments')
    .select(`
      *,
      post:posts(id, content, user_id, created_at)
    `)
    .eq('is_bot_comment', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching bot comments:', error);
    return { comments: [], error };
  }
  
  return { comments: data || [], error: null };
}

/**
 * Update bot comment (admin only)
 */
export async function updateBotComment(commentId, content) {
  const { data, error } = await supabase
    .from('post_comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .eq('is_bot_comment', true)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating bot comment:', error);
    return { comment: null, error };
  }
  
  return { comment: data, error: null };
}

/**
 * Delete bot comment (admin only)
 */
export async function deleteBotComment(commentId) {
  const { error } = await supabase
    .from('post_comments')
    .delete()
    .eq('id', commentId)
    .eq('is_bot_comment', true);
  
  if (error) {
    console.error('Error deleting bot comment:', error);
    return { success: false, error };
  }
  
  return { success: true, error: null };
}

/**
 * Get all bot roasts (for tracks) (admin only)
 */
export async function getAllBotRoasts(limit = 50) {
  const { data, error } = await supabase
    .from('track_comments')
    .select(`
      *,
      track:tracks(id, title, artist, user_id, created_at)
    `)
    .eq('is_bot_roast', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching bot roasts:', error);
    return { roasts: [], error };
  }
  
  return { roasts: data || [], error: null };
}

/**
 * Update bot roast (admin only)
 */
export async function updateBotRoast(roastId, content) {
  const { data, error } = await supabase
    .from('track_comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', roastId)
    .eq('is_bot_roast', true)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating bot roast:', error);
    return { roast: null, error };
  }
  
  return { roast: data, error: null };
}

/**
 * Delete bot roast (admin only)
 */
export async function deleteBotRoast(roastId) {
  const { error } = await supabase
    .from('track_comments')
    .delete()
    .eq('id', roastId)
    .eq('is_bot_roast', true);
  
  if (error) {
    console.error('Error deleting bot roast:', error);
    return { success: false, error };
  }
  
  return { success: true, error: null };
}
