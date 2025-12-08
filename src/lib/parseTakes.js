/**
 * Parse messages into "Takes" (prompt + response pairs)
 * @param {array} messages - Chat messages
 * @returns {array} - Array of takes
 */
export const parseTakes = (messages = []) => {
  const takes = [];
  let currentTake = null;

  messages.forEach((msg, index) => {
    if (msg.role === 'user') {
      if (currentTake) {
        takes.push(currentTake);
      }
      currentTake = {
        id: index,
        prompt: msg.content,
        promptTimestamp: msg.timestamp || null,
        response: null,
        responseTimestamp: null,
        settings: msg.settings || null
      };
    } else if (msg.role === 'assistant' && currentTake) {
      currentTake.response = msg.content;
      currentTake.responseTimestamp = msg.timestamp || null;
      currentTake.settings = msg.settings || currentTake.settings;
    }
  });

  if (currentTake) {
    takes.push(currentTake);
  }

  return takes;
};
