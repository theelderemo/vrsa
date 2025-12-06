/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle, Wrench } from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import WritingToolsDock from '../../components/ui/WritingToolsDock';
import Analyzer from '../Analyzer';
import RhymeFinder from './RhymeFinder';
import WordplaySuggester from './WordplaySuggester';
import HookGenerator from './HookGenerator';

const WritingTools = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState('analyzer');

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

  const handleToolSelect = (toolId) => {
    if (toolId !== 'more') {
      setActiveTool(toolId);
    }
  };

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'analyzer':
        return <Analyzer />;
      case 'rhyme-finder':
        return <RhymeFinder />;
      case 'wordplay':
        return <WordplaySuggester />;
      case 'hook-generator':
        return <HookGenerator />;
      default:
        return <Analyzer />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-slate-900">
      {/* Dock at the top */}
      <div className="p-4 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-3">
            <Wrench size={20} className="text-indigo-400 mr-2" />
            <h1 className="text-lg font-semibold text-slate-300">Writing Tools</h1>
          </div>
          <WritingToolsDock activeTool={activeTool} onToolSelect={handleToolSelect} />
        </div>
      </div>

      {/* Active Tool Content */}
      <div className="flex-1 overflow-hidden">
        {renderActiveTool()}
      </div>
    </div>
  );
};

export default WritingTools;
