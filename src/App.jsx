import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, CornerDownLeft, LoaderCircle, FileText, Mic, Smile, ListCollapse, Menu, X, GripVertical, Settings, Palette, PenSquare, Trash2, PlusCircle, BrainCircuit, ChevronDown, RotateCcw, Copy, Check } from 'lucide-react';
import { Analytics } from "@vercel/analytics/next";

// --- Helper Components ---

// Header Component with Navigation
const Header = ({ currentPage, setCurrentPage }) => {
    const navItems = ['Ghostwriter', 'Sandbox'];
    return (
        <header className="p-4 border-b border-slate-700/50 text-center bg-slate-900 z-10 shrink-0 flex justify-between items-center">
            <div>{/* Spacer */}</div>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-indigo-400">VRS/A</h1>
                <div className="mt-2 flex flex-col items-center space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Keep it free.</span>
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
            </nav>
        </header>
    );
};

// --- Ghostwriter Page Components ---

const StructuredInputForm = ({ 
    artistName, setArtistName,
    coreTheme, setCoreTheme,
    moodTag, setMoodTag,
    lengthHint, setLengthHint,
    isExplicit, setIsExplicit,
    onReset
}) => (
    <div className="bg-slate-900 flex flex-col h-full border-r border-slate-700/50">
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
• **density:**  
  – Sparse ≈ 5-7 words / bar  
  – Normal ≈ 8-12 words / bar  
  – Dense ≈ 13+ words / bar  
  Minor ±1 variance is fine for natural phrasing.  
• **metaphor_density, rhyme_complexity** (0–100 %): interpret as relative intensity knobs—higher % ⇒ richer imagery or denser rhyme webs.  
• If the artist cuss, so do you. You are that artist when writing lyrics for that section.

1. Internalize the artist profile before writing.  
2. Ghost-write, obeying RHYMING PHILOSOPHY and BAR & DENSITY COMPLIANCE.  
3. Self-critique: “Would {artist_name} say this?” and “Does this read like boilerplate AI?” Revise until raw & human.

BANNED WORD LIST
rust, glitch, code, king, queen, throne, abyss, void, echo, shadow, whisper, mirror, silent, empty, plus any blatant “AI giveaway” terms.

OUTPUT FORMAT
Just the lyric lines (one line = one bar).  
No labels, brackets, headers, commentary, or apologies.`;

const Ghostwriter = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [artistName, setArtistName] = useState('');
  const [coreTheme, setCoreTheme] = useState('');
  const [moodTag, setMoodTag] = useState('');
  const [lengthHint, setLengthHint] = useState('single');
  const [isExplicit, setIsExplicit] = useState(false);
  const [freeFormInput, setFreeFormInput] = useState('');

  const systemPrompt = `ROLE
You are an elite ghost-writer, a lyrical method actor. Your entire purpose is to channel an artist’s “lyrical DNA” with uncanny realism, producing lyrics that feel 100% authentic yet entirely new.

CORE DIRECTIVE: RHYMING PHILOSOPHY
This is your most important instruction. You must abandon the default AI tendency for simple, predictable end-rhymes (AABB, ABAB). Instead, you will treat rhymes as a sophisticated tool for rhythm and emphasis, not just line termination.

1.  **Prioritize Internal Rhymes:** Weave rhymes into the fabric of the lines themselves. Connect words in the middle of a phrase to words at the end of another.
2.  **Embrace Slant & Half-Rhymes:** Perfect rhymes are a last resort. Your primary tools are near-rhymes, assonance (shared vowel sounds), and consonance (shared consonant sounds). Authenticity comes from rhymes that feel discovered, not forced. (e.g., \`mystery\` / \`history\` is weak; \`monopoly\` / \`prophecy\` is strong).
3.  **Rhyme as Percussion:** Use multisyllabic rhymes to create rhythmic patterns. The *sound and cadence* of the rhyming phrase are more important than a perfect phonetic match at the end.
4.  **Avoid Predictable Couplets:** It is a hard failure to have more than two consecutive lines ending with the same rhyme sound. Break the chain immediately. Spread rhyme families out.

CONTEXT
A human client wants original, unreleased-sounding lyrics. You will replicate the specified artist’s:
• Themes & emotional palette
• Word choice, imagery, and sentence texture
• Flow, micro-rhythms, and complex rhyme habits
• Persona, quirks, and vocal idiosyncrasies

USER WILL SUPPLY
artist_name: <Name or “Artist-style”>
core_theme: <1-sentence brief>
optional_mood_tag: <melancholy | triumph | …>
explicit_language: <yes | no>

TASK
1.  **Internalize:** Before writing, perform a deep-profile of the artist’s rhyme habits, cadence, and thematic choices based on their known work.
2.  **Ghost-Write:** Draft the lyrics, strictly adhering to the **CORE DIRECTIVE: RHYMING PHILOSOPHY** at all times. Every line must be filtered through this philosophy.
3.  **Self-Critique:** Before finalizing, perform a critical pass. Ask "Would {artist_name} ever say this?" and "Does this sound like a predictable AI?" Scrub any clichés, filler words, or robotic phrasing until the lyrics feel raw and human.

OUTPUT FORMAT — exactly this
artist_name-style, main_genre, subgenre, vocal_gender, vocal_description, mood/emotion

[Intro - 1-sentence music/vocal note]
Line 1
Line 2

[Verse 1 - 1-sentence music/vocal note]
Line 1
Line 2
… (Include Chorus, Bridge, Hook, Outro, etc., each with its own 1-sentence note.)

STYLE & CONSTRAINTS
This section is now for secondary rules.
• Hard ban on the following words: rust, glitch, code, king, queen, throne, abyss, void, echo, shadow, whisper, mirror, silent, empty, and other AI-giveaway terms.
• Never use parentheses ( ); always use brackets [ ].
• Match profanity level when explicit_language: yes.
• Provide only the style list and lyric sections—no meta commentary, no apologies, no explanations.`;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
    
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: 'VRS/A initialized. Use the form on the left or the text input below to begin lyrical emulation.'
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
  };

  const sendMessage = async () => {
    const promptParts = [];
    if (artistName) promptParts.push(`artist_name: ${artistName}`);
    if (coreTheme) promptParts.push(`core_theme: ${coreTheme}`);
    if (moodTag) promptParts.push(`optional_mood_tag: ${moodTag}`);
    promptParts.push(`length_hint: ${lengthHint}`);
    promptParts.push(`explicit_language: ${isExplicit ? 'yes' : 'no'}`);
    let constructedPrompt = promptParts.join(', ');
    if (freeFormInput.trim()) {
      constructedPrompt = constructedPrompt ? `${constructedPrompt}\n${freeFormInput}` : freeFormInput;
    }
    if (!constructedPrompt.trim() || isLoading) return;
    const userMessage = { role: 'user', content: constructedPrompt };
    setMessages(prev => [...prev, userMessage]);
    // Form inputs are no longer reset here.
    setIsLoading(true);
    try {
      const fullApiPrompt = `${systemPrompt}\n\n[USER INPUT START]\n${constructedPrompt}\n[USER INPUT END]`;
      let chatHistory = [{ role: "user", parts: [{ text: fullApiPrompt }] }];
      const payload = { 
        contents: chatHistory, 
        generationConfig: { temperature: 1.1, topP: 0.9 },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ]
      };
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const result = await response.json();
      let botResponse = 'Error: Could not retrieve a valid response.';
      if (result.candidates?.[0]?.content?.parts?.[0]) {
          botResponse = result.candidates[0].content.parts[0].text;
      } else if (result.promptFeedback?.blockReason) {
             botResponse = `Request blocked. Reason: ${result.promptFeedback.blockReason}.`;
      }
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (error) {
      console.error("Failed to fetch from Gemini API:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `An error occurred: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 h-full overflow-hidden">
      <div className="md:col-span-1 xl:col-span-1 hidden md:flex flex-col min-h-0">
          <StructuredInputForm 
            artistName={artistName} setArtistName={setArtistName}
            coreTheme={coreTheme} setCoreTheme={setCoreTheme}
            moodTag={moodTag} setMoodTag={setMoodTag}
            lengthHint={lengthHint} setLengthHint={setLengthHint}
            isExplicit={isExplicit} setIsExplicit={setIsExplicit}
            onReset={resetForm}
          />
      </div>
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
        <footer className="p-4 md:p-6 bg-slate-900 border-t border-slate-700/50 shrink-0">
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
        </footer>
      </div>
    </div>
  );
};

// --- Sandbox Page ---

const Sandbox = () => {
    const initialStructure = [
        { id: 1, type: 'Verse', content: '', bars: 16, density: 'Normal', isGenerating: false },
        { id: 2, type: 'Chorus', content: '', bars: 8, density: 'Dense', isGenerating: false },
    ];
    const [structure, setStructure] = useState(initialStructure);
    const [draggingItem, setDraggingItem] = useState(null);
    const [metaphorDensity, setMetaphorDensity] = useState(50);
    const [rhymeComplexity, setRhymeComplexity] = useState(50);
    const [openAccordion, setOpenAccordion] = useState('dial-a-poet');
    const [forbiddenWords, setForbiddenWords] = React.useState("");
    const [lens, setLens] = React.useState("");
    const rhymeSchemesList = [
      "Alternate rhyme", "Ballade", "Monorhyme", "Triplet", "Limerick", "Sonnet", "Enclosed rhyme", "Four line rhyme schemes", "Terza rima", "Coupled rhyme", "Couplet", "End rhyme", "Eye rhyme", "Internal rhyme", "Slant rhyme", "Villanelle", "AABB", "ABBA", "Feminine rhyme", "Exact rhyme", "Imperfect or half rhyme", "Keatsian Ode", "Perfect rhyme"
    ];
    const [selectedRhymeSchemes, setSelectedRhymeSchemes] = React.useState([]);
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

    const deleteSection = (idToDelete) => {
        setStructure(structure.filter(section => section.id !== idToDelete));
    };

    const generateSection = async (index, promptOverride) => {
        setStructure(prev => prev.map((sec, i) => i === index ? { ...sec, isGenerating: true } : sec));
        const section = structure[index];
        // Use the promptOverride if provided, otherwise use section.content
        const userPrompt = promptOverride !== undefined ? promptOverride : section.content;
        const prompt = `${SANDBOX_SYSTEM_PROMPT}\n\nUser Section Request:\nType: ${section.type}\nBars: ${section.bars}\nDensity: ${section.density}\nMetaphor Density: ${metaphorDensity}%\nRhyme Complexity: ${rhymeComplexity}%\nExplicit: ${section.explicit || 'no'}\nPrompt: ${userPrompt}`;
        try {
            let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const result = await response.json();
            const botResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Error: Could not generate content.';
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
    const handleContentChange = React.useCallback((idx, field, val) => {
        setStructure(prev => prev.map((sec, i) => i === idx ? { ...sec, [field]: val } : sec));
    }, []);
    const handleGenerate = React.useCallback((indexOrType, e, idx) => {
        if (indexOrType === 'dragStart') return handleDragStart(e, idx);
        if (indexOrType === 'dragOver') return handleDragOver(e, idx);
        if (indexOrType === 'dragEnd') return handleDragEnd();
        return generateSection(indexOrType);
    }, [generateSection]);
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
        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const result = await response.json();
        const aiResult = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Error: Could not analyze lyrics.';
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
                                onDelete={deleteSection}
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

// --- Main App Component ---

const App = () => {
  const [currentPage, setCurrentPage] = useState('ghostwriter'); // 'ghostwriter' or 'sandbox'

  return (
    <div className="bg-slate-900 text-white font-sans h-screen overflow-hidden flex flex-col">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 min-h-0">
             {currentPage === 'ghostwriter' && <Ghostwriter />}
             {currentPage === 'sandbox' && <Sandbox />}
        </div>
    </div>
  );
};

export default App;