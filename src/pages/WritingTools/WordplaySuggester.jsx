/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle, Lock, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { callAIWithSystem } from '../../lib/api';
import { useUser } from '../../hooks/useUser';
import { checkRateLimit, incrementUsage, RATE_LIMIT_FEATURES, getRemainingUses } from '../../lib/rateLimits';

const WordplaySuggester = () => {
  const { user, profile, loading } = useUser();
  const navigate = useNavigate();
  const isPro = profile?.is_pro === 'true';
  
  const [word, setWord] = useState('');
  const [context, setContext] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rateLimit, setRateLimit] = useState({ canUse: true, remaining: 1 });

  useEffect(() => {
    const limit = checkRateLimit(RATE_LIMIT_FEATURES.WORDPLAY_SUGGESTER, 1, isPro);
    setRateLimit(limit);
  }, [isPro]);

  const SYSTEM_PROMPT = `You are a wordplay generator. You output ONLY formatted wordplay suggestions. You NEVER write conversational text.

CRITICAL RULES:
- Start output IMMEDIATELY with "**Double Meanings**"
- NEVER begin with "Absolutely", "Here are", "Let's", "Sure", or ANY greeting
- NEVER end with "Let me know", "Hope this helps", or ANY closing remark
- Output ONLY the 5 category sections with examples
- NO commentary, NO explanations outside the examples`;

  const handleGenerate = () => {
    if (!word.trim()) return;
    
    // Check rate limit for free users
    if (!isPro && !rateLimit.canUse) {
      return;
    }
    
    let userPrompt = `Word: "${word}"`;
    if (context.trim()) {
      userPrompt += `\nContext: ${context}`;
    }
    userPrompt += `\n\nGenerate wordplay for this word in these 5 categories:\n**Double Meanings**\n**Puns**\n**Homophones**\n**Metaphors**\n**Slang**\n\nFor each category, give 3-4 lyric examples. Start immediately with **Double Meanings** - no intro text.`;
    
    callAIWithSystem(SYSTEM_PROMPT, userPrompt, setIsLoading, setResult, { temperature: 0.9, top_p: 0.95 });
    
    // Increment usage for free users
    if (!isPro) {
      incrementUsage(RATE_LIMIT_FEATURES.WORDPLAY_SUGGESTER);
      const newLimit = checkRateLimit(RATE_LIMIT_FEATURES.WORDPLAY_SUGGESTER, 1, isPro);
      setRateLimit(newLimit);
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <LoaderCircle className="animate-spin text-purple-400" size={48} />
      </div>
    );
  }

  // Parse result sections for freemium preview
  const parseSections = (text) => {
    if (!text) return [];
    
    // Split by section headers (e.g., "**Double Meanings**:")
    const sectionRegex = /\*\*([^*]+)\*\*:?/g;
    const matches = [];
    let match;
    
    while ((match = sectionRegex.exec(text)) !== null) {
      matches.push({
        title: match[1].trim(),
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }
    
    if (matches.length === 0) return [];
    
    const sections = [];
    for (let i = 0; i < matches.length; i++) {
      const currentMatch = matches[i];
      const nextMatch = matches[i + 1];
      
      // Extract content between this match and the next (or end of text)
      const contentStart = currentMatch.endIndex;
      const contentEnd = nextMatch ? nextMatch.startIndex : text.length;
      const content = text.substring(contentStart, contentEnd).trim();
      
      // Only add sections that have actual content
      if (content && content.length > 10) {
        sections.push({
          title: currentMatch.title,
          content: content
        });
      }
    }
    
    return sections;
  };

  const sections = parseSections(result);
  const showFreemiumPreview = !isPro && result && sections.length > 1;

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="p-3 lg:p-6 border-b border-slate-700/50 bg-slate-900 shrink-0">
        <h2 className="text-xl lg:text-2xl font-bold text-purple-400 mb-1">Wordplay Suggester</h2>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Input Side - Compact on mobile */}
        <div className="shrink-0 lg:shrink lg:w-1/2 p-3 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-700/50 flex flex-col max-h-[35vh] lg:max-h-none">
          <div className="space-y-3 lg:space-y-4">
            <div>
              <label className="block text-xs lg:text-sm font-medium text-slate-300 mb-1 lg:mb-2">Word or Phrase</label>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., heart, cold, fire, cash..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div className="hidden lg:block">
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
              disabled={isLoading || !word.trim() || (!isPro && !rateLimit.canUse)}
              className="w-full px-4 py-2 lg:py-3 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
            >
              {isLoading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin mr-2" />
                  <span className="hidden lg:inline">Generating...</span>
                  <span className="lg:hidden">...</span>
                </>
              ) : (
                <>
                  <span className="hidden lg:inline">Generate Wordplay</span>
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
            <h4 className="text-sm font-semibold text-slate-400 mb-2">Pro Tips</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• Try common words like "heart", "cold", "fire" for rich wordplay</li>
              <li>• Add context to get more relevant suggestions</li>
              <li>• Combine multiple suggestions for layered meanings</li>
            </ul>
          </div>
        </div>

        {/* Results Side */}
        <div className="flex-1 min-h-0 p-3 lg:p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2 lg:mb-3 shrink-0">
            <h3 className="text-base lg:text-lg font-semibold text-slate-300">Results</h3>
            {result && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 lg:px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs lg:text-sm transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 lg:p-4 min-h-0">
            {result ? (
              <div className="text-slate-200 text-xs lg:text-sm space-y-4">
                {showFreemiumPreview ? (
                  <>
                    {/* First section - visible to free users */}
                    <div>
                      <div className="font-bold text-purple-400 mb-2">{sections[0].title}</div>
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{sections[0].content}</ReactMarkdown>
                      </div>
                    </div>
                    
                    {/* Blurred remaining sections with upgrade CTA */}
                    <div className="relative">
                      <div className="blur-sm select-none pointer-events-none opacity-60 space-y-4">
                        {sections.slice(1).map((section, i) => (
                          <div key={i}>
                            <div className="font-bold text-purple-400 mb-2">{section.title}</div>
                            <div className="prose prose-invert prose-sm max-w-none">
                              <ReactMarkdown>{section.content}</ReactMarkdown>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                        <div className="text-center p-6 max-w-sm">
                          <Lock size={32} className="mx-auto mb-3 text-purple-400" />
                          <h3 className="text-lg font-bold text-white mb-2">{sections.length - 1}+ More Categories Hidden</h3>
                          <p className="text-slate-400 text-sm mb-4">
                            Unlock all wordplay suggestions plus unlimited daily generations
                          </p>
                          <button
                            onClick={() => navigate('/studio-pass')}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
                          >
                            <Sparkles size={16} />
                            Upgrade to Studio Pass
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center px-4">
                  <p className="text-sm lg:text-base">Enter a word to get wordplay suggestions</p>
                  <p className="text-xs lg:text-sm mt-2 text-slate-600">Perfect for finding clever double meanings</p>
                  {!isPro && (
                    <p className="text-xs text-purple-400 mt-3">🎁 Try 1 free generation (resets daily)</p>
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

export default WordplaySuggester;
