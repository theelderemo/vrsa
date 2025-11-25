import { supabase } from './supabase';

/**
 * Create a new chat session for the user
 * @param {string} userId - The authenticated user's ID
 * @param {boolean} memoryEnabled - Whether context retention is enabled
 * @param {number} contextWindow - Number of messages to keep (default: 10)
 * @returns {Promise<{id: string, error: null} | {id: null, error: Error}>}
 */
export async function createChatSession(userId, memoryEnabled = false, contextWindow = 10) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        memory_enabled: memoryEnabled,
        context_window: contextWindow,
        messages: []
      })
      .select('id')
      .single();

    if (error) throw error;
    
    return { id: data.id, error: null };
  } catch (error) {
    console.error('Error creating chat session:', error);
    return { id: null, error };
  }
}

/**
 * Get a chat session by ID
 * @param {string} sessionId - The session ID
 * @returns {Promise<{session: object, error: null} | {session: null, error: Error}>}
 */
export async function getChatSession(sessionId) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;
    
    return { session: data, error: null };
  } catch (error) {
    console.error('Error getting chat session:', error);
    return { session: null, error };
  }
}

/**
 * Update a chat session's memory enabled setting
 * @param {string} sessionId - The session ID
 * @param {boolean} memoryEnabled - Whether to enable memory
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function updateMemorySetting(sessionId, memoryEnabled) {
  try {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ 
        memory_enabled: memoryEnabled,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating the memory setting:', error);
    return { success: false, error };
  }
}

/**
 * Append a message to the chat session
 * @param {string} sessionId - The session ID
 * @param {object} message - Message object with {role, content}
 * @param {number} contextWindow - Max messages to keep
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function appendMessage(sessionId, message, contextWindow = 10) {
  try {
    // Get current session
    const { session, error: getError } = await getChatSession(sessionId);
    if (getError) throw getError;

    // Append new message
    let messages = [...session.messages, message];
    
    // Trim to context window
    if (messages.length > contextWindow) {
      const systemMessages = messages.filter(m => m.role === 'system');
      const nonSystemMessages = messages.filter(m => m.role !== 'system');
      const recentMessages = nonSystemMessages.slice(-contextWindow);
      messages = [...systemMessages, ...recentMessages];
    }

    // Update session with new messages
    const { error: updateError } = await supabase
      .from('chat_sessions')
      .update({ 
        messages,
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Extend expiry by 7 days
      })
      .eq('id', sessionId);

    if (updateError) throw updateError;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error appending message:', error);
    return { success: false, error };
  }
}

/**
 * Get messages from a chat session (respects memory setting)
 * @param {string} sessionId - The session ID
 * @returns {Promise<{messages: array, error: null} | {messages: [], error: Error}>}
 */
export async function getMessages(sessionId) {
  try {
    const { session, error } = await getChatSession(sessionId);
    if (error) throw error;

    // Only return messages if memory is enabled
    if (!session.memory_enabled) {
      return { messages: [], error: null };
    }
    
    return { messages: session.messages || [], error: null };
  } catch (error) {
    console.error('Error getting messages:', error);
    return { messages: [], error };
  }
}

/**
 * Clear all messages from a chat session
 * @param {string} sessionId - The session ID
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function clearChatHistory(sessionId) {
  try {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ 
        messages: [],
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return { success: false, error };
  }
}

/**
 * Delete a chat session
 * @param {string} sessionId - The session ID
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function deleteChatSession(sessionId) {
  try {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting chat session:', error);
    return { success: false, error };
  }
}

/**
 * Get the most recent active session for a user, or create a new one
 * @param {string} userId - The authenticated user's ID
 * @returns {Promise<{sessionId: string, error: null} | {sessionId: null, error: Error}>}
 */
export async function getOrCreateSession(userId) {
  try {
    // Try to get the most recent non-expired session
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('id, expires_at')
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString())
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    // If a valid session exists, return it
    if (data && data.length > 0) {
      return { sessionId: data[0].id, error: null };
    }

    // Otherwise, create a new session
    const { id: newSessionId, error: createError } = await createChatSession(userId);
    if (createError) throw createError;

    return { sessionId: newSessionId, error: null };
  } catch (error) {
    console.error('Error getting or creating session:', error);
    return { sessionId: null, error };
  }
}
