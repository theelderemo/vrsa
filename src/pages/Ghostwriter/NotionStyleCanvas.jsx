/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, LoaderCircle, Save, Trash2 } from 'lucide-react';
import { useUser } from '../../hooks/useUser';

const STORAGE_KEY = 'notion-canvas-content';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Not saved yet';
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(timestamp);
};

const NotionStyleCanvas = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const [status, setStatus] = useState('idle');
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    document.title = 'Canvas | Ghostwriter | VRS/A';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Minimal full-screen canvas with autosave and export.',
      );
    }
  }, []);

  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) {
      setContent(savedContent);
      setLastSaved(new Date());
    }
  }, []);

  useEffect(() => {
    if (content === undefined) return;

    setStatus('saving');
    let resetTimer;
    const handler = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, content);
      const now = new Date();
      setLastSaved(now);
      setStatus('saved');
      resetTimer = setTimeout(() => setStatus('idle'), 1500);
    }, 450);

    return () => {
      clearTimeout(handler);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [content]);

  const statusIndicator = useMemo(() => {
    if (status === 'saving') {
      return (
        <span className="flex items-center gap-2 text-amber-200" aria-live="polite">
          <LoaderCircle size={16} className="animate-spin" />
          Saving…
        </span>
      );
    }

    if (status === 'saved') {
      return (
        <span className="flex items-center gap-2 text-emerald-200" aria-live="polite">
          <CheckCircle2 size={16} />
          Saved at {formatTimestamp(lastSaved)}
        </span>
      );
    }

    return (
      <span className="flex items-center gap-2 text-slate-300" aria-live="polite">
        <Save size={16} />
        Autosave ready
      </span>
    );
  }, [lastSaved, status]);

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'canvas.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setContent('');
    localStorage.removeItem(STORAGE_KEY);
    setLastSaved(null);
    setStatus('idle');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <LoaderCircle className="animate-spin text-indigo-400" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Canvas</p>
            <h1 className="mt-1 text-2xl font-bold text-white">Full-screen focus editor</h1>
            <p className="text-sm text-slate-400">
              Write without distractions. Your work autosaves locally and can be exported anytime.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm lg:items-end">
            {statusIndicator}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <Download size={16} />
                Export text
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-rose-100 transition-colors hover:border-rose-400 hover:text-white"
              >
                <Trash2 size={16} />
                Clear
              </button>
              {!user && (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-700 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
                >
                  Sign in to sync
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your draft..."
            className="h-[70vh] w-full resize-none rounded-2xl bg-transparent p-6 text-lg leading-relaxed text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="text-sm text-slate-500">
          {user
            ? `Signed in as ${user.email}. Content saves locally for privacy.`
            : 'You are editing offline. Content stays on this device until you sign in.'}
        </div>
      </div>
    </div>
  );
};

export default NotionStyleCanvas;
