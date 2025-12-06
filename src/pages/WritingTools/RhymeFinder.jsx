/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import { checkRateLimit, incrementUsage, RATE_LIMIT_FEATURES, DAILY_LIMITS, getRemainingUses } from '../../lib/rateLimits';

const SEARCH_MODES = [
  { id: 'rel_rhy', label: 'Perfect Rhymes', description: 'Words that rhyme exactly', color: 'indigo', example: 'cat → hat, bat' },
  { id: 'rel_nry', label: 'Slant Rhymes', description: 'Near rhymes / imperfect matches', color: 'purple', example: 'cat → bad, cap' },
  { id: 'sl', label: 'Sounds Like', description: 'Words that sound similar', color: 'pink', example: 'jirraf → giraffe' },
  { id: 'rel_hom', label: 'Homophones', description: 'Sound-alike words (different spelling)', color: 'rose', example: 'course → coarse' },
  { id: 'rel_cns', label: 'Consonant Match', description: 'Same consonant pattern', color: 'orange', example: 'sample → simple' },
  { id: 'ml', label: 'Means Like', description: 'Words with similar meaning', color: 'emerald', example: 'happy → joyful, elated' },
  { id: 'rel_syn', label: 'Synonyms', description: 'WordNet synonyms', color: 'teal', example: 'ocean → sea' },
  { id: 'rel_ant', label: 'Antonyms', description: 'Opposite meanings', color: 'red', example: 'late → early' },
  { id: 'rel_trg', label: 'Triggers', description: 'Statistically associated words', color: 'amber', example: 'cow → milking, farm' },
  { id: 'rel_jjb', label: 'Adjectives For', description: 'Common adjectives for a noun', color: 'cyan', example: 'beach → sandy, sunny' },
  { id: 'rel_jja', label: 'Nouns For Adjective', description: 'Nouns often described by adjective', color: 'sky', example: 'yellow → sun, banana' },
  { id: 'rel_bga', label: 'Follows Word', description: 'Words that often come after', color: 'violet', example: 'wreak → havoc' },
  { id: 'rel_bgb', label: 'Precedes Word', description: 'Words that often come before', color: 'fuchsia', example: 'havoc → wreak' },
];

const COLOR_CLASSES = {
  indigo: { active: 'bg-indigo-600 text-white', border: 'border-indigo-500/30 hover:border-indigo-500/60' },
  purple: { active: 'bg-purple-600 text-white', border: 'border-purple-500/30 hover:border-purple-500/60' },
  pink: { active: 'bg-pink-600 text-white', border: 'border-pink-500/30 hover:border-pink-500/60' },
  rose: { active: 'bg-rose-600 text-white', border: 'border-rose-500/30 hover:border-rose-500/60' },
  orange: { active: 'bg-orange-600 text-white', border: 'border-orange-500/30 hover:border-orange-500/60' },
  emerald: { active: 'bg-emerald-600 text-white', border: 'border-emerald-500/30 hover:border-emerald-500/60' },
  teal: { active: 'bg-teal-600 text-white', border: 'border-teal-500/30 hover:border-teal-500/60' },
  red: { active: 'bg-red-600 text-white', border: 'border-red-500/30 hover:border-red-500/60' },
  amber: { active: 'bg-amber-600 text-white', border: 'border-amber-500/30 hover:border-amber-500/60' },
  cyan: { active: 'bg-cyan-600 text-white', border: 'border-cyan-500/30 hover:border-cyan-500/60' },
  sky: { active: 'bg-sky-600 text-white', border: 'border-sky-500/30 hover:border-sky-500/60' },
  violet: { active: 'bg-violet-600 text-white', border: 'border-violet-500/30 hover:border-violet-500/60' },
  fuchsia: { active: 'bg-fuchsia-600 text-white', border: 'border-fuchsia-500/30 hover:border-fuchsia-500/60' },
};

const RhymeFinder = () => {
  const { profile } = useUser();
  const isPro = profile?.is_pro === 'true';
  
  const [word, setWord] = useState('');
  const [topic, setTopic] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchMode, setSearchMode] = useState('rel_rhy');
  const [copiedWord, setCopiedWord] = useState(null);
  const [showAllModes, setShowAllModes] = useState(false);
  const [remainingQueries, setRemainingQueries] = useState(DAILY_LIMITS.WORD_FINDER);

  useEffect(() => {
    setRemainingQueries(getRemainingUses(RATE_LIMIT_FEATURES.WORD_FINDER, DAILY_LIMITS.WORD_FINDER, isPro));
  }, [isPro]);

  const currentMode = SEARCH_MODES.find(m => m.id === searchMode);

  const fetchWords = async () => {
    if (!word.trim()) return;
    
    // Check rate limit for free users
    const { canUse } = checkRateLimit(RATE_LIMIT_FEATURES.WORD_FINDER, DAILY_LIMITS.WORD_FINDER, isPro);
    if (!canUse) {
      setError('Daily limit reached. Upgrade to Studio Pass for unlimited searches.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResults([]);

    try {
      let url = `https://api.datamuse.com/words?${searchMode}=${encodeURIComponent(word.trim())}&max=100&md=ps`;
      
      // Add topic hint if provided
      if (topic.trim()) {
        url += `&topics=${encodeURIComponent(topic.trim())}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      setResults(data);
      
      // Increment usage after successful search
      incrementUsage(RATE_LIMIT_FEATURES.WORD_FINDER);
      setRemainingQueries(getRemainingUses(RATE_LIMIT_FEATURES.WORD_FINDER, DAILY_LIMITS.WORD_FINDER, isPro));

      if (data.length === 0) {
        setError(`No results found for "${word}". Try a different word or search mode.`);
      }
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      console.error('Datamuse API error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWords();
    }
  };

  const handleCopy = (wordText) => {
    navigator.clipboard.writeText(wordText);
    setCopiedWord(wordText);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  const getPartOfSpeech = (tags) => {
    if (!tags) return null;
    const pos = tags.find(t => ['n', 'v', 'adj', 'adv', 'u'].includes(t));
    const posMap = { n: 'noun', v: 'verb', adj: 'adj', adv: 'adv', u: '?' };
    return pos ? posMap[pos] : null;
  };

  const getSyllables = (numSyllables) => {
    if (!numSyllables) return null;
    return `${numSyllables} syl`;
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="p-3 lg:p-6 border-b border-slate-700/50 bg-slate-900 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl lg:text-2xl font-bold text-indigo-400 mb-1">Word Finder</h2>
          {!isPro && (
            <span className="text-xs text-amber-400">
              {remainingQueries}/{DAILY_LIMITS.WORD_FINDER} searches left today
            </span>
          )}
        </div>
      </div>
      
      {/* Mobile: Compact inline controls | Desktop: Side panel */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        
        {/* Controls - Compact on mobile, side panel on desktop */}
        <div className="shrink-0 lg:w-1/3 p-3 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-700/50 lg:flex lg:flex-col lg:overflow-y-auto">
          
          {/* Search Row - Always visible */}
          <div className="flex gap-2 mb-2 lg:mb-3 lg:flex-col">
            <div className="flex-1 relative">
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a word..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <button
              onClick={fetchWords}
              disabled={loading || !word.trim() || (!isPro && remainingQueries <= 0)}
              title={!isPro && remainingQueries <= 0 ? 'Daily limit reached' : 'Search'}
              className="px-4 py-2 lg:w-full lg:py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
            >
              {loading ? <LoaderCircle size={18} className="animate-spin" /> : <span className="lg:hidden">Go</span>}
              <span className="hidden lg:inline">{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </div>

          {/* Topic Input - Hidden on mobile unless expanded */}
          <div className="hidden lg:block relative mb-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Topic hint (optional)"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            />
          </div>

          {/* Search Mode - Dropdown on mobile, full list on desktop */}
          <div className="flex items-center gap-2 lg:flex-col lg:items-stretch">
            {/* Mobile: Current mode button + dropdown */}
            <div className="lg:hidden flex-1">
              <button
                onClick={() => setShowAllModes(!showAllModes)}
                className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${COLOR_CLASSES[currentMode?.color || 'indigo'].active}`}
              >
                <span>{currentMode?.label || 'Select Mode'}</span>
                <span>{showAllModes ? '▲' : '▼'}</span>
              </button>
            </div>
            
            {/* Desktop: Full mode list */}
            <div className="hidden lg:block">
              <h4 className="text-sm font-semibold text-slate-400 mb-2">Search Mode</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {SEARCH_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSearchMode(mode.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      searchMode === mode.id
                        ? COLOR_CLASSES[mode.color].active
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                    }`}
                    title={mode.description}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              
              {/* Current Mode Description - Desktop only */}
              {currentMode && (
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 text-sm">
                  <p className="font-medium text-slate-300 mb-1">{currentMode.label}</p>
                  <p className="text-slate-500 text-xs">{currentMode.description}</p>
                  <p className="text-slate-600 text-xs italic mt-1">e.g., {currentMode.example}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile: Expanded mode selector */}
          {showAllModes && (
            <div className="lg:hidden mt-2 p-2 bg-slate-800/80 rounded-lg border border-slate-700/50">
              <div className="grid grid-cols-2 gap-1.5">
                {SEARCH_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setSearchMode(mode.id);
                      setShowAllModes(false);
                    }}
                    className={`px-2 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                      searchMode === mode.id
                        ? COLOR_CLASSES[mode.color].active
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Area - Takes remaining space */}
        <div className="flex-1 min-h-0 p-3 lg:p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2 lg:mb-3 shrink-0">
            <h3 className="text-base lg:text-lg font-semibold text-slate-300">Results</h3>
            {results.length > 0 && (
              <span className="text-xs lg:text-sm text-slate-500">{results.length} found • Tap to copy</span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto min-h-0">
            {error && (
              <div className="text-center text-slate-500 py-4 lg:py-8">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 lg:gap-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`
                      p-2 lg:p-3 rounded-lg border cursor-pointer relative group
                      transition-all active:scale-95 lg:hover:scale-105
                      bg-slate-800/50 ${COLOR_CLASSES[currentMode?.color || 'indigo'].border}
                    `}
                    onClick={() => handleCopy(result.word)}
                  >
                    {copiedWord === result.word && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 rounded-lg z-10">
                        <span className="text-green-400 text-xs">Copied!</span>
                      </div>
                    )}
                    <p className="text-white font-medium text-center truncate text-sm lg:text-base">{result.word}</p>
                    <div className="hidden lg:flex justify-center gap-2 mt-1 flex-wrap">
                      {getPartOfSpeech(result.tags) && (
                        <span className="text-xs text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded">
                          {getPartOfSpeech(result.tags)}
                        </span>
                      )}
                      {getSyllables(result.numSyllables) && (
                        <span className="text-xs text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded">
                          {getSyllables(result.numSyllables)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && results.length === 0 && (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center px-4">
                  <p className="text-sm lg:text-base">Enter a word to find matches</p>
                  <p className="text-xs lg:text-sm mt-2 text-slate-600">
                    Tap the mode button to change search type
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RhymeFinder;
