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

import React, { useState } from 'react';
import { User, Copy, Check } from 'lucide-react';
import EditableLine from './EditableLine';
import { useTypewriter } from '../../hooks/useTypewriter';
import { VRSA_BOT_AVATAR_URL } from '../../lib/social';

const ChatMessage = ({ 
  message, 
  index, 
  onLineEdit, 
  editingLine, 
  onCancelEdit, 
  onSaveEdit,
  onAiSuggest, // New prop for AI suggestions
  profile // For pro feature checks
}) => {
  const [isCopied, setIsCopied] = useState(false);
  
  const isBotMessage = message.role === 'assistant';
  // Enable typewriter effect only for bot messages (not initial welcome or user messages)
  const shouldAnimate = isBotMessage && index > 0;
  
  // Apply typewriter effect to bot messages
  const { displayedText, isTyping, skip } = useTypewriter(
    message.content, 
    20, // 20ms per character for smooth effect
    shouldAnimate
  );

  const handleCopy = () => {
    const textToCopy = message.content;
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  };

  // Show copy button only for bot messages and not for the initial welcome message (index 0)
  const showCopyButton = isBotMessage && index > 0;
  
  // The initial welcome message (index 0) should not be editable
  const isInitialMessage = index === 0;
  
  // Use displayedText for typewriter effect or full message content
  const contentToDisplay = shouldAnimate ? displayedText : message.content;
  
  // Split bot messages into lines for inline editing (but not the initial message)
  // Only split when animation is complete
  const lines = isBotMessage && !isInitialMessage && !isTyping 
    ? contentToDisplay.split('\n').filter(line => line.trim()) 
    : [];
  const isMultiLine = lines.length > 1 && !isTyping;
  const messageId = `msg-${index}`;

  // Function to render text with clickable links
  const renderMessageContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 hover:text-yellow-300 underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className={`flex items-start gap-4 my-6 ${isBotMessage ? 'pr-8' : 'pl-8'}`}>
      {isBotMessage ? (
        <img 
          src={VRSA_BOT_AVATAR_URL} 
          alt="VRSA Bot"
          className="flex-shrink-0 w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-slate-700">
          <User className="text-white" />
        </div>
      )}
      <div className={`relative p-4 rounded-lg w-full ${isBotMessage ? 'bg-slate-800' : 'bg-slate-700/50'}`}>
        {showCopyButton && (
          <button 
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-600 transition-colors"
            aria-label="Copy lyrics"
          >
            {isCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-400" />}
          </button>
        )}
        {isTyping && shouldAnimate && (
          <button
            onClick={skip}
            className="absolute top-2 right-10 px-2 py-1 text-xs rounded-md bg-indigo-600/80 hover:bg-indigo-500 text-white transition-colors"
            aria-label="Skip animation"
          >
            Skip
          </button>
        )}
        
        {/* Render bot messages with editable lines (only when typing is complete), user messages as plain text */}
        {isBotMessage && isMultiLine ? (
          <div className="text-slate-200 font-mono text-sm md:text-base pr-8">
            {lines.map((line, lineIndex) => (
              <EditableLine
                key={`${messageId}-line-${lineIndex}`}
                lineNumber={lineIndex + 1}
                text={line}
                onEdit={(lineNum, text) => onLineEdit && onLineEdit(index, lineNum, text)}
                isEditing={editingLine?.messageIndex === index && editingLine?.lineNumber === lineIndex + 1}
                onCancelEdit={() => onCancelEdit && onCancelEdit()}
                onSaveEdit={(lineNum, newText) => onSaveEdit && onSaveEdit(index, lineNum, newText)}
                onAiSuggest={onAiSuggest ? (lineNum, text, customPrompt) => onAiSuggest(index, lineNum, text, customPrompt) : undefined}
                profile={profile}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-200 whitespace-pre-wrap font-mono text-sm md:text-base pr-8">
            {renderMessageContent(contentToDisplay)}
            {isTyping && <span className="inline-block w-1 h-4 ml-1 bg-indigo-400 animate-pulse" />}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
