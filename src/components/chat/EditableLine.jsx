import React, { useState } from 'react';
import { Edit2, Check, X, Sparkles, Type } from 'lucide-react';

const EditableLine = ({ 
  lineNumber, 
  text, 
  onEdit, 
  isEditing, 
  onCancelEdit,
  onSaveEdit,
  onAiSuggest, // New prop for AI suggestions with custom prompt
  profile // For pro feature checks
}) => {
  const [editedText, setEditedText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const [editMode, setEditMode] = useState('manual'); // 'manual' or 'ai'
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(''); // For custom AI instructions

  const handleEdit = (mode = 'manual') => {
    setEditedText(text);
    setEditMode(mode);
    setCustomPrompt(''); // Reset custom prompt when entering edit mode
    onEdit(lineNumber, text);
  };

  const handleAiSuggest = async () => {
    if (!customPrompt.trim() || !onAiSuggest) return;
    
    setIsLoadingSuggestions(true);
    try {
      const suggestions = await onAiSuggest(lineNumber, text, customPrompt);
      setAiSuggestions(suggestions || []);
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      setAiSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSave = (textToSave = editedText) => {
    onSaveEdit(lineNumber, textToSave);
    setAiSuggestions([]);
    setCustomPrompt('');
    setEditMode('manual');
  };

  const handleCancel = () => {
    setEditedText(text);
    setAiSuggestions([]);
    setCustomPrompt('');
    setEditMode('manual');
    onCancelEdit();
  };

  const handleSelectSuggestion = (suggestion) => {
    setEditedText(suggestion);
    setAiSuggestions([]);
    setEditMode('manual'); // Switch to manual to allow further edits
  };

  return (
    <div 
      className="group relative py-1 px-2 -mx-2 rounded hover:bg-slate-700/30 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-2">
        {/* Line number */}
        <span className="text-slate-500 text-xs font-mono w-8 flex-shrink-0 select-none pt-0.5">
          {lineNumber}
        </span>
        
        {/* Line content or edit input */}
        {isEditing ? (
          <div className="flex-1 flex flex-col gap-2">
            {/* Mode Toggle */}
            <div className="flex gap-1 mb-1">
              <button
                onClick={() => setEditMode('manual')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                  editMode === 'manual' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
                title="Manual editing"
              >
                <Type size={12} />
                Manual
              </button>
              <button
                onClick={() => handleEdit('ai')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                  editMode === 'ai' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
                title={profile?.is_pro !== 'true' ? 'AI Prompt (Studio Pass Only)' : 'AI suggestions with custom prompt'}
                disabled={!onAiSuggest || profile?.is_pro !== 'true'}
              >
                <Sparkles size={12} />
                AI Prompt {profile?.is_pro !== 'true' ? '🔒' : ''}
              </button>
            </div>

            {/* Manual Edit Mode */}
            {editMode === 'manual' && (
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="flex-1 bg-slate-700 border border-indigo-500 rounded px-2 py-1 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
              />
            )}

            {/* AI Suggestions Mode */}
            {editMode === 'ai' && (
              <div className="space-y-2">
                {/* Custom prompt input */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">
                    What do you want to change about this line?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customPrompt.trim()) {
                          handleAiSuggest();
                        }
                        if (e.key === 'Escape') handleCancel();
                      }}
                      className="flex-1 bg-slate-700 border border-indigo-500 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder='e.g., "make it more metaphorical" or "add a sports reference"'
                      autoFocus
                    />
                    <button
                      onClick={handleAiSuggest}
                      disabled={!customPrompt.trim() || isLoadingSuggestions}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-sm text-white flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles size={14} />
                      Generate
                    </button>
                  </div>
                </div>

                {/* Loading state */}
                {isLoadingSuggestions ? (
                  <div className="bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-slate-400 text-sm flex items-center gap-2">
                    <Sparkles size={14} className="animate-pulse" />
                    Generating AI suggestions with full song context...
                  </div>
                ) : aiSuggestions.length > 0 ? (
                  <>
                    <p className="text-xs text-slate-400">Select a suggestion:</p>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {aiSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectSuggestion(suggestion)}
                          className="w-full text-left bg-slate-700 hover:bg-indigo-600/20 border border-slate-600 hover:border-indigo-500 rounded px-3 py-2 text-slate-200 text-sm transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSave()}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs text-white flex items-center gap-1 transition-colors"
                disabled={isLoadingSuggestions}
              >
                <Check size={12} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-slate-600 hover:bg-slate-700 rounded text-xs text-slate-200 flex items-center gap-1 transition-colors"
              >
                <X size={12} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="flex-1 text-slate-200 text-sm leading-relaxed">
              {text}
            </span>
            
            {/* Edit buttons (visible on hover) */}
            {(isHovered || isEditing) && (
              <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit('manual')}
                  className="p-1 rounded hover:bg-slate-600 transition-colors"
                  aria-label="Edit line manually"
                  title="Edit manually"
                >
                  <Edit2 size={14} className="text-slate-400 hover:text-indigo-400" />
                </button>
                {onAiSuggest && (
                  <button
                    onClick={() => handleEdit('ai')}
                    className="p-1 rounded hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Prompt AI for suggestions"
                    title={profile?.is_pro !== 'true' ? 'AI Prompt (Studio Pass Only)' : 'Prompt AI for suggestions'}
                    disabled={profile?.is_pro !== 'true'}
                  >
                    <Sparkles size={14} className="text-slate-400 hover:text-yellow-400" />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EditableLine;
