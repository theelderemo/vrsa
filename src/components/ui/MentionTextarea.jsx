/**
 * MentionTextarea - Textarea component with @ mention autocomplete
 * Shows a dropdown of matching usernames when typing @
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Loader2 } from 'lucide-react';
import { searchUsersByUsername, BOT_ACCOUNTS, VRSA_BOT_AVATAR_URL } from '../../lib/social';

const MentionTextarea = ({
  value,
  onChange,
  placeholder = 'Type a message...',
  className = '',
  disabled = false,
  rows = 3,
  onFocus,
  onKeyDown: externalKeyDown,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const textareaRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Detect @ mentions in the input
  const detectMention = useCallback((text, cursorPosition) => {
    // Look backwards from cursor to find @
    const textBeforeCursor = text.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex === -1) {
      return { isMentioning: false, query: '', startIndex: -1 };
    }

    // Check if there's a space or newline between @ and cursor (if so, not mentioning)
    const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
    if (textAfterAt.includes(' ') || textAfterAt.includes('\n')) {
      return { isMentioning: false, query: '', startIndex: -1 };
    }

    // Check if @ is at start or preceded by space/newline
    const charBeforeAt = lastAtIndex > 0 ? text[lastAtIndex - 1] : ' ';
    if (charBeforeAt !== ' ' && charBeforeAt !== '\n' && lastAtIndex !== 0) {
      return { isMentioning: false, query: '', startIndex: -1 };
    }

    return {
      isMentioning: true,
      query: textAfterAt.toLowerCase(),
      startIndex: lastAtIndex,
    };
  }, []);

  // Search for users when mention query changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!mentionQuery && mentionStartIndex >= 0) {
        // Show bot accounts when just typing @
        const botSuggestions = BOT_ACCOUNTS.filter(bot => 
          bot.username.toLowerCase().startsWith(mentionQuery)
        );
        setSuggestions(botSuggestions);
        setShowSuggestions(true);
        return;
      }

      if (mentionQuery.length < 1) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      
      // Search for real users
      const { users } = await searchUsersByUsername(mentionQuery, 8);
      
      // Also include bot accounts that match
      const botSuggestions = BOT_ACCOUNTS.filter(bot => 
        bot.username.toLowerCase().startsWith(mentionQuery)
      );
      
      // Combine: bots first, then users
      const allSuggestions = [...botSuggestions, ...users.filter(u => u.username)];
      
      setSuggestions(allSuggestions);
      setShowSuggestions(allSuggestions.length > 0);
      setSelectedIndex(0);
      setLoading(false);
    };

    if (mentionStartIndex >= 0) {
      searchUsers();
    } else {
      setShowSuggestions(false);
    }
  }, [mentionQuery, mentionStartIndex]);

  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    onChange(newValue);
    
    const { isMentioning, query, startIndex } = detectMention(newValue, cursorPosition);
    
    if (isMentioning) {
      setMentionQuery(query);
      setMentionStartIndex(startIndex);
    } else {
      setMentionQuery('');
      setMentionStartIndex(-1);
      setShowSuggestions(false);
    }
  };

  // Handle selecting a suggestion
  const selectSuggestion = (user) => {
    if (mentionStartIndex < 0) return;
    
    const beforeMention = value.substring(0, mentionStartIndex);
    const afterMention = value.substring(mentionStartIndex + 1 + mentionQuery.length);
    const newValue = `${beforeMention}@${user.username} ${afterMention}`;
    
    onChange(newValue);
    setShowSuggestions(false);
    setMentionStartIndex(-1);
    setMentionQuery('');
    
    // Focus back on textarea
    textareaRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % suggestions.length);
          return;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
          return;
        case 'Enter':
          if (!e.shiftKey) {
            e.preventDefault();
            selectSuggestion(suggestions[selectedIndex]);
            return;
          }
          break;
        case 'Tab':
          e.preventDefault();
          selectSuggestion(suggestions[selectedIndex]);
          return;
        case 'Escape':
          setShowSuggestions(false);
          return;
      }
    }
    
    // Call external keydown handler if provided
    externalKeyDown?.(e);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        rows={rows}
      />
      
      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-hidden z-50 max-h-48 overflow-y-auto"
        >
          {loading ? (
            <div className="flex items-center justify-center py-3">
              <Loader2 size={16} className="animate-spin text-indigo-400" />
            </div>
          ) : suggestions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-500">
              No users found
            </div>
          ) : (
            suggestions.map((user, index) => (
              <button
                key={user.id}
                type="button"
                onClick={() => selectSuggestion(user)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                  index === selectedIndex 
                    ? 'bg-indigo-600/30 text-white' 
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {user.profile_picture_url ? (
                  <img 
                    src={user.profile_picture_url} 
                    alt={user.username}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <User size={12} className="text-indigo-400" />
                  </div>
                )}
                <span className="text-sm font-medium">@{user.username}</span>
                {user.isBot && (
                  <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                    Bot
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MentionTextarea;
