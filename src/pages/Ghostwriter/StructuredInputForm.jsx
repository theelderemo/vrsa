import React from 'react';
import { X, RotateCcw, BrainCircuit, Mic, FileText, Smile, ListCollapse, Trash2, Undo2, Redo2, Download } from 'lucide-react';
import CheckboxDropdown from '../../components/ui/CheckboxDropdown';
import MemoryToggle from '../../components/ui/MemoryToggle';
import StructuredInputToggle from '../../components/ui/StructuredInputToggle';
import { 
  MODEL_OPTIONS, 
  rhymePlacementOptions, 
  rhymeQualityOptions, 
  rhymePatternOptions, 
  poeticFormOptions 
} from '../../lib/constants';

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
  memoryEnabled, onMemoryToggle,
  useStructuredInput, onStructuredInputToggle,
  onClearConversation,
  canUndo, onUndo,
  canRedo, onRedo,
  onExportConversation,
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
        
        {/* Memory Toggle */}
        <MemoryToggle 
          enabled={memoryEnabled}
          onChange={onMemoryToggle}
          className="mb-2"
        />
        
        {/* Structured Input Toggle */}
        <StructuredInputToggle 
          enabled={useStructuredInput}
          onChange={onStructuredInputToggle}
          className="mb-2"
        />
        
        {/* Clear Conversation Button */}
        {memoryEnabled && (
          <button
            onClick={onClearConversation}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors text-sm"
          >
            <Trash2 size={14} />
            Clear Conversation History
          </button>
        )}
        
        {/* Edit History Controls */}
        <div className="flex gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo last edit"
          >
            <Undo2 size={14} />
            Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo last undone edit"
          >
            <Redo2 size={14} />
            Redo
          </button>
        </div>
        
        {/* Export Conversation Button */}
        <button
          onClick={onExportConversation}
          className="w-full flex items-center justify-center gap-2 p-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors text-sm"
        >
          <Download size={14} />
          Export Conversation
        </button>
        
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

export default StructuredInputForm;
