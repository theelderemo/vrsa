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

import React, { useState } from 'react';
import { X, RotateCcw, BrainCircuit, Mic, FileText, Smile, ListCollapse, Trash2, Download, Shield, History, FolderPlus, Pencil, Check, Sliders, Music, Settings } from 'lucide-react';
import CheckboxDropdown from '../../components/ui/CheckboxDropdown';
import MemoryToggle from '../../components/ui/MemoryToggle';
import StructuredInputToggle from '../../components/ui/StructuredInputToggle';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/Accordion';
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
  onDeleteAllHistory,
  onShowPrivacy,
  onExportConversation,
  onReset,
  onCloseMobile,
  // Session management props
  userSessions = [],
  currentSessionId,
  currentSessionName = '',
  onCreateNewSession,
  onSwitchSession,
  onRenameSession,
  onDeleteSession
}) => {
  const [exportFormat, setExportFormat] = useState('json');
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(currentSessionName);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  return (
    <div className="bg-slate-900 flex flex-col h-full border-r border-slate-700/50 relative overflow-hidden">
      {/* Header with close button on mobile */}
      <div className="flex items-center justify-between gap-2 p-3 md:p-4 shrink-0 border-b border-slate-700/30">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-indigo-400 truncate min-w-0">Structured Input</h2>
        {/* Mobile close button - ALWAYS VISIBLE ON MOBILE */}
        {onCloseMobile && (
          <button
            className="md:hidden bg-slate-800 p-2 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-700 focus:outline-none shrink-0 z-50"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-3 space-y-3">
        {/* Session Manager Section */}
        <div className="space-y-2 bg-gradient-to-br from-indigo-900/30 to-slate-800/50 rounded-lg p-2.5 sm:p-3 border border-indigo-600/30">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-indigo-300 flex items-center gap-1.5 sm:gap-2 min-w-0">
              <FolderPlus size={14} className="shrink-0" />
              <span className="truncate">My Projects</span>
            </h3>
            <span className="text-xs text-slate-500 shrink-0">{userSessions.length} saved</span>
          </div>
          
          {/* Projects Dropdown with New Project option */}
          {isRenaming ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                placeholder="Project name..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onRenameSession && onRenameSession(renameValue);
                    setIsRenaming(false);
                  } else if (e.key === 'Escape') {
                    setRenameValue(currentSessionName);
                    setIsRenaming(false);
                  }
                }}
              />
              <button
                onClick={() => {
                  onRenameSession && onRenameSession(renameValue);
                  setIsRenaming(false);
                }}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm transition-colors"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => {
                  setRenameValue(currentSessionName);
                  setIsRenaming(false);
                }}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* New Project Button */}
              <button
                onClick={() => onCreateNewSession && onCreateNewSession()}
                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg p-2 text-white text-xs sm:text-sm font-medium transition-colors"
              >
                <FolderPlus size={14} className="shrink-0" />
                <span>New Project</span>
              </button>
              
              {/* No Project Option */}
              <button
                onClick={() => onSwitchSession && onSwitchSession(null)}
                className={`w-full flex items-center justify-between gap-2 rounded-lg p-2 text-xs sm:text-sm transition-colors ${
                  !currentSessionId 
                    ? 'bg-slate-700 text-white border border-indigo-500' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <span className="flex-1 text-left truncate">No Project</span>
              </button>
              
              {/* Existing Projects List */}
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {userSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center gap-1.5 rounded-lg p-2 text-xs sm:text-sm transition-colors group ${
                      currentSessionId === session.id 
                        ? 'bg-slate-700 text-white border border-indigo-500' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => onSwitchSession && onSwitchSession(session.id)}
                      className="flex-1 text-left truncate min-w-0"
                      title={session.name || `Project ${new Date(session.updated_at).toLocaleDateString()}`}
                    >
                      {session.name || `Project ${new Date(session.updated_at).toLocaleDateString()}`}
                    </button>
                    
                    {currentSessionId === session.id && (
                      <button
                        onClick={() => {
                          setRenameValue(currentSessionName);
                          setIsRenaming(true);
                        }}
                        className="p-1 hover:bg-slate-600 rounded text-slate-400 hover:text-indigo-400 transition-colors shrink-0"
                        title="Rename project"
                      >
                        <Pencil size={12} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => setShowDeleteConfirm(session.id)}
                      className="p-1 hover:bg-red-600/20 rounded text-slate-400 hover:text-red-400 transition-colors shrink-0"
                      title="Delete project"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Settings Accordion */}
        <Accordion type="multiple" defaultValue={[]} className="w-full bg-slate-800/30">
          {/* AI Model & Memory Settings */}
          <AccordionItem value="model">
            <AccordionTrigger icon={<BrainCircuit className="h-4 w-4" />}>
              AI Model & Memory
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {/* Model Selection Dropdown */}
                <div className="relative">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">AI Model</label>
                  <select 
                    value={selectedModel} 
                    onChange={e => {
                      const model = MODEL_OPTIONS.find(m => m.id === e.target.value);
                      if (model?.premium && profile.is_pro !== 'true') return;
                      if (model?.beta && profile.is_beta !== 'true') return;
                      setSelectedModel(e.target.value);
                    }} 
                    className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {MODEL_OPTIONS.map(model => (
                      <option 
                        key={model.id} 
                        value={model.id} 
                        disabled={(model.premium && profile.is_pro !== 'true') || (model.beta && profile.is_beta !== 'true')}
                      >
                        {model.name} {model.premium && profile.is_pro !== 'true' ? '(Studio Pass Only)' : model.beta && profile.is_beta !== 'true' ? '(Beta Testers Only)' : ''}
                      </option>
                    ))}
                  </select>
                  {profile.is_pro !== 'true' && (
                    <a href="https://buymeacoffee.com/theelderemo/membership" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 mt-1 hover:underline block">
                      Unlock Claude 3 Opus with Studio Pass
                    </a>
                  )}
                </div>
                
                <MemoryToggle 
                  enabled={memoryEnabled}
                  onChange={onMemoryToggle}
                />
                
                <StructuredInputToggle 
                  enabled={useStructuredInput}
                  onChange={onStructuredInputToggle}
                />
                
                {memoryEnabled && (
                  <button
                    onClick={onClearConversation}
                    className="w-full flex items-center justify-center gap-2 p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors text-xs"
                  >
                    <Trash2 size={12} />
                    Clear Conversation
                  </button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Lyrics Input Settings */}
          <AccordionItem value="lyrics">
            <AccordionTrigger icon={<Mic className="h-4 w-4" />}>
              Lyrics Settings
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="relative">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Artist Name</label>
                  <input type="text" value={artistName} onChange={e => setArtistName(e.target.value)} placeholder="e.g., Frank Ocean" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="relative">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Core Theme</label>
                  <textarea value={coreTheme} onChange={e => setCoreTheme(e.target.value)} placeholder="e.g., Unrequited love in the digital age" rows="2" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                </div>
                <div className="relative">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Mood Tag</label>
                  <input type="text" value={moodTag} onChange={e => setMoodTag(e.target.value)} placeholder="e.g., melancholy, nostalgic" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="relative">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Banned Words</label>
                  <textarea value={bannedWords} onChange={e => setBannedWords(e.target.value)} placeholder="e.g., love, heart, forever" rows="2" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                  <p className="text-xs text-slate-500 mt-1">Comma-separated words to avoid</p>
                </div>
                <div className="relative">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Length</label>
                  <select value={lengthHint} onChange={e => setLengthHint(e.target.value)} className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>short</option><option>single</option><option>double</option><option>full song</option><option>hook</option><option>chorus</option><option>bridge</option><option>breakdown</option><option>outro</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" checked={isExplicit} onChange={e => setIsExplicit(e.target.checked)} className="sr-only" />
                      <div className={`block w-12 h-6 rounded-full ${isExplicit ? 'bg-indigo-600' : 'bg-slate-700'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isExplicit ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-slate-300 text-sm">Explicit Language</div>
                  </label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Rhyme Controls */}
          <AccordionItem value="rhyme">
            <AccordionTrigger icon={<Music className="h-4 w-4" />}>
              Rhyme Controls
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
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

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
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
            </AccordionContent>
          </AccordionItem>

          {/* Advanced Settings */}
          <AccordionItem value="advanced">
            <AccordionTrigger icon={<Sliders className="h-4 w-4" />}>
              Advanced Settings
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Temperature: {temperature}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.01"
                    value={temperature}
                    onChange={e => setTemperature(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Higher = more creative/random</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Top-p: {topP}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.01"
                    value={topP}
                    onChange={e => setTopP(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Nucleus sampling threshold</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Data & Export */}
          <AccordionItem value="data">
            <AccordionTrigger icon={<Settings className="h-4 w-4" />}>
              Data & Export
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <button
                  onClick={onShowPrivacy}
                  className="w-full flex items-center justify-center gap-2 p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors text-xs"
                >
                  <Shield size={12} />
                  Privacy & Data
                </button>
                
                <button
                  onClick={onDeleteAllHistory}
                  className="w-full flex items-center justify-center gap-2 p-2 bg-red-900/20 hover:bg-red-900/30 border border-red-600/30 rounded-lg text-red-400 hover:text-red-300 transition-colors text-xs"
                >
                  <History size={12} />
                  Delete All History
                </button>
                
                <button
                  onClick={onReset}
                  className="w-full flex items-center justify-center gap-2 p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors text-xs"
                >
                  <RotateCcw size={12} />
                  Reset Form
                </button>
                
                <div className="pt-2 border-t border-slate-700/50">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Export Format</label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="json">JSON (structured data)</option>
                    <option value="txt">TXT (plain text)</option>
                    <option value="pdf">PDF (print to PDF)</option>
                  </select>
                  
                  <button
                    onClick={() => onExportConversation(exportFormat)}
                    className="w-full mt-2 flex items-center justify-center gap-2 p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors text-xs"
                  >
                    <Download size={12} />
                    Export Conversation
                  </button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-4 sm:p-6 max-w-sm w-full border border-slate-700 mx-4">
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">Delete Project?</h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-4">
              This will permanently delete this project and all its chat history. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onDeleteSession && onDeleteSession(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }}
                className="flex-1 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-3 sm:px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StructuredInputForm;
