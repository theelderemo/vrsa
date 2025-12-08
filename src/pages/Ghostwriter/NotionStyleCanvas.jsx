/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command, LoaderCircle, Lock, Send, Sparkles, Wand2, Waypoints } from 'lucide-react';
import { useUser } from '../../hooks/useUser';

const NotionStyleCanvas = () => {
  const { user, profile, loading } = useUser();
  const navigate = useNavigate();
  const [editorContent, setEditorContent] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content:
        "Welcome to the Canvas. Keep writing in the main panel and loop me in when you need an autofill, rewrite, or a quick skill.",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [agentInstructions, setAgentInstructions] = useState('');
  const editorRef = useRef(null);

  const isPro = profile?.is_pro === 'true';

  useEffect(() => {
    document.title = 'Canvas | Ghostwriter | VRS/A';
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
          <p className="text-slate-400 mb-6">Log in to access the Canvas and keep your drafts synced.</p>
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

  const contentBeforeCaret = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) return '';

    const range = selection.getRangeAt(0).cloneRange();
    range.selectNodeContents(editorRef.current);
    range.setEnd(selection.focusNode, selection.focusOffset);
    return range.toString();
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
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'AI skills are locked — unlock with Studio Pass to run inline edits and completions.',
        },
      ]);
      return;
    }

    const target = selectedText || editorContent.split('\n').slice(-2).join('\n');

    setEditorContent((prev) => `${prev}\n\n[AI ${action}]\n${target}\n`);
    setChatMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `Applied ${action.toLowerCase()} to ${selectedText ? 'your selection' : 'the latest block'}.`,
      },
    ]);
  };

  const handleContentChange = (e) => {
    const text = e.currentTarget.innerText;
    setEditorContent(text);

    const beforeCaret = contentBeforeCaret();
    const lastWord = beforeCaret.split(/\s/).pop() || '';

    if (lastWord.startsWith('/')) {
      setSlashQuery(lastWord.slice(1));
      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
      setSlashQuery('');
    }
  };

  const quickCommands = [
    { label: 'Autofill next section', icon: <Sparkles size={16} />, action: 'Autofill' },
    { label: 'Rewrite highlighted block', icon: <Wand2 size={16} />, action: 'Rewrite' },
    { label: 'Tighten wording', icon: <Command size={16} />, action: 'Tighten' },
  ];

  const slashCommands = [
    'Translate to',
    'Continue writing',
    'Ask a question',
    'Ask about this page',
    'Make shorter',
    'See more',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6">
        <aside className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-4 flex flex-col gap-4 sticky top-6 h-fit">
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
            <h3 className="text-sm font-semibold text-indigo-200">Agent instructions</h3>
            <p className="text-slate-400 text-sm mt-1">
              Keep personal notes, voice rules, and references in one place.
            </p>
            <button
              type="button"
              className="mt-3 w-full px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm font-semibold text-white transition-colors"
              onClick={() => setShowInstructionsModal(true)}
            >
              Open instructions
            </button>
          </div>
        </aside>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-indigo-300 font-semibold">Canvas</p>
                <h1 className="text-2xl font-bold text-white mt-1">Write like a doc, pull AI like a teammate</h1>
                <p className="text-slate-400 text-sm mt-2 max-w-3xl">
                  Whole-page editing with inline completions. Type "/" for quick skills, highlight a block to rewrite, and keep chat context pinned in the sidebar.
                </p>
              </div>
              {!isPro && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200">
                  <Lock size={16} className="text-amber-300" />
                  <span>Studio Pass required for AI edits</span>
                </div>
              )}
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
          </div>

          <div className="relative bg-slate-950/80 border border-slate-800 rounded-xl shadow-inner">
            <div className="p-5 space-y-6">
              <div className="relative">
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleContentChange}
                  onKeyUp={syncSelection}
                  onMouseUp={syncSelection}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowSlashMenu(false);
                    }
                  }}
                  className="min-h-[520px] rounded-xl bg-slate-900/60 p-5 text-base text-slate-100 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {!editorContent && (
                  <div className="pointer-events-none absolute left-5 top-5 text-slate-500 text-base">
                    Start writing. Use "/" to open AI commands.
                  </div>
                )}

                {showSlashMenu && (
                  <div className="absolute left-5 top-[20%] z-10 w-72 rounded-xl bg-slate-800 border border-slate-700 shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Commands</p>
                      <p className="text-sm text-white font-semibold mt-1">AI</p>
                      <p className="text-xs text-slate-400">Type "/" for quick actions</p>
                    </div>
                    <ul className="max-h-64 overflow-y-auto">
                      {slashCommands
                        .filter((command) => command.toLowerCase().includes(slashQuery.toLowerCase()))
                        .map((command) => (
                          <li key={command}>
                            <button
                              type="button"
                              onClick={() => handleAiAction(command)}
                              className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm ${
                                isPro
                                  ? 'text-slate-100 hover:bg-slate-700/70'
                                  : 'text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              <span>{command}</span>
                              <span className="text-xs text-slate-400">AI action</span>
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-4 right-4 flex flex-col gap-3 w-[320px]">
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-indigo-200 font-semibold">
                  <Sparkles size={16} />
                  AI shortcut dock
                </div>
                {['Translate to', 'Continue writing', 'Ask a question', 'Ask about this page', 'Make shorter', 'See more'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleAiAction(label)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm border transition-colors ${
                      isPro
                        ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-100'
                        : 'border-slate-700 bg-slate-900 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Command size={14} />
                      {label}
                    </span>
                    <span className="text-xs text-slate-500">AI</span>
                  </button>
                ))}
              </div>
              {!isPro && (
                <div className="rounded-xl bg-amber-900/40 border border-amber-700 text-amber-200 px-3 py-2 text-sm">
                  AI shortcuts are locked. Upgrade to Studio Pass to run inline edits and completions.
                </div>
              )}
            </div>
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

      {showInstructionsModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/80 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-indigo-300 font-semibold">Agent memory</p>
                <h2 className="text-lg font-semibold text-white">Personalize instructions</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Close instructions"
              >
                ✕
              </button>
            </div>

            <textarea
              value={agentInstructions}
              onChange={(e) => setAgentInstructions(e.target.value)}
              rows={6}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 text-sm text-white p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe your tone, references, or rules."
            />

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-slate-700 text-sm text-slate-200 hover:bg-slate-800"
                onClick={() => setShowInstructionsModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white"
                onClick={() => {
                  setShowInstructionsModal(false);
                  if (agentInstructions.trim()) {
                    setChatMessages((prev) => [
                      ...prev,
                      {
                        role: 'assistant',
                        content: 'Instructions saved. I will keep them in mind while editing your canvas.',
                      },
                    ]);
                  }
                }}
              >
                Save instructions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotionStyleCanvas;
