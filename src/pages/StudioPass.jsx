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

import React from 'react';


const StudioPass = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-sm px-6 py-3 rounded-full border border-indigo-500/50 mb-6">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Studio Pass
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Support Development.
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Unlock Premium Tools.
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            VRS/A is free and always will be. Studio Pass keeps the lights on, unlocks the expensive AI models, 
            and gives you access to premium tools like the Wordplay Suggester and Hook Generator. 
            Think of it as buying me a coffee, except the coffee gets you access to Claude Opus and GPT 5.1.
          </p>
        </div>

        {/* What You Get */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-indigo-500/30 mb-12">
          <h2 className="text-3xl font-bold text-indigo-300 mb-6">
    What You Get Right Now
  </h2>

  <div className="grid md:grid-cols-2 gap-6">
    {/* Premium Card */}
    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
      <h3 className="text-xl font-semibold text-purple-300 mb-3">
        Premium Tier Models
      </h3>
      <ul className="space-y-2 text-slate-300">
        <li className="flex items-start gap-2">
          <span className="text-indigo-400 mt-1">•</span>
          <span><strong>GPT 5.1</strong> - Next-gen flagship intelligence</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-indigo-400 mt-1">•</span>
          <span><strong>Claude Sonnet 4.5</strong> - State-of-the-art reasoning & creative writing</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-indigo-400 mt-1">•</span>
          <span><strong>Claude 3 Opus</strong> - The creative powerhouse, legendary for lyrics</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-indigo-400 mt-1">•</span>
          <span><strong>DeepSeek R1 0528</strong> - Advanced reasoning snapshot</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-indigo-400 mt-1">•</span>
          <span><strong>GPT 4.1</strong> - Reliable workhorse model</span>
        </li>
      </ul>
    </div>

    {/* Standard/Free Card */}
    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
      <h3 className="text-xl font-semibold text-emerald-300 mb-3">
        Standard Access (Free)
      </h3>
      <ul className="space-y-2 text-slate-300">
        <li className="flex items-start gap-2">
          <span className="text-emerald-400 mt-1">•</span>
          <span><strong>gpt-4o</strong> - Fast, capable, and free</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-emerald-400 mt-1">•</span>
          <span><strong>gpt-4o-mini</strong> - Lightning fast responses</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-emerald-400 mt-1">•</span>
          <span><strong>DeepSeek R1</strong> - Optimized reasoning engine</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-emerald-400 mt-1">•</span>
          <span><strong>DeepSeek V3.1</strong> - Balanced open-weight performance</span>
        </li>
      </ul>
    </div>

            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">
                Premium Image Generation
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span><strong>Flux 1.1 Pro</strong> - High-quality album covers, avatars, logos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>1024x1024 resolution output</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>Unlimited generations (fair use)</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">
                Premium Writing Tools
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span><strong>Wordplay Suggester</strong> - Double meanings, puns, slang alternatives</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span><strong>Hook Generator</strong> - 5 unique hook/chorus ideas per query</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span><strong>Unlimited Analyzer</strong> - No daily limits on analysis tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span><strong>Unlimited Word Finder</strong> - No daily limits on rhyme searches</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">
                Custom AI Prompts
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>Click any line and prompt the AI directly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>"Make it more metaphorical" or "add a sports reference"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>AI has full song context when suggesting edits</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
              <h3 className="text-xl font-semibold text-purple-300 mb-3">
                Priority Support
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>Your feature requests go to the top of the list</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>Direct line to me in Discord</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>Beta access to new features</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* What's Coming */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 mb-12">
          <h2 className="text-3xl font-bold text-purple-300 mb-6">
            What's Coming (Studio Pass Only)
          </h2>
          
          <div className="space-y-6 text-slate-300">
            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
              <h3 className="text-lg font-semibold text-indigo-300 mb-2">🎯 Genius Grounding</h3>
              <p className="mb-2">
                329k song dataset. When you say "write like Kendrick," it'll actually 
                pull real examples instead of guessing. Vector embeddings + Azure AI Search.
              </p>
              <p className="text-sm text-slate-400">
                Will include attribution ("this flow pattern shows up in 47 songs") so we're not accidentally plagiarizing.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
              <h3 className="text-lg font-semibold text-indigo-300 mb-2">🤖 Multi-Agent Writing</h3>
              <p className="mb-2">
                Specialized agents instead of one generic AI: verse agent, hook agent, editor agent, flow coach, 
                copyright scanner. Let them "debate" and show you ranked options.
              </p>
              <p className="text-sm text-slate-400">
                Imagine three different AIs arguing about whether your bar is fire or mid.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
              <h3 className="text-lg font-semibold text-indigo-300 mb-2">🎵 Suno Integration (Beta)</h3>
              <p className="mb-2">
                Lyrics → actual music generation. You bring your own Suno tokens, we provide an edge function proxy.
                Generate full tracks from your lyrics using Suno's powerful models right inside VRS/A.
              </p>
              <p className="text-sm text-slate-400">
                Legal gray area since it's unofficial API. Will be clearly labeled as beta/experimental.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
              <h3 className="text-lg font-semibold text-indigo-300 mb-2">🎬 Visual Generation Upgrades</h3>
              <p className="mb-2">
                Social media assets, music video storyboards, Spotify canvas (8sec loops), vinyl mockups, 
                tour posters, lyric typography art.
              </p>
              <p className="text-sm text-slate-400">
                Maybe even full AI music videos via Azure if the budget allows.
              </p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700/50">
              <h3 className="text-lg font-semibold text-indigo-300 mb-2">🎼 Audio Tools</h3>
              <p className="mb-2">
                MIDI export from lyric cadence, BPM analyzer, chord progression suggestions, stem separation, 
                voice cloning (Azure voice models for demos), beat marketplace.
              </p>
              <p className="text-sm text-slate-400">
                Upload a track, isolate vocals. Or clone your voice for quick demos.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-indigo-900/30 border border-indigo-500/50 rounded-lg">
            <p className="text-slate-300 text-sm">
              <strong className="text-indigo-300">Reality Check:</strong> These features are expensive to run. 
              GPU time costs real money. Studio Pass pays for Azure compute credits, AI API calls, and storage. 
              The more members, the faster I can ship these.
            </p>
          </div>
        </div>

        {/* The Honest Truth */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-12">
          <h2 className="text-3xl font-bold text-slate-200 mb-6">The Honest Truth</h2>
          
          <div className="space-y-4 text-slate-300">
            <p>
              <strong className="text-indigo-300">This isn't a subscription.</strong> It's a Buy Me a Coffee membership. 
              You're supporting development, not buying a guaranteed service level. If Azure's API goes down at 3am, 
              I'm probably asleep.
            </p>
            
            <p>
              <strong className="text-indigo-300">Refunds are rare.</strong> This is a donation/support tier. 
              If you have a legitimate issue (charged twice, feature doesn't work), email me and I'll make it right. 
              If you just changed your mind, probably not.
            </p>
            
            <p>
              <strong className="text-indigo-300">Free tier isn't going anywhere.</strong> Core features (Ghostwriter, Analyzer, 
              basic models) stay free forever. Studio Pass unlocks the stuff that costs me money to run.
            </p>
            
            <p>
              <strong className="text-indigo-300">I'm one person.</strong> Not a team. Not a startup. Just me. Your support literally keeps this alive.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Support?</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Join Studio Pass and help fund the next generation of AI-powered music creation tools. 
            Plus you get the expensive models.
          </p>
          <a
            href="https://buymeacoffee.com/theelderemo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Get Studio Pass →
          </a>
          <p className="text-indigo-200 text-sm mt-4">
            After subscribing, your account will be upgraded instantly. If you have any problems, email me at support@vrsa.app or join me on discord.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-12 text-center">
          <p className="text-slate-400">
            Questions? Hit me up in{' '}
            <a
              href="https://discord.gg/FQ6XGNf53P"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Discord
            </a>{' '}
            or email{' '}
            <a
              href="mailto:support@vrsa.com"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              support@vrsa.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudioPass;
