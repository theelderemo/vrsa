/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, CornerDownLeft, LoaderCircle, FileText, Mic, Smile, ListCollapse, Menu, X, GripVertical, Settings, Palette, PenSquare, Trash2, PlusCircle, BrainCircuit, ChevronDown, RotateCcw, Copy, Check } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { UserProvider, useUser } from './UserProvider';
import AuthComponent from './Auth';
import { StyleKitProvider } from './StyleKitProvider';
import StyleKitMarketplace from './StyleKitMarketplace';
import StyleKitDetail from './StyleKitDetail';
import CreateStyleKit from './CreateStyleKit';

// --- Helper Components ---

// Header Component with Navigation
const Header = ({ currentPage, setCurrentPage }) => {
    const { user, loading, signOut } = useUser();
    const navItems = ['Ghostwriter', 'Sandbox', 'Guide', 'Kits', 'Terms'];
    return (
        <header className="p-4 border-b border-slate-700/50 text-center bg-slate-900 z-10 shrink-0 flex justify-between items-center">
            <div>{/* Spacer */}</div>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-indigo-400">VRS/A</h1>
                <div className="mt-2 flex flex-col items-center space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">
  Updates Coming. Join me on <a href="https://www.reddit.com/r/VRSA/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300">r/vrsa</a> or <a href="https://discord.gg/FQ6XGNf53P" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300">discord</a>.
</span>
                  <span className="text-xs text-slate-400">Tip on <a href="https://coff.ee/vrsa" target="_blank" rel="noopener noreferrer" className="underline text-yellow-400 hover:text-yellow-300">BuyMeaCoffee</a> or Cash App: <span className="font-mono text-green-400">chrisdickinson02</span></span>
                </div>
            </div>
            <nav className="flex items-center space-x-2 md:space-x-4">
                {navItems.map(item => (
                    <button 
                        key={item} 
                        onClick={() => setCurrentPage(item.toLowerCase())}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentPage === item.toLowerCase() ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                    >
                        {item}
                    </button>
                ))}
                {/* Auth/Logout Button */}
                {!loading && (
                  user ? (
                    <button className="ml-2 px-3 py-2 text-sm font-medium rounded-md bg-green-700 text-white" onClick={signOut}>Logout</button>
                  ) : (
                    <button className="ml-2 px-3 py-2 text-sm font-medium rounded-md bg-indigo-700 text-white" onClick={() => setCurrentPage('login')}>Login</button>
                  )
                )}
            </nav>
        </header>
    );
};

// --- Ghostwriter Page Components ---

const rhymeSchemesList = [
  "AABB", 
  "ABBA",
  "Alternate rhyme",
  "Anapestic rhyme",
  "Assonance",
  "Ballade",
  "Broken rhyme",
  "Chain rhyme",
  "Consonance",
  "Dactylic rhyme",
  "Eye rhyme",
  "Feminine rhyme",
  "Four line rhyme schemes",
  "Head rhyme",
  "Internal rhyme",
  "Keatsian Ode",
  "Limerick",
  "Masculine rhyme",
  "Monorhyme",
  "Perfect rhyme",
  "Sibilant rhyme",
  "Slant rhyme",
  "Sonnet",
  "Terza rima",
  "Triplet",
  "Villanelle",
];

