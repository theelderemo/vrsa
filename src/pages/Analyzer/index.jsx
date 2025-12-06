/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle, Lock, Palette, FileText, ListCollapse, Mic, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useUser } from '../../hooks/useUser';
import { callAI } from '../../lib/api';
import { checkRateLimit, incrementUsage, RATE_LIMIT_FEATURES, DAILY_LIMITS, getRemainingUses } from '../../lib/rateLimits';

const Analyzer = () => {
  const { user, profile, loading } = useUser();
  const navigate = useNavigate();
  const [lyricsInput, setLyricsInput] = useState('');
  const [remainingAnalyses, setRemainingAnalyses] = useState(DAILY_LIMITS.ANALYZER);
  
  const isPro = profile?.is_pro === 'true';
  
  useEffect(() => {
    setRemainingAnalyses(getRemainingUses(RATE_LIMIT_FEATURES.ANALYZER, DAILY_LIMITS.ANALYZER, isPro));
  }, [isPro]);
  const [stylePaletteResult, setStylePaletteResult] = useState('');
  const [sunoTagsResult, setSunoTagsResult] = useState('');
  const [statSheetResult, setStatSheetResult] = useState('');
  const [rhymeVisualizerResult, setRhymeVisualizerResult] = useState('');
  const [isAnalyzingStylePalette, setIsAnalyzingStylePalette] = useState(false);
  const [isGeneratingSunoTags, setIsGeneratingSunoTags] = useState(false);
  const [isGeneratingStatSheet, setIsGeneratingStatSheet] = useState(false);
  const [isAnalyzingRhymes, setIsAnalyzingRhymes] = useState(false);

  // Auth check
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <LoaderCircle className="animate-spin text-indigo-400" size={48} />
      </div>
    );
  }

if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900 p-8">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-slate-400 mb-6">Please log in to access Analyzer mode.</p>
          <button
            onClick={() => navigate('/login')} // <-- FIXED
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            Log In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  const STYLE_PALETTE_PROMPT = `You are a world-class musicologist and lyric analyst. Given a set of lyrics, extract a detailed "style palette" describing:
- Main genre and subgenre
- Typical themes and emotional palette
- Word choice, imagery, and recurring motifs
- Flow, rhyme habits, and rhythmic quirks
- Persona, vocal style, and unique artist signatures

Output a concise but information-dense summary, suitable for use as a reference for ghostwriting in this style. Do not repeat the lyrics. Do not include meta commentary or apologies.`;

  const SUNO_TAG_GENERATOR_PROMPT = `You are an expert at generating Suno AI-compatible style tags. Based on the lyrical analysis provided, generate:

Genre: [primary genre with optional subgenre]
Instruments: [comma-separated list of key instruments that fit the style]
Tags: [comma-separated stylistic descriptors, mood tags, and production elements]

Keep it concise. Match the vibe of the analyzed lyrics. Output ONLY the three lines above, no additional commentary.`;

  const STAT_SHEET_PROMPT = `You are a lyrical analyst. Analyze the provided lyrics and generate a detailed "Stat-Sheet" with the following metrics:

1. **Lexical Density**: Calculate (Unique words / Total words) × 100 and express as a percentage
2. **Sentiment Analysis**: Break down the emotional content into percentages (e.g., "60% Melancholy, 25% Aggressive, 15% Reflective")
3. **Reading Level**: Estimate the grade level (e.g., "Grade 8 reading level")
4. **Banned Word Counter**: Count instances of generic/cliché words like: shadow, mirror, echo, void, abyss, whisper, silent, empty, king, queen, throne, rust, static, glitch, code, darkness, light (list any found)
5. **Additional Insights**: Note any standout linguistic patterns (alliteration frequency, average syllables per word, etc.)

Format as a clean stat sheet. Be precise with numbers.`;

  const RHYME_VISUALIZER_PROMPT = `You are a rhyme analysis expert. Analyze the provided lyrics and identify ALL rhymes, categorizing them as:

**Perfect Rhymes**: Exact sound matches (e.g., cat/hat, time/rhyme)
**Slant Rhymes**: Near-rhymes or imperfect matches (e.g., shape/keep, soul/cold)
**Internal Rhymes**: Rhymes within a single line (not just at line ends)

For each category, list the rhyming pairs/groups you found, citing the specific words. Present this as a structured analysis that helps the user understand the rhyme structure.`;

  const handleStylePaletteAnalysis = () => {
    const { canUse } = checkRateLimit(RATE_LIMIT_FEATURES.ANALYZER, DAILY_LIMITS.ANALYZER, isPro);
    if (!canUse) {
      alert('Daily limit reached. Upgrade to Studio Pass for unlimited analyses.');
      return;
    }
    
    const prompt = `${STYLE_PALETTE_PROMPT}\n\nLyrics to analyze:\n${lyricsInput}`;
    callAI(prompt, setIsAnalyzingStylePalette, (result) => {
      setStylePaletteResult(result);
      incrementUsage(RATE_LIMIT_FEATURES.ANALYZER);
      setRemainingAnalyses(getRemainingUses(RATE_LIMIT_FEATURES.ANALYZER, DAILY_LIMITS.ANALYZER, isPro));
    });
  };

  const handleGenerateSunoTags = () => {
    if (stylePaletteResult) {
      const prompt = `${SUNO_TAG_GENERATOR_PROMPT}\n\nLyrical Analysis:\n${stylePaletteResult}`;
      callAI(prompt, setIsGeneratingSunoTags, setSunoTagsResult);
    } else {
      const prompt = `${SUNO_TAG_GENERATOR_PROMPT}\n\nAnalyze these lyrics and generate appropriate tags:\n${lyricsInput}`;
      callAI(prompt, setIsGeneratingSunoTags, setSunoTagsResult);
    }
  };

  const handleGenerateStatSheet = () => {
    const prompt = `${STAT_SHEET_PROMPT}\n\nLyrics to analyze:\n${lyricsInput}`;
    callAI(prompt, setIsGeneratingStatSheet, setStatSheetResult);
  };

  const handleRhymeVisualization = () => {
    const prompt = `${RHYME_VISUALIZER_PROMPT}\n\nLyrics to analyze:\n${lyricsInput}`;
    callAI(prompt, setIsAnalyzingRhymes, setRhymeVisualizerResult);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="p-3 lg:p-6 border-b border-slate-700/50 bg-slate-900 shrink-0">
        <h2 className="text-xl lg:text-2xl font-bold text-indigo-400 mb-1">Lyric Analyzer</h2>
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-xs lg:text-sm">Paste lyrics and analyze with AI tools</p>
          {!isPro && (
            <span className="text-xs text-amber-400">
              {remainingAnalyses}/{DAILY_LIMITS.ANALYZER} analyses left today
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Panel - Input Area */}
        <div className="shrink-0 lg:shrink lg:w-1/2 p-3 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-700/50 flex flex-col max-h-[40vh] lg:max-h-none">
          <h3 className="text-base lg:text-lg font-semibold text-slate-300 mb-2 lg:mb-3">Paste Lyrics</h3>
          <textarea
            value={lyricsInput}
            onChange={(e) => setLyricsInput(e.target.value)}
            placeholder="Paste your lyrics here..."
            className="flex-1 w-full bg-slate-800 border border-slate-700 rounded-lg p-3 lg:p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-xs lg:text-sm min-h-[80px]"
          />
          <div className="mt-3 lg:mt-4 grid grid-cols-2 gap-2 lg:gap-3">
            <button
              onClick={handleStylePaletteAnalysis}
              disabled={isAnalyzingStylePalette || !lyricsInput.trim() || (!isPro && remainingAnalyses <= 0)}
              title={!isPro && remainingAnalyses <= 0 ? 'Daily limit reached' : 'Analyze style palette'}
              className="px-2 lg:px-4 py-2 lg:py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs lg:text-sm"
            >
              {isAnalyzingStylePalette ? <LoaderCircle size={16} className="animate-spin lg:mr-2" /> : <Palette size={16} className="lg:mr-2" />}
              <span className="hidden lg:inline">Style Palette</span>
              <span className="lg:hidden">Style</span>
            </button>
            <button
              onClick={isPro ? handleGenerateStatSheet : undefined}
              disabled={isGeneratingStatSheet || !lyricsInput.trim() || !isPro}
              title={!isPro ? 'Studio Pass Only' : 'Generate stat sheet'}
              className="px-2 lg:px-4 py-2 lg:py-3 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs lg:text-sm relative"
            >
              {isGeneratingStatSheet ? <LoaderCircle size={16} className="animate-spin lg:mr-2" /> : !isPro ? <Lock size={16} className="lg:mr-2" /> : <FileText size={16} className="lg:mr-2" />}
              <span className="hidden lg:inline">Stat-Sheet {!isPro && '🔒'}</span>
              <span className="lg:hidden">Stats {!isPro && '🔒'}</span>
            </button>
            <button
              onClick={isPro ? handleRhymeVisualization : undefined}
              disabled={isAnalyzingRhymes || !lyricsInput.trim() || !isPro}
              title={!isPro ? 'Studio Pass Only' : 'Analyze rhymes'}
              className="px-2 lg:px-4 py-2 lg:py-3 bg-pink-600 hover:bg-pink-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs lg:text-sm"
            >
              {isAnalyzingRhymes ? <LoaderCircle size={16} className="animate-spin lg:mr-2" /> : !isPro ? <Lock size={16} className="lg:mr-2" /> : <ListCollapse size={16} className="lg:mr-2" />}
              <span className="hidden lg:inline">Rhyme Analysis {!isPro && '🔒'}</span>
              <span className="lg:hidden">Rhymes {!isPro && '🔒'}</span>
            </button>
            <button
              onClick={isPro ? handleGenerateSunoTags : undefined}
              disabled={isGeneratingSunoTags || !lyricsInput.trim() || !isPro}
              title={!isPro ? 'Studio Pass Only' : 'Generate Suno tags'}
              className="px-2 lg:px-4 py-2 lg:py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs lg:text-sm"
            >
              {isGeneratingSunoTags ? <LoaderCircle size={16} className="animate-spin lg:mr-2" /> : !isPro ? <Lock size={16} className="lg:mr-2" /> : <Mic size={16} className="lg:mr-2" />}
              <span className="hidden lg:inline">Suno Tags {!isPro && '🔒'}</span>
              <span className="lg:hidden">Tags</span>
            </button>
          </div>
        </div>

        {/* Right Panel - Results Area */}
        <div className="flex-1 min-h-0 p-3 lg:p-6 flex flex-col overflow-hidden">
          <h3 className="text-base lg:text-lg font-semibold text-slate-300 mb-2 lg:mb-3 shrink-0">Analysis Results</h3>
          <div className="flex-1 space-y-3 lg:space-y-4 overflow-y-auto min-h-0">
            {/* Style Palette Result */}
            {stylePaletteResult && (
              <div className="bg-slate-800/50 border border-indigo-500/50 rounded-lg p-3 lg:p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-indigo-400 flex items-center text-sm lg:text-base">
                    <Palette size={14} className="mr-2" /> Style Palette
                  </h4>
                </div>
                <div className="text-slate-200 text-xs lg:text-sm prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{stylePaletteResult}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Suno Tags Result */}
            {sunoTagsResult && (
              <div className="bg-slate-800/50 border border-emerald-500/50 rounded-lg p-3 lg:p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-emerald-400 flex items-center text-sm lg:text-base">
                    <Mic size={14} className="mr-2" /> Suno Tags
                  </h4>
                </div>
                <div className="text-slate-200 text-xs lg:text-sm font-mono prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{sunoTagsResult}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Stat Sheet Result */}
            {statSheetResult && (
              <div className="bg-slate-800/50 border border-purple-500/50 rounded-lg p-3 lg:p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-purple-400 flex items-center text-sm lg:text-base">
                    <FileText size={14} className="mr-2" /> Stat-Sheet
                  </h4>
                </div>
                <div className="text-slate-200 text-xs lg:text-sm prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{statSheetResult}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Rhyme Visualizer Result */}
            {rhymeVisualizerResult && (
              <div className="bg-slate-800/50 border border-pink-500/50 rounded-lg p-3 lg:p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-pink-400 flex items-center text-sm lg:text-base">
                    <ListCollapse size={14} className="mr-2" /> Rhyme Analysis
                  </h4>
                </div>
                <div className="text-slate-200 text-xs lg:text-sm prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{rhymeVisualizerResult}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!stylePaletteResult && !sunoTagsResult && !statSheetResult && !rhymeVisualizerResult && (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center px-4">
                  <BrainCircuit size={36} className="mx-auto mb-3 opacity-50 lg:hidden" />
                  <BrainCircuit size={48} className="mx-auto mb-4 opacity-50 hidden lg:block" />
                  <p className="text-sm lg:text-base">Analysis results will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
