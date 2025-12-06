/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useState } from 'react';
import { Sparkles, LoaderCircle, Copy, Check } from 'lucide-react';
import { callAI } from '../../lib/api';

const WordplaySuggester = () => {
  const [word, setWord] = useState('');
  const [context, setContext] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const WORDPLAY_PROMPT = `You are a creative wordplay expert specializing in songwriting. Given a word or phrase, generate creative wordplay suggestions including:

**Double Meanings**: Words or phrases that work on multiple levels
**Puns**: Sound-alike words that create clever connections
**Homophone Plays**: Words that sound the same but have different meanings
**Metaphoric Twists**: Creative ways to use the word metaphorically
**Slang Alternatives**: Hip-hop/R&B/pop culture slang substitutions

Format each suggestion clearly. Be creative, clever, and think like a songwriter looking for that perfect turn of phrase. Keep suggestions relevant to songwriting.`;

  const handleGenerate = () => {
    if (!word.trim()) return;
    
    let prompt = `${WORDPLAY_PROMPT}\n\nWord/Phrase to work with: "${word}"`;
    if (context.trim()) {
      prompt += `\n\nContext/Theme: ${context}`;
    }
    
    callAI(prompt, setLoading, setResult, { temperature: 0.9, top_p: 0.95 });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 lg:p-6 border-b border-slate-700/50">
        <h2 className="text-2xl font-bold text-purple-400 mb-2">Wordplay Suggester</h2>
        <p className="text-slate-400 text-sm">Get creative with double meanings, puns, and clever twists</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Input Side */}
        <div className="w-full lg:w-1/2 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-700/50 flex flex-col">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Word or Phrase</label>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., heart, cold, fire, cash..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Context (Optional)</label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="What's the song about? Love, heartbreak, success, struggle..."
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !word.trim()}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoaderCircle size={20} className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} className="mr-2" />
                  Generate Wordplay
                </>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-400 mb-2">Pro Tips</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• Try common words like "heart", "cold", "fire" for rich wordplay</li>
              <li>• Add context to get more relevant suggestions</li>
              <li>• Combine multiple suggestions for layered meanings</li>
            </ul>
          </div>
        </div>

        {/* Results Side */}
        <div className="w-full lg:w-1/2 p-4 lg:p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-300">Results</h3>
            {result && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            {result ? (
              <div className="text-slate-200 text-sm whitespace-pre-wrap">{result}</div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center">
                  <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Enter a word to get wordplay suggestions</p>
                  <p className="text-sm mt-2">Perfect for finding clever double meanings</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordplaySuggester;
