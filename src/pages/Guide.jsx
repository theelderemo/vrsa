import React from 'react';

const Guide = () => (
  <div className="flex flex-col items-center justify-center min-h-full bg-slate-900 p-8">
    <div className="max-w-4xl w-full bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700/50">
      <h1 className="text-3xl font-bold text-indigo-400 mb-4">VRS/A Field Manual</h1>
      
      <h2 className="text-xl font-semibold text-slate-200 mb-2">Welcome to VRS/A</h2>
      <p className="text-slate-300 mb-4">Built by one guy, running on fumes, vibes, and a couple tips. VRS/A is your lyric engine for bending styles, moods, and rhyme forms into something that doesn't sound like it was grown in a lab.</p>

      <p className="text-slate-400 mb-6 text-sm italic">Like it? Help keep it free: <a href="buymeacoffee.com/theelderemo" target="_blank" rel="noopener noreferrer" className="underline text-yellow-400 hover:text-yellow-300">BuyMeaCoffee</a> or Cash App <span className="font-mono text-green-400">$chrisdickinson02</span>.</p>

      <h2 className="text-xl font-semibold text-slate-200 mb-2">Ghostwriter Mode Tour</h2>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 1: Navigation</h3>
      <p className="text-slate-300 mb-4">Use the nav up top to switch between:<br />- <strong>Ghostwriter</strong>: For when you have a core idea and need a full, styled section generated quickly.<br />- <strong>Analyzer</strong>: For deconstructing existing lyrics and understanding what makes them work.</p>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 2: Structured Input Form</h3>
      <p className="text-slate-300 mb-4">The left panel is your command center. Be specific for the best results:<br />- <strong>Artist Name</strong>: Go for an era or album for more accuracy (e.g., "Kendrick Lamar on To Pimp a Butterfly").<br />- <strong>Core Theme</strong>: Give it the song's topic in a sentence or two.<br />- <strong>Mood</strong>: Set the emotional tone ("dark," "nostalgic," "aggressive").<br />- <strong>Length</strong>: Choose the exact section you need, from a short verse to a full song.</p>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 3: Advanced Controls</h3>
      <p className="text-slate-300 mb-4">Fine-tune the output:<br />- <strong>Explicit toggle</strong>: Enable for adult content that fits the artist's style.<br />- <strong>Rhyme schemes</strong>: Select any schemes you want the AI to prioritize.<br />- <strong>Temperature & Top-p</strong>: Your chaos knobs. For a good balance of creativity and coherence, I suggest a <strong>Temp of 1.2</strong> and a <strong>Top-p of 0.9</strong>.</p>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 4: Generate Your First Lyrics</h3>
      <p className="text-slate-300 mb-4">Either fill out the form, type your full request in the box at the bottom, or do both for maximum control. Then hit send.</p>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 5: Iterate and Refine</h3>
      <p className="text-slate-300 mb-6">The AI remembers the conversation. Use the copy button on lyrics you like, then ask for tweaks: "Make that first verse more aggressive" or "add a pre-chorus that builds tension."</p>

      <h2 className="text-xl font-semibold text-slate-200 mb-2">Sandbox Mode Tour</h2>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 6: Advanced Structure</h3>
      <p className="text-slate-300 mb-4">Drag sections. Set bars and density. Micromanage your song like you're producing in Ableton on a cracked license.</p>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 7: Dial-a-Poet</h3>
      <p className="text-slate-300 mb-4">Adjust <strong>Metaphor Density</strong> (literal vs. abstract) and <strong>Rhyme Complexity</strong> (simple end-rhymes vs. complex internal rhymes). If you don't know what those mean, guess and test.</p>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 8: Style Palette</h3>
      <p className="text-slate-300 mb-4">Paste existing lyrics to get a detailed breakdown of that artist's DNA. Useful for mimicry and theft (the legal kind).</p>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 10: Generate Sections</h3>
      <p className="text-slate-300 mb-6">Each section card has its own prompt box. Hit the brain icon to generate lyrics for just that section. Trash what sucks. Repeat.</p>

      <h2 className="text-xl font-semibold text-slate-200 mt-6 mb-2">Pro-Tips for Better Output</h2>
      <p className="text-slate-300 mb-4"><strong>Vague prompts get vague results. Specific prompts get specific results.</strong><br/>- "A sad song" is okay. "A song in the style of Frank Ocean's 'Blonde' about the melancholy of seeing your ex's car parked outside a house you don't recognize" is much better.<br/>- Don't just name an artist; name their era. "2001 Radiohead" is a world away from "1995 Radiohead."<br/>- Blend styles: "Write a verse with the storytelling of Kendrick Lamar but the melodic sensibility of a 2010's Lana Del Rey chorus."</p>
      
      <h2 className="text-xl font-semibold text-slate-200 mt-6 mb-2">Rhyme Scheme & Lyrical Device Guide</h2>
      <p className="text-slate-400 mb-4 text-sm italic">A quick reference for the toggles in the sidebar. Use these to influence the structure and texture of your lyrics.</p>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-slate-200 mb-2">Structural Patterns</h3>
          <p className="text-slate-300 mb-1"><strong>AABB, ABBA, Alternate rhyme (ABAB)</strong>: The basics. AABB is paired couplets, ABBA is an enclosed rhyme, and ABAB is interlocking.</p>
          <p className="text-slate-300 mb-1"><strong>Monorhyme</strong>: Every line ends with the same rhyme. (AAAA)</p>
          <p className="text-slate-300 mb-1"><strong>Triplet</strong>: Three consecutive lines that rhyme. (AAA)</p>
          <p className="text-slate-300 mb-1"><strong>Chain Rhyme / Terza Rima</strong>: Interlocking rhyme scheme that connects stanzas (e.g., ABA BCB CDC).</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-slate-200 mb-2">Types of Rhyme</h3>
          <p className="text-slate-300 mb-1"><strong>Perfect Rhyme</strong>: The classic, exact sound match (cat/hat). VRS/A avoids overusing this.</p>
          <p className="text-slate-300 mb-1"><strong>Slant Rhyme</strong>: Similar but not identical sounds (shape/keep). The bread and butter of modern lyricism.</p>
          <p className="text-slate-300 mb-1"><strong>Masculine vs. Feminine Rhyme</strong>: Masculine is a single, stressed syllable rhyme (fight/light). Feminine is multi-syllable with the last unstressed (backing/cracking).</p>
          <p className="text-slate-300 mb-1"><strong>Dactylic Rhyme</strong>: A three-syllable rhyme where the first syllable is stressed (beautiful/dutiful).</p>
          <p className="text-slate-300 mb-1"><strong>Broken Rhyme</strong>: A word rhymed with a two-word phrase ("in time" / "this fine time").</p>
          <p className="text-slate-300 mb-1"><strong>Eye Rhyme</strong>: Words that look like they rhyme but don't (move/love). Used for poetic effect.</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-slate-200 mb-2">Lyrical Devices (Texture & Sound)</h3>
          <p className="text-slate-300 mb-1"><strong>Internal Rhyme</strong>: Rhymes that occur within a single line, not just at the end.</p>
          <p className="text-slate-300 mb-1"><strong>Head Rhyme (Alliteration)</strong>: Repetition of initial consonant sounds ("She sells seashells...").</p>
          <p className="text-slate-300 mb-1"><strong>Assonance & Consonance</strong>: Repetition of internal vowel (Assonance) or consonant (Consonance) sounds. Creates a subtle musicality.</p>
          <p className="text-slate-300 mb-1"><strong>Sibilant Rhyme (Sibilance)</strong>: Repetition of 's' sounds for a hissing effect.</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-slate-200 mb-2">Formal Structures</h3>
          <p className="text-slate-300 mb-1"><strong>Sonnet, Limerick, Villanelle, Ballade, Keatsian Ode</strong>: Highly structured classical forms with specific rules for rhyme and meter. Use these for a challenge.</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-slate-200 mt-6 mb-2">Still Reading?</h2>
      <p className="text-slate-300 mb-4">You're now over 1,000 words into a walkthrough for a lyric generator. Either you're lost or you love it.</p>
      <p className="text-slate-300">If it's the second one: <a href="https://coff.ee/vrsa" target="_blank" rel="noopener noreferrer" className="underline text-yellow-400 hover:text-yellow-300">tip me</a>. Or Cash App <span className="font-mono text-green-400">$chrisdickinson02</span>. Or don't—and pray the API doesn't get rate-limited again.</p>
    </div>
  </div>
);

export default Guide;
