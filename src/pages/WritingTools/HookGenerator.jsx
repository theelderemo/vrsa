/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle, RefreshCw, Lock, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { callAIMultiple } from '../../lib/api';
import { useUser } from '../../hooks/useUser';
import { checkRateLimit, incrementUsage, RATE_LIMIT_FEATURES, getRemainingUses } from '../../lib/rateLimits';

const HookGenerator = () => {
  const { user, profile, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const isPro = profile?.is_pro === 'true';
  
  const [theme, setTheme] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(-1);
  const [rateLimit, setRateLimit] = useState({ canUse: true, remaining: 1 });

  useEffect(() => {
    const limit = checkRateLimit(RATE_LIMIT_FEATURES.HOOK_GENERATOR, 1, isPro);
    setRateLimit(limit);
  }, [isPro]);

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

  const SYSTEM_PROMPT = `You are a hook generator. You output ONLY song hooks/choruses. You NEVER write conversational text.

CRITICAL RULES:
- Start output IMMEDIATELY with the hook title in bold: **Title Here**
- NEVER begin with "Absolutely", "Here's", "Sure", or ANY greeting
- NEVER end with "Let me know", "Hope this helps", or ANY closing remark
- Output format: **Title** → lyrics (4-8 lines) → *Melodic notes: brief description*
- NO commentary outside this format`;

  const handleGenerate = async () => {
    if (!theme.trim()) return;
    
    // Check rate limit for free users
    if (!isPro && !rateLimit.canUse) {
      return;
    }
    
    setLoading(true);
    setHooks([]);
    
    try {
      let userPrompt = `Theme: "${theme}"`;
      if (genre) userPrompt += `\nGenre: ${genre}`;
      if (mood) userPrompt += `\nMood: ${mood}`;
      userPrompt += `\n\nGenerate 1 hook. Start immediately with **Title** - no intro text.`;
      
      // Pro users get 4 real hooks, free users get 1 real hook
      const count = isPro ? 4 : 1;
      const results = await callAIMultiple(SYSTEM_PROMPT, userPrompt, count, { temperature: 0.95, top_p: 0.95 });
      
      // For free users, add 3 mock blurred hooks
      if (!isPro) {
        const mockHooks = [
          "**Feel The Fire**\n\nTurn it up, feel the vibe,\nWe on fire, we alive,\nNo looking back, it's our time,\nTurn it up, feel the vibe!\n\n*Melodic notes: High-energy chant with ascending melody on 'alive' - perfect for crowd participation.*",
          "**All Night Long**\n\nAll night long we gonna shine,\nCatch the rhythm, feel the grind,\nHearts racing, stars align,\nAll night long we gonna shine!\n\n*Melodic notes: Repetitive hook with syncopated rhythm - builds intensity with each repetition.*",
          "**Don't Let Go**\n\nTake my hand, don't let go,\nThrough the highs and through the low,\nWe're unstoppable, let it show,\nTake my hand, don't let go!\n\n*Melodic notes: Anthemic progression with powerful vocal climax on final line.*"
        ];
        setHooks([...results, ...mockHooks]);
      } else {
        setHooks(results);
      }
      
      // Increment usage for free users
      if (!isPro) {
        incrementUsage(RATE_LIMIT_FEATURES.HOOK_GENERATOR);
        const newLimit = checkRateLimit(RATE_LIMIT_FEATURES.HOOK_GENERATOR, 1, isPro);
        setRateLimit(newLimit);
      }
    } catch (error) {
      console.error('Hook generation error:', error);
      setHooks([`An error occurred: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (theme.trim() && (isPro || rateLimit.canUse)) {
      handleGenerate();
    }
  };

  const handleCopy = (index) => {
    navigator.clipboard.writeText(hooks[index]);
    setCopied(index);
    setTimeout(() => setCopied(-1), 2000);
  };

  // Loading state
  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <LoaderCircle className="animate-spin text-amber-400" size={48} />
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
              disabled={loading || !theme.trim() || (!isPro && !rateLimit.canUse)}
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
            {!isPro && (
              <p className="text-xs text-slate-500 mt-2 text-center">
                {rateLimit.canUse ? '1 free generation per day' : 'Daily limit reached. Upgrade for unlimited generations.'}
              </p>
            )}
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
            <h3 className="text-base lg:text-lg font-semibold text-slate-300">Generated Hooks ({isPro ? '4' : '1 visible, 3 locked'})</h3>
            <div className="flex gap-1 lg:gap-2">
              {hooks.length > 0 && (
                <button
                  onClick={handleRegenerate}
                  disabled={loading || (!isPro && !rateLimit.canUse)}
                  className="flex items-center gap-1 px-2 lg:px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs lg:text-sm transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                  <span className="hidden lg:inline">Regenerate</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto min-h-0">
            {hooks.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                {hooks.map((hook, index) => {
                  const isLocked = !isPro && index > 0;
                  return (
                    <div
                      key={index}
                      className={`relative bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 lg:p-4 ${
                        isLocked ? 'overflow-hidden' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-amber-400">Hook #{index + 1}</span>
                        {!isLocked && (
                          <button
                            onClick={() => handleCopy(index)}
                            className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                          >
                            {copied === index ? '✓ Copied' : 'Copy'}
                          </button>
                        )}
                      </div>
                      <div className={`text-slate-200 text-xs lg:text-sm prose prose-invert prose-sm max-w-none ${
                        isLocked ? 'blur-sm select-none' : ''
                      }`}>
                        <ReactMarkdown>{hook}</ReactMarkdown>
                      </div>
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm rounded-lg">
                          <div className="text-center p-4">
                            <Lock size={24} className="mx-auto mb-2 text-amber-400" />
                            <p className="text-sm font-semibold text-white mb-1">Upgrade to Unlock</p>
                            <button
                              onClick={() => navigate('/studio-pass')}
                              className="mt-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded transition-colors inline-flex items-center gap-1"
                            >
                              <Sparkles size={12} />
                              Studio Pass
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center px-4">
                  <p className="text-sm lg:text-base">Enter a theme to generate hook ideas</p>
                  <p className="text-xs lg:text-sm mt-2 text-slate-600">Get 4 unique hooks to kickstart your song</p>
                  {!isPro && (
                    <p className="text-xs text-amber-400 mt-3">🎁 Try 1 free generation (resets daily)</p>
                  )}
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
