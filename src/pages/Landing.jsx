import React from 'react';

const Landing = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-5xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-sm px-6 py-3 rounded-full border border-indigo-500/30">
              <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                VRS/A
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              AI-Powered Lyrical
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Co-Writing Studio
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Paste lyrics or start from scratch. Analyze, deconstruct, and create with advanced AI tools: Style Palette, Suno AI Tag Generator, Stat-Sheet, and Rhyme Visualizer. Always free, always private.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button
              onClick={() => setCurrentPage('ghostwriter')}
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/50"
            >
              Start with Ghostwriter
            </button>
            <button
              onClick={() => setCurrentPage('analyzer')}
              className="group px-8 py-4 bg-slate-800/80 backdrop-blur-sm border-2 border-indigo-500/50 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-slate-800 hover:border-indigo-400 hover:scale-105"
            >
              Try Analyzer Mode
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Ghostwriter Card */}
          <div className="group relative bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
            <div className="pt-8">
              <h3 className="text-2xl font-bold mb-4 text-indigo-300">Ghostwriter Mode</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Chat-based interface for rapid lyrical generation. Provide structured inputs like artist name, 
                theme, mood, and rhyme schemes. The AI channels your chosen artist's DNA to create authentic, 
                unreleased-quality lyrics in seconds.
              </p>
              <ul className="space-y-3 text-slate-400">
                <li>Structured input form for precision control</li>
                <li>Advanced rhyme scheme selection</li>
                <li>Adjustable temperature and creativity settings</li>
              </ul>
            </div>
          </div>

          {/* Analyzer Card */}
          <div className="group relative bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
            <div className="pt-8">
              <h3 className="text-2xl font-bold mb-4 text-purple-300">Analyzer Mode</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Deconstruct and analyze existing lyrics with powerful AI tools. Paste any lyrics to extract style palettes, 
                generate Suno AI tags, calculate lyrical statistics, and visualize rhyme patterns. Perfect for understanding 
                what makes great lyrics work.
              </p>
              <ul className="space-y-3 text-slate-400">
                <li>✓ Lyrical DNA extraction (Style Palette)</li>
                <li>✓ Suno AI-compatible tag generation</li>
                <li>✓ Detailed stat-sheets with metrics</li>
                <li>✓ Rhyme pattern visualization and analysis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold mb-12 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Powered by Advanced AI. Always Free. No Ads. No Tracking.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Landing;
