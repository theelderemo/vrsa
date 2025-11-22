import React, { useState } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';

const ChatMessage = ({ message, index }) => {
  const [isCopied, setIsCopied] = useState(false);

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

  const isBotMessage = message.role === 'assistant';
  // Show copy button only for bot messages and not for the initial welcome message (index 0)
  const showCopyButton = isBotMessage && index > 0;

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
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isBotMessage ? 'bg-indigo-600' : 'bg-slate-700'}`}>
        {isBotMessage ? <Bot className="text-white" /> : <User className="text-white" />}
      </div>
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
        <p className="text-slate-200 whitespace-pre-wrap font-mono text-sm md:text-base pr-8">{renderMessageContent(message.content)}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
