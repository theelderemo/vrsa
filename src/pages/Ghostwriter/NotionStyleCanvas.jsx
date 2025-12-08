/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, LoaderCircle, Save, Wand2 } from 'lucide-react';
import { useUser } from '../../hooks/useUser';

const NotionStyleCanvas = () => {
  const { user, loading } = useUser();
  const [title, setTitle] = useState('Untitled document');
  const [editorContent, setEditorContent] = useState('');
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.title = 'Canvas | Ghostwriter | VRS/A';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'A distraction-free canvas for long-form writing with automatic saving.');
    }
  }, []);

  useEffect(() => {
    const storedTitle = localStorage.getItem('canvas:title');
    const storedContent = localStorage.getItem('canvas:content');
    if (storedTitle) setTitle(storedTitle);
    if (storedContent) setEditorContent(storedContent);
  }, []);

  const saveDraft = (nextTitle, nextContent) => {
    setIsSaving(true);
    localStorage.setItem('canvas:title', nextTitle);
    localStorage.setItem('canvas:content', nextContent);
    setLastSavedAt(new Date());
    setTimeout(() => setIsSaving(false), 300);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <LoaderCircle className="animate-spin text-indigo-400" size={48} />
      </div>
    );
  }

  const handleContentChange = (event) => {
    const nextContent = event.target.value;
    setEditorContent(nextContent);
    saveDraft(title, nextContent);
  };

  const handleTitleChange = (event) => {
    const nextTitle = event.target.value;
    setTitle(nextTitle);
    saveDraft(nextTitle, editorContent);
  };

  const clearDraft = () => {
    setTitle('Untitled document');
    setEditorContent('');
    saveDraft('Untitled document', '');
  };

  const wordCount = useMemo(() => {
    if (!editorContent.trim()) return 0;
    return editorContent.trim().split(/\s+/).length;
  }, [editorContent]);

  const formattedSavedAt = useMemo(() => {
    if (!lastSavedAt) return 'Not yet saved';
    return lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [lastSavedAt]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-4 py-3 md:px-8 flex items-center justify-between gap-3 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Wand2 size={20} className="text-indigo-300" />
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Canvas</p>
            <p className="text-sm text-slate-200">Distraction-free writing</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5">
            {isSaving ? <LoaderCircle size={14} className="animate-spin text-indigo-300" /> : <CheckCircle2 size={14} className="text-emerald-300" />}
            <span>{isSaving ? 'Saving…' : `Saved ${formattedSavedAt}`}</span>
          </div>
          <button
            type="button"
            onClick={clearDraft}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Clear draft
          </button>
        </div>
      </header>

      <main className="px-4 py-8 md:px-10">
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-5xl flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-2xl md:p-8">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Name your piece"
            />
            <p className="text-sm text-slate-400">Every keystroke saves locally so you never lose the thread.</p>
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-indigo-300">Document</label>
            <textarea
              value={editorContent}
              onChange={handleContentChange}
              placeholder="Start writing with a clear mind. This canvas keeps your words safe."
              className="h-[60vh] w-full resize-none rounded-xl border border-slate-800 bg-slate-950/80 p-5 text-base leading-relaxed text-slate-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Save size={16} className="text-indigo-300" />
              <span>
                {wordCount} {wordCount === 1 ? 'word' : 'words'} · {editorContent.length} characters
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>
                {user
                  ? `Signed in as ${user.email ?? 'your account'} — drafts save locally while you write.`
                  : 'Not signed in — drafts stay on this device.'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotionStyleCanvas;
