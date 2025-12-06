/* eslint-disable no-unused-vars */
/**
 * PublishModal - Modal for publishing tracks to the public feed
 * Allows users to select best lines for preview, add title, and publish
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Music, Sparkles, AlertCircle, Check, Loader2, Ghost } from 'lucide-react';
import { publishTrack } from '../../lib/social';

/**
 * Extract lyrics content from messages array
 * @param {array} messages - Chat messages
 * @returns {string} - Combined lyrics content
 */
const extractLyricsFromMessages = (messages) => {
  return messages
    .filter(m => m.role === 'assistant')
    .map(m => m.content)
    .join('\n\n');
};

/**
 * Split lyrics into lines for selection
 * @param {string} lyrics - Full lyrics content
 * @returns {array} - Array of lines
 */
const splitIntoLines = (lyrics) => {
  return lyrics
    .split('\n')
    .map((line, index) => ({ text: line.trim(), index }))
    .filter(line => line.text.length > 0);
};

const PublishModal = ({
  isOpen,
  onClose,
  messages,
  sessionId,
  userId,
  settings = {},
  onPublishSuccess
}) => {
  const [title, setTitle] = useState('');
  const [selectedLines, setSelectedLines] = useState(new Set());
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Extract lyrics from messages
  const lyrics = useMemo(() => extractLyricsFromMessages(messages), [messages]);
  const lines = useMemo(() => splitIntoLines(lyrics), [lyrics]);

  // Generate hook snippet from selected lines
  const hookSnippet = useMemo(() => {
    const selected = Array.from(selectedLines)
      .sort((a, b) => a - b)
      .slice(0, 4)
      .map(idx => lines.find(l => l.index === idx)?.text)
      .filter(Boolean)
      .join('\n');
    return selected || lines.slice(0, 4).map(l => l.text).join('\n');
  }, [selectedLines, lines]);

  const toggleLine = (index) => {
    const newSelected = new Set(selectedLines);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else if (newSelected.size < 4) {
      newSelected.add(index);
    }
    setSelectedLines(newSelected);
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      setError('Please enter a title for your track');
      return;
    }

    if (lyrics.length < 10) {
      setError('Your track needs more content before publishing');
      return;
    }

    setIsPublishing(true);
    setError('');

    try {
      const { track, error: publishError } = await publishTrack({
        userId,
        sessionId,
        title: title.trim(),
        lyricsContent: lyrics,
        hookSnippet,
        primaryArtistStyle: settings.artistName || null,
        moodTags: settings.moodTag ? [settings.moodTag] : [],
        generationSettings: settings,
        isAnonymous: isGhostMode
      });

      if (publishError) throw publishError;

      setSuccess(true);
      setTimeout(() => {
        onPublishSuccess?.(track);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Publish error:', err);
      setError(err.message || 'Failed to publish track. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const resetAndClose = () => {
    setTitle('');
    setSelectedLines(new Set());
    setIsGhostMode(false);
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={resetAndClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Release Track</h2>
                <p className="text-sm text-slate-400">Share your work with the community</p>
              </div>
            </div>
            <button
              onClick={resetAndClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Success State */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Track Released! 🔥</h3>
                <p className="text-slate-400">Your track is now live on the feed</p>
              </motion.div>
            )}

            {!success && (
              <>
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Track Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your track a name..."
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Settings Preview */}
                {(settings.artistName || settings.moodTag) && (
                  <div className="flex flex-wrap gap-2">
                    {settings.artistName && (
                      <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 text-sm rounded-full flex items-center gap-1">
                        <Music size={14} />
                        {settings.artistName}
                      </span>
                    )}
                    {settings.moodTag && (
                      <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full flex items-center gap-1">
                        <Sparkles size={14} />
                        {settings.moodTag}
                      </span>
                    )}
                  </div>
                )}

                {/* Hook Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select Your Best 4 Lines (Preview)
                  </label>
                  <p className="text-xs text-slate-500 mb-3">
                    These lines will be shown on your track card in the feed. Click to select.
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-1 bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                    {lines.length > 0 ? (
                      lines.map((line) => (
                        <button
                          key={line.index}
                          onClick={() => toggleLine(line.index)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                            selectedLines.has(line.index)
                              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                              : 'hover:bg-slate-700/50 text-slate-300'
                          }`}
                        >
                          {line.text}
                        </button>
                      ))
                    ) : (
                      <p className="text-slate-500 text-center py-4">No lyrics to display</p>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {selectedLines.size}/4 lines selected
                    {selectedLines.size === 0 && ' (first 4 lines will be used by default)'}
                  </p>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Preview
                  </label>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-white font-medium mb-2">{title || 'Untitled Track'}</p>
                    <p className="text-slate-400 text-sm whitespace-pre-line italic">
                      "{hookSnippet || 'Your hook will appear here...'}"
                    </p>
                    {isGhostMode && (
                      <p className="text-purple-400 text-xs mt-2 flex items-center gap-1">
                        <Ghost size={12} /> Publishing anonymously
                      </p>
                    )}
                  </div>
                </div>

                {/* Ghost Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isGhostMode ? 'bg-purple-600/30' : 'bg-slate-700'
                    }`}>
                      <Ghost className={`w-5 h-5 transition-colors ${
                        isGhostMode ? 'text-purple-400' : 'text-slate-400'
                      }`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Ghost Mode</h4>
                      <p className="text-xs text-slate-400">
                        Publish anonymously without your username
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsGhostMode(!isGhostMode)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      isGhostMode ? 'bg-purple-600' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        isGhostMode ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!success && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700 bg-slate-800/50">
              <button
                onClick={resetAndClose}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing || !title.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Flame size={18} />
                    Release Track
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PublishModal;
