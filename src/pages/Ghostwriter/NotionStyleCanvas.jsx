/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clipboard, Download, LoaderCircle, Save } from 'lucide-react';
import { useUser } from '../../hooks/useUser';

const NotionStyleCanvas = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState('Untitled draft');
  const [editorContent, setEditorContent] = useState('');
  const [status, setStatus] = useState('Saved');
  const saveTimer = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    document.title = 'Canvas | Ghostwriter | VRS/A';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Write in a focused, full-screen canvas with autosave and quick export tools designed for long-form drafting.',
      );
    }
  }, []);

  useEffect(() => {
    const storageKey = user ? `canvas-${user.id}` : 'canvas-anonymous';
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setTitle(parsed.title || 'Untitled draft');
        setEditorContent(parsed.content || '');
      } catch (error) {
        console.error('Unable to parse saved canvas state', error);
      }
    }
  }, [user]);

  useEffect(() => {
    const storageKey = user ? `canvas-${user.id}` : 'canvas-anonymous';
    setStatus('Saving…');

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(() => {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          title,
          content: editorContent,
          savedAt: new Date().toISOString(),
        }),
      );
      setStatus('Saved');
    }, 450);

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [editorContent, title, user]);

  const wordCount = useMemo(() => {
    if (!editorContent.trim()) return 0;
    return editorContent.trim().split(/\s+/).length;
  }, [editorContent]);

  const readingTime = useMemo(() => {
    if (!wordCount) return '0 min read';
    const minutes = Math.max(1, Math.round(wordCount / 200));
    return `${minutes} min read`;
  }, [wordCount]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editorContent);
      setStatus('Copied to clipboard');
      setTimeout(() => setStatus('Saved'), 1000);
    } catch (error) {
      console.error('Copy failed', error);
      setStatus('Copy unavailable');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([editorContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'draft'}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus('Downloaded');
    setTimeout(() => setStatus('Saved'), 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <LoaderCircle className="animate-spin text-indigo-400" size={48} />
      </div>
    );
  }

  const syncSelection = () => {
    const selection = window.getSelection();
    if (!selection) return;
    const text = selection.toString();
    if (text.trim()) {
      setStatus('Selection ready');
    } else if (status === 'Selection ready') {
      setStatus('Saved');
    }
  };

  const handleContentChange = (e) => {
    const text = e.currentTarget.value;
    setEditorContent(text);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:border-indigo-500 hover:text-white transition"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <div>
              <p className="text-xs uppercase tracking-wide text-indigo-300 font-semibold">Focus editor</p>
              <p className="text-sm text-slate-400">Full-screen writing with autosave and quick export tools.</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              {status === 'Saved' || status === 'Downloaded' || status === 'Copied to clipboard' ? (
                <CheckCircle2 className="text-emerald-400" size={16} />
              ) : (
                <Save className="text-indigo-300 animate-pulse" size={16} />
              )}
              <span>{status}</span>
            </div>
            <p className="text-xs text-slate-500">
              {user ? `Signed in as ${user.email || 'member'}` : 'Local draft mode — saved to this browser.'}
            </p>
          </div>
        </div>

        <section className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Name your draft"
                className="w-full bg-transparent border-b border-slate-700 text-2xl font-semibold text-white pb-2 focus:outline-none focus:border-indigo-400"
              />
              <p className="text-sm text-slate-400 mt-1">Your writing autosaves locally while you focus.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
              <span className="rounded-full bg-slate-800 px-3 py-1">{wordCount} words</span>
              <span className="rounded-full bg-slate-800 px-3 py-1">{readingTime}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
            >
              <Clipboard size={16} />
              Copy all
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 hover:border-indigo-500 transition"
            >
              <Download size={16} />
              Download .txt
            </button>
          </div>

          <div className="relative">
            <textarea
              ref={editorRef}
              value={editorContent}
              onChange={handleContentChange}
              onKeyUp={syncSelection}
              onMouseUp={syncSelection}
              spellCheck
              placeholder="Begin typing in a distraction-free canvas..."
              className="w-full min-h-[70vh] rounded-xl bg-slate-950/70 border border-slate-800 p-5 text-base leading-relaxed text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
            <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_0_0_1px_rgba(99,102,241,0.08)]" aria-hidden />
          </div>
        </section>
      </div>
    </div>
  );
};

export default NotionStyleCanvas;
