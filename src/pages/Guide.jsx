import React from 'react';
import { Link } from 'react-router-dom';

const Guide = () => (
  <div className="flex flex-col items-center justify-center min-h-full bg-slate-900 p-8">
    <div className="max-w-4xl w-full bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700/50">
      <h1 className="text-3xl font-bold text-indigo-400 mb-4">VRS/A Field Manual</h1>
      
      <h2 className="text-xl font-semibold text-slate-200 mb-2">Welcome to VRS/A</h2>
      <p className="text-slate-300 mb-4">Built by one guy, running on fumes, vibes, and a couple tips. VRS/A is your lyric engine for bending styles, moods, and rhyme forms into something that doesn't sound like it was grown in a lab.</p>

      <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-lg mb-6">
        <h3 className="text-indigo-300 font-bold mb-1">🚀 New: Studio Pass</h3>
        <p className="text-slate-400 text-sm">
          Want access to the heavy hitters? The <strong>Studio Pass</strong> unlocks premium models like <strong>Claude 3 Opus</strong>, <strong>DeepSeek R1</strong>, and <strong>GPT-5.1</strong>, plus the high-res <strong>Flux 1.1</strong> image generator. Support the dev, get better tools. 
          <a href="https://buymeacoffee.com/theelderemo/membership" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline ml-1">Get it here.</a>
        </p>
      </div>

      <h2 className="text-xl font-semibold text-slate-200 mb-2">Ghostwriter Mode Tour</h2>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 1: Navigation</h3>
      <p className="text-slate-300 mb-4">Use the nav up top to switch between tools. <strong>Ghostwriter</strong> is for generation, <strong>Analyzer</strong> is for deconstruction, and <strong>Album Art</strong> is for visuals.</p>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 2: Structured Input Form</h3>
      <p className="text-slate-300 mb-4">The left panel is your command center. Be specific for the best results:<br />- <strong>Artist Name</strong>: Go for an era or album for more accuracy (e.g., "Kendrick Lamar on To Pimp a Butterfly").<br />- <strong>Core Theme</strong>: Give it the song's topic in a sentence or two.<br />- <strong>Mood</strong>: Set the emotional tone ("dark," "nostalgic," "aggressive").<br />- <strong>Length</strong>: Choose the exact section you need, from a short verse to a full song.</p>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 3: Advanced Controls</h3>
      <p className="text-slate-300 mb-4">Fine-tune the output:<br />- <strong>Explicit toggle</strong>: Enable for adult content that fits the artist's style.<br />- <strong>Rhyme schemes</strong>: Select specific patterns or poetic forms (Sonnets, Villanelles, etc.) from the dropdowns.<br />- <strong>Temperature & Top-p</strong>: Your chaos knobs. For a good balance of creativity and coherence, I suggest a <strong>Temp of 1.2</strong> and a <strong>Top-p of 0.9</strong>.</p>

      <h3 className="text-lg font-medium text-slate-200 mb-6">Step 4: Iterate and Refine</h3>
      <p className="text-slate-300 mb-6">The AI remembers the conversation. Use the copy button on lyrics you like, then ask for tweaks: "Make that first verse more aggressive" or "add a pre-chorus that builds tension."</p>

      <h2 className="text-xl font-semibold text-slate-200 mb-2">Album Art Generator</h2>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 5: Visuals</h3>
      <p className="text-slate-300 mb-4">Stop using stock photos. Go to the <strong>Album Art</strong> tab to generate custom visuals.<br />- <strong>Album Covers</strong>: Abstract, moody, or literal interpretations of your lyrics.<br />- <strong>Artist Avatars</strong>: Create a consistent persona for your streaming profiles.<br />- <strong>Band Logos</strong>: Get typography and icon ideas for your brand.</p>
      <p className="text-slate-400 text-sm italic mb-6">Note: The high-quality Flux 1.1 Pro model is reserved for Studio Pass members because GPU time costs actual money.</p>

      <h2 className="text-xl font-semibold text-slate-200 mt-6 mb-2">Pro-Tips for Better Output</h2>
      <p className="text-slate-300 mb-4"><strong>Vague prompts get vague results. Specific prompts get specific results.</strong><br/>- "A sad song" is okay. "A song in the style of Frank Ocean's 'Blonde' about the melancholy of seeing your ex's car parked outside a house you don't recognize" is much better.<br/>- Don't just name an artist; name their era. "2001 Radiohead" is a world away from "1995 Radiohead."<br/>- Blend styles: "Write a verse with the storytelling of Kendrick Lamar but the melodic sensibility of a 2010's Lana Del Rey chorus."</p>
      
      <h2 className="text-xl font-semibold text-slate-200 mt-6 mb-2">Rhyme Scheme & Lyrical Device Guide</h2>
      <p className="text-slate-400 mb-4 text-sm italic">A quick reference for the toggles in the sidebar. Use these to influence the structure and texture of your lyrics.</p>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-slate-200 mb-2">Structural Patterns</h3>
          <p className="text-slate-300 mb-1"><strong>AABB, ABBA, Alternate rhyme (ABAB)</strong>: The basics. AABB is paired couplets, ABBA is an enclosed rhyme, and ABAB is interlocking.</p>
          <p className="text-slate-300 mb-1"><strong>Monorhyme</strong>: Every line ends with the same rhyme. (AAAA)</p>
          <p className="text-slate-300 mb-1"><strong>Chain Rhyme / Terza Rima</strong>: Interlocking rhyme scheme that connects stanzas (e.g., ABA BCB CDC).</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-slate-200 mb-2">Types of Rhyme</h3>
          <p className="text-slate-300 mb-1"><strong>Slant Rhyme</strong>: Similar but not identical sounds (shape/keep). The bread and butter of modern lyricism.</p>
          <p className="text-slate-300 mb-1"><strong>Multisyllabic Rhyme</strong>: Rhyming multiple syllables at the end of lines (pessimistic/realistic). A staple of complex hip-hop.</p>
          <p className="text-slate-300 mb-1"><strong>Internal Rhyme</strong>: Rhymes that occur within a single line, not just at the end.</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-slate-200 mb-2">Formal Structures</h3>
          <p className="text-slate-300 mb-1"><strong>Sonnet, Villanelle, Sestina, Ghazal</strong>: Highly structured classical forms. Use these if you want to challenge the AI to adhere to strict rules.</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-slate-200 mt-6 mb-2">Still Reading?</h2>
      <p className="text-slate-300 mb-4">You're now deep into a manual for a lyric generator. Either you're lost or you love it.</p>
      <p className="text-slate-300">If it's the second one: <a href="https://buymeacoffee.com/theelderemo" target="_blank" rel="noopener noreferrer" className="underline text-yellow-400 hover:text-yellow-300">tip me</a>. Or don't, and pray the API doesn't get rate-limited again.</p>
    </div>
  </div>
);

export default Guide;