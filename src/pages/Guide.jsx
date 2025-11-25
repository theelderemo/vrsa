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
        <div className="border-t border-slate-700 pt-8">
          <h2 className="text-3xl font-bold text-white mb-2">The Archive of Poetic Forms</h2>
          <p className="text-slate-400 mb-8">
            VRS/A supports 17 distinct poetic forms. Selecting these in the "Poetic Forms" dropdown forces the AI to adhere to specific structural rules. Here is your reference guide.
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

        <h2 className="text-2xl font-bold text-slate-200 mt-10 mb-2">Still Reading?</h2>
        <p className="text-slate-300 mb-4">You're deep in the docs. I respect it.</p>
        <p className="text-slate-300">If this tool helps you write a banger, <a href="https://buymeacoffee.com/theelderemo" target="_blank" rel="noopener noreferrer" className="underline text-yellow-400 hover:text-yellow-300">buy me a coffee</a>. If it writes garbage, blame the temperature setting.</p>
      </div>
    </div>
  </div>
);

export default Guide;