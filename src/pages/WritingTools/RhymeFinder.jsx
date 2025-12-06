/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useState } from 'react';
import { Search, LoaderCircle, Volume2 } from 'lucide-react';

const RhymeFinder = () => {
  const [word, setWord] = useState('');
  const [rhymes, setRhymes] = useState([]);
  const [nearRhymes, setNearRhymes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchType, setSearchType] = useState('perfect'); // 'perfect' or 'near'

  const fetchRhymes = async () => {
    if (!word.trim()) return;
    
    setLoading(true);
    setError('');
    setRhymes([]);
    setNearRhymes([]);

    try {
      // Fetch perfect rhymes
      const perfectRes = await fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(word.trim())}&max=50`);
      const perfectData = await perfectRes.json();
      
      // Fetch near rhymes (slant rhymes)
      const nearRes = await fetch(`https://api.datamuse.com/words?rel_nry=${encodeURIComponent(word.trim())}&max=50`);
      const nearData = await nearRes.json();

      setRhymes(perfectData);
      setNearRhymes(nearData);

      if (perfectData.length === 0 && nearData.length === 0) {
        setError('No rhymes found. Try a different word.');
      }
    } catch (err) {
      setError('Failed to fetch rhymes. Please try again.');
      console.error('Datamuse API error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchRhymes();
    }
  };

  const getSyllableCount = (score) => {
    // Datamuse returns a score - higher is more common/relevant
    if (score > 10000) return 'Very common';
    if (score > 1000) return 'Common';
    if (score > 100) return 'Less common';
    return 'Rare';
  };

  const displayedRhymes = searchType === 'perfect' ? rhymes : nearRhymes;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 lg:p-6 border-b border-slate-700/50">
        <h2 className="text-2xl font-bold text-indigo-400 mb-2">Rhyme Finder</h2>
        <p className="text-slate-400 text-sm">Find perfect and slant rhymes powered by Datamuse API</p>
      </div>

      <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
        {/* Search Input */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a word to find rhymes..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          </div>
          <button
            onClick={fetchRhymes}
            disabled={loading || !word.trim()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? <LoaderCircle size={20} className="animate-spin" /> : 'Search'}
          </button>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSearchType('perfect')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              searchType === 'perfect'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Perfect Rhymes ({rhymes.length})
          </button>
          <button
            onClick={() => setSearchType('near')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              searchType === 'near'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Slant Rhymes ({nearRhymes.length})
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="text-center text-slate-500 py-8">
              <p>{error}</p>
            </div>
          )}

          {displayedRhymes.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {displayedRhymes.map((rhyme, index) => (
                <div
                  key={index}
                  className={`
                    p-3 rounded-lg border cursor-pointer
                    transition-all hover:scale-105
                    ${searchType === 'perfect' 
                      ? 'bg-slate-800/50 border-indigo-500/30 hover:border-indigo-500/60' 
                      : 'bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60'
                    }
                  `}
                  onClick={() => navigator.clipboard.writeText(rhyme.word)}
                  title="Click to copy"
                >
                  <p className="text-white font-medium text-center">{rhyme.word}</p>
                  {rhyme.score && (
                    <p className="text-xs text-slate-500 text-center mt-1">
                      {getSyllableCount(rhyme.score)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && !error && rhymes.length === 0 && nearRhymes.length === 0 && (
            <div className="flex items-center justify-center h-full text-slate-500">
              <div className="text-center">
                <Volume2 size={48} className="mx-auto mb-4 opacity-50" />
                <p>Enter a word to find rhymes</p>
                <p className="text-sm mt-2">Perfect for finding that elusive end rhyme</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RhymeFinder;
