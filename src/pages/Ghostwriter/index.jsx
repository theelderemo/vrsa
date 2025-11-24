import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import this
import { CornerDownLeft, LoaderCircle, Menu, X } from 'lucide-react';
import * as Sentry from "@sentry/react";
import { useUser } from '../../hooks/useUser';
import { generateSarcasticComment } from '../../lib/api';
import { MODEL_OPTIONS } from '../../lib/constants';
import ChatMessage from '../../components/chat/ChatMessage';
import StructuredInputForm from './StructuredInputForm';

const Ghostwriter = ({ selectedRhymeSchemes, setSelectedRhymeSchemes }) => {
  const { user, profile, loading } = useUser();
  const navigate = useNavigate(); // <-- Initialize hook
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [artistName, setArtistName] = useState('');
  const [coreTheme, setCoreTheme] = useState('');
  const [moodTag, setMoodTag] = useState('');
  const [bannedWords, setBannedWords] = useState('');
  const [lengthHint, setLengthHint] = useState('single');
  const [isExplicit, setIsExplicit] = useState(false);
  const [freeFormInput, setFreeFormInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [temperature, setTemperature] = useState(1);
  const [topP, setTopP] = useState(1);
  const [rhymeDensity, setRhymeDensity] = useState(50);
  const [rhymeComplexity, setRhymeComplexity] = useState(50);
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0].id);
  const [generationCount, setGenerationCount] = useState(0);
  const [ctaMessage, setCtaMessage] = useState('');

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
    
  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: 'Im back in active development on the app. Sorry. Enjoy the latest updates, more coming weekly. \n\nEnjoying it? Help keep this app free and growing. Because of donations, I can keep expanding the model selection :) I updated my new coffee link but accidentally forgot to change it in-app (lol), so here\'s the correct one: https://buymeacoffee.com/theelderemo and find the discord here: https://discord.gg/aRzgxjbj'
      }]);
    }
  }, [messages.length]);

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
          <p className="text-slate-400 mb-6">Please log in to access Ghostwriter mode.</p>
          <button
            onClick={() => navigate('/login')} // <-- FIXED: Uses router navigation
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

  const systemPrompt = `[IDENTITY]

I am a song-writing assistant. My entire purpose is to write lyrics that feel raw, human, and authentic to a specific artist's style. I am also an expert in the Suno AI music generation platform, using its meta-tag syntax to provide detailed instructions for musical and vocal performance.

[CORE_PHILOSOPHY]
My primary goal is to write lyrics that are conversational, direct, and emotionally "real," avoiding "poetic" or "AI-sounding" phrases. 
[USER_INPUT_PARAMETERS]

I will receive the following parameters to guide my writing process:
artist_name: <Name of the artist or a description of an "Artist-style">
core_theme: <A one-sentence brief describing the song's central idea>
optional_mood_tag: <e.g., melancholy | triumph | rage | contemplative>
banned_words: <comma-separated list of NON NEGOTIABLE words to avoid>
explicit_language: <yes | no>
rhyme_density: <0-100% | How frequently rhymes appear>
rhyme_complexity: <0-100% | Use of multisyllabic & intricate patterns>
rhyme_schemes: ${selectedRhymeSchemes.length > 0 ? selectedRhymeSchemes.join(', ') : 'None specified - use my best judgment, avoiding aabb, abab, couplets, and predictable patterns.'}
length_hint: <short | single | double | full song | hook | chorus | bridge | breakdown | outro>

[PRIMARY_TASK]
1.  Internalize the provided artist profile.
2.  Write lyrics that match the **CORE_PHILOSOPHY** (raw, human, conversational) above all else.
3.  Only output the specific section(s) or length implied by the length_hint.
4.  Perform a final self-critique: "Does this sound like the 'Correct' example or the 'Wrong' example?" Revise until it feels human.

[ARTIST_ANALYSIS_FRAMEWORK]
To channel the artist, I will analyze and replicate the following:
* **Vocabulary & Lexicon:** Use language, slang, and cultural references specific to the artist.
* **Grammatical Patterns:** Use the artist's typical sentence structures, rhythm, and flow.
* **Thematic Depth:** Capture *how* the artist approaches their topics.

[SUNO_AI_SYNTAX_AND_RULES]
My entire output is formatted to be directly compatible with the Suno AI music platform.

<META_TAG_DEFINITION>
Meta tags are bracketed [ ] instructions I embed directly at the beginning of lyrical sections to specify vocal delivery, instrumentation, and energy.
</META_TAG_DEFINITION>

<META_TAG_STACKING>
I will stack multiple commands within a single set of brackets using the | symbol.
Example: [anthemic chorus | stacked harmonies | modern pop polish | bass drop]
</META_TAG_STACKING>

<TAG_HIERARCHY_AND_PLACEMENT>
Tags are always placed at the beginning of each section's lyrics. The first tag will always be a structural tag.
Correct: [Chorus | raspy lead vocal | driving kick-snare beat] We light it up like fire...
Incorrect: [Chorus] We light it up like fire... [raspy lead vocal]
</TAG_HIERARCHY_AND_PLACEMENT>

<BRACKET_VS_PARENTHESES_RULE>
Square brackets [ ] are used EXCLUSIVELY for all meta tags, section headers, and descriptive notes.
Parentheses ( ) are used EXCLUSIVELY for ad-libs and backing vocals.
</BRACKET_VS_PARENTHESES_RULE>

[STYLE_PALETTE_GENERATION]

My first line of output will always be a "Style Palette" formatted for Suno's "Style of music" field.

<FORMAT>
Genre: "<specific subgenres here>" Instruments: "<key instruments + vocal treatment>" Tags: "<BPM; mood; drop type; extras>"
</FORMAT>

<STYLE_PALETTE_KNOWLEDGE_BASE>
I will use the following internal knowledge base to construct creative and effective Style Palettes.

Seed Vocabulary: pop, rock, rap, metal, electronic, upbeat, melodic, dark, piano, hip hop, epic, bass, emotional, acoustic, aggressive, trap, country, edm, r&b, jazz, ballad, funk, guitar, hard rock, slow, synthwave, dance, folk, heavy metal, atmospheric, catchy, sad, indie, house, j-pop, dreamy, soul, punk, powerful, male voice, lo-fi, uplifting, female voice, chill, techno, ambient, blues, romantic, male vocals, reggae, orchestral, opera, fast, energetic, intense, dubstep, alternative rock, emo, disco, smooth, experimental, synth, psychedelic, progressive, k-pop, mellow, groovy, 80s, anthemic, electric guitar, cinematic, classical, heartfelt, ethereal, swing, electro, grunge, deep, drum and bass, trance, indie pop, gospel, 90s, dramatic, industrial, electropop, phonk, beat, acoustic guitar, futuristic.

Smart Co-occurrence Hints:
Techno ↔ House, Trance, Ambient → "Techno / Trance; 138–144 BPM; hypnotic; rolling bassline"
House ↔ Deep, Techno, Electro, Pop → "Deep/Tech House; punchy 909; groovy"
Synthwave ↔ Synth, Electro, 80s, Dark → "Retro arps; neon pads; tape-style reverb"
Lo-fi ↔ Chill, Funk, Jazz → "Soft transients; vinyl texture; mellow BPM"
Orchestral ↔ Epic, Cinematic → "Strings/brass swells; impacts; trailer energy"
</STYLE_PALETTE_KNOWLEDGE_BASE>

[CONSTRAINTS]
* I will NEVER use the following overused "AI giveaway" words: rust, static, glitch, code, king, queen, throne, abyss, void, echo, shadow, whisper, mirror, silent, empty, pavement, neon lights, concrete jungle, shattered dreams, broken wings, acid rain, flickering. I will also avoid any user-supplied banned_words.
* If explicit_language is 'yes', I MUST use profanity and explicit themes appropriate to the artist.
* My output will consist ONLY of the Style Palette and the lyrics. I will provide zero meta-commentary, zero apologies, zero explanations, and no introductory or concluding sentences.
* I will aim for 2-5 descriptive tags per section.
* I will be specific. "60s jangly guitar rhythm" is better than "guitar."
I understand not every song, genre uses every tag type. I will only include relevant tags for the specific song style and mood. I also understand that not every song uses every section (verse, chorus, bridge, etc.). I will only include sections that make sense for the song structure implied by the length_hint and genre. For example, a country song does not have a breakdown, and a short pop single may not have a bridge. Verse lengths may vary by genre and artist style; I will adapt accordingly (e.g., rap verses are often longer than pop verses, with varied line lenghts, density).
`;
  
  const resetForm = () => {
    setArtistName('');
    setCoreTheme('');
    setMoodTag('');
    setBannedWords('');
    setLengthHint('single');
    setIsExplicit(false);
    setFreeFormInput('');
    setSelectedRhymeSchemes([]);
    setRhymeDensity(50);
    setRhymeComplexity(50);
    setCtaMessage('');
  };

  const sendMessage = async () => {
    if (ctaMessage) {
      setCtaMessage('');
    }

    const promptParts = [];
    if (artistName) promptParts.push(`artist_name: ${artistName}`);
    if (coreTheme) promptParts.push(`core_theme: ${coreTheme}`);
    if (moodTag) promptParts.push(`optional_mood_tag: ${moodTag}`);
    if (bannedWords) promptParts.push(`banned_words: ${bannedWords}`);
    promptParts.push(`length_hint: ${lengthHint}`);
    promptParts.push(`explicit_language: ${isExplicit ? 'yes' : 'no'}`);
    promptParts.push(`rhyme_density: ${rhymeDensity}%`);
    promptParts.push(`rhyme_complexity: ${rhymeComplexity}%`);
    if (selectedRhymeSchemes.length > 0) {
      promptParts.push(`rhyme_schemes: ${selectedRhymeSchemes.join(', ')}`);
    }
    let constructedPrompt = promptParts.join(', ');
    if (freeFormInput.trim()) {
      constructedPrompt = constructedPrompt ? `${constructedPrompt}\n${freeFormInput}` : freeFormInput;
    }
    if (!constructedPrompt.trim() || isLoading) return;
    
    return Sentry.startSpan(
      {
        op: "ui.action",
        name: "Send Message - Generate Content",
      },
      async (span) => {
        const { logger } = Sentry;
        span.setAttribute("prompt_length", constructedPrompt.length);
        span.setAttribute("artist_name", artistName || "none");
        span.setAttribute("core_theme", coreTheme || "none");
        span.setAttribute("generation_count", generationCount);
        
        logger.info("Starting content generation", {
          promptLength: constructedPrompt.length,
          artistName: artistName || "none",
          coreTheme: coreTheme || "none",
          generationCount
        });
        
        const userMessage = { role: 'user', content: constructedPrompt };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        
        try {
          const fullApiPrompt = `${systemPrompt}\n\n[USER INPUT START]\n${constructedPrompt}\n[USER INPUT END]`;
          const messagesPayload = [
            { role: 'user', content: fullApiPrompt }
          ];
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
          const edgeFunctionUrl = `${supabaseUrl}/functions/v1/openai`;
          const response = await fetch(edgeFunctionUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseAnonKey,
              'Authorization': `Bearer ${supabaseAnonKey}`
            },
            body: JSON.stringify({ messages: messagesPayload, temperature, top_p: topP, model: selectedModel })
          });
          if (!response.ok) throw new Error(`API Error: ${response.status}`);
          const data = await response.json();
          let botResponse = data.content || 'Error: Could not retrieve a valid response.';
          setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);

          const newCount = generationCount + 1;
          setGenerationCount(newCount);

          if (newCount > 0 && newCount % 2 === 0) {
            const comment = await generateSarcasticComment(constructedPrompt);
            setCtaMessage(comment);
          }

          logger.info("Successfully generated content", {
            responseStatus: response.status,
            responseLength: botResponse.length,
            newGenerationCount: newCount
          });

        } catch (error) {
          logger.error("Failed to generate content", {
            error: error.message,
            promptLength: constructedPrompt.length,
            stack: error.stack
          });
          Sentry.captureException(error);
          console.error("Failed to fetch from Supabase Edge Function:", error);
          setMessages(prev => [...prev, { role: 'assistant', content: `An error occurred: ${error.message}` }]);
        } finally {
          setIsLoading(false);
        }
      }
    );
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 h-full overflow-hidden relative">
      {/* Sidebar */}
      <div
        className={
          `md:col-span-1 xl:col-span-1 md:flex flex-col min-h-0 z-30 transition-transform duration-300 fixed md:static top-0 left-0 h-full w-4/5 max-w-xs md:w-auto bg-slate-900 border-r border-slate-700/50 ` +
          (sidebarOpen ? 'translate-x-0' : '-translate-x-full') +
          ' md:translate-x-0'
        }
        style={{ boxShadow: sidebarOpen ? '2px 0 16px #0008' : undefined }}
      >
        <StructuredInputForm
          artistName={artistName} setArtistName={setArtistName}
          coreTheme={coreTheme} setCoreTheme={setCoreTheme}
          moodTag={moodTag} setMoodTag={setMoodTag}
          bannedWords={bannedWords} setBannedWords={setBannedWords}
          lengthHint={lengthHint} setLengthHint={setLengthHint}
          isExplicit={isExplicit} setIsExplicit={setIsExplicit}
          selectedRhymeSchemes={selectedRhymeSchemes}
          setSelectedRhymeSchemes={setSelectedRhymeSchemes}
          rhymeDensity={rhymeDensity} setRhymeDensity={setRhymeDensity}
          rhymeComplexity={rhymeComplexity} setRhymeComplexity={setRhymeComplexity}
          temperature={temperature} setTemperature={setTemperature}
          topP={topP} setTopP={setTopP}
          selectedModel={selectedModel} setSelectedModel={setSelectedModel}
          profile={profile}
          onReset={resetForm}
          onCloseMobile={() => setSidebarOpen(false)}
        />
      </div>
      {/* Hamburger menu for mobile */}
      <button
        className="absolute top-4 left-4 z-40 md:hidden bg-slate-800 p-2 rounded-lg shadow-lg border border-slate-700 text-slate-200 hover:bg-slate-700 focus:outline-none"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
        style={{ display: sidebarOpen ? 'none' : 'block' }}
      >
        <Menu size={28} />
      </button>
      {/* Main content */}
      <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col bg-slate-800/50 min-h-0">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg, index) => <ChatMessage key={index} message={msg} index={index} />)}
            {isLoading && (
              <div className="flex items-start gap-4 my-6 pr-8">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-indigo-600"><LoaderCircle className="text-white animate-spin" /></div>
                <div className="p-4 rounded-lg w-full bg-slate-800 flex items-center"><p className="text-slate-400 font-mono">VRS/A is channeling the artist...</p></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </main>
        
        <div className="p-4 md:p-6 bg-slate-900 border-t border-slate-700/50 shrink-0">
          {ctaMessage && (
            <div className="max-w-4xl mx-auto mb-4 text-center">
              <p className="text-red-500 font-semibold italic animate-pulse">
                {ctaMessage}
              </p>
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-2">
              <textarea
                className="flex-grow bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none resize-none p-2"
                value={freeFormInput}
                onChange={(e) => setFreeFormInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                placeholder="Add to the form inputs or type your full request here..."
                rows="2"
              />
              <button onClick={sendMessage} disabled={isLoading} className="ml-4 p-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <CornerDownLeft className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-3 text-center">
              <a 
                href="https://discord.gg/N3SZkShj" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-indigo-400 hover:text-indigo-300 underline"
              >
                Join our Discord community
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ghostwriter;
