/**
 * MIT License
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useState, useEffect } from 'react';
import { LoaderCircle, Upload, AlertCircle, Server } from 'lucide-react';
import { useUser } from '../../hooks/useUser';

const API_URL = import.meta.env.VITE_AUDIO_ENGINE_URL || "https://audio.vrsa.app"; 

const AudioAnalyzer = () => {
  const { loading: userLoading } = useUser();
  const [analysis, setAnalysis] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [engineStatus, setEngineStatus] = useState({ online: false, checking: true });

  // Check engine status on component mount
  useEffect(() => {
    const checkEngineStatus = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        const response = await fetch(`${supabaseUrl}/functions/v1/audio-engine-status`, {
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setEngineStatus({ online: data.online, checking: false });
        } else {
          setEngineStatus({ online: false, checking: false });
        }
      } catch (err) {
        console.error('Failed to check engine status:', err);
        setEngineStatus({ online: false, checking: false });
      }
    };

    checkEngineStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkEngineStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (file.size > 10 * 1024 * 1024) { // 10MB limit check
        setError("File is too large. Please upload an MP3/WAV under 10MB.");
        return;
    }

    setIsProcessing(true);
    setError(null);
    setAnalysis(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Calls your VM's Python API
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysis(data);

    } catch (err) {
      console.error('Audio Engine Error:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot reach Audio Engine. Check if your VM is running and accessible.');
      } else if (err.message.includes('Server error')) {
        setError(`Audio Engine error: ${err.message}. Check server logs for details.`);
      } else {
        setError('Audio analysis failed. Please try again or check your audio file format.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <LoaderCircle className="animate-spin text-indigo-400" size={48} />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Upload Area */}
          <div className="relative group">
            <div className={`
              border-2 border-dashed rounded-2xl p-10 text-center transition-all
              ${isProcessing ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800/50'}
            `}>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              />
              
              <div className="flex flex-col items-center gap-4">
                {isProcessing ? (
                  <LoaderCircle className="animate-spin text-indigo-400" size={48} />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="text-indigo-400" size={32} />
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {isProcessing ? "Analyzing Audio..." : "Upload a Song"}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {isProcessing ? "Please wait, this may take a moment" : "MP3, WAV, or M4A (Max 10MB)"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Status & Error Message */}
          <div className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Server size={18} className="text-slate-400" />
                <span className="text-sm text-slate-300">Audio Engine Status:</span>
              </div>
              <div className="flex items-center gap-2">
                {engineStatus.checking ? (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-400">Checking...</span>
                  </>
                ) : engineStatus.online ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-400">Online</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-red-400">Offline</span>
                  </>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
                <div className="flex items-center gap-3 text-red-400 mb-3">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
                <div className="text-xs text-red-300/70 space-y-1">
                  <p>• Ensure your Audio Engine VM is running</p>
                  <p>• Check if Cloudflare tunnel is active</p>
                  <p>• Verify the API endpoint in environment variables</p>
                  <p>• Try uploading a different audio file format</p>
                </div>
              </div>
            )}
          </div>

          {/* Results Display */}
          {analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* BPM Card */}
              <div className="bg-slate-800/50 border border-indigo-500/30 p-6 rounded-xl text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Tempo</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl font-black text-white">{analysis.bpm}</span>
                  <span className="text-sm text-indigo-400 font-medium self-end mb-1">BPM</span>
                </div>
              </div>

              {/* Key Card */}
              <div className="bg-slate-800/50 border border-purple-500/30 p-6 rounded-xl text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Musical Key</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-black text-white">{analysis.key}</span>
                  <span className="text-xl text-purple-400 font-medium">{analysis.scale}</span>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioAnalyzer;