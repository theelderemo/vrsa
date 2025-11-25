/**
 * Parse natural language commands for inline editing
 * Examples:
 * - "make line 3 more metaphorical"
 * - "rhyme line 5 with 'dreams'"
 * - "rewrite line 2 to be more emotional"
 */
export function parseEditCommand(input, messageContent) {
  const lineNumberRegex = /line\s+(\d+)/i;
  const match = input.match(lineNumberRegex);
  
  if (!match) {
    return null;
  }
  
  const lineNumber = parseInt(match[1], 10);
  const lines = messageContent.split('\n').filter(l => l.trim());
  
  if (lineNumber < 1 || lineNumber > lines.length) {
    return null;
  }
  
  const targetLine = lines[lineNumber - 1];
  
  // Determine the type of edit
  let editType = 'general';
  let instructions = input;
  
  if (/rhyme.*with/i.test(input)) {
    editType = 'rhyme';
    const rhymeWord = input.match(/with\s+['"]?(\w+)['"]?/i)?.[1];
    instructions = rhymeWord 
      ? `Rewrite this line to rhyme with "${rhymeWord}": ${targetLine}`
      : `Make this line rhyme better: ${targetLine}`;
  } else if (/more\s+(\w+)/i.test(input)) {
    const quality = input.match(/more\s+(\w+)/i)[1];
    editType = 'enhance';
    instructions = `Make this line more ${quality}: ${targetLine}`;
  } else if (/rewrite/i.test(input)) {
    editType = 'rewrite';
    instructions = `${input.replace(lineNumberRegex, '').trim()}: ${targetLine}`;
  } else if (/improve|better/i.test(input)) {
    editType = 'improve';
    instructions = `Improve this line: ${targetLine}`;
  } else {
    // General instruction
    instructions = `${input.replace(lineNumberRegex, '').trim()}: ${targetLine}`;
  }
  
  return {
    lineNumber,
    targetLine,
    editType,
    instructions
  };
}

/**
 * Build a prompt for AI to perform inline edits
 */
export function buildEditPrompt(parsedCommand, fullContext) {
  const { lineNumber, targetLine, instructions } = parsedCommand;
  
  const contextLines = fullContext.split('\n').filter(l => l.trim());
  const beforeContext = contextLines.slice(Math.max(0, lineNumber - 3), lineNumber - 1);
  const afterContext = contextLines.slice(lineNumber, Math.min(contextLines.length, lineNumber + 2));
  
  let prompt = `I need you to edit a specific line from lyrics.\n\n`;
  
  if (beforeContext.length > 0) {
    prompt += `Previous lines:\n${beforeContext.join('\n')}\n\n`;
  }
  
  prompt += `TARGET LINE (line ${lineNumber}):\n${targetLine}\n\n`;
  
  if (afterContext.length > 0) {
    prompt += `Following lines:\n${afterContext.join('\n')}\n\n`;
  }
  
  prompt += `INSTRUCTION: ${instructions}\n\n`;
  prompt += `Respond with ONLY the rewritten line, nothing else. Maintain the same style and flow.`;
  
  return prompt;
}