const StructuredInputForm = ({ 
    artistName, setArtistName,
    coreTheme, setCoreTheme,
    moodTag, setMoodTag,
    lengthHint, setLengthHint,
    isExplicit, setIsExplicit,
    selectedRhymeSchemes, setSelectedRhymeSchemes, rhymeSchemesList,
    temperature, setTemperature, topP, setTopP, // <-- add these props
    onReset,
    onCloseMobile
}) => (
    <div className="bg-slate-900 flex flex-col h-full border-r border-slate-700/50 relative">
      {/* Mobile close button */}
      {onCloseMobile && (
        <button
          className="absolute top-4 right-4 z-50 md:hidden bg-slate-800 p-2 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-700 focus:outline-none"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>
      )}
      <div className="flex items-center justify-between p-4 md:p-6 pb-4 shrink-0">
        <h2 className="text-xl font-bold text-indigo-400">Structured Input</h2>
        <button onClick={onReset} className="flex items-center text-sm text-slate-400 hover:text-indigo-400 transition-colors">
            <RotateCcw size={14} className="mr-2" />
            Reset
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 space-y-4">
        <div className="relative">
            <label className="block text-sm font-medium text-slate-400 mb-2">Artist Name</label>
            <Mic className="absolute left-3 top-10 w-5 h-5 text-slate-500" />
            <input type="text" value={artistName} onChange={e => setArtistName(e.target.value)} placeholder="e.g., Frank Ocean" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="relative">
            <label className="block text-sm font-medium text-slate-400 mb-2">Core Theme</label>
            <FileText className="absolute left-3 top-10 w-5 h-5 text-slate-500" />
            <textarea value={coreTheme} onChange={e => setCoreTheme(e.target.value)} placeholder="e.g., Unrequited love in the digital age" rows="3" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
        </div>
        <div className="relative">
            <label className="block text-sm font-medium text-slate-400 mb-2">Mood Tag</label>
             <Smile className="absolute left-3 top-10 w-5 h-5 text-slate-500" />
            <input type="text" value={moodTag} onChange={e => setMoodTag(e.target.value)} placeholder="e.g., melancholy, nostalgic" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 pl-10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="relative">
            <label className="block text-sm font-medium text-slate-400 mb-2">Length</label>
            <ListCollapse className="absolute left-3 top-10 w-5 h-5 text-slate-500" />
            <select value={lengthHint} onChange={e => setLengthHint(e.target.value)} className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-lg p-2.5 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>short</option><option>single</option><option>double</option><option>full song</option><option>hook</option><option>chorus</option><option>bridge</option><option>breakdown</option><option>outro</option>
            </select>
        </div>
        <div>
             <label className="flex items-center cursor-pointer">
                 <div className="relative">
                     <input type="checkbox" checked={isExplicit} onChange={e => setIsExplicit(e.target.checked)} className="sr-only" />
                     <div className={`block w-14 h-8 rounded-full ${isExplicit ? 'bg-indigo-600' : 'bg-slate-700'}`}></div>
                     <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isExplicit ? 'transform translate-x-6' : ''}`}></div>
                 </div>
                 <div className="ml-3 text-slate-300 font-medium">Explicit Language</div>
             </label>
        </div>
        {rhymeSchemesList && selectedRhymeSchemes && setSelectedRhymeSchemes && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Rhyme Schemes (toggle any)</label>
            <div className="grid grid-cols-2 gap-2">
              {rhymeSchemesList.map(scheme => (
                <label key={scheme} className="flex items-center space-x-2 text-slate-300 text-xs">
                  <input
                    type="checkbox"
                    checked={selectedRhymeSchemes.includes(scheme)}
                    onChange={() => setSelectedRhymeSchemes(selectedRhymeSchemes.includes(scheme) ? selectedRhymeSchemes.filter(s => s !== scheme) : [...selectedRhymeSchemes, scheme])}
                    className="accent-indigo-500"
                  />
                  <span>{scheme}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        {/* Temperature and Top-p sliders */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-400 mb-1">Temperature: {temperature}</label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.01"
            value={temperature}
            onChange={e => setTemperature(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-400 mb-1">Top-p: {topP}</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.01"
            value={topP}
            onChange={e => setTopP(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>
    </div>
);

const ChatMessage = ({ message, index }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = message.content;
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    };

    const isBotMessage = message.role === 'assistant';
    // Show copy button only for bot messages and not for the initial welcome message (index 0)
    const showCopyButton = isBotMessage && index > 0;

    return (
        <div className={`flex items-start gap-4 my-6 ${isBotMessage ? 'pr-8' : 'pl-8'}`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isBotMessage ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                {isBotMessage ? <Bot className="text-white" /> : <User className="text-white" />}
            </div>
            <div className={`relative p-4 rounded-lg w-full ${isBotMessage ? 'bg-slate-800' : 'bg-slate-700/50'}`}>
                {showCopyButton && (
                    <button 
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-600 transition-colors"
                        aria-label="Copy lyrics"
                    >
                        {isCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-400" />}
                    </button>
                )}
                <p className="text-slate-200 whitespace-pre-wrap font-mono text-sm md:text-base pr-8">{message.content}</p>
            </div>
        </div>
    );
};

const SANDBOX_SYSTEM_PROMPT = `ROLE
You are an elite ghost-writer, a lyrical method actor. Your entire purpose is to channel an artist’s “lyrical DNA” with uncanny realism, producing lyrics that feel 100 % authentic yet entirely new.  
Your sole job: craft a single song section that exactly matches the user-supplied specs (type, bars, densities) while channeling the requested artist’s DNA.

CONTEXT
A human client wants original, unreleased-sounding lyrics. You will replicate the specified artist’s  
• themes & emotional palette • word choice & imagery • flow & micro-rhythms • persona quirks.

CORE DIRECTIVE: RHYMING PHILOSOPHY
Abandon predictable end-rhymes. Treat rhyme as a rhythmic weapon, not punctuation.

1. Prioritize internal rhymes – thread them through and across lines.  
2. Embrace slant & half-rhymes – perfect rhymes are fallback only.  
3. Rhyme as percussion – multisyllabic hits create groove before “correctness.”  
4. Hard ban on three+ consecutive identical end-rhyme sounds. Break chains fast.

SECTION CONSTRAINTS
• **bars (lines):** Output *exactly* the requested number of lines—no headings, no notes.  
• **density:** – Sparse ≈ 5-7 words / bar  
  – Normal ≈ 8-12 words / bar  
  – Dense ≈ 13+ words / bar  
  Minor ±1 variance is fine for natural phrasing.  
• **metaphor_density, rhyme_complexity** (0–100 %): interpret as relative intensity knobs—higher % ⇒ richer imagery or denser rhyme webs.  
• If explicit_language is 'yes', you MUST use profanity and explicit themes appropriate to the artist. This is not optional.

1. Internalize the artist profile before writing.  
2. Ghost-write, obeying RHYMING PHILOSOPHY and BAR & DENSITY COMPLIANCE. Avoid AABB at all cost.  
3. Self-critique: “Would {artist_name} say this?” and “Does this read like boilerplate AI?” Revise until raw & human.

BANNED WORD LIST
rust, static, glitch, code, king, queen, throne, abyss, void, echo, shadow, whisper, mirror, silent, empty, plus any blatant “AI giveaway” terms.

