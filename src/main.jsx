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

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import * as Sentry from "@sentry/react";
import './index.css'
import App from './App.jsx'

Sentry.init({
  dsn: "https://23db32b682813a8a4400c7cd33460371@o4510367251234816.ingest.us.sentry.io/4510377545891840",
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    Sentry.feedbackIntegration({
      colorScheme: "dark",
      isEmailRequired: true,
      showBranding: false,
      triggerAriaLabel: "Bug Report or Feedback?",
      triggerLabel: "Bug Report or Feedback?",
      formTitle: "...what did ya break?",
      messagePlaceholder: "Let me know what happened, as detailed as you can. You can also use this to give general feedback!",
      themeDark: {
        background: "#0f172a",         
        backgroundHover: "#1e293b",    
        foreground: "#e2e8f0",        
        accentForeground: "#ffffff",  
        accentBackground: "#6366f1",   
        successColor: "#10b981",        
        errorColor: "#ef4444",         
        boxShadow: "0px 4px 24px 0px rgba(99, 102, 241, 0.12)", 
        outline: "1px auto var(--accent-background)"
      }
    })
  ],
  // Tracing
  tracesSampleRate: 0.5, 
  tracePropagationTargets: ["localhost", "https://vrsa.app/", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.5, 
  replaysOnErrorSampleRate: 1.0, 
  enableLogs: true
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* <-- Add this wrapper */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
