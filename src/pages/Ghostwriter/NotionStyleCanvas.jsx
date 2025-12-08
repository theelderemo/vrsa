/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command, LoaderCircle, Lock, Send, Sparkles, Wand2, Waypoints } from 'lucide-react';
import { useUser } from '../../hooks/useUser';

const defaultCanvasText = `Draft your piece like you're in Notion.
Use the canvas as a full-page document and bring in AI only when you need it.

Quick ideas:
- Use "/outline" to map the sections you want to write next.
- Highlight a block and tap Rewrite to adjust tone.
- Add context in the sidebar chat so the agent writes in your voice.`;

const NotionStyleCanvas = () => {
  const { user, profile, loading } = useUser();
  const navigate = useNavigate();
  const [editorContent, setEditorContent] = useState(defaultCanvasText);
  const [selectedText, setSelectedText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content:
        "Welcome to the Notion-Style Canvas. Keep writing in the main panel and loop me in when you need an autofill, rewrite, or a quick skill.",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aiStatus, setAiStatus] = useState('Idle');
  const editorRef = useRef(null);

  const isPro = profile?.is_pro === 'true';

  useEffect(() => {
    document.title = 'Notion-Style Canvas | Ghostwriter | VRS/A';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Write in a Notion-inspired canvas with a sidebar chat. Highlight blocks to rewrite, autofill, and keep long-form context for your agent.',
      );
    }
  }, []);

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
          <p className="text-slate-400 mb-6">Log in to access the Notion-Style Canvas and keep your drafts synced.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            Log In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  const syncSelection = () => {
    const selection = window.getSelection();
    if (!selection) return;
    const text = selection.toString();
    setSelectedText(text.trim());
  };

  const handleChatSubmit = (event) => {
    event.preventDefault();
    if (!chatInput.trim()) return;

    const nextMessages = [...chatMessages, { role: 'user', content: chatInput.trim() }];
    setChatMessages(nextMessages);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Got it. I will keep that in mind while you edit the canvas. Highlight a block and choose an AI skill when you are ready.',
        },
      ]);
    }, 300);
  };

  const handleAiAction = (action) => {
    if (!isPro) {
      setAiStatus('AI skills are locked — Studio Pass required.');
      return;
    }

    const target = selectedText || editorContent.split('\n').slice(-2).join('\n');
    setAiStatus(`Working on ${action.toLowerCase()}...`);

    setTimeout(() => {
      setAiStatus('Idle');
      setEditorContent((prev) => `${prev}\n\n[AI ${action}]\n${target}\n`);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Applied ${action.toLowerCase()} to ${selectedText ? 'your selection' : 'the latest block'}.`,
        },
      ]);
    }, 500);
  };

  const quickCommands = [
    { label: 'Autofill next section', icon: <Sparkles size={16} />, action: 'Autofill' },
    { label: 'Rewrite highlighted block', icon: <Wand2 size={16} />, action: 'Rewrite' },
    { label: 'Tighten wording', icon: <Command size={16} />, action: 'Tighten' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6">
        <aside className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-4 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300">
              <Waypoints size={18} />
              <p className="text-sm font-semibold uppercase tracking-wide">Sidebar chat</p>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Pin context, share preferences, and keep your agent aligned while you edit in the main canvas.
            </p>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[40vh] pr-2">
            {chatMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`p-3 rounded-lg border ${message.role === 'assistant' ? 'border-indigo-700/40 bg-indigo-900/30' : 'border-slate-700 bg-slate-800/50'}`}
              >
                <p className="text-xs text-slate-400 uppercase mb-1">{message.role === 'assistant' ? 'Agent' : 'You'}</p>
                <p className="text-sm text-slate-100 whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} className="space-y-2">
            <label className="text-xs text-slate-400">Add context or instructions</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tell the agent how you want this written..."
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
                aria-label="Send chat message"
              >
                <Send size={16} />
              </button>
            </div>
          </form>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
            <h3 className="text-sm font-semibold text-indigo-200">Personalize your Agent’s instructions and memory</h3>
            <p className="text-slate-400 text-sm mt-1">
              Save style notes, references, and rules so the agent writes like a teammate who remembers your preferences over time.
            </p>
            <button
              type="button"
              className="mt-3 w-full px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm font-semibold text-white transition-colors"
              onClick={() => setChatMessages((prev) => [
                ...prev,
                {
                  role: 'assistant',
                  content:
                    'Memory updated. Your agent will prioritize the latest instructions and keep them sticky for this canvas.',
                },
              ])}
            >
              Save instructions to memory
            </button>
          </div>
        </aside>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-indigo-300 font-semibold">Notion-Style Canvas</p>
              <h1 className="text-2xl font-bold text-white mt-1">Draft like a word processor, call AI like an agent</h1>
              <p className="text-slate-400 text-sm mt-2 max-w-3xl">
                Keep your hands on the keyboard. Highlight context, tap an AI skill, and let the agent rewrite or autofill inline while you stay in control.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200">
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-300" />
                AI status:
              </span>
              <span className={`font-semibold ${isPro ? 'text-emerald-300' : 'text-slate-400'}`}>{aiStatus}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickCommands.map((command) => (
              <button
                key={command.action}
                type="button"
                onClick={() => handleAiAction(command.action)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  isPro
                    ? 'border-indigo-700 bg-indigo-900/40 hover:bg-indigo-900/70 text-indigo-100'
                    : 'border-slate-700 bg-slate-800/60 text-slate-400 cursor-not-allowed'
                }`}
              >
                {command.icon}
                {command.label}
                {!isPro && <Lock size={14} className="text-amber-300" />}
              </button>
            ))}
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setEditorContent(e.currentTarget.innerText)}
            onKeyUp={syncSelection}
            onMouseUp={syncSelection}
            className="min-h-[420px] rounded-xl border border-slate-800 bg-slate-900/80 p-5 text-base text-slate-100 leading-relaxed shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {editorContent}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-indigo-200 font-semibold">
                <Command size={16} />
                One-click AI skills (no prompt required)
              </div>
              <p className="text-slate-400 text-sm">
                Type "/" to surface shortcuts like outline, summarize, or turn notes into lyrics. Prompts still work, but quick skills keep you moving.
              </p>
              <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                <li>Highlight any block to rewrite tone or tighten.</li>
                <li>Run autofill on the next section to draft in-line.</li>
                <li>The agent keeps context of the entire page when unlocked.</li>
              </ul>
              {!isPro && (
                <p className="text-amber-300 text-sm font-semibold mt-1">Studio Pass required to activate AI on this canvas.</p>
              )}
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-indigo-200 font-semibold">
                <Wand2 size={16} />
                Prompt-aware editing
              </div>
              <p className="text-slate-400 text-sm">
                The agent reads the entire canvas before editing, so it can rewrite selected text or fill in the blanks without losing your voice.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-300 mt-2">
                <span className="px-2 py-1 rounded bg-slate-700 text-xs uppercase tracking-wide">Selected</span>
                <span className="truncate" title={selectedText || 'No text highlighted yet'}>
                  {selectedText || 'Highlight text in the canvas to target AI actions.'}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NotionStyleCanvas;
