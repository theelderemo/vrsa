/**
 * MIT License
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { LoaderCircle, PenTool, Music } from 'lucide-react';

const Tools = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Tools - Writing & Audio Tools | VRS/A';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Access writing tools for lyrics analysis and audio tools for music processing.');
    }
  }, []);

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
          <p className="text-slate-400 mb-6">Please log in to access Tools.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Tools</h1>
          <p className="text-xl text-slate-400">Choose your creative toolkit</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Writing Tools */}
          <div 
            onClick={() => navigate('/writing-tools')}
            className="group cursor-pointer bg-slate-800 border border-slate-700 rounded-xl p-8 hover:border-indigo-500 hover:bg-slate-800/80 transition-all duration-200"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-4">
                <PenTool size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Writing Tools</h2>
            </div>
            
            <p className="text-slate-400 mb-6">
              Analyze lyrics, find rhymes, generate hooks, and explore wordplay with our comprehensive writing toolkit.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Lyrics Analyzer
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Rhyme Finder
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Wordplay Suggester
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Hook Generator
              </div>
            </div>
          </div>

          {/* Audio Tools */}
          <div 
            onClick={() => navigate('/audio-tools')}
            className="group cursor-pointer bg-slate-800 border border-slate-700 rounded-xl p-8 hover:border-purple-500 hover:bg-slate-800/80 transition-all duration-200"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <Music size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Audio Tools</h2>
            </div>
            
            <p className="text-slate-400 mb-6">
              Analyze and process your audio files to extract metadata and gain insights from your music tracks.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Audio Analyzer
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                More tools coming soon...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;