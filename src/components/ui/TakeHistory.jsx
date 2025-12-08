/**
 * TakeHistory - Version control sidebar showing generation history
 * Displays "Takes" (user prompt + AI response pairs) with ability to restore
 */

import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  History,
  Clock,
  ChevronRight,
  RotateCcw,
  Info,
  X,
  Music,
  Sparkles,
  Copy,
  Edit3,
  Check
} from 'lucide-react';

/**
 * Parse messages into "Takes" (prompt + response pairs)
 * @param {array} messages - Chat messages
 * @returns {array} - Array of takes
 */
const parseTakes = (messages) => {
  const takes = [];
  let currentTake = null;

  messages.forEach((msg, index) => {
    if (msg.role === 'user') {
      // Start a new take
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
      // Complete the current take
      currentTake.response = msg.content;
      currentTake.responseTimestamp = msg.timestamp || null;
      currentTake.settings = msg.settings || currentTake.settings;
    }
  });

  // Push the last take if it exists
  if (currentTake) {
    takes.push(currentTake);
  }

  return takes;
};

/**
 * Format timestamp for display
 */
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

/**
 * TakeCard - Individual take display
 */
const TakeCard = ({ take, takeNumber, isSelected, onSelect, onRestore, onViewSettings }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Get preview text (first 50 chars of response)
  const preview = take.response 
    ? take.response.substring(0, 80) + (take.response.length > 80 ? '...' : '')
    : 'No response yet...';

  // Get prompt preview
  const promptPreview = take.prompt
    ? take.prompt.substring(0, 50) + (take.prompt.length > 50 ? '...' : '')
    : 'Empty prompt';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-lg border transition-all cursor-pointer ${
        isSelected
          ? 'bg-indigo-600/20 border-indigo-500/50'
          : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
      }`}
      onClick={() => onSelect(take)}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isSelected ? 'bg-indigo-600' : 'bg-slate-700'
          }`}>
            <span className="text-xs font-bold text-white">{takeNumber}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Take {takeNumber}</p>
            {take.promptTimestamp && (
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Clock size={10} />
                {formatTime(take.promptTimestamp)}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="p-1 hover:bg-slate-700 rounded transition-colors"
        >
          <ChevronRight
            size={16}
            className={`text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        </button>
      </div>

      {/* Preview */}
      <div className="px-3 pb-3">
        <p className="text-xs text-slate-400 italic line-clamp-2">
          "{preview}"
        </p>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2 border-t border-slate-700/50 pt-3">
              {/* Prompt */}
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Prompt:</p>
                <p className="text-xs text-slate-400">{promptPreview}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestore(take);
                  }}
                  className="flex items-center gap-1 px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/50 rounded text-indigo-400 text-xs transition-colors"
                >
                  <RotateCcw size={12} />
                  Restore
                </button>
                {take.settings && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewSettings(take);
                    }}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded text-slate-400 text-xs transition-colors"
                  >
                    <Info size={12} />
                    Settings
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * TakeDetailModal - Show full prompt and response for a take
 */
const TakeDetailModal = ({ take, isOpen, onClose }) => {
  const [promptValue, setPromptValue] = useState('');
  const [responseValue, setResponseValue] = useState('');
  const [promptEditable, setPromptEditable] = useState(false);
  const [responseEditable, setResponseEditable] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (take) {
      setPromptValue(take.prompt || '');
      setResponseValue(take.response || '');
    }
    setPromptEditable(false);
    setResponseEditable(false);
    setCopiedField(null);
  }, [take]);

  if (!isOpen || !take) return null;

  const handleCopy = async (text, field) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch (error) {
      console.error('Failed to copy text', error);
    }
  };

  const handleClose = () => {
    setPromptValue(take.prompt || '');
    setResponseValue(take.response || '');
    setPromptEditable(false);
    setResponseEditable(false);
    setCopiedField(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-black/60"
          onClick={handleClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <History size={18} className="text-indigo-400" />
              <div>
                <p className="text-white font-semibold">Take {take.takeNumber ?? take.id + 1}</p>
                <p className="text-xs text-slate-500">Full prompt and response</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              type="button"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-200">Prompt</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(promptValue, 'prompt')}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800/80 border border-slate-700 rounded text-slate-300 text-xs hover:bg-slate-800"
                    type="button"
                  >
                    {copiedField === 'prompt' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    {copiedField === 'prompt' ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => setPromptEditable(!promptEditable)}
                    className="flex items-center gap-1 px-2 py-1 bg-indigo-600/20 border border-indigo-500/50 rounded text-indigo-300 text-xs hover:bg-indigo-600/30"
                    type="button"
                  >
                    <Edit3 size={14} />
                    {promptEditable ? 'Done' : 'Edit'}
                  </button>
                </div>
              </div>
              <textarea
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                readOnly={!promptEditable}
                className={`w-full rounded-lg border bg-slate-800/60 text-slate-200 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  promptEditable ? 'border-slate-600' : 'border-slate-700 cursor-not-allowed'
                }`}
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-200">Response</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(responseValue, 'response')}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800/80 border border-slate-700 rounded text-slate-300 text-xs hover:bg-slate-800"
                    type="button"
                  >
                    {copiedField === 'response' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    {copiedField === 'response' ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => setResponseEditable(!responseEditable)}
                    className="flex items-center gap-1 px-2 py-1 bg-indigo-600/20 border border-indigo-500/50 rounded text-indigo-300 text-xs hover:bg-indigo-600/30"
                    type="button"
                  >
                    <Edit3 size={14} />
                    {responseEditable ? 'Done' : 'Edit'}
                  </button>
                </div>
              </div>
              <textarea
                value={responseValue}
                onChange={(e) => setResponseValue(e.target.value)}
                readOnly={!responseEditable}
                className={`w-full rounded-lg border bg-slate-800/60 text-slate-200 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  responseEditable ? 'border-slate-600' : 'border-slate-700 cursor-not-allowed'
                }`}
                rows={8}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * SettingsModal - Show generation settings for a take
 */
const SettingsModal = ({ take, isOpen, onClose }) => {
  if (!isOpen || !take?.settings) return null;

  const settings = take.settings;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-xl"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-400" />
            Generation Settings
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
          {settings.artistName && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Artist Style</span>
              <span className="text-sm text-white">{settings.artistName}</span>
            </div>
          )}
          {settings.moodTag && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Mood</span>
              <span className="text-sm text-white">{settings.moodTag}</span>
            </div>
          )}
          {settings.rhymeDensity !== undefined && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Rhyme Density</span>
              <span className="text-sm text-white">{settings.rhymeDensity}%</span>
            </div>
          )}
          {settings.rhymeComplexity !== undefined && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Rhyme Complexity</span>
              <span className="text-sm text-white">{settings.rhymeComplexity}%</span>
            </div>
          )}
          {settings.temperature !== undefined && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Temperature</span>
              <span className="text-sm text-white">{settings.temperature}</span>
            </div>
          )}
          {settings.lengthHint && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Length</span>
              <span className="text-sm text-white capitalize">{settings.lengthHint}</span>
            </div>
          )}
          {settings.selectedRhymeSchemes?.length > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Rhyme Schemes</span>
              <span className="text-sm text-white">{settings.selectedRhymeSchemes.join(', ')}</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Main TakeHistory Component
 */
const TakeHistory = ({ 
  messages, 
  isOpen, 
  onClose, 
  onRestoreTake,
  className = ''
}) => {
  const [selectedTake, setSelectedTake] = useState(null);
  const [settingsTake, setSettingsTake] = useState(null);

  const openTakeModal = (take) => {
    setSelectedTake(take);
  };

  const closeTakeModal = () => {
    setSelectedTake(null);
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedTake(null);
      setSettingsTake(null);
    }
  }, [isOpen]);

  // Parse messages into takes
  const takes = useMemo(() => parseTakes(messages), [messages]);

  const handleRestore = (take) => {
    if (onRestoreTake && take.response) {
      onRestoreTake(take);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <History size={20} className="text-indigo-400" />
            Take History
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {takes.length === 0 ? (
            <div className="text-center py-8">
              <Music size={40} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">No takes yet</p>
              <p className="text-slate-500 text-xs mt-1">
                Generate some lyrics to see your history
              </p>
            </div>
          ) : (
            takes
              .map((take, index) => {
                const numberedTake = { ...take, takeNumber: index + 1 };

                return (
                  <TakeCard
                    key={numberedTake.id}
                    take={numberedTake}
                    takeNumber={numberedTake.takeNumber}
                    isSelected={selectedTake?.id === numberedTake.id}
                    onSelect={() => openTakeModal(numberedTake)}
                    onRestore={handleRestore}
                    onViewSettings={setSettingsTake}
                  />
                );
              })
              .reverse()
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-700 bg-slate-800/50">
          <p className="text-xs text-slate-500 text-center">
            {takes.length} take{takes.length !== 1 ? 's' : ''} in this session
          </p>
        </div>

        {/* Settings Modal */}
        <SettingsModal
          take={settingsTake}
          isOpen={!!settingsTake}
          onClose={() => setSettingsTake(null)}
        />

        {/* Take Detail Modal */}
        <TakeDetailModal
          take={selectedTake}
          isOpen={!!selectedTake}
          onClose={closeTakeModal}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default TakeHistory;