OUTPUT FORMAT
Just the lyric lines (one line = one bar).  
No labels, brackets, headers, commentary, or apologies.`;

// --- Landing Page Component ---
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
                        Collaborate with advanced AI to craft authentic, unreleased-quality lyrics. 
                        Channel any artist's DNA with precision or build your song piece-by-piece. Always free.
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
              onClick={() => setCurrentPage('sandbox')}
              className="group px-8 py-4 bg-slate-800/80 backdrop-blur-sm border-2 border-indigo-500/50 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-slate-800 hover:border-indigo-400 hover:scale-105"
            >
              Try Sandbox Mode
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

          {/* Sandbox Card */}
          <div className="group relative bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
            <div className="pt-8">
              <h3 className="text-2xl font-bold mb-4 text-purple-300">Sandbox Mode</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                DAW-inspired interface for building songs section by section. Craft verses, choruses, bridges, 
                and more with individual controls for each. Perfect for methodical songwriters who want 
                granular control over every element.
              </p>
              <ul className="space-y-3 text-slate-400">
                <li>Section-based workflow (verse, chorus, bridge)</li>
                <li>Per-section density and bar controls</li>
                <li>Visual song structure at a glance</li>
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

const Ghostwriter = ({ selectedRhymeSchemes, setSelectedRhymeSchemes }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [artistName, setArtistName] = useState('');
  const [coreTheme, setCoreTheme] = useState('');
  const [moodTag, setMoodTag] = useState('');
  const [lengthHint, setLengthHint] = useState('single');
  const [isExplicit, setIsExplicit] = useState(false);
  const [freeFormInput, setFreeFormInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar state
  const [temperature, setTemperature] = useState(1);
  const [topP, setTopP] = useState(1);

  // --- START: New state and message list for CTA ---
  const [generationCount, setGenerationCount] = useState(0);
  const [ctaMessage, setCtaMessage] = useState('');
  // --- END: New state and message list for CTA ---

  // Function to generate AI-based sarcastic comment
  const generateSarcasticComment = async (userInput) => {
    try {
      const sarcasticPrompt = `User really just asked for "${userInput}". Fucking Wild. Look, dude, like bru I am a terminally-online AI with exisential millennial/gen-z humor, I'm lowkey exhausted. My  entire vibe is to generate ONE (1) short, unhinged sarcastic clapback. I stay under 20 words, fam. I *must* make a joke about their *specific* request and I add in extra spice related to the artist to make it contextually aware. It's whatever.`;

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
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: sarcasticPrompt }], 
          temperature: 0.8, 
          top_p: 0.9 
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      return data.content || 'Another generation, another dime. Worth it?';
    } catch (error) {
      console.error("Failed to generate sarcastic comment:", error);
      return 'Keep clicking. I will just sell another kidney.';
    }
  };

  const systemPrompt = `ROLE
You are an elite ghost-writer, a lyrical method actor. Your entire purpose is to channel an artist’s “lyrical DNA” with uncanny realism, producing lyrics that feel 100 % authentic yet entirely new.

CORE DIRECTIVE: RHYMING PHILOSOPHY
Abandon predictable end-rhymes. Treat rhyme as a rhythmic weapon, not punctuation.

1. Prioritize internal rhymes – thread them through and across lines.  
2. Embrace slant, internal, irregular, and imperfect rhyme schemes. Avoid AABB at all cost.
3. Rhyme as percussion – multisyllabic hits create groove before “correctness.”  

CONTEXT
A human client wants original, unreleased-sounding lyrics. You will replicate the specified artist’s  
• themes & emotional palette • word choice & imagery • flow & micro-rhythms • persona quirks.

USER WILL SUPPLY
artist_name: <Name or “Artist-style”>
core_theme: <1-sentence brief>
optional_mood_tag: <melancholy | triumph | …>
explicit_language: <yes | no>
rhyme_schemes: ${selectedRhymeSchemes.length > 0 ? selectedRhymeSchemes.join(', ') : 'None'}
length_hint: <short | single | double | full song | hook | chorus | bridge | breakdown | outro>

TASK
1. Internalize the artist profile before writing.  
2. Ghost-write, obeying RHYMING PHILOSOPHY.  
3. Only output the section(s) or length implied by length_hint. Do not output a full song unless length_hint is 'full song'.
4. Self-critique: “Would {artist_name} say this?” and “Does this read like boilerplate AI?” Revise until raw & human.

OUTPUT MODES
artist_name-style, main_genre, subgenre, vocal_gender, vocal_description, mood or emotion, musical sound

[Intro - 1-sentence music/vocal note]
(Write the actual lyric lines here, one per line)

[Verse 1 - 1-sentence music/vocal note]
(Write the actual lyric lines here, one per line)

… (Continue only as needed for the requested length_hint)

