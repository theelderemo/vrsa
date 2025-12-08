import { supabase } from './supabase';
/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * New chat session
 * @param {string} userId - The authenticated user's ID
 * @param {boolean} memoryEnabled - Whether context retention is enabled
 * @param {number} contextWindow - Number of messages to keep (default: 10)
 * @param {object} initialSettings - Optional settings object to save with the session
 * @returns {Promise<{id: string, error: null} | {id: null, error: Error}>}
 */
export async function createChatSession(userId, memoryEnabled = false, contextWindow = 10, initialSettings = null) {
  try {
    const insertData = {
      user_id: userId,
      memory_enabled: memoryEnabled,
      context_window: contextWindow,
      messages: [],
      name: initialSettings?.name || `Project ${new Date().toLocaleDateString()}`
    };
    
    if (initialSettings) {
      insertData.settings = initialSettings;
    }
    
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert(insertData)
      .select('id, name')
      .single();

    if (error) throw error;
    
    return { id: data.id, name: data.name, error: null };
  } catch (error) {
    console.error('Error creating chat session:', error);
    return { id: null, name: null, error };
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
    const { session, error: getError } = await getChatSession(sessionId);
    if (getError) throw getError;

    let messages = [...session.messages, message];
    
    if (messages.length > contextWindow) {
      const systemMessages = messages.filter(m => m.role === 'system');
      const nonSystemMessages = messages.filter(m => m.role !== 'system');
      const recentMessages = nonSystemMessages.slice(-contextWindow);
      messages = [...systemMessages, ...recentMessages];
    }

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
 * Delete all chat sessions for a user (one-click delete all history)
 * @param {string} userId - The authenticated user's ID
 * @returns {Promise<{success: boolean, deletedCount: number, error: Error | null}>}
 */
export async function deleteAllUserSessions(userId) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('user_id', userId)
      .select('id');

    if (error) throw error;
    
    return { success: true, deletedCount: data?.length || 0, error: null };
  } catch (error) {
    console.error('Error deleting all user sessions:', error);
    return { success: false, deletedCount: 0, error };
  }
}

/**
 * Start fresh session (creates new session, keeps current output in UI)
 * @param {string} userId - The authenticated user's ID
 * @param {boolean} memoryEnabled - Whether to enable memory on the new session
 * @returns {Promise<{sessionId: string, error: null} | {sessionId: null, error: Error}>}
 */
export async function startFreshSession(userId, memoryEnabled = false) {
  try {
    const { id, error } = await createChatSession(userId, memoryEnabled);
    if (error) throw error;
    
    return { sessionId: id, error: null };
  } catch (error) {
    console.error('Error starting fresh session:', error);
    return { sessionId: null, error };
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

    if (data && data.length > 0) {
      return { sessionId: data[0].id, error: null };
    }

    const { id: newSessionId, error: createError } = await createChatSession(userId);
    if (createError) throw createError;

    return { sessionId: newSessionId, error: null };
  } catch (error) {
    console.error('Error getting or creating session:', error);
    return { sessionId: null, error };
  }
}

/**
 * Get all active sessions for a user (for session manager UI)
 * @param {string} userId - The authenticated user's ID
 * @returns {Promise<{sessions: array, error: null} | {sessions: [], error: Error}>}
 */
export async function getUserSessions(userId) {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('id, name, settings, memory_enabled, updated_at, expires_at')
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString())
      .order('updated_at', { ascending: false });

    if (error) throw error;
    
    return { sessions: data || [], error: null };
  } catch (error) {
    console.error('Error getting user sessions:', error);
    return { sessions: [], error };
  }
}

/**
 * Update session settings (for auto-saving slider states)
 * @param {string} sessionId - The session ID
 * @param {object} settings - Settings object to save
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function updateSessionSettings(sessionId, settings) {
  try {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ 
        settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating session settings:', error);
    return { success: false, error };
  }
}

/**
 * Rename a session
 * @param {string} sessionId - The session ID
 * @param {string} name - New name for the session
 * @returns {Promise<{success: boolean, error: Error | null}>}
 */
export async function renameSession(sessionId, name) {
  try {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ 
        name,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error renaming session:', error);
    return { success: false, error };
  }
}
