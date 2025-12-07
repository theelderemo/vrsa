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

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Guide = () => {
  useEffect(() => {
    document.title = 'Guide - How to Use VRS/A | VRS/A';
  }, []);

  return (
  <div className="flex flex-col items-center justify-center min-h-full bg-slate-900 p-8">
    <div className="max-w-4xl w-full bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700/50">
      <h1 className="text-3xl font-bold text-indigo-400 mb-4">How To Use This Thing</h1>
      
      <p className="text-slate-300 mb-4">So you found VRS/A. Cool. This is a lyric generator built by one person who got tired of generic AI outputs. It runs on a shoestring budget and works way better if you actually tell it what you want instead of being vague.</p>

      <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-lg mb-6">
        <h3 className="text-indigo-300 font-bold mb-1">Studio Pass</h3>
        <p className="text-slate-400 text-sm">
          The expensive AI models (GPT 5.1, Claude Sonnet 4.5, Claude 3 Opus, DeepSeek R1 0528) plus premium tools (Wordplay Suggester, Hook Generator) and the high-res image generator (Flux 1.1 Pro) are locked behind Studio Pass. It costs money because those APIs literally charge per request. Free tier still works fine.
          <a href="https://buymeacoffee.com/theelderemo/membership" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline ml-1">Get it here if you want.</a>
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-lg mb-6">
        <h3 className="text-slate-200 font-bold mb-2">📍 Quick Navigation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <a href="#ghostwriter" className="text-indigo-400 hover:text-indigo-300">Ghostwriter</a>
          <a href="#writing-tools" className="text-indigo-400 hover:text-indigo-300">Writing Tools</a>
          <a href="#album-art" className="text-indigo-400 hover:text-indigo-300">Album Art</a>
          <a href="#social" className="text-indigo-400 hover:text-indigo-300">Social Features</a>
          <a href="#poetic-forms" className="text-indigo-400 hover:text-indigo-300">Poetic Forms</a>
        </div>
      </div>

      {/* GHOSTWRITER SECTION */}
      <div id="ghostwriter" className="border-t border-slate-700 pt-6 mt-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
          Ghostwriter
        </h2>
        <p className="text-slate-400 mb-4">This is where you generate lyrics. The more specific you are, the better the output.</p>

        <h3 className="text-lg font-medium text-slate-200 mb-2">Projects</h3>
        <p className="text-slate-300 mb-4">Use the "My Projects" panel to organize different songs or albums. Each project keeps its own chat history if you have memory turned on. You can rename them, switch between them, whatever.</p>

        <h3 className="text-lg font-medium text-slate-200 mb-2">The Settings Panel</h3>
        <p className="text-slate-300 mb-4">The sidebar on the left controls what the AI generates. Here's what matters:</p>
        <p className="text-slate-300 mb-1"><strong>Artist Name:</strong> Be specific. "Kendrick Lamar on To Pimp a Butterfly" works way better than just "Kendrick Lamar."</p>
        <p className="text-slate-300 mb-1"><strong>Core Theme:</strong> What's the song about. A sentence or two.</p>
        <p className="text-slate-300 mb-1"><strong>Mood:</strong> The vibe. Dark, nostalgic, aggressive, whatever.</p>
        <p className="text-slate-300 mb-1"><strong>Banned Words:</strong> Comma-separated list of words to avoid. Use this to kill clichés.</p>
        <p className="text-slate-300 mb-4"><strong>Length:</strong> What you need. Verse, hook, full song, etc.</p>

        <h3 className="text-lg font-medium text-slate-200 mb-2">Model Selection</h3>
        <p className="text-slate-300 mb-1"><strong>Free models:</strong> gpt-4o, gpt-4o-mini, DeepSeek R1, DeepSeek V3.1. These work fine.</p>
        <p className="text-slate-300 mb-1"><strong>Studio Pass models:</strong> GPT 5.1, Claude Sonnet 4.5, Claude 3 Opus, DeepSeek R1 0528. These cost more to run but are better at creative writing.</p>
        <p className="text-slate-300 mb-1"><strong>Memory toggle:</strong> When on, the AI remembers the conversation. Good for iterating. When off, each prompt is fresh.</p>
        <p className="text-slate-300 mb-4"><strong>Structured Input toggle:</strong> When on, your sidebar settings get added to every prompt automatically. Turn it off if you just want to chat.</p>

        <h3 className="text-lg font-medium text-slate-200 mb-2">The Chaos Knobs</h3>
        <p className="text-slate-300 mb-1"><strong>Explicit content:</strong> Turn it on if you need swearing or adult themes.</p>
        <p className="text-slate-300 mb-1"><strong>Rhyme schemes:</strong> Pick AABB, ABAB, or whatever. Or choose a poetic form like Sonnets or Villanelles if you want to get weird.</p>
        <p className="text-slate-300 mb-4"><strong>Temperature and Top-p:</strong> Temperature controls randomness. Top-p controls word choice diversity. Default settings (Temp 1.2, Top-p 0.9) work well. Lower temp makes it predictable. Higher temp makes it chaotic. Play with them if the output is too boring or too nonsensical.</p>

        <h3 className="text-lg font-medium text-slate-200 mb-2">How To Iterate</h3>
        <p className="text-slate-300 mb-4">With memory on, the AI remembers what you said. So you can ask for changes like "make that verse more aggressive" or "add a pre-chorus." Copy the parts you like and keep building.</p>

        <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg mb-6">
          <h4 className="text-purple-300 font-bold mb-1">Custom Line Edits (Studio Pass)</h4>
          <p className="text-slate-400 text-sm">
            Click any line in the generated lyrics and ask the AI to change just that line. "Make it more metaphorical," "add a sports reference," whatever. It knows the context of the full song.
          </p>
        </div>
      </div>

      {/* WRITING TOOLS SECTION */}
      <div id="writing-tools" className="border-t border-slate-700 pt-6 mt-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
          Writing Tools
        </h2>
        <p className="text-slate-400 mb-4">Some utilities for analyzing lyrics, finding rhymes, and generating ideas. Check the nav bar.</p>

        <div className="space-y-4">
          {/* Analyzer */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-bold text-emerald-300 mb-2">Analyzer</h3>
            <p className="text-slate-300 mb-2">Paste lyrics and get breakdowns:</p>
            <ul className="text-slate-400 text-sm space-y-1 ml-4">
              <li>• <strong>Style Palette:</strong> Genre, themes, word patterns, flow habits.</li>
              <li>• <strong>Suno Tags:</strong> Tags you can use for music generators like Suno.</li>
              <li>• <strong>Stat Sheet:</strong> Reading level, sentiment, word density, cliché counter.</li>
              <li>• <strong>Rhyme Visualizer:</strong> Breaks down perfect, slant, and internal rhymes.</li>
            </ul>
            <p className="text-slate-500 text-xs mt-2">Free users have daily limits. Studio Pass gets unlimited.</p>
          </div>

          {/* Word Finder */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-bold text-emerald-300 mb-2">Word Finder</h3>
            <p className="text-slate-300 mb-2">Basically a rhyme dictionary with extras. Type a word and pick a search mode:</p>
            <ul className="text-slate-400 text-sm space-y-1 ml-4">
              <li>• Perfect rhymes, slant rhymes, near rhymes</li>
              <li>• Sounds like (for when you can't spell)</li>
              <li>• Homophones (same sound, different spelling)</li>
              <li>• Synonyms, antonyms, related words</li>
              <li>• Words that commonly appear together</li>
              <li>• Words that come before/after your word in phrases</li>
            </ul>
            <p className="text-slate-500 text-xs mt-2">You can add a topic to narrow results. Uses Datamuse API.</p>
          </div>

          {/* Wordplay Suggester */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/30">
            <h3 className="text-lg font-bold text-purple-300 mb-2">Wordplay Suggester <span className="text-xs bg-purple-600 px-2 py-0.5 rounded ml-2">Studio Pass</span></h3>
            <p className="text-slate-300 mb-2">Enter a word and get suggestions for puns, double meanings, metaphors, homophones, slang alternatives. Optionally add context for better results.</p>
          </div>

          {/* Hook Generator */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-amber-500/30">
            <h3 className="text-lg font-bold text-amber-300 mb-2">Hook Generator <span className="text-xs bg-amber-600 px-2 py-0.5 rounded ml-2">Studio Pass</span></h3>
            <p className="text-slate-300 mb-2">Give it a theme, genre, and mood. Get 5 hook/chorus ideas with melodic notes.</p>
          </div>
        </div>
      </div>

      {/* ALBUM ART SECTION */}
      <div id="album-art" className="border-t border-slate-700 pt-6 mt-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-8 bg-pink-500 rounded-full"></span>
          Album Art
        </h2>
        <p className="text-slate-400 mb-4">Generate visuals. Three modes: album covers, artist avatars, band logos. Describe what you want and it makes an image.</p>
        <p className="text-slate-400 text-sm italic mt-4">Flux 1.1 Pro is Studio Pass only because GPU time is expensive.</p>
      </div>

      {/* SOCIAL FEATURES SECTION */}
      <div id="social" className="border-t border-slate-700 pt-6 mt-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
          The Feed
        </h2>
        <p className="text-slate-400 mb-4">You can publish tracks, post updates, follow people, comment on stuff. Basically Twitter for lyricists.</p>

        <div className="space-y-4">
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-bold text-blue-300 mb-2">Publishing Tracks</h3>
            <p className="text-slate-300">Click "Publish" on any lyrics you generate. Add a title, optionally go anonymous (Ghost Mode), and it goes live on your profile and the feed. People can like, comment, view the full lyrics.</p>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-bold text-blue-300 mb-2">Posts</h3>
            <p className="text-slate-300">Text updates. Public (everyone sees it) or Followers Only (locked to your followers). Use it for announcements or whatever.</p>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-bold text-blue-300 mb-2">Comments and Mentions</h3>
            <p className="text-slate-300 mb-1">Leave comments on posts and tracks. Supports threaded replies.</p>
            <p className="text-slate-300 mb-1">Type @ to mention someone. They get a notification.</p>
            <p className="text-slate-300">Mention @VRSA and the AI bot responds. It auto-comments on every post too, like a hype man with terminal online brain.</p>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-bold text-blue-300 mb-2">Following</h3>
            <p className="text-slate-300">Follow people to see their posts and tracks in your feed. You can also see their followers-only posts.</p>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-bold text-blue-300 mb-2">Your Profile</h3>
            <p className="text-slate-300">Everyone gets a public profile at /u/yourUsername. Upload a profile pic, write a bio, see your follower/following counts. Your published tracks, posts, and albums show up in tabs.</p>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-bold text-blue-300 mb-2">Notifications</h3>
            <p className="text-slate-300">Bell icon in the nav. Red dot means unread. You get notified when someone mentions you, follows you, or when there are dev updates.</p>
          </div>
        </div>
      </div>

      {/* PRO TIPS SECTION */}
      <div className="border-t border-slate-700 pt-6 mt-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-8 bg-yellow-500 rounded-full"></span>
          How To Not Get Garbage Output
        </h2>
        <p className="text-slate-300 mb-4">Vague prompts get vague results. Be specific.</p>
        <p className="text-slate-400 mb-1">"A sad song" is weak. "A song in the style of Frank Ocean's Blonde about seeing your ex's car parked outside a house you don't recognize" is way better.</p>
        <p className="text-slate-400 mb-1">Name the era, not just the artist. "2001 Radiohead" is different from "1995 Radiohead."</p>
        <p className="text-slate-400 mb-1">Blend styles if you want: "Kendrick Lamar storytelling with 2010s Lana Del Rey melodic sensibility."</p>
        <p className="text-slate-400 mb-1">Use Banned Words to kill clichés before they show up.</p>
        <p className="text-slate-400 mb-1">Output too boring? Raise temperature. Too chaotic? Lower it.</p>
        <p className="text-slate-400 mb-4">Turn on Memory and iterate. The AI learns what you want over multiple messages.</p>
      </div>
      
      {/* RHYME SCHEME REFERENCE */}
      <div className="border-t border-slate-700 pt-6 mt-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
          Rhyme Schemes
        </h2>
        <p className="text-slate-400 mb-4 text-sm italic">What the sidebar toggles do. Use these to control structure and flow.</p>
      
        <div className="space-y-4">
          {/* Rhyme Placement */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-medium text-cyan-300 mb-2">Rhyme Placement</h3>
            <p className="text-slate-300 mb-1"><strong>End Rhyme</strong>: The classic. Rhymes fall at the end of lines.</p>
            <p className="text-slate-300 mb-1"><strong>Internal Rhyme</strong>: Rhymes that occur within a single line, not just at the end. Creates density and flow.</p>
            <p className="text-slate-300 mb-1"><strong>Cross-line Rhyme</strong>: Rhymes that connect across multiple lines in unexpected positions.</p>
          </div>

          {/* Rhyme Quality */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-medium text-cyan-300 mb-2">Rhyme Quality</h3>
            <p className="text-slate-300 mb-1"><strong>Perfect Rhyme</strong>: Exact sound matches (cat/hat, time/rhyme). Clean but can feel predictable.</p>
            <p className="text-slate-300 mb-1"><strong>Slant Rhyme</strong>: Similar but not identical sounds (shape/keep, soul/cold). The bread and butter of modern lyricism.</p>
            <p className="text-slate-300 mb-1"><strong>Assonance</strong>: Matching vowel sounds (lake/fate, might/find). Creates subtle musicality.</p>
            <p className="text-slate-300 mb-1"><strong>Consonance</strong>: Matching consonant sounds (luck/lick, pitter/patter). Harder edges.</p>
            <p className="text-slate-300 mb-1"><strong>Multisyllabic Rhyme</strong>: Rhyming multiple syllables at the end of lines (pessimistic/realistic). A staple of complex hip-hop.</p>
          </div>

          {/* Rhyme Patterns */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-medium text-cyan-300 mb-2">Structural Patterns</h3>
            <p className="text-slate-300 mb-1"><strong>AABB (Couplets)</strong>: Paired rhymes. Direct, punchy, good for rap.</p>
            <p className="text-slate-300 mb-1"><strong>ABAB (Alternating)</strong>: Interlocking rhymes. Classic verse structure.</p>
            <p className="text-slate-300 mb-1"><strong>ABBA (Enclosed)</strong>: Bookend rhyme. Creates a sense of closure.</p>
            <p className="text-slate-300 mb-1"><strong>ABCCB / ABCCA</strong>: Extended patterns. Good for longer verses with complex structure.</p>
            <p className="text-slate-300 mb-1"><strong>Free/Irregular</strong>: No set pattern. Let the content dictate the form.</p>
          </div>
        </div>
      </div>

      {/* POETIC FORMS ARCHIVE */}
      <div id="poetic-forms" className="border-t border-slate-700 pt-8 mt-6">
        <h2 className="text-3xl font-bold text-white mb-2">Poetic Forms</h2>
        <p className="text-slate-400 mb-8">
          VRS/A supports 17 poetic forms. Pick one from the dropdown and the AI follows those structural rules. Here's what they are.
        </p>

          {/* SECTION 1: Short & Strict */}
          <h3 className="text-xl font-bold text-indigo-300 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
            Short & Strict Forms
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            
            {/* Haiku */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Haiku</h4>
                <span className="text-xs font-mono text-slate-500">5-7-5 Syllables</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">A Japanese form consisting of three phrases with a 5, 7, 5 syllable structure. Usually focuses on nature or a specific moment in time.</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-indigo-500 font-mono text-xs text-slate-300 italic">
                "Screen light in the dark (5)<br/>
                Fingers dance on plastic keys (7)<br/>
                Code becomes alive (5)"
              </div>
            </div>

            {/* Limerick */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Limerick</h4>
                <span className="text-xs font-mono text-slate-500">AABBA Rhyme</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">A humorous, frequently bawdy, verse of three long and two short lines rhyming AABBA.</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-indigo-500 font-mono text-xs text-slate-300 italic">
                "There once was a rapper named Pete,<br/>
                Who couldn't quite find the right beat.<br/>
                He stumbled and tripped,<br/>
                His microphone slipped,<br/>
                And he fell off the stage to the street."
              </div>
            </div>

            {/* Cinquain */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Cinquain</h4>
                <span className="text-xs font-mono text-slate-500">2-4-6-8-2 Syllables</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">A five-line stanza with varied meter. The American Crapsey form uses a strict syllable count (2, 4, 6, 8, 2).</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-indigo-500 font-mono text-xs text-slate-300 italic">
                "Listen... (2)<br/>
                With faint dry sound (4)<br/>
                Like steps of passing ghosts (6)<br/>
                The leaves, frost-crisp'd, break from the trees (8)<br/>
                And fall. (2)"
              </div>
            </div>

            {/* Acrostic */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Acrostic</h4>
                <span className="text-xs font-mono text-slate-500">Spells a word</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">A poem where the first letter of each line spells out a hidden word or message.</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-indigo-500 font-mono text-xs text-slate-300 italic">
                "<strong>V</strong>ocals cutting through the mix<br/>
                <strong>R</strong>hythms that the drummer kicks<br/>
                <strong>S</strong>tyle that never needs a fix<br/>
                <strong>A</strong>udio and politics"
              </div>
            </div>
          </div>

          {/* SECTION 2: Complex & Repetitive */}
          <h3 className="text-xl font-bold text-indigo-300 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
            Complex Structures
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-8">

            {/* Sonnet */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Sonnet</h4>
                <span className="text-xs font-mono text-slate-500">14 Lines / Iambic</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">14 lines, usually in iambic pentameter. English/Shakespearean sonnets use three quatrains and a final couplet (ABAB CDCD EFEF GG).</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-purple-500 font-mono text-xs text-slate-300 italic">
                "...But if the while I think on thee, dear friend,<br/>
                All losses are restored and sorrows end." <br/>
                (The final couplet)
              </div>
            </div>

            {/* Villanelle */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Villanelle</h4>
                <span className="text-xs font-mono text-slate-500">19 Lines / 2 Refrains</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">Five tercets followed by a quatrain. Two refrains repeat throughout the poem in a specific pattern (A1 b A2 / a b A1 / a b A2...). Ideal for obsessions.</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-purple-500 font-mono text-xs text-slate-300 italic">
                "Do not go gentle into that good night,<br/>
                Old age should burn and rave at close of day;<br/>
                Rage, rage against the dying of the light."
              </div>
            </div>

            {/* Sestina */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Sestina</h4>
                <span className="text-xs font-mono text-slate-500">39 Lines / Word Repetition</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">Six stanzas of six lines, followed by a three-line envoy. The same six end-words are repeated in every stanza in a rotating order. Extremely difficult.</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-purple-500 font-mono text-xs text-slate-300 italic">
                Uses the same 6 end-words (e.g., book, sleep, time, drink, wait, silence) rotated through 39 lines.
              </div>
            </div>

            {/* Pantoum */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Pantoum</h4>
                <span className="text-xs font-mono text-slate-500">Chain Repetition</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">Composed of quatrains where lines 2 and 4 of each stanza serve as lines 1 and 3 of the next stanza. Creates a hypnotic, echoing effect.</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-purple-500 font-mono text-xs text-slate-300 italic">
                "The streetlights were blurry. (1)<br/>
                I missed the last train. (2)<br/>
                I missed the last train. (1 - next stanza)<br/>
                The night felt like rain. (2 - next stanza)"
              </div>
            </div>

            {/* Ghazal */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Ghazal</h4>
                <span className="text-xs font-mono text-slate-500">Couplets / Refrain</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">Arabic form. Rhyming couplets of the same length. Both lines of the first couplet rhyme; subsequent couplets rhyme only in the second line. Features a refrain word (radif).</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-purple-500 font-mono text-xs text-slate-300 italic">
                "Where are you now? Who lies beneath your spell tonight?<br/>
                Whom else from rapture’s road will you expel tonight?"<br/>
                (Agha Shahid Ali)
              </div>
            </div>
          </div>

          {/* SECTION 3: Thematic & Narrative */}
          <h3 className="text-xl font-bold text-indigo-300 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
            Thematic & Narrative
          </h3>
          <div className="grid md:grid-cols-2 gap-4">

            {/* Free Verse */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Free Verse</h4>
                <span className="text-xs font-mono text-slate-500">No Rules</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">Poetry that does not rhyme or have a regular meter. Relies on cadence, enjambment, and imagery. This is the default mode for most modern songwriters.</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-emerald-500 font-mono text-xs text-slate-300 italic">
                "I saw the best minds of my generation destroyed by madness,<br/>starving hysterical naked..."
              </div>
            </div>

            {/* Narrative */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Narrative</h4>
                <span className="text-xs font-mono text-slate-500">Storytelling</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">A poem that tells a story. Has a plot, characters, and a setting. Think "Stan" by Eminem or "The Rime of the Ancient Mariner".</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-emerald-500 font-mono text-xs text-slate-300 italic">
                "It was a cold November evening when he finally came home..."
              </div>
            </div>

            {/* Ballad */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Ballad</h4>
                <span className="text-xs font-mono text-slate-500">ABCB Quatrains</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">A narrative poem, often set to music. Typically structured in quatrains with an ABCB rhyme scheme. Common in folk and country.</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-emerald-500 font-mono text-xs text-slate-300 italic">
                "The wind blew high, the wind blew low, (A)<br/>
                The ship was sinking fast; (B)<br/>
                The captain called to the crew below, (C)<br/>
                'This hour is our last!' (B)"
              </div>
            </div>

            {/* Elegy */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Elegy</h4>
                <span className="text-xs font-mono text-slate-500">Mourning</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">A poem of serious reflection, typically a lament for the dead. The tone is somber, melancholic, and reflective.</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-emerald-500 font-mono text-xs text-slate-300 italic">
                "O Captain! my Captain! our fearful trip is done..."
              </div>
            </div>

            {/* Ode */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Ode</h4>
                <span className="text-xs font-mono text-slate-500">Praise</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">A lyric poem addressing a particular subject, often elevated in style or manner. Written in praise of a person, object, or event.</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-emerald-500 font-mono text-xs text-slate-300 italic">
                "Thou still unravished bride of quietness,<br/>Thou foster-child of silence and slow time..."
              </div>
            </div>

            {/* Pastoral */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Pastoral</h4>
                <span className="text-xs font-mono text-slate-500">Rural Life</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">Poems that idealize rural life and landscapes. Expect shepherds, green hills, and a withdrawal from modern life. Often used in folk music.</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-emerald-500 font-mono text-xs text-slate-300 italic">
                "Come live with me and be my love,<br/>And we will all the pleasures prove..."
              </div>
            </div>

            {/* Ekphrastic */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Ekphrastic</h4>
                <span className="text-xs font-mono text-slate-500">Art about Art</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">A vivid description of a scene or, more commonly, a work of art. It is poetry written about a painting, statue, or photograph.</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-emerald-500 font-mono text-xs text-slate-300 italic">
                "About suffering they were never wrong,<br/>The old Masters: how well they understood..." <br/>(Auden on Brueghel's Icarus)
              </div>
            </div>

            {/* Prose Poem */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-white text-lg m-0">Prose</h4>
                <span className="text-xs font-mono text-slate-500">Paragraph Form</span>
              </div>
              <p className="text-slate-400 text-sm mb-3">Written in paragraphs rather than verse, but maintains poetic qualities like imagery, rhythm, and figurative language. Good for spoken word.</p>
              <div className="bg-slate-900/80 p-3 rounded border-l-2 border-emerald-500 font-mono text-xs text-slate-300 italic">
                "The city is a concrete beast that breathes smoke and exhales noise. I walk its veins at midnight, listening to the heartbeat of the subway."
              </div>
            </div>

          </div>
        </div>

      {/* STILL READING */}
      <div className="border-t border-slate-700 pt-6 mt-6">
        <h2 className="text-2xl font-bold text-slate-200 mb-2">You Made It</h2>
        <p className="text-slate-300 mb-4">That's the whole thing. If this helps you make something cool, <a href="https://buymeacoffee.com/theelderemo" target="_blank" rel="noopener noreferrer" className="underline text-yellow-400 hover:text-yellow-300">throw me a tip</a>. If the output sucks, tweak your temperature settings.</p>
      </div>
    </div>
  </div>
  );
};

export default Guide;