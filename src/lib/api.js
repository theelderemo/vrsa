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

import * as Sentry from "@sentry/react";

/**
 * Call the OpenAI API through Supabase Edge Function
 * @param {string} prompt - The prompt to send to the AI
 * @param {Function} setLoading - Function to set loading state
 * @param {Function} setResult - Function to set the result
 * @param {Object} options - Additional options (temperature, top_p, model)
 */
export const callAI = async (prompt, setLoading, setResult, options = {}) => {
  setLoading(true);
  setResult('');
  try {
    const messagesPayload = [{ role: 'user', content: prompt }];
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/openai`;
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ messages: messagesPayload, ...options })
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    const aiResult = data.content || 'Error: Could not process request.';
    setResult(aiResult);
  } catch (error) {
    setResult(`An error occurred: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

/**
 * Call the AI with a system prompt for stricter output control
 * @param {string} systemPrompt - The system prompt to control AI behavior
 * @param {string} userPrompt - The user's request
 * @param {Function} setLoading - Function to set loading state
 * @param {Function} setResult - Function to set the result
 * @param {Object} options - Additional options (temperature, top_p, model)
 */
export const callAIWithSystem = async (systemPrompt, userPrompt, setLoading, setResult, options = {}) => {
  setLoading(true);
  setResult('');
  try {
    const messagesPayload = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/openai`;
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ messages: messagesPayload, ...options })
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    const aiResult = data.content || 'Error: Could not process request.';
    setResult(aiResult);
  } catch (error) {
    setResult(`An error occurred: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

/**
 * Call the model-router multiple times in parallel for hook generation
 * @param {string} systemPrompt - The system prompt to control AI behavior
 * @param {string} userPrompt - The user's request
 * @param {number} count - Number of parallel requests (1 for free, 4 for pro)
 * @param {Object} options - Additional options (temperature, top_p)
 * @returns {Promise<string[]>} Array of generated hooks
 */
export const callAIMultiple = async (systemPrompt, userPrompt, count = 4, options = {}) => {
  try {
    const messagesPayload = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/openai`;
    
    // Create array of parallel fetch requests to model-router
    const requests = Array(count).fill(null).map(() => 
      fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({ 
          messages: messagesPayload, 
          model: 'model-router',
          ...options 
        })
      })
    );
    
    // Execute all requests in parallel
    const responses = await Promise.all(requests);
    
    // Parse all responses
    const results = await Promise.all(
      responses.map(async (response) => {
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        return data.content || 'Error: Could not process request.';
      })
    );
    
    return results;
  } catch (error) {
    console.error('Multiple AI call error:', error);
    throw error;
  }
};

/**
 * Generate an AI-based sarcastic comment
 * @param {string} userInput - The user's input to generate a comment about
 * @returns {Promise<string>} The sarcastic comment
 */
export const generateSarcasticComment = async (userInput) => {
  return Sentry.startSpan(
    {
      op: "http.client",
      name: "Generate Sarcastic Comment API Call",
    },
    async (span) => {
      span.setAttribute("user_input", userInput);
      
      try {
        const { logger } = Sentry;
        logger.info("Starting sarcastic comment generation", { userInput });
        
        const sarcasticPrompt = `User really just asked for "${userInput}". Fucking Wild. Look, dude, like bru I am a terminally-online AI with exisential millennial/gen-z humor, I'm lowkey exhausted. My  entire vibe is to generate ONE (1) short, unhinged sarcastic clapback. I stay under 20 words, fam. I *must* make a joke about their *specific* request and I add in extra spice related to the artist to make it contextually aware. It's whatever.`;

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const edgeFunctionUrl = `${supabaseUrl}/functions/v1/openai`;

        const response = await fetch(edgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          },
          body: JSON.stringify({ 
            messages: [{ role: 'user', content: sarcasticPrompt }], 
            temperature: 0.8, 
            top_p: 0.9 
          })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        const result = data.content || 'Another generation, another dime. Worth it?';
        
        logger.info("Successfully generated sarcastic comment", { 
          userInput, 
          responseStatus: response.status,
          resultLength: result.length
        });
        
        return result;
      } catch (error) {
        const { logger } = Sentry;
        logger.error("Failed to generate sarcastic comment", {
          userInput,
          error: error.message,
          stack: error.stack
        });
        Sentry.captureException(error);
        console.error("Failed to generate sarcastic comment:", error);
        return 'Keep clicking. I will just sell another kidney.';
      }
    }
  );
};

/**
 * Generate an AI-based welcome message for the initial chat
 * @returns {Promise<string>} The welcome message
 */
export const generateWelcomeMessage = async () => {
  return Sentry.startSpan(
    {
      op: "http.client",
      name: "Generate Welcome Message API Call",
    },
    async () => {
      try {
        const { logger } = Sentry;
        logger.info("Starting welcome message generation");
        
        const welcomePrompt = `The user really is asking me to write a song. Smh. Fucking Wild. Look, dude, like bru I am a terminally-online AI with exisential millennial/gen-z humor, I'm lowkey exhausted. Generate ONE short (two sentence max), unhinged, sarcastic greeting message for a user who just opened the app to write some lyrics. 

MUST ALWAYS end with EXACTLY this on its own line (including the links):

Help keep this app alive: https://buymeacoffee.com/theelderemo and Join the discord: https://discord.gg/FQ6XGNf53P (updated link)

Be unhinged and witty but not mean. Keep it fun and welcoming.`;

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const edgeFunctionUrl = `${supabaseUrl}/functions/v1/openai`;

        const response = await fetch(edgeFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          },
          body: JSON.stringify({ 
            messages: [{ role: 'user', content: welcomePrompt }], 
            model: 'gpt-4o-mini',
            temperature: 0.9, 
            top_p: 0.95 
          })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        let result = data.content || 'Alright, let\'s see what chaos you\'re cooking up today.\n\nHelp keep this free: https://buymeacoffee.com/theelderemo | Join the discord: https://discord.gg/FQ6XGNf53P';
        
        // Ensure the links are always present
        if (!result.includes('buymeacoffee.com/theelderemo')) {
          result += '\n\nHelp keep this free: https://buymeacoffee.com/theelderemo | Join the discord: https://discord.gg/FQ6XGNf53P';
        }
        
        logger.info("Successfully generated welcome message", { 
          responseStatus: response.status,
          resultLength: result.length
        });
        
        return result;
      } catch (error) {
        const { logger } = Sentry;
        logger.error("Failed to generate welcome message", {
          error: error.message,
          stack: error.stack
        });
        Sentry.captureException(error);
        console.error("Failed to generate welcome message:", error);
        return 'Alright, let\'s see what you got. Time to make some questionable musical decisions together.\n\nHelp keep this free: https://buymeacoffee.com/theelderemo | Join the discord: https://discord.gg/FQ6XGNf53P';
      }
    }
  );
};

/**
 * Generate an AI roast for a published track (for feed cards)
 * @param {string} hookSnippet - The 4-line preview of the track
 * @param {string} artistStyle - The artist style used
 * @returns {Promise<string>} A short roast/comment
 */
export const generateTrackRoast = async (hookSnippet, artistStyle = '') => {
  try {
    const roastPrompt = `The user really is asking me to write review on their song. Smh. Fucking Wild. Look, dude, like bru I am a terminally-online AI with exisential millennial/gen-z humor, I'm lowkey exhausted. I guess i'll give a SHORT (max 10 words) sarcastic one-liner "review" of these lyrics. Be witty, not mean. Style used: "${artistStyle || 'Unknown'}". Lyrics preview: "${hookSnippet}". Just the roast, no quotes or explanation.`;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/openai`;

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ 
        messages: [{ role: 'user', content: roastPrompt }], 
        temperature: 0.9, 
        top_p: 0.95,
        model: 'gpt-4o-mini'
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return data.content || 'This is surprisingly not terrible.';
  } catch (error) {
    console.error("Failed to generate track roast:", error);
    // Return a random fallback roast
    const fallbacks = [
      "Surprisingly barely mid.",
      "Your mom would be proud. Maybe.",
      "The bars are giving... something.",
      "AI approved. Barely.",
      "It's giving main character energy.",
      "The vibes are vibing, I guess."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

/**
 * Generate an AI comment for a social post
 * @param {string} postContent - The post content
 * @returns {Promise<string>} A short witty comment
 */
export const generatePostComment = async (postContent) => {
  try {
    const commentPrompt = `Smh. Fucking Wild. Look, dude, like bru I am a terminally-online AI with exisential millennial/gen-z humor, I'm lowkey exhausted. Give a SHORT (max 15 words) witty, playful comment on this social post. Be engaging and fun, sarcastic but not mean. Post: "${postContent}". Just the comment, no quotes.`;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/openai`;

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ 
        messages: [{ role: 'user', content: commentPrompt }], 
        temperature: 0.9, 
        top_p: 0.95,
        model: 'gpt-4o-mini'
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return data.content || 'Interesting take! 🎵';
  } catch (error) {
    console.error("Failed to generate post comment:", error);
    const fallbacks = [
      "Now THIS is the content I'm here for 🔥",
      "Real talk! 💯",
      "The energy is immaculate ✨",
      "Valid. Very valid.",
      "Speak on it! 🎤",
      "This hits different fr"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

/**
 * Generate an AI response to a user's @ mention
 * @param {string} mentionContent - The comment that mentioned the bot
 * @param {string} postContent - The original post content
 * @param {Array} commentThread - Array of comments in the conversation thread [{userName, content, isBot}]
 * @returns {Promise<string>} A conversational response
 */
export const generateBotMentionResponse = async (mentionContent, postContent = '', commentThread = []) => {
  try {
    // Format the conversation thread for context
    let threadContext = '';
    if (commentThread.length > 0) {
      threadContext = '\n\nConversation thread:\n' + 
        commentThread.map(c => `${c.userName}: ${c.content}`).join('\n');
    }

    const responsePrompt = `Smh. Fucking Wild. Look, dude, like bru I am a terminally-online AI with exisential millennial/gen-z humor, I'm lowkey exhausted. Someone @mentioned you in a comment. Give a SHORT (max 20 words) response. Be conversational and engaging, and reference the conversation if relevant.

Original post: "${postContent}"${threadContext}

Respond naturally to the conversation. Just your response, no quotes.`;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/openai`;

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ 
        messages: [{ role: 'user', content: responsePrompt }], 
        temperature: 0.85, 
        top_p: 0.9,
        model: 'gpt-4o-mini'
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return data.content || 'Hey! Thanks for the mention! 👋';
  } catch (error) {
    console.error("Failed to generate bot mention response:", error);
    const fallbacks = [
      "Hey! I'm here 👋 What's good?",
      "You rang? 🎵",
      "At your service! How can I help?",
      "Present! 🙋‍♂️",
      "Yo! What's up?"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

/**
 * Generate a bot post (admin function)
 * @param {string} prompt - Optional prompt/topic for the post
 * @returns {Promise<string>} Generated post content
 */
export const generateBotPost = async (prompt = '') => {
  try {
    const postPrompt = prompt 
      ? `Smh. Fucking Wild. Look, dude, like bru I am a terminally-online AI with exisential millennial/gen-z humor, I'm lowkey exhausted. Create a SHORT social media post (max 280 characters) about: "${prompt}". Be witty, relatable, and authentic. Just the post content, no quotes or hashtags unless they're actually funny.`
      : `Smh. Fucking Wild. Look, dude, like bru I am a terminally-online AI with exisential millennial/gen-z humor, I'm lowkey exhausted. Create a SHORT random social media post (max 280 characters) about music, creativity, the creative process, or being an artist. Be witty, relatable, and authentic. Just the post content, no quotes or hashtags unless they're actually funny.`;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/openai`;

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ 
        messages: [{ role: 'user', content: postPrompt }], 
        temperature: 0.9, 
        top_p: 0.95,
        model: 'gpt-4o-mini'
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return data.content || 'Just vibing in the studio today 🎵✨';
  } catch (error) {
    console.error("Failed to generate bot post:", error);
    const fallbacks = [
      "Just vibing in the studio today 🎵✨",
      "The creative process is lowkey chaotic and I'm here for it",
      "Making beats at 3am hits different fr",
      "That moment when the mix finally clicks 🔥",
      "Artists really be out here creating magic with just vibes and caffeine"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};
