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

const Privacy = () => (
  <div className="flex flex-col items-center justify-center min-h-full bg-slate-900 p-8">
    <div className="max-w-4xl w-full bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700/50">
      <h1 className="text-3xl font-bold text-indigo-400 mb-6">VRS/A Privacy Policy</h1>
      
      <div className="text-slate-300 text-sm space-y-6">
        <p className="italic text-slate-400">Last updated: November 25, 2025</p>
        <p>
          We value your privacy because we value our own. This policy explains what we collect, why we collect it, and how we comply with global privacy laws (including GDPR and CCPA).
        </p>

        {/* Data Collection */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">1. Data We Collect</h3>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li><strong>Account Information:</strong> When you sign up, we collect your email address and username via Supabase. This is required to provide the service and prevent abuse.</li>
            <li><strong>Usage Data:</strong> We use Sentry to track errors and crashes. This helps us fix bugs. It does not track your activity across other websites.</li>
            <li><strong>Generated Content:</strong> If you enable "Remember Context", your chat history is stored in our database so the AI can remember what you said. This data is deleted automatically after 7 days of inactivity, or you can manually delete it instantly.</li>
          </ul>
        </section>

        {/* Cookies */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">2. Cookies & Local Storage</h3>
          <div className="bg-slate-900/50 p-4 rounded border border-slate-700 mb-2">
            <p className="text-indigo-300 font-semibold mb-1">The Short Version:</p>
            <p>We use "Essential Cookies" only. No ad tracking. No marketing pixels.</p>
          </div>
          <p className="mb-2">To comply with <strong>ePrivacy Directive (EU)</strong> and <strong>CCPA (California)</strong>, here is exactly what we use:</p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li><strong>Authentication Tokens:</strong> We store a secure token in your browser's Local Storage or Cookies to keep you logged in. This is strictly necessary for the app to function.</li>
            <li><strong>User Preferences:</strong> We may store small bits of data (like your "Memory Enabled" toggle state) locally on your device to remember your settings.</li>
          </ul>
          <p className="mt-2">We do <strong>not</strong> use third-party advertising cookies (like Facebook Pixel or Google Ads) to track you across the internet.</p>
        </section>

        {/* Third Parties */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">3. Third-Party Processors</h3>
          <p>We use the following services to run the app. They process data on our behalf:</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li><strong>Supabase:</strong> Database and Authentication (US-based).</li>
            <li><strong>OpenAI / Azure OpenAI:</strong> LLM processing. They process your prompts to generate lyrics/images but do not use your data to train their models (Zero Data Retention policy enabled where applicable).</li>
            <li><strong>Sentry:</strong> Error tracking and performance monitoring.</li>
            <li><strong>Buy Me a Coffee:</strong> Payment processing for Studio Pass. We do not see or store your credit card info.</li>
          </ul>
        </section>

        {/* User Rights */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">4. Your Rights (GDPR & CCPA)</h3>
          <p className="mb-2">Regardless of where you live, you have the right to:</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li><strong>Access:</strong> See what data we have on you (it's basically just your email and chats).</li>
            <li><strong>Deletion:</strong> You can delete your chat history instantly via the "Delete All History" button in the app. You can request full account deletion by emailing us.</li>
            <li><strong>Opt-out:</strong> Since we don't sell your data, there is nothing to opt-out of regarding data sales.</li>
          </ul>
        </section>

        {/* Contact */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">5. Contact</h3>
          <p>For privacy requests or to shout at clouds:</p>
          <p className="mt-1">Email: <a href="mailto:support@vrsa.app" className="text-indigo-400 hover:text-indigo-300 transition-colors">support@vrsa.app</a></p>
        </section>

        <div className="pt-6 border-t border-slate-700 text-center text-slate-400 text-xs">
          This policy was written by a human, not a lawyer. It is designed to be readable and honest.
        </div>
      </div>
    </div>
  </div>
);

export default Privacy;