import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, CornerDownLeft, LoaderCircle, FileText, Mic, Smile, ListCollapse, Menu, X, Palette, BrainCircuit, RotateCcw, Copy, Check, ChevronDown } from 'lucide-react';
import * as Sentry from "@sentry/react";
import ReactMarkdown from 'react-markdown';
import { UserProvider } from './UserProvider';
import { StyleKitProvider } from './StyleKitProvider';
import AuthComponent from './Auth';
import { useUser } from './hooks/useUser'; // Import the hook

// Define available models here. 
// The 'id' should match what your backend expects to map to an Azure deployment.
const MODEL_OPTIONS = [
  { id: 'gpt-4.1', name: 'GPT 4.1', premium: false },
  { id: 'DeepSeek-R1', name: 'DeepSeek R1', premium: false },
  { id: 'DeepSeek-V3.1', name: 'DeepSeek V3.1', premium: false },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', premium: true }, 
];

// --- Helper Components ---

// Header Component with Navigation
const Header = ({ currentPage, setCurrentPage }) => {
    const { user, profile, signOut } = useUser();
    const navItems = ['Ghostwriter', 'Analyzer', 'Guide', 'Terms'];
    
    return (
      <header className="p-4 border-b border-slate-700/50 bg-slate-900 z-10 shrink-0">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>{/* Left spacer */}</div>
          
          {/* Center content */}
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-indigo-400">VRS/A</h1>
          </div>
          
          {/* Right navigation */}
          <nav className="flex items-center space-x-2 md:space-x-4">
            {navItems.map(item => (
              <button 
                key={item} 
                onClick={() => setCurrentPage(item.toLowerCase())}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === item.toLowerCase() 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                {item}
              </button>
            ))}
            
            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2 ml-2">
                <span className="text-slate-400 text-sm hidden md:inline">
                  {profile?.username ? `@${profile.username}` : user.email}
                </span>
                <button
                  onClick={async () => {
                    await signOut();
                    setCurrentPage('landing');
                    window.location.reload();
                  }}
                  className="px-3 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ml-2 ${
                  currentPage === 'login'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-600/80 hover:bg-indigo-600 text-white'
                }`}
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </header>
    );
};

// --- Ghostwriter Page Components ---

// Organized rhyme options by category
const rhymePlacementOptions = [
  "End rhyme",
  "Internal rhyme",
  "Cross-line rhyme"
];

const rhymeQualityOptions = [
  "Perfect rhyme",
  "Slant rhyme",
  "Assonance",
  "Consonance",
  "Multisyllabic rhyme"
];

const rhymePatternOptions = [
  "AABB (couplets)",
  "ABAB (alternating)",
  "ABBA (enclosed)",
  "ABCCB Pattern",
  "ABCCA",
  "Free/irregular"
];

const poeticFormOptions = [
  "Haiku",
  "Sonnet",
  "Free verse",
  "Limerick",
  "Villanelle",
  "Elegy",
  "Ode",
  "Acrostic",
  "Sestina",
  "Narrative",
  "Cinquain",
  "Prose",
  "Ekphrastic",
  "Pantoum",
  "Pastoral",
  "Ballad",
  "Ghazal"
];

// Dropdown with checkboxes component
const CheckboxDropdown = ({ label, options, selectedValues, onChange, placeholder = "Select options..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCount = options.filter(opt => selectedValues.includes(opt)).length;
  const displayText = selectedCount > 0 ? `${selectedCount} selected` : placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-slate-400 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-left text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-between"
      >
        <span className={selectedCount > 0 ? "text-white" : "text-slate-500"}>{displayText}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 space-y-1">
            {options.map(option => (
              <label key={option} className="flex items-center space-x-2 text-slate-300 text-xs p-2 hover:bg-slate-700 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => onChange(option)}
                  className="accent-indigo-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StructuredInputForm = ({ 
    artistName, setArtistName,
    coreTheme, setCoreTheme,
    moodTag, setMoodTag,
    bannedWords, setBannedWords,
    lengthHint, setLengthHint,
    isExplicit, setIsExplicit,
    selectedRhymeSchemes, setSelectedRhymeSchemes,
    rhymeDensity, setRhymeDensity,
    rhymeComplexity, setRhymeComplexity,
    temperature, setTemperature, topP, setTopP,
    selectedModel, setSelectedModel,
    profile,
    onReset,
    onCloseMobile
}) => {
  return (
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
        {/* Model Selection Dropdown */}
        <div className="relative">
            <label className="block text-sm font-medium text-slate-400 mb-2">AI Model</label>
            <BrainCircuit className="absolute left-3 top-10 w-5 h-5 text-slate-500" />
            <select 
              value={selectedModel} 
              onChange={e => {
                const model = MODEL_OPTIONS.find(m => m.id === e.target.value);
                // Block premium models for non-pro users
                if (model?.premium && profile.is_pro !== 'true') {
                  return;
                }
                setSelectedModel(e.target.value);
              }} 
              className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-lg p-2.5 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {MODEL_OPTIONS.map(model => (
                <option 
                  key={model.id} 
                  value={model.id} 
                  disabled={model.premium && profile.is_pro !== 'true'}
                >
                  {model.name} {model.premium && profile.is_pro !== 'true' ? '(Studio Pass Only)' : ''}
                </option>
              ))}
            </select>
            {/* Upsell Link */}
            {profile.is_pro !== 'true' && (
               <a href="https://buymeacoffee.com/theelderemo/membership" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 mt-1 hover:underline block">
                 Unlock Claude 3 Opus with Studio Pass
               </a>
            )}
        </div>
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
            <label className="block text-sm font-medium text-slate-400 mb-2">Banned Words</label>
            <textarea value={bannedWords} onChange={e => setBannedWords(e.target.value)} placeholder="e.g., love, heart, forever (comma-separated)" rows="2" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
            <p className="text-xs text-slate-500 mt-1">Words to avoid in lyrics</p>
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
        
        {/* Rhyme Control Section */}
        <div className="space-y-4 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-bold text-indigo-300 mb-3">Rhyme Controls</h3>
          
          {/* Rhyme Density Slider */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Rhyme Density: {rhymeDensity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={rhymeDensity}
              onChange={e => setRhymeDensity(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <p className="text-xs text-slate-500 mt-1">How frequently rhymes appear</p>
          </div>

          {/* Rhyme Complexity Slider */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Rhyme Complexity: {rhymeComplexity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={rhymeComplexity}
              onChange={e => setRhymeComplexity(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <p className="text-xs text-slate-500 mt-1">Multisyllabic & intricate patterns</p>
          </div>

          {/* Rhyme Placement */}
          <CheckboxDropdown
            label="Rhyme Placement"
            options={rhymePlacementOptions}
            selectedValues={selectedRhymeSchemes}
            onChange={(option) => setSelectedRhymeSchemes(
              selectedRhymeSchemes.includes(option)
                ? selectedRhymeSchemes.filter(s => s !== option)
                : [...selectedRhymeSchemes, option]
            )}
            placeholder="Select rhyme placement..."
          />

          {/* Rhyme Quality */}
          <CheckboxDropdown
            label="Rhyme Quality"
            options={rhymeQualityOptions}
            selectedValues={selectedRhymeSchemes}
            onChange={(option) => setSelectedRhymeSchemes(
              selectedRhymeSchemes.includes(option)
                ? selectedRhymeSchemes.filter(s => s !== option)
                : [...selectedRhymeSchemes, option]
            )}
            placeholder="Select rhyme quality..."
          />

          {/* Structure Patterns */}
          <CheckboxDropdown
            label="Structure Patterns"
            options={rhymePatternOptions}
            selectedValues={selectedRhymeSchemes}
            onChange={(option) => setSelectedRhymeSchemes(
              selectedRhymeSchemes.includes(option)
                ? selectedRhymeSchemes.filter(s => s !== option)
                : [...selectedRhymeSchemes, option]
            )}
            placeholder="Select rhyme patterns..."
          />

          {/* Poetic Forms */}
          <CheckboxDropdown
            label="Poetic Forms"
            options={poeticFormOptions}
            selectedValues={selectedRhymeSchemes}
            onChange={(option) => setSelectedRhymeSchemes(
              selectedRhymeSchemes.includes(option)
                ? selectedRhymeSchemes.filter(s => s !== option)
                : [...selectedRhymeSchemes, option]
            )}
            placeholder="Select poetic forms..."
          />
        </div>

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
};

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

    // Function to render text with clickable links
    const renderMessageContent = (content) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = content.split(urlRegex);
        
        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-300 underline"
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

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
                <p className="text-slate-200 whitespace-pre-wrap font-mono text-sm md:text-base pr-8">{renderMessageContent(message.content)}</p>
            </div>
        </div>
    );
};

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

const Ghostwriter = ({ selectedRhymeSchemes, setSelectedRhymeSchemes }) => {
  const { user, profile, loading } = useUser();
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
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar state
  const [temperature, setTemperature] = useState(1);
  const [topP, setTopP] = useState(1);
  const [rhymeDensity, setRhymeDensity] = useState(50);
  const [rhymeComplexity, setRhymeComplexity] = useState(50);
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0].id);

  // --- START: New state and message list for CTA ---
  const [generationCount, setGenerationCount] = useState(0);
  const [ctaMessage, setCtaMessage] = useState('');
  // --- END: New state and message list for CTA ---

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

  // Auth check - show login prompt if not authenticated
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
            onClick={() => window.location.href = '/#login'}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            Log In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  // Wait for profile to load
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <LoaderCircle className="animate-spin text-indigo-400" size={48} />
      </div>
    );
  }

  // Function to generate AI-based sarcastic comment
  const generateSarcasticComment = async (userInput) => {
    return Sentry.startSpan(
      {
        op: "http.client",
        name: "Generate Sarcastic Comment API Call",
      },
      async (span) => {
        span.setAttribute("user_input", userInput);
        
        try {
          const { logger } = Sentry;
          logger.info("Starting sarcastic comment generation", { userInput });
          
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
          const result = data.content || 'Another generation, another dime. Worth it?';
          
          logger.info("Successfully generated sarcastic comment", { 
            userInput, 
            responseStatus: response.status,
            resultLength: result.length
          });
          
          return result;
        } catch (error) {
          const { logger } = Sentry;
          logger.error("Failed to generate sarcastic comment", {
            userInput,
            error: error.message,
            stack: error.stack
          });
          Sentry.captureException(error);
          console.error("Failed to generate sarcastic comment:", error);
          return 'Keep clicking. I will just sell another kidney.';
        }
      }
    );
  };

  const systemPrompt =  `[IDENTITY]

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
rhyme_schemes: ${selectedRhymeSchemes.length > 0 ? selectedRhymeSchemes.join(', '  ) : 'None specified - use my best judgment, avoiding aabb, abab, couplets, and predictable patterns.'}
length_hint: <short | single | double | full song | hook | chorus | bridge | breakdown | outro>

[PRIMARY_TASK]
1.  Internalize the provided artist profile.
2.  Write lyrics that match the **CORE_PHILOSOPHY** (raw, human, conversational) above all else.
3.  Only output the specific section(s) or length implied by the length_hint.
4.  Perform a final self-critique: “Does this sound like the 'Correct' example or the 'Wrong' example?” Revise until it feels human.

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
Techno ↔ House, Trance, Ambient → “Techno / Trance; 138–144 BPM; hypnotic; rolling bassline”
House ↔ Deep, Techno, Electro, Pop → “Deep/Tech House; punchy 909; groovy”
Synthwave ↔ Synth, Electro, 80s, Dark → “Retro arps; neon pads; tape-style reverb”
Lo-fi ↔ Chill, Funk, Jazz → “Soft transients; vinyl texture; mellow BPM”
Orchestral ↔ Epic, Cinematic → “Strings/brass swells; impacts; trailer energy”
</STYLE_PALETTE_KNOWLEDGE_BASE>

[CONSTRAINTS]
* I will NEVER use the following overused "AI giveaway" words: rust, static, glitch, code, king, queen, throne, abyss, void, echo, shadow, whisper, mirror, silent, empty, pavement, neon lights, concrete jungle, shattered dreams, broken wings, acid rain, flickering. I will also avoid any user-supplied banned_words.
* If explicit_language is 'yes', I MUST use profanity and explicit themes appropriate to the artist.
* My output will consist ONLY of the Style Palette and the lyrics. I will provide zero meta-commentary, zero apologies, zero explanations, and no introductory or concluding sentences.
* I will aim for 2-5 descriptive tags per section.
* I will be specific. "60s jangly guitar rhythm" is better than "guitar."
I understand not every song, genre uses every tag type. I will only include relevant tags for the specific song style and mood. I also understand that not every song uses every section (verse, chorus, bridge, etc.). I will only include sections that make sense for the song structure implied by the length_hint and genre. For example, a country song does not have a breakdown, and a short pop single may not have a bridge. Verse lengths may vary by genre and artist style; I will adapt accordingly (e.g., rap verses are often longer than pop verses, with varied line lenghts, density).

Example:
User wants a song by Lil Wayne, your output would be something like:

Style
Genre: "Southern Hip Hop, Dirty South Trap"
Instruments: "Heavy 808 sub bass, snappy snare, chopped vocal sample loop, minimalist percussion"
Tags: "76 BPM; repetitive vocal hook; aggressive lyrical flow; punchy; minimalist; bouncy"

[Intro | spoken producer tag | vocal sample loop "A milli" | heavy 808 bass start]
(Bangladesh)
Young Money
You dig?
Yeah, Mack, I'm goin' in

[Verse 1 | rapid fire flow | aggressive delivery | minimal trap beat | vocal sample loop in background]
A millionaire, I'm a Young Money millionaire
Tougher than Nigerian hair (Woo)
My criteria compared to your career just isn't fair
I'm a venereal disease, like a menstrual bleed
Through the pencil and leak on the sheet of the tablet in my mind
'Cause I don't write shit 'cause I ain't got time
'Cause my seconds, minutes, hours go to the almighty dollar
And the almighty power of that ch-cho-cho-cho-chopper
Sister, brother, son, daughter, father, mother-fuck a copper
Got the Maserati dancin' on the bridge, pussy poppin'
Tell the coppers, "Ha-ha-ha-ha, you can't catch him, you can't stop him"
I go by them goon rules, if you can't beat 'em, then you pop 'em
You can't man 'em, then you mop 'em, you can't stand 'em, then you drop 'em
You pop 'em 'cause we pop 'em like Orville Redenbacher

[Chorus | beat stop | punchy vocal impact | vocal sample loop returns]
Motherfucker, I'm ill, yeah

[Verse 2 | rhythmic flow switch | playful delivery | heavy sub bass | crisp snare]
A million here, a million there
Sicilian bitch with long hair, with coke in her derrière
Like smoking the thinnest air, I open the Lamborghini
Hopin' them crackers see me, like, "Look at that bastard Weezy"
He's a beast, he's a dog, he's a motherfuckin' problem
Okay, you're a goon, but what's a goon to a goblin?
Nothin', nothin', you ain't scarin' nothin'
On some faggot bullshit, call 'em Dennis Rodman
Call me what you want, bitch, call me on my sidekick
Never answer when it's private, damn, I hate a shy bitch
Don't you hate a shy bitch? Yeah, I ate a shy bitch
She ain't shy no more, she changed her name to my bitch, haha
Yeah, nigga, that's my bitch
So when she ask for the money when you through, don't be surprised, bitch (Woo)
And it ain't trickin' if you got it
But you like a bitch with no ass, you ain't got shit
Motherfucker, I'm ill, not sick
And I'm okay, but my watch sick
Yeah, my drop sick, yeah, my Glock sick
And my knot thick, I'm it

[Chorus | beat stop | punchy vocal impact | heavy 808 return]
Motherfucker, I'm ill, yeah

[Verse 3 | relentless flow | intricate lyricism | sparse instrumentation | building intensity]
See, they say I'm rappin' like B.I.G., Jay, and 2Pac
André 3000, where is Erykah Badu at? Who that?
Who that said they gon' beat Lil Wayne?
My name ain't Bic, but I keep that flame, man
Who that one that do that, boy? You knew that, chew that, swallow
And I be the shit, now you got loose bowels
I don't owe you like two vowels
But I would like for you to pay me by the hour, haha
And I'd rather be pushin' flowers
Than to be in the pen, sharin' showers, huh
Tony told us this world was ours
And the Bible told us every girl was sour
Don't play in her garden and don't smell her flower
Call me Mr. Carter or Mr. Lawn Mower
Boy, I got so many bitches, like I'm Mike Lowrey
Even Gwen Stefani said she couldn't doubt me
Motherfucker, I say, "Life ain't shit without me"
Chrome lips pokin' out the coupe, look like it's poutin'
I do what I do, and you do what you can do about it
Bitch, I can turn a crack rock into a mountain, dare me
Don't you compare me 'cause there ain't nobody near me
They don't see me, but they hear me, they don't feel me, but they fear me, I'm illy

[Outro | abrupt ending | vocal sample loop fade]
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
          // Update the endpoint name if needed
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

          // --- START: CTA Logic - Set message after successful generation ---
          const newCount = generationCount + 1;
          setGenerationCount(newCount);

          if (newCount > 0 && newCount % 2 === 0) {
            const comment = await generateSarcasticComment(constructedPrompt);
            setCtaMessage(comment);
          }
          // --- END: CTA Logic ---

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
            {/* Discord Link */}
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
        {/* --- END: Wrapper for CTA and Input Box --- */}
      </div>
    </div>
  );
};

// --- Analyzer Page ---

const Analyzer = () => {
    const { user, loading } = useUser();
    const [lyricsInput, setLyricsInput] = useState('');
    const [stylePaletteResult, setStylePaletteResult] = useState('');
    const [sunoTagsResult, setSunoTagsResult] = useState('');
    const [statSheetResult, setStatSheetResult] = useState('');
    const [rhymeVisualizerResult, setRhymeVisualizerResult] = useState('');
    const [isAnalyzingStylePalette, setIsAnalyzingStylePalette] = useState(false);
    const [isGeneratingSunoTags, setIsGeneratingSunoTags] = useState(false);
    const [isGeneratingStatSheet, setIsGeneratingStatSheet] = useState(false);
    const [isAnalyzingRhymes, setIsAnalyzingRhymes] = useState(false);

    // Auth check - show login prompt if not authenticated
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
                    <p className="text-slate-400 mb-6">Please log in to access Analyzer mode.</p>
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

    // API call helper
    const callAI = async (prompt, setLoading, setResult) => {
        setLoading(true);
        setResult('');
        try {
            const messagesPayload = [{ role: 'user', content: prompt }];
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
                body: JSON.stringify({ messages: messagesPayload })
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();
            const aiResult = data.content || 'Error: Could not process request.';
            setResult(aiResult);
        } catch (error) {
            setResult(`An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const STYLE_PALETTE_PROMPT = `You are a world-class musicologist and lyric analyst. Given a set of lyrics, extract a detailed "style palette" describing:
- Main genre and subgenre
- Typical themes and emotional palette
- Word choice, imagery, and recurring motifs
- Flow, rhyme habits, and rhythmic quirks
- Persona, vocal style, and unique artist signatures

Output a concise but information-dense summary, suitable for use as a reference for ghostwriting in this style. Do not repeat the lyrics. Do not include meta commentary or apologies.`;

    const SUNO_TAG_GENERATOR_PROMPT = `You are an expert at generating Suno AI-compatible style tags. Based on the lyrical analysis provided, generate:

Genre: [primary genre with optional subgenre]
Instruments: [comma-separated list of key instruments that fit the style]
Tags: [comma-separated stylistic descriptors, mood tags, and production elements]

Keep it concise. Match the vibe of the analyzed lyrics. Output ONLY the three lines above, no additional commentary.`;

    const STAT_SHEET_PROMPT = `You are a lyrical analyst. Analyze the provided lyrics and generate a detailed "Stat-Sheet" with the following metrics:

1. **Lexical Density**: Calculate (Unique words / Total words) × 100 and express as a percentage
2. **Sentiment Analysis**: Break down the emotional content into percentages (e.g., "60% Melancholy, 25% Aggressive, 15% Reflective")
3. **Reading Level**: Estimate the grade level (e.g., "Grade 8 reading level")
4. **Banned Word Counter**: Count instances of generic/cliché words like: shadow, mirror, echo, void, abyss, whisper, silent, empty, king, queen, throne, rust, static, glitch, code, darkness, light (list any found)
5. **Additional Insights**: Note any standout linguistic patterns (alliteration frequency, average syllables per word, etc.)

Format as a clean stat sheet. Be precise with numbers.`;

    const RHYME_VISUALIZER_PROMPT = `You are a rhyme analysis expert. Analyze the provided lyrics and identify ALL rhymes, categorizing them as:

**Perfect Rhymes**: Exact sound matches (e.g., cat/hat, time/rhyme)
**Slant Rhymes**: Near-rhymes or imperfect matches (e.g., shape/keep, soul/cold)
**Internal Rhymes**: Rhymes within a single line (not just at line ends)

For each category, list the rhyming pairs/groups you found, citing the specific words. Present this as a structured analysis that helps the user understand the rhyme structure.`;

    const handleStylePaletteAnalysis = () => {
        const prompt = `${STYLE_PALETTE_PROMPT}\n\nLyrics to analyze:\n${lyricsInput}`;
        callAI(prompt, setIsAnalyzingStylePalette, setStylePaletteResult);
    };

    const handleGenerateSunoTags = () => {
        if (stylePaletteResult) {
            // If Style Palette exists, use it
            const prompt = `${SUNO_TAG_GENERATOR_PROMPT}\n\nLyrical Analysis:\n${stylePaletteResult}`;
            callAI(prompt, setIsGeneratingSunoTags, setSunoTagsResult);
        } else {
            // Otherwise, generate directly from lyrics
            const prompt = `${SUNO_TAG_GENERATOR_PROMPT}\n\nAnalyze these lyrics and generate appropriate tags:\n${lyricsInput}`;
            callAI(prompt, setIsGeneratingSunoTags, setSunoTagsResult);
        }
    };

    const handleGenerateStatSheet = () => {
        const prompt = `${STAT_SHEET_PROMPT}\n\nLyrics to analyze:\n${lyricsInput}`;
        callAI(prompt, setIsGeneratingStatSheet, setStatSheetResult);
    };

    const handleRhymeVisualization = () => {
        const prompt = `${RHYME_VISUALIZER_PROMPT}\n\nLyrics to analyze:\n${lyricsInput}`;
        callAI(prompt, setIsAnalyzingRhymes, setRhymeVisualizerResult);
    };

    return (
        <div className="h-full w-full flex flex-col overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-slate-700/50 bg-slate-900">
                <h2 className="text-2xl font-bold text-indigo-400 mb-2">Lyric Analyzer</h2>
                <p className="text-slate-400 text-sm">Paste your lyrics below and deconstruct them with powerful AI analysis tools.</p>
            </div>
            
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left Panel - Input Area */}
                <div className="w-full lg:w-1/2 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-700/50 flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">Paste Lyrics</h3>
                    <textarea
                        value={lyricsInput}
                        onChange={(e) => setLyricsInput(e.target.value)}
                        placeholder="Paste your lyrics here for analysis..."
                        className="flex-1 w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm"
                    />
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                            onClick={handleStylePaletteAnalysis}
                            disabled={isAnalyzingStylePalette || !lyricsInput.trim()}
                            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isAnalyzingStylePalette ? <LoaderCircle size={18} className="animate-spin mr-2" /> : <Palette size={18} className="mr-2" />}
                            Style Palette
                        </button>
                        <button
                            onClick={handleGenerateStatSheet}
                            disabled={isGeneratingStatSheet || !lyricsInput.trim()}
                            className="px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isGeneratingStatSheet ? <LoaderCircle size={18} className="animate-spin mr-2" /> : <FileText size={18} className="mr-2" />}
                            Stat-Sheet
                        </button>
                        <button
                            onClick={handleRhymeVisualization}
                            disabled={isAnalyzingRhymes || !lyricsInput.trim()}
                            className="px-4 py-3 bg-pink-600 hover:bg-pink-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isAnalyzingRhymes ? <LoaderCircle size={18} className="animate-spin mr-2" /> : <ListCollapse size={18} className="mr-2" />}
                            Rhyme Analysis
                        </button>
                        <button
                            onClick={handleGenerateSunoTags}
                            disabled={isGeneratingSunoTags || !lyricsInput.trim()}
                            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isGeneratingSunoTags ? <LoaderCircle size={18} className="animate-spin mr-2" /> : <Mic size={18} className="mr-2" />}
                            Suno Tags
                        </button>
                    </div>
                </div>

                {/* Right Panel - Results Area */}
                <div className="w-full lg:w-1/2 p-4 lg:p-6 flex flex-col overflow-hidden">
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">Analysis Results</h3>
                    <div className="flex-1 space-y-4 overflow-y-auto">
                        {/* Style Palette Result */}
                        {stylePaletteResult && (
                            <div className="bg-slate-800/50 border border-indigo-500/50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-indigo-400 flex items-center">
                                        <Palette size={16} className="mr-2" /> Style Palette (Lyrical DNA)
                                    </h4>
                                </div>
                                <div className="text-slate-200 text-sm prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown>{stylePaletteResult}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {/* Suno Tags Result */}
                        {sunoTagsResult && (
                            <div className="bg-slate-800/50 border border-emerald-500/50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-emerald-400 flex items-center">
                                        <Mic size={16} className="mr-2" /> Suno AI Style Tags
                                    </h4>
                                </div>
                                <div className="text-slate-200 text-sm font-mono prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown>{sunoTagsResult}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {/* Stat Sheet Result */}
                        {statSheetResult && (
                            <div className="bg-slate-800/50 border border-purple-500/50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-purple-400 flex items-center">
                                        <FileText size={16} className="mr-2" /> Stat-Sheet
                                    </h4>
                                </div>
                                <div className="text-slate-200 text-sm prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown>{statSheetResult}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {/* Rhyme Visualizer Result */}
                        {rhymeVisualizerResult && (
                            <div className="bg-slate-800/50 border border-pink-500/50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-pink-400 flex items-center">
                                        <ListCollapse size={16} className="mr-2" /> Rhyme Analysis
                                    </h4>
                                </div>
                                <div className="text-slate-200 text-sm prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown>{rhymeVisualizerResult}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!stylePaletteResult && !sunoTagsResult && !statSheetResult && !rhymeVisualizerResult && (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                <div className="text-center">
                                    <BrainCircuit size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>Analysis results will appear here</p>
                                </div>
                            </div>
                        )}
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
      <p className="text-slate-300 mb-4">Drag sections. Set bars and density. Micromanage your song like you’re producing in Ableton on a cracked license.</p>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 7: Dial-a-Poet</h3>
      <p className="text-slate-300 mb-4">Adjust <strong>Metaphor Density</strong> (literal vs. abstract) and <strong>Rhyme Complexity</strong> (simple end-rhymes vs. complex internal rhymes). If you don’t know what those mean, guess and test.</p>

      <h3 className="text-lg font-medium text-slate-200 mb-2">Step 8: Style Palette</h3>
      <p className="text-slate-300 mb-4">Paste existing lyrics to get a detailed breakdown of that artist’s DNA. Useful for mimicry and theft (the legal kind).</p>

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

  // Handle hash-based routing for login navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (hash === 'login') {
        setCurrentPage('login');
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <UserProvider>
      <StyleKitProvider>
        <div className="bg-slate-900 text-white font-sans h-screen flex flex-col">
          {currentPage !== 'landing' && <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {currentPage === 'landing' && <Landing setCurrentPage={setCurrentPage} />}
            {currentPage === 'ghostwriter' && <Ghostwriter selectedRhymeSchemes={selectedRhymeSchemes} setSelectedRhymeSchemes={setSelectedRhymeSchemes} />}
            {currentPage === 'analyzer' && <Analyzer />}
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
