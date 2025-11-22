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
