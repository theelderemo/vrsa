import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react";
import './index.css'
import App from './App.jsx'

// Initialize Sentry as early as possible in the application's lifecycle
Sentry.init({
  dsn: "https://23db32b682813a8a4400c7cd33460371@o4510367251234816.ingest.us.sentry.io/4510377545891840",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    Sentry.feedbackIntegration({
      colorScheme: "system",
      isEmailRequired: true,
      showBranding: false,
      triggerAriaLabel: "Bug Report or Feedback?",
      triggerLabel: "Bug Report or Feedback?",
      formTitle: "...what did ya break?",
      messagePlaceholder: "Let me know what happened, as detailed as you can. You can also use this to give general feedback!",
    })
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  // Enable logs to be sent to Sentry
  enableLogs: true
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
