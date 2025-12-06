/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle, RefreshCw, Lock } from 'lucide-react';
import { callAI } from '../../lib/api';
import { useUser } from '../../hooks/useUser';

const HookGenerator = () => {
  const { user, profile, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const isPro = profile?.is_pro === 'true';
  
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
    if (!theme.trim() || !isPro) return;
    
    let prompt = `${HOOK_PROMPT}\n\nTheme/Topic: "${theme}"`;
    if (genre) prompt += `\nGenre: ${genre}`;
    if (mood) prompt += `\nMood: ${mood}`;
    
    callAI(prompt, setLoading, setResult, { temperature: 0.95, top_p: 0.95 });
  };

  const handleRegenerate = () => {
    if (theme.trim() && isPro) {
      handleGenerate();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading state
  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <LoaderCircle className="animate-spin text-amber-400" size={48} />
      </div>
    );
  }

  // Pro-only gate
  if (!isPro) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900 p-8">
        <div className="max-w-md text-center">
          <Lock size={48} className="mx-auto mb-4 text-amber-400 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-4">Studio Pass Required</h2>
          <p className="text-slate-400 mb-6">Hook Generator is a premium feature. Upgrade to Studio Pass to unlock AI-powered hook generation.</p>
          <button
            onClick={() => navigate('/studio-pass')}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
          >
            Get Studio Pass
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="p-3 lg:p-6 border-b border-slate-700/50 bg-slate-900 shrink-0">
        <h2 className="text-xl lg:text-2xl font-bold text-amber-400 mb-1">Hook Generator</h2>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Input Side - Compact on mobile */}
        <div className="shrink-0 lg:shrink lg:w-1/2 p-3 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-700/50 flex flex-col max-h-[40vh] lg:max-h-none overflow-y-auto">
          <div className="space-y-3 lg:space-y-4">
            <div>
              <label className="block text-xs lg:text-sm font-medium text-slate-300 mb-1 lg:mb-2">Theme / Topic *</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g., lost love, making it big..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 lg:gap-0 lg:grid-cols-1 lg:space-y-4">
              <div>
                <label className="block text-xs lg:text-sm font-medium text-slate-300 mb-1 lg:mb-2">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 lg:px-4 lg:py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs lg:text-sm"
                >
                  <option value="">Any</option>
                  {genres.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs lg:text-sm font-medium text-slate-300 mb-1 lg:mb-2">Mood</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 lg:px-4 lg:py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs lg:text-sm"
                >
                  <option value="">Any</option>
                  {moods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !theme.trim()}
              className="w-full px-4 py-2 lg:py-3 bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin mr-2" />
                  <span className="hidden lg:inline">Generating...</span>
                  <span className="lg:hidden">...</span>
                </>
              ) : (
                <>
                  <span className="hidden lg:inline">Generate Hooks</span>
                  <span className="lg:hidden">Generate</span>
                </>
              )}
            </button>
          </div>

          <div className="hidden lg:block mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
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
        <div className="flex-1 min-h-0 p-3 lg:p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2 lg:mb-3 shrink-0">
            <h3 className="text-base lg:text-lg font-semibold text-slate-300">Generated Hooks</h3>
            <div className="flex gap-1 lg:gap-2">
              {result && (
                <>
                  <button
                    onClick={handleRegenerate}
                    disabled={loading}
                    className="flex items-center gap-1 px-2 lg:px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs lg:text-sm transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                    <span className="hidden lg:inline">Regenerate</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2 lg:px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs lg:text-sm transition-colors"
                  >
                    <span className="hidden lg:inline">{copied ? 'Copied!' : 'Copy'}</span>
                    <span className="lg:hidden">{copied ? '✓' : 'Copy'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 lg:p-4 min-h-0">
            {result ? (
              <div className="text-slate-200 text-xs lg:text-sm whitespace-pre-wrap">{result}</div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center px-4">
                  <p className="text-sm lg:text-base">Enter a theme to generate hook ideas</p>
                  <p className="text-xs lg:text-sm mt-2 text-slate-600">Get 5 unique hooks to kickstart your song</p>
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
