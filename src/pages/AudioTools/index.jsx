/**
 * MIT License
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import AudioAnalyzer from './AudioAnalyzer';

const AudioTools = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTool] = useState(searchParams.get('tool') || 'audio-analyzer');

  useEffect(() => {
    document.title = 'Audio Tools - Audio Analyzer | VRS/A';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Analyze audio files, extract metadata, and get insights from your music tracks.');
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
          <p className="text-slate-400 mb-6">Please log in to access Audio Tools.</p>
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

  // Render the active tool
  const renderActiveTool = () => {
    switch (activeTool) {
      case 'audio-analyzer':
        return <AudioAnalyzer />;
      default:
        return <AudioAnalyzer />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Audio Tools</h1>
          <p className="text-slate-400">Analyze and process your audio files</p>
        </div>
        
        {renderActiveTool()}
      </div>
    </div>
  );
};

export default AudioTools;