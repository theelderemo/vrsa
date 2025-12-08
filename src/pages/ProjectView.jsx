import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  MessageSquare,
  Music,
  RefreshCcw,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { getChatSession, getMessages } from '../lib/chatSessions';
import { exportConversationAsJson, exportConversationAsTxt } from '../lib/exportUtils';
import { parseTakes } from '../lib/parseTakes';

const formatDate = (date) => {
  if (!date) return 'Unknown';
  return new Date(date).toLocaleString();
};

const ProjectView = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { user, loading: userLoading } = useUser();

  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const takes = useMemo(() => parseTakes(messages), [messages]);

  useEffect(() => {
    document.title = 'Project Dashboard | VRS/A';
  }, []);

  const loadProject = useCallback(async () => {
    if (!projectId || !user) return;

    setLoading(true);
    setError(null);

    const { session, error: sessionError } = await getChatSession(projectId);

    if (sessionError || !session) {
      setError('Unable to load this project.');
      setLoading(false);
      return;
    }

    if (session.user_id !== user.id) {
      setError('This project does not belong to your account.');
      setLoading(false);
      return;
    }

    setProject(session);

    const { messages: savedMessages, error: messagesError } = await getMessages(projectId);

    if (messagesError) {
      console.error('Failed to load project messages:', messagesError);
      setError('We could not load the saved generations for this project.');
      setMessages(session.messages || []);
    } else {
      const usableMessages = savedMessages?.length ? savedMessages : (session.messages || []);
      setMessages(usableMessages);
    }

    setLoading(false);
  }, [projectId, user]);

  useEffect(() => {
    if (!userLoading) {
      loadProject();
    }
  }, [userLoading, loadProject]);

  const handleExport = (format) => {
    if (!project) return;
    const projectName = project.name || 'Project';

    if (format === 'txt') {
      exportConversationAsTxt(messages, projectName);
    } else {
      exportConversationAsJson(messages, projectName);
    }
  };

  if (loading || userLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white">
          <RefreshCcw className="animate-spin text-indigo-400" size={18} />
          <span>Loading project dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-600/40 text-red-100">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert size={18} />
            <h2 className="text-lg font-semibold">Project Dashboard Unavailable</h2>
          </div>
          <p className="text-sm text-red-200 mb-4">{error}</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </button>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Project Dashboard</p>
            <h1 className="text-2xl font-semibold text-white">{project.name || 'Untitled Project'}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/ghostwriter?projectId=${project.id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
          >
            <Music size={16} />
            Open in Ghostwriter
          </button>
          <button
            onClick={() => handleExport('txt')}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500"
          >
            <Download size={16} />
            Export TXT
          </button>
          <button
            onClick={() => handleExport('json')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500"
          >
            <Download size={16} />
            Export JSON
          </button>
        </div>
      </div>

      {!project.memory_enabled && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-100">
          <MessageSquare size={18} className="mt-0.5" />
          <div>
            <p className="font-semibold">Memory is off for this project.</p>
            <p className="text-sm text-amber-100/90">Enable memory in Ghostwriter to save future generations here.</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal size={16} className="text-indigo-400" />
            <p className="text-sm font-semibold text-white">Project Details</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              <span>Created: {formatDate(project.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-400" />
              <span>Updated: {formatDate(project.updated_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-slate-400" />
              <span>Memory: {project.memory_enabled ? 'On' : 'Off'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink size={14} className="text-slate-400" />
              <span>Context Window: {project.context_window || 0}</span>
            </div>
          </div>
          {project.settings && (
            <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-sm text-slate-200 space-y-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">Saved Style & Metadata</p>
              {project.settings.artistName && (
                <p><span className="text-slate-400">Artist:</span> {project.settings.artistName}</p>
              )}
              {project.settings.coreTheme && (
                <p><span className="text-slate-400">Theme:</span> {project.settings.coreTheme}</p>
              )}
              {project.settings.moodTag && (
                <p><span className="text-slate-400">Mood:</span> {project.settings.moodTag}</p>
              )}
              {project.settings.lengthHint && (
                <p><span className="text-slate-400">Length:</span> {project.settings.lengthHint}</p>
              )}
            </div>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2">
            <Music size={16} className="text-indigo-400" />
            <p className="text-sm font-semibold text-white">At a Glance</p>
          </div>
          <div className="space-y-2 text-sm text-slate-200">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400">Saved takes</span>
              <span className="font-semibold text-white">{takes.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400">Memory status</span>
              <span className="font-semibold text-white">{project.memory_enabled ? 'On' : 'Off'}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400">Project ID</span>
              <span className="font-mono text-xs text-white">{project.id}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Saved Generations</p>
            <h2 className="text-xl font-semibold text-white">Project Takes</h2>
          </div>
          <button
            onClick={loadProject}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>

        {takes.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/60 text-slate-300 text-sm">
            <p>No saved takes yet. Generate lyrics in Ghostwriter with memory enabled to see them here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {takes.map((take, index) => (
              <div
                key={take.id || index}
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
                      <span className="text-white font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Take {index + 1}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <Clock size={12} />
                        {take.responseTimestamp ? formatDate(take.responseTimestamp) : 'Timestamp unavailable'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {take.settings?.artistName && (
                      <span className="px-2 py-1 rounded-full bg-slate-700/70 border border-slate-600/70">{take.settings.artistName}</span>
                    )}
                    {take.settings?.coreTheme && (
                      <span className="px-2 py-1 rounded-full bg-slate-700/70 border border-slate-600/70">{take.settings.coreTheme}</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Prompt</p>
                    <pre className="whitespace-pre-wrap break-words text-sm text-slate-200 font-sans leading-relaxed">{take.prompt || 'No prompt recorded.'}</pre>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Response</p>
                    <pre className="whitespace-pre-wrap break-words text-sm text-slate-200 font-sans leading-relaxed">{take.response || 'No response captured yet.'}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
