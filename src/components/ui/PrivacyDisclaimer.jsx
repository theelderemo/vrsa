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

import React from 'react';

const PrivacyDisclaimer = ({ isOpen, onClose, onDeleteAllHistory }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Privacy & Data Storage</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-700 transition-colors"
            aria-label="Close"
          >
            <span className="text-slate-400 text-xl">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* What We Store */}
          <section>
            <div className="mb-3">
              <h3 className="font-semibold text-white mb-2">What We Store</h3>
              <ul className="text-slate-300 text-sm space-y-2 list-disc list-inside">
                <li>Your conversation messages (when "Remember Context" is enabled)</li>
                <li>Edit history for undo/redo functionality</li>
                <li>Session metadata (creation time, last updated)</li>
                <li>Your preference settings (memory toggle state)</li>
              </ul>
            </div>
          </section>

          {/* How Long */}
          <section>
            <div className="mb-3">
              <h3 className="font-semibold text-white mb-2">How Long We Keep It</h3>
              <ul className="text-slate-300 text-sm space-y-2 list-disc list-inside">
                <li>Chat sessions automatically expire after <strong>7 days</strong> of inactivity</li>
                <li>Each new message extends the expiry by another 7 days</li>
                <li>You can manually delete your data at any time (see below)</li>
              </ul>
            </div>
          </section>

          {/* Security */}
          <section>
            <div className="mb-3">
              <h3 className="font-semibold text-white mb-2">Security</h3>
              <ul className="text-slate-300 text-sm space-y-2 list-disc list-inside">
                <li>All data is stored securely in Supabase with encryption at rest</li>
                <li>Only you can access your own chat sessions (enforced by Row Level Security)</li>
                <li>Your conversations are never shared with third parties</li>
                <li>AI model providers (OpenAI/Azure) process messages but don't retain them</li>
              </ul>
            </div>
          </section>

          {/* Your Control */}
          <section className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="mb-3">
              <h3 className="font-semibold text-white mb-2">You're In Control</h3>
              <ul className="text-slate-300 text-sm space-y-2 list-disc list-inside">
                <li><strong>Turn off memory:</strong> Toggle "Remember Context" to stop saving messages</li>
                <li><strong>Clear conversation:</strong> Wipe current session history anytime</li>
                <li><strong>Start fresh:</strong> Create a new session while keeping current output</li>
                <li><strong>Delete everything:</strong> One-click removal of all your chat history (button below)</li>
                <li><strong>Export your data:</strong> Download conversations as TXT, PDF, or JSON</li>
              </ul>
            </div>
          </section>

          {/* Delete All Button */}
          <button
            onClick={() => {
              if (onDeleteAllHistory) {
                onDeleteAllHistory();
              }
            }}
            className="w-full flex items-center justify-center gap-2 p-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-red-400 hover:text-red-300 transition-colors"
          >
            Delete All My Chat History
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-900/50">
          <p className="text-xs text-slate-400 text-center">
            Questions about privacy? Contact us via{' '}
            <a 
              href="https://discord.gg/FQ6XGNf53P" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Discord
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyDisclaimer;
