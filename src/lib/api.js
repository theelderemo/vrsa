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
