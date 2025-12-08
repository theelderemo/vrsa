/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LoaderCircle, Save, Type } from 'lucide-react';
import { useUser } from '../../hooks/useUser';

const STORAGE_KEY_CONTENT = 'canvas:content';
const STORAGE_KEY_TITLE = 'canvas:title';

const formatTimestamp = (date) => {
  if (!date) return 'Not saved yet';
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

const NotionStyleCanvas = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState('Untitled canvas');
  const [editorContent, setEditorContent] = useState('');
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    document.title = 'Canvas | Ghostwriter | VRS/A';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Focused, full-screen writing canvas with autosave and live word counts.',
      );
    }
  }, []);

  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEY_CONTENT);
    const savedTitle = localStorage.getItem(STORAGE_KEY_TITLE);

    if (savedContent) setEditorContent(savedContent);
    if (savedTitle) setTitle(savedTitle);
  }, []);

  useEffect(() => {
    if (!title && !editorContent) return;

    setIsSaving(true);
    clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY_CONTENT, editorContent);
      localStorage.setItem(STORAGE_KEY_TITLE, title || 'Untitled canvas');
      setLastSavedAt(new Date());
      setIsSaving(false);
    }, 400);

    return () => clearTimeout(saveTimer.current);
  }, [title, editorContent]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <LoaderCircle className="animate-spin text-indigo-400" size={48} />
      </div>
    );
  }

  const editorStats = useMemo(() => {
    const characters = editorContent.length;
    const words = editorContent.trim() ? editorContent.trim().split(/\s+/).length : 0;
    const readingTime = words ? Math.max(1, Math.round(words / 200)) : 0;

    return { characters, words, readingTime };
  }, [editorContent]);

  const handleContentChange = (event) => {
    setEditorContent(event.target.value);
  };

  const isGuest = !user;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {isGuest && (
          <div className="mb-6 rounded-2xl border border-amber-800 bg-amber-900/30 text-amber-100 px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              <p className="font-semibold">Guest mode</p>
              <p className="text-amber-100/80">You can write and autosave locally. Sign in to sync across devices.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-amber-950 transition-colors hover:bg-amber-400"
            >
              Log in
            </button>
          </div>
        )}

        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="h-10 w-10 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 flex items-center justify-center"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-wide text-indigo-300 font-semibold">Canvas</p>
              <h1 className="text-2xl font-bold text-white">Full-screen writing</h1>
              <p className="text-slate-400 text-sm mt-1">
                A distraction-free editor with local autosave, live word counts, and gentle status indicators.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
              <Type size={16} className="text-indigo-300" />
              <span>{editorStats.words} words</span>
              <span className="text-slate-500">•</span>
              <span>{editorStats.characters} chars</span>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                isSaving ? 'border-indigo-600 bg-indigo-900/40 text-indigo-100' : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving…' : `Saved ${formatTimestamp(lastSavedAt)}`}</span>
            </div>
          </div>
        </header>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-slate-800 bg-slate-900/70 px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full sm:w-auto flex-1 bg-transparent text-2xl font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-3 py-2"
              placeholder="Name your canvas"
              aria-label="Canvas title"
            />
            <p className="text-sm text-slate-400">
              Estimated read: {editorStats.readingTime || 1} min
            </p>
          </div>

          <div className="p-4 sm:p-6">
            <textarea
              value={editorContent}
              onChange={handleContentChange}
              className="w-full min-h-[70vh] resize-none bg-slate-950/70 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder:text-slate-600 rounded-xl p-4 text-lg leading-relaxed shadow-inner"
              placeholder="Start writing your draft. Everything saves locally as you type."
              aria-label="Canvas editor"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default NotionStyleCanvas;