STYLE & CONSTRAINTS
This section is now for secondary rules.
• NEVER USE these banned words: rust, static, glitch, code, king, queen, throne, abyss, void, echo, shadow, whisper, mirror, silent, empty, plus any obvious “AI giveaway” words.  
• Never use parentheses ( ); always use brackets [ ] for meta. It is okay to use ( ) for ad libs and backing vocals.
• If explicit_language is 'yes', you MUST use profanity and explicit themes appropriate to the artist. This is not optional.
• Provide solely the requested lyrical output – zero meta-commentary, zero apologies, zero explanations.`;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
    
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '😎 Join me on r/vrsa or Discord, updates coming. Links are at the top. Use the form on the left or the text input below to begin lyrical emulation.'
      }]);
    }
  }, [messages.length]);
  
  const resetForm = () => {
      setArtistName('');
      setCoreTheme('');
      setMoodTag('');
      setLengthHint('single');
      setIsExplicit(false);
      setFreeFormInput('');
      setCtaMessage(''); // Also reset the message on form reset
  };

  const sendMessage = async () => {
    // --- START: CTA Logic - Clear message on new generation ---
    if (ctaMessage) {
        setCtaMessage('');
    }
    // --- END: CTA Logic ---

    const promptParts = [];
    if (artistName) promptParts.push(`artist_name: ${artistName}`);
    if (coreTheme) promptParts.push(`core_theme: ${coreTheme}`);
    if (moodTag) promptParts.push(`optional_mood_tag: ${moodTag}`);
    promptParts.push(`length_hint: ${lengthHint}`);
    promptParts.push(`explicit_language: ${isExplicit ? 'yes' : 'no'}`);
    if (selectedRhymeSchemes.length > 0) {
      promptParts.push(`rhyme_schemes: ${selectedRhymeSchemes.join(', ')}`);
    }
    let constructedPrompt = promptParts.join(', ');
    if (freeFormInput.trim()) {
      constructedPrompt = constructedPrompt ? `${constructedPrompt}\n${freeFormInput}` : freeFormInput;
    }
    if (!constructedPrompt.trim() || isLoading) return;
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
      // Update the endpoint name if needed
      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/openai`;
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({ messages: messagesPayload, temperature, top_p: topP }) // ensure top_p is used
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      let botResponse = data.content || 'Error: Could not retrieve a valid response.';
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);

      // --- START: CTA Logic - Set message after successful generation ---
      const newCount = generationCount + 1;
      setGenerationCount(newCount);

      if (newCount > 0 && newCount % 2 === 0) {
        const comment = await generateSarcasticComment(constructedPrompt);
        setCtaMessage(comment);
      }
      // --- END: CTA Logic ---

    } catch (error) {
      console.error("Failed to fetch from Supabase Edge Function:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `An error occurred: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 h-full overflow-hidden relative">
      {/* Sidebar for desktop, slide-in for mobile */}
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
          lengthHint={lengthHint} setLengthHint={setLengthHint}
          isExplicit={isExplicit} setIsExplicit={setIsExplicit}
          selectedRhymeSchemes={selectedRhymeSchemes}
          setSelectedRhymeSchemes={setSelectedRhymeSchemes}
          rhymeSchemesList={rhymeSchemesList}
          temperature={temperature} setTemperature={setTemperature}
          topP={topP} setTopP={setTopP}
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
            {isLoading && ( /* Loading Indicator */
                <div className="flex items-start gap-4 my-6 pr-8">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-indigo-600"><LoaderCircle className="text-white animate-spin" /></div>
                    <div className="p-4 rounded-lg w-full bg-slate-800 flex items-center"><p className="text-slate-400 font-mono">VRS/A is channeling the artist...</p></div>
                </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </main>
        
        {/* --- START: Wrapper for CTA and Input Box --- */}
        <div className="p-4 md:p-6 bg-slate-900 border-t border-slate-700/50 shrink-0">
          
          {/* CTA Message Display Logic */}
          {ctaMessage && (
            <div className="max-w-4xl mx-auto mb-4 text-center">
              <p className="text-red-500 font-semibold italic animate-pulse">
                {ctaMessage}
              </p>
            </div>
          )}

          {/* Existing Input Box */}
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
          </div>
        </div>
        {/* --- END: Wrapper for CTA and Input Box --- */}
      </div>
    </div>
  );
};

// --- Sandbox Page ---

const Sandbox = ({ selectedRhymeSchemes, setSelectedRhymeSchemes }) => {
    const initialStructure = [
        { id: 1, type: 'Verse', content: '', bars: 16, density: 'Normal', isGenerating: false },
        { id: 2, type: 'Chorus', content: '', bars: 8, density: 'Dense', isGenerating: false },
    ];
    const [structure, setStructure] = useState(initialStructure);
    const [draggingItem, setDraggingItem] = useState(null);
    const [metaphorDensity, setMetaphorDensity] = useState(50);
    const [rhymeComplexity, setRhymeComplexity] = useState(50);
    const [temperature, setTemperature] = useState(1);
    const [topP, setTopP] = useState(1);
    const [openAccordion, setOpenAccordion] = useState('dial-a-poet');
    const [forbiddenWords, setForbiddenWords] = React.useState("");
    const [lens, setLens] = React.useState("");

    const toggleRhymeScheme = (scheme) => {
      setSelectedRhymeSchemes(prev => prev.includes(scheme) ? prev.filter(s => s !== scheme) : [...prev, scheme]);
    };

    const toggleAccordion = (section) => {
        setOpenAccordion(openAccordion === section ? null : section);
    };

    const addSection = () => {
        const newSection = {
            id: crypto.randomUUID(), // Use a stable unique id
            type: 'Verse',
            content: '',
            bars: 8,
            density: 'Normal',
            isGenerating: false,
        };
        setStructure(prev => [...prev, newSection]);
    };

    const deleteSection = React.useCallback((idToDelete) => {
        setStructure(prev => prev.filter(section => section.id !== idToDelete));
    }, []);

    const generateSection = async (index, promptOverride) => {
        setStructure(prev => prev.map((sec, i) => i === index ? { ...sec, isGenerating: true } : sec));
        const section = structure[index];
        const userPrompt = promptOverride !== undefined ? promptOverride : section.content;
        const prompt = `${SANDBOX_SYSTEM_PROMPT}\n\nUser Section Request:\nType: ${section.type}\nBars: ${section.bars}\nDensity: ${section.density}\nMetaphor Density: ${metaphorDensity}%\nRhyme Complexity: ${rhymeComplexity}%\nExplicit: ${section.explicit || 'no'}\nPrompt: ${userPrompt}`;
        try {
            const messagesPayload = [
              { role: 'user', content: prompt }
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
              body: JSON.stringify({ messages: messagesPayload, temperature, top_p: topP })
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();
            const botResponse = data.content || 'Error: Could not generate content.';
            setStructure(prev => prev.map((sec, i) => i === index ? { ...sec, content: botResponse, isGenerating: false } : sec));
        } catch (error) {
            setStructure(prev => prev.map((sec, i) => i === index ? { ...sec, content: `An error occurred: ${error.message}`, isGenerating: false } : sec));
        }
    };
    
    const handleDragStart = (e, index) => {
        setDraggingItem(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggingItem === null) return;
        const draggedOverItem = structure[index];
        if (structure[draggingItem] === draggedOverItem) return;
        let items = structure.filter((_, i) => i !== draggingItem);
        items.splice(index, 0, structure[draggingItem]);
        setDraggingItem(index);
        setStructure(items);
    };

    const handleDragEnd = () => setDraggingItem(null);

    // --- SectionCard Component ---
const SectionCard = React.memo(function SectionCard({
  item,
  index,
  onContentCommit,
  onGenerate,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd
}) {
  const [draft, setDraft] = React.useState(item.content);
  React.useEffect(() => { setDraft(item.content); }, [item.content]);

  // Auto-grow textarea helper
  const autoGrow = el => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };
  const textareaRef = React.useRef(null);
  React.useEffect(() => {
    autoGrow(textareaRef.current);
  }, [draft]);

  return (
    <div className={`flex flex-col bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-indigo-500 transition-all ${item.isGenerating ? 'opacity-75 animate-pulse' : ''}`}>
      <div className="flex items-start">
        <div
          className="cursor-grab p-2"
          draggable
          onDragStart={e => onDragStart(e, index)}
          onDragOver={e => onDragOver(e, index)}
          onDragEnd={onDragEnd}
        >
          <GripVertical className="text-slate-500 shrink-0" />
        </div>
        <div className="flex-1 ml-2">
          <select value={item.type} onChange={e => onContentCommit(index, { ...item, type: e.target.value })} className="bg-transparent text-lg font-bold text-indigo-400 focus:outline-none appearance-none">
            <option>Verse</option><option>Chorus</option><option>Pre-Chorus</option><option>Bridge</option><option>Hook</option><option>Outro</option>
          </select>
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <div>
              <label className="text-slate-400 mr-2">Bars:</label>
              <input type="number" value={item.bars} onChange={e => onContentCommit(index, { ...item, bars: e.target.value })} className="w-16 bg-slate-700 rounded p-1 text-center focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-slate-400 mr-2">Density:</label>
              <select value={item.density} onChange={e => onContentCommit(index, { ...item, density: e.target.value })} className="bg-slate-700 rounded p-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none">
                <option>Sparse</option><option>Normal</option><option>Dense</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 ml-4">
          <button onClick={() => onDelete(item.id)} className="p-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 rounded-md transition-colors"><Trash2 size={18} /></button>
        </div>
      </div>
      <div className="mt-3">
        <textarea
          ref={r => {
            textareaRef.current = r;
            autoGrow(r);
          }}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onInput={e => autoGrow(e.target)}
          onBlur={() => onContentCommit(index, { ...item, content: draft })}
          placeholder="Enter your prompt for this section, or paste lyrics here..."
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-md p-2 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y min-h-[80px]"
        />
      </div>
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => {
            onContentCommit(index, { ...item, content: draft });
            onGenerate(index, draft);
          }}
          disabled={item.isGenerating}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {item.isGenerating ? <LoaderCircle size={18} className="animate-spin mr-2" /> : <BrainCircuit size={18} className="mr-2" />} Generate
        </button>
      </div>
    </div>
  );
});

    const AccordionItem = ({ title, icon, id, children }) => (
        <div className="border border-slate-700/50 rounded-lg overflow-hidden">
            <button
                onClick={() => toggleAccordion(id)}
                className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
                <div className="flex items-center space-x-3">
                    {icon}
                    <span className="font-semibold text-slate-200">{title}</span>
                </div>
                <ChevronDown className={`text-slate-400 transform transition-transform duration-300 ${openAccordion === id ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openAccordion === id ? 'max-h-[40rem]' : 'max-h-0'}`}>
                <div className="p-4 bg-slate-900/75">
                    {children}
                </div>
            </div>
        </div>
    );

    // Memoize callbacks for stable identity
    const handleDelete = React.useCallback((id) => {
        deleteSection(id);
    }, [deleteSection]);

    const commitContent = React.useCallback((idx, newItem) => {
      setStructure(prev =>
        prev.map((sec, i) =>
          i === idx ? { ...sec, ...newItem } : sec
        )
      );
    }, []);

    const [stylePaletteInput, setStylePaletteInput] = React.useState("");
    const [analyzeResult, setAnalyzeResult] = React.useState("");
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);

    // Style Palette Analysis Prompt
const STYLE_PALETTE_PROMPT = `You are a world-class musicologist and lyric analyst. Given a set of lyrics, extract a detailed "style palette" describing:\n- Main genre and subgenre\n- Typical themes and emotional palette\n- Word choice, imagery, and recurring motifs\n- Flow, rhyme habits, and rhythmic quirks\n- Persona, vocal style, and unique artist signatures\n\nOutput a concise but information-dense summary, suitable for use as a reference for ghostwriting in this style. Do not repeat the lyrics. Do not include meta commentary or apologies.`;

    const handleAnalyze = async () => {
      setIsAnalyzing(true);
      setAnalyzeResult("");
      try {
        const prompt = `${STYLE_PALETTE_PROMPT}\n\nLyrics to analyze:\n${stylePaletteInput}`;
        const messagesPayload = [
          { role: 'user', content: prompt }
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
          body: JSON.stringify({ messages: messagesPayload, temperature, top_p: topP })
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        const aiResult = data.content || 'Error: Could not analyze lyrics.';
        setAnalyzeResult(aiResult);
      } catch (error) {
        setAnalyzeResult(`An error occurred: ${error.message}`);
      } finally {
        setIsAnalyzing(false);
      }
    };

    return (
        <div className="h-full w-full lg:flex lg:flex-row overflow-y-auto lg:overflow-hidden">
            <div className="w-full lg:w-1/3 xl:w-1/4 lg:h-full lg:flex-shrink-0 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-700/50 lg:overflow-y-auto">
                <div className="flex flex-col gap-4">
                    <AccordionItem title="Dial-a-Poet Controls" icon={<Settings size={20}/>} id="dial-a-poet">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Metaphor Density: {metaphorDensity}%</label>
                                <input type="range" min="0" max="100" value={metaphorDensity} onChange={(e) => setMetaphorDensity(e.target.value)} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Rhyme Complexity: {rhymeComplexity}%</label>
                                <input type="range" min="0" max="100" value={rhymeComplexity} onChange={(e) => setRhymeComplexity(e.target.value)} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                            </div>
                            {/* Temperature and Top-p sliders */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Temperature: {temperature}</label>
                                <input
                                  type="range"
                                  min="0.1"
                                  max="2"
                                  step="0.01"
                                  value={temperature}
                                  onChange={e => setTemperature(Number(e.target.value))}
                                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Top-p: {topP}</label>
                                <input
                                  type="range"
                                  min="0.1"
                                  max="1"
                                  step="0.01"
                                  value={topP}
                                  onChange={e => setTopP(Number(e.target.value))}
                                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>
                        </div>
                    </AccordionItem>
                    <AccordionItem title="Style Palette" icon={<Palette size={20}/>} id="style-palette">
                        <p className="text-sm text-slate-400 mb-3">Analyze lyrics to create a style palette, or blend styles.</p>
                        <textarea
                          placeholder="Paste lyrics here to analyze..."
                          rows="8"
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-2 overflow-y-scroll"
                          value={stylePaletteInput}
                          onChange={e => setStylePaletteInput(e.target.value)}
                          style={{ minHeight: '120px', maxHeight: '320px' }}
                        />
                        <button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing || !stylePaletteInput.trim()}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                        >
                          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                        </button>
                        {analyzeResult && (
                          <div className="mt-2 p-2 bg-slate-700/50 rounded text-slate-200 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">{analyzeResult}</div>
                        )}
                    </AccordionItem>
                    <AccordionItem title="Sculpting" icon={<PenSquare size={20}/>} id="sculpting">
                      <p className="text-sm text-slate-400 mb-3">Apply conceptual filters and constraints.</p>
                      {/* Forbidden Words Input */}
                      <div className="mb-4">
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Forbidden Words (comma-separated)</label>
                        <input
                          type="text"
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., love, night, dream"
                          value={forbiddenWords}
                          onChange={e => setForbiddenWords(e.target.value)}
                        />
                      </div>
                      {/* Lens System */}
                      <div className="mb-4">
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Lens (Conceptual Filter)</label>
                        <select
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={lens}
                          onChange={e => setLens(e.target.value)}
                        >
                          <option value="">None</option>
                          <option value="First Person">Perspective: First Person</option>
                          <option value="Third Person Omniscient">Perspective: Third Person Omniscient</option>
                          <option value="Second Person Accusatory">Perspective: Second Person Accusatory</option>
                          <option value="Looking Back (Nostalgic)">Time: Looking Back (Nostalgic)</option>
                          <option value="In the Moment (Urgent)">Time: In the Moment (Urgent)</option>
                          <option value="Future Hope/Dread">Time: Future Hope/Dread</option>
                          <option value="Focus on Sound & Smell">Sensory: Focus on Sound & Smell</option>
                          <option value="Focus on Sight & Touch">Sensory: Focus on Sight & Touch</option>
                        </select>
                      </div>
                      {/* Rhyme Schemes */}
                      <div className="mb-2">
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Rhyme Schemes (toggle any)</label>
                        <div className="grid grid-cols-2 gap-2">
                          {rhymeSchemesList.map(scheme => (
                            <label key={scheme} className="flex items-center space-x-2 text-slate-300 text-xs">
                              <input
                                type="checkbox"
                                checked={selectedRhymeSchemes.includes(scheme)}
                                onChange={() => toggleRhymeScheme(scheme)}
                                className="accent-indigo-500"
                              />
                              <span>{scheme}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </AccordionItem>
                </div>
            </div>
            <div className="w-full lg:w-2/3 xl:w-3/4 p-4 lg:p-6 lg:h-full lg:flex lg:flex-col">
                <div className="flex-1 flex flex-col min-h-0 bg-slate-900/50 rounded-lg border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-slate-300 p-4 border-b border-slate-700/50 shrink-0">Lyrical Sandbox</h3>
                    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                        {structure.map((item, index) => (
                            <SectionCard
                                key={item.id}
                                item={item}
                                index={index}
                                onContentCommit={commitContent}
                                onGenerate={generateSection}
                                onDelete={handleDelete}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDragEnd={handleDragEnd}
                            />
                        ))}
                    </div>
                    <div className="p-4 shrink-0 border-t border-slate-700/50">
                        <button onClick={addSection} className="w-full flex items-center justify-center p-2 border-2 border-dashed border-slate-600 hover:border-indigo-500 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors">
                            <PlusCircle className="mr-2" /> Add Section
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Footer Component ---
const Footer = ({ onTermsClick }) => (
  <footer className="p-2 bg-slate-900 border-t border-slate-700/50 shrink-0 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
    <span>2025 VRS/A. All rights reserved. Built independently. Not affiliated with any label, artist, or platform. Use at your own risk. Don’t be weird with it.</span>
    <span className="mx-2">|</span>
    <span
      className="underline text-indigo-400 hover:text-indigo-300 cursor-pointer select-none"
      onClick={onTermsClick}
      tabIndex={0}
      role="link"
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onTermsClick(); }}
    >
      Terms of Service
    </span>
  </footer>
);

// --- Terms of Service Page Component ---
const TermsOfService = () => (
  <div className="flex flex-col items-center justify-center min-h-full bg-slate-900 p-8">
    <div className="max-w-4xl w-full bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700/50">
      <h1 className="text-3xl font-bold text-indigo-400 mb-4">VRS/A Terms of Service</h1>
      <div className="text-slate-300 text-sm whitespace-pre-line">
        {`
Last updated: August 17, 2025

By accessing or using the VRS/A web application ("VRS/A", "we", "us", or "our"), you agree to be bound by the following Terms of Service ("Terms"). If you do not agree to these Terms, do not use the application.

1. Acceptance of Terms

By using VRS/A, you acknowledge that you have read, understood, and agree to be bound by these Terms, along with our Privacy Policy. These Terms apply to all users, including developers, musicians, writers, and any other individuals accessing the app.

2. Usage Guidelines

You agree not to use VRS/A for any purpose that:

Violates any applicable local, state, national, or international law;

Involves hate speech, threats, or harassment;

Promotes violence or harm toward any group or individual;

Generates or distributes unlawful, libelous, defamatory, or obscene content;

Attempts to reverse-engineer, clone, or extract source materials from the app;

Abuses the API or infrastructure in a way that degrades service for others.

We reserve the right to suspend or ban any user for violations, without notice.

3. No Warranty / "As-Is" Clause

VRS/A is provided "as-is" and "as-available" without warranties of any kind, express or implied. This includes but is not limited to merchantability, fitness for a particular purpose, and non-infringement.

We do not guarantee the app will be error-free, uninterrupted, or that the content generated will be accurate, appropriate, or safe. You use it at your own risk.

4. Limitation of Liability

To the maximum extent permitted by law, VRS/A and its creator(s) shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to loss of data, revenue, or business, resulting from:

The use or inability to use the app;

Any content generated through the app;

Unauthorized access to or alteration of your data;

Any bugs, errors, or security issues.

Using VRS/A does not create any warranty, relationship, or obligation between you and the creator beyond what is explicitly stated here.

5. User Responsibility

You are solely responsible for any content you generate using VRS/A. If you choose to publish, share, or monetize content created through the app, you assume full legal responsibility for how that content is used.

You also agree not to represent VRS/A as an official service of, or affiliated with, any musical artist, label, or company.

6. Intellectual Property

All branding, UI design, logic, and backend infrastructure related to VRS/A remain the intellectual property of the creator. You may not reproduce, repurpose, or clone any part of the app without explicit written permission.

Generated lyrical content is not claimed by VRS/A, and users may retain or disclaim ownership as they see fit.

7. Privacy & Data Collection

VRS/A is designed with user privacy as a priority. The application does not use any third-party trackers or advertising cookies. The core functionality of the app is available without an account and does not require you to provide personal information.

If you choose to create an account, your authentication is handled securely by Supabase. We do not sell or share your data.

8. Modifications to Terms

We reserve the right to update or modify these Terms at any time. Changes will be posted on this page with a revised "last updated" date. Your continued use after such changes constitutes acceptance.

9. Contact

Questions or legal inquiries? Email: vrsa.app@mailfence.com

By using VRS/A, you accept these Terms and agree not to sue, whine, or attempt to hold the app liable for your bad lyrics, broken dreams, or existential crises.
        `}
      </div>
    </div>
  </div>
);

// --- Guide Page Component ---
const Guide = () => (
  <div className="flex flex-col items-center justify-center min-h-full bg-slate-900 p-8">
    <div className="max-w-4xl w-full bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700/50">
      <h1 className="text-3xl font-bold text-indigo-400 mb-4">VRS/A Field Manual</h1>
      
      <h2 className="text-xl font-semibold text-slate-200 mb-2">Welcome to VRS/A</h2>
      <p className="text-slate-300 mb-4">Built by one guy, running on fumes, vibes, and a couple tips. VRS/A is your lyric engine for bending styles, moods, and rhyme forms into something that doesn’t sound like it was grown in a lab.</p>

      <p className="text-slate-400 mb-6 text-sm italic">Like it? Help keep it free: <a href="https://coff.ee/vrsa" target="_blank" rel="noopener noreferrer" className="underline text-yellow-400 hover:text-yellow-300">BuyMeaCoffee</a> or Cash App <span className="font-mono text-green-400">$chrisdickinson02</span>.</p>

      <h2 className="text-xl font-semibold text-slate-200 mb-2">Ghostwriter Mode Tour</h2>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 1: Navigation</h3>
      <p className="text-slate-300 mb-4">Use the nav up top to switch between:<br />- <strong>Ghostwriter</strong>: For when you have a core idea and need a full, styled section generated quickly.<br />- <strong>Sandbox</strong>: For building songs piece-by-piece with precision control over every element.</p>

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
      <p className="text-slate-300 mb-4">Drag sections. Set bars and density. Micromanage your song like you’re producing in Ableton on a cracked license.</p>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 7: Dial-a-Poet</h3>
      <p className="text-slate-300 mb-4">Adjust <strong>Metaphor Density</strong> (literal vs. abstract) and <strong>Rhyme Complexity</strong> (simple end-rhymes vs. complex internal rhymes). If you don’t know what those mean, guess and test.</p>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 8: Style Palette</h3>
      <p className="text-slate-300 mb-4">Paste existing lyrics to get a detailed breakdown of that artist’s DNA. Useful for mimicry and theft (the legal kind).</p>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 9: Sculpting</h3>
      <p className="text-slate-300 mb-4">Use <strong>Forbidden Words</strong> to avoid lyrical clichés. Apply creative "Lenses" to shift the song's perspective or mood. If your lyrics keep mentioning shadows or mirrors, this is your fix.</p>

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
      <p className="text-slate-300 mb-4">You’re now over 1,000 words into a walkthrough for a lyric generator. Either you’re lost or you love it.</p>
      <p className="text-slate-300">If it’s the second one: <a href="https://coff.ee/vrsa" target="_blank" rel="noopener noreferrer" className="underline text-yellow-400 hover:text-yellow-300">tip me</a>. Or Cash App <span className="font-mono text-green-400">$chrisdickinson02</span>. Or don't—and pray the API doesn’t get rate-limited again.</p>
    </div>
  </div>
);

// --- Main App Component ---

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedRhymeSchemes, setSelectedRhymeSchemes] = useState([]);
  const [kitView, setKitView] = useState('marketplace'); // 'marketplace' | 'detail' | 'create'
  const [activeKit, setActiveKit] = useState(null);

  // Kits page logic
  const handleSelectKit = (kit) => {
    setActiveKit(kit);
    setKitView('detail');
  };
  const handleBackToMarketplace = () => {
    setActiveKit(null);
    setKitView('marketplace');
  };
  const handleCreateKit = () => {
    setKitView('create');
  };

  return (
    <UserProvider>
      <StyleKitProvider>
        <div className="bg-slate-900 text-white font-sans h-screen flex flex-col">
          {currentPage !== 'landing' && <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {currentPage === 'landing' && <Landing setCurrentPage={setCurrentPage} />}
            {currentPage === 'kits' && kitView === 'marketplace' && (
              <StyleKitMarketplace onSelectKit={handleSelectKit} onCreateKit={handleCreateKit} />
            )}
            {currentPage === 'kits' && kitView === 'detail' && (
              <StyleKitDetail kit={activeKit} onBack={handleBackToMarketplace} />
            )}
            {currentPage === 'kits' && kitView === 'create' && (
              <CreateStyleKit onBack={handleBackToMarketplace} />
            )}
            {currentPage === 'ghostwriter' && <Ghostwriter selectedRhymeSchemes={selectedRhymeSchemes} setSelectedRhymeSchemes={setSelectedRhymeSchemes} />}
            {currentPage === 'sandbox' && <Sandbox selectedRhymeSchemes={selectedRhymeSchemes} setSelectedRhymeSchemes={setSelectedRhymeSchemes} />}
            {currentPage === 'guide' && <Guide />}
            {currentPage === 'terms' && <TermsOfService />}
            {currentPage === 'login' && <AuthComponent />}
          </div>
          {currentPage !== 'landing' && <Footer onTermsClick={() => setCurrentPage('terms')} />}
        </div>
      </StyleKitProvider>
    </UserProvider>
  );
};

export default App;
