/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useState } from 'react';
import { Lightbulb, LoaderCircle, Copy, Check, RefreshCw } from 'lucide-react';
import { callAI } from '../../lib/api';

const HookGenerator = () => {
  const [theme, setTheme] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const genres = [
    'Hip-Hop/Rap',
    'R&B',
    'Pop',
    'Rock',
    'Country',
    'EDM/Dance',
    'Soul',
    'Indie',
    'Alternative'
  ];

  const moods = [
    'Hype/Energetic',
    'Melancholic',
    'Romantic',
    'Aggressive',
    'Chill/Laid-back',
    'Inspirational',
    'Dark/Moody',
    'Party',
    'Reflective'
  ];

  const HOOK_PROMPT = `You are a hit songwriter specializing in catchy hooks. Generate 5 unique hook/chorus ideas based on the given theme. Each hook should:

1. Be memorable and singable
2. Have a strong melodic potential
3. Use repetition effectively
4. Be emotionally resonant
5. Be appropriate for the specified genre and mood

Format each hook clearly numbered 1-5. Include brief notes on how each hook could work melodically. Be creative and think radio-ready.`;

  const handleGenerate = () => {
    if (!theme.trim()) return;
    
    let prompt = `${HOOK_PROMPT}\n\nTheme/Topic: "${theme}"`;
    if (genre) prompt += `\nGenre: ${genre}`;
    if (mood) prompt += `\nMood: ${mood}`;
    
    callAI(prompt, setLoading, setResult, { temperature: 0.95, top_p: 0.95 });
  };

  const handleRegenerate = () => {
    if (theme.trim()) {
      handleGenerate();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 lg:p-6 border-b border-slate-700/50">
        <h2 className="text-2xl font-bold text-amber-400 mb-2">Hook Generator</h2>
        <p className="text-slate-400 text-sm">Generate catchy hooks and chorus ideas for your songs</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Input Side */}
        <div className="w-full lg:w-1/2 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-700/50 flex flex-col">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Theme / Topic *</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g., lost love, making it big, late night vibes..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Any genre</option>
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Any mood</option>
                {moods.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !theme.trim()}
              className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoaderCircle size={20} className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Lightbulb size={20} className="mr-2" />
                  Generate Hooks
                </>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-400 mb-2">What makes a great hook?</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• Repetition - phrases that stick in your head</li>
              <li>• Simplicity - easy to sing along to</li>
              <li>• Emotion - makes you feel something</li>
              <li>• Uniqueness - stands out from the crowd</li>
            </ul>
          </div>
        </div>

        {/* Results Side */}
        <div className="w-full lg:w-1/2 p-4 lg:p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-300">Generated Hooks</h3>
            <div className="flex gap-2">
              {result && (
                <>
                  <button
                    onClick={handleRegenerate}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Regenerate
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            {result ? (
              <div className="text-slate-200 text-sm whitespace-pre-wrap">{result}</div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center">
                  <Lightbulb size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Enter a theme to generate hook ideas</p>
                  <p className="text-sm mt-2">Get 5 unique hooks to kickstart your song</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HookGenerator;
