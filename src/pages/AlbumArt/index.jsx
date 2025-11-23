import React, { useState } from 'react';
import { LoaderCircle, Image, User, Type } from 'lucide-react';
import * as Sentry from "@sentry/react";
import { useUser } from '../../hooks/useUser';
import { IMAGE_GENERATOR_OPTIONS } from '../../lib/constants';

const AlbumArt = () => {
  const { user, profile, loading } = useUser();
  const [activeGenerator, setActiveGenerator] = useState('album-cover');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(IMAGE_GENERATOR_OPTIONS[0].id);

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
          <p className="text-slate-400 mb-6">Please log in to access Album Art generation.</p>
          <button
            onClick={() => window.location.href = '/#login'}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            Log In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <LoaderCircle className="animate-spin text-indigo-400" size={48} />
      </div>
    );
  }

  const generators = [
    {
      id: 'album-cover',
      name: 'Album Cover',
      icon: Image,
      description: 'Generate unique album cover art',
      systemMessage: 'Create a professional design based on the following description. Focus on visual impact, color harmony, and artistic composition.'
    },
    {
      id: 'artist-avatar',
      icon: User,
      name: 'Artist Avatar',
      description: 'Create consistent artist personas',
      systemMessage: 'Generate a profile picture for an artist based on the following description. Create a consistent, recognizable persona that captures the artist\'s style and personality.'
    },
    {
      id: 'band-logo',
      icon: Type,
      name: 'Band Logo',
      description: 'Design customizable band/artist logos',
      systemMessage: 'Design a professional band or artist logo based on the following description. Focus on typography, symbolism, and visual identity that represents the artist\'s brand and musical style.'
    }
  ];

  const activeGeneratorData = generators.find(g => g.id === activeGenerator);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    // Check premium access for premium models
    const selectedModelData = IMAGE_GENERATOR_OPTIONS.find(m => m.id === selectedModel);
    if (selectedModelData?.premium && profile.is_pro !== 'true') {
      setError('This model requires a premium subscription');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const azureKey = import.meta.env.VITE_AZURE_OPENAI_KEY;

      if (!azureKey) {
        throw new Error('Azure OpenAI credentials not configured');
      }

      // Combine system message with user prompt
      const fullPrompt = `${activeGeneratorData.systemMessage}\n\n${prompt}`;

      const response = await fetch(`https://chris-mfvtydwh-swedencentral.cognitiveservices.azure.com/openai/deployments/${selectedModel}/images/generations?api-version=2024-02-01`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureKey
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          n: 1,
          size: '1024x1024'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate image');
      }

      const data = await response.json();
      console.log('Azure response:', data); // Debug log
      
      // Try different possible response structures
      let imageUrl = null;
      if (data.data && data.data[0]?.url) {
        imageUrl = data.data[0].url;
      } else if (data.data && data.data[0]?.b64_json) {
        imageUrl = `data:image/png;base64,${data.data[0].b64_json}`;
      } else if (data.result && data.result.data && data.result.data[0]?.url) {
        imageUrl = data.result.data[0].url;
      }
      
      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        console.error('Unexpected response structure:', data);
        throw new Error('No image URL in response. Check console for details.');
      }

    } catch (err) {
      console.error('Image generation error:', err);
      setError(err.message || 'Failed to generate image');
      Sentry.captureException(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 p-4">
        <h1 className="text-2xl font-bold mb-2">Album Art Generator</h1>
        <p className="text-slate-400 text-sm">Create stunning visuals for your music</p>
      </div>

      {/* Generator Type Selection */}
      <div className="border-b border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {generators.map((gen) => {
            const Icon = gen.icon;
            return (
              <button
                key={gen.id}
                onClick={() => setActiveGenerator(gen.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  activeGenerator === gen.id
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`flex-shrink-0 ${activeGenerator === gen.id ? 'text-indigo-400' : 'text-slate-400'}`} size={24} />
                  <div>
                    <h3 className="font-semibold mb-1">{gen.name}</h3>
                    <p className="text-sm text-slate-400">{gen.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Model Selection */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium mb-2">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {IMAGE_GENERATOR_OPTIONS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} {model.premium ? 'Studio Pass' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Prompt Input */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <label className="block text-sm font-medium mb-2">
              Describe your {activeGeneratorData.name.toLowerCase()}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Example: A dark, moody album cover featuring abstract geometric shapes in deep purple and black tones...`}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[120px] resize-y"
              disabled={isGenerating}
            />
            <div className="mt-3 flex justify-between items-center">
              <p className="text-xs text-slate-500">
                Tip: Be specific about style, colors, mood, and composition
              </p>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <LoaderCircle className="animate-spin" size={18} />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Generated Image Display */}
          {generatedImage && (
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Generated {activeGeneratorData.name}</h3>
              <div className="relative">
                <img
                  src={generatedImage}
                  alt="Generated artwork"
                  className="w-full rounded-lg shadow-2xl"
                />
                <div className="mt-4 flex gap-3">
                  <a
                    href={generatedImage}
                    download="album-art.png"
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors text-center"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => {
                      setGeneratedImage(null);
                      setPrompt('');
                    }}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Generate New
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Info Panel */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h3 className="font-semibold mb-2 text-indigo-400">About {activeGeneratorData.name} Generator</h3>
            <p className="text-sm text-slate-400">
              {activeGeneratorData.systemMessage}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AlbumArt;
