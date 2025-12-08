/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import RhymeFinder from './RhymeFinder';
import WordplaySuggester from './WordplaySuggester';
import HookGenerator from './HookGenerator';

const WritingTools = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTool = searchParams.get('tool') || 'rhyme-finder';

  useEffect(() => {
    document.title = 'Writing Tools - Analyzer & Rhyme Finder | VRS/A';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Analyze lyrics, find rhymes, generate hooks, and explore wordplay. Style Palette, Stat-Sheet analysis, 13-mode Word Finder, and more.');
    }
  }, []);

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
          <p className="text-slate-400 mb-6">Please log in to access Writing Tools.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            Log In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'rhyme-finder':
        return <RhymeFinder />;
      case 'wordplay':
      case 'wordplay-suggester':
        return <WordplaySuggester />;
      case 'hook-generator':
        return <HookGenerator />;
      default:
        return <RhymeFinder />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-slate-900">
      {/* Active Tool Content */}
      <div className="flex-1 overflow-hidden">
        {renderActiveTool()}
      </div>
    </div>
  );
};

export default WritingTools;
