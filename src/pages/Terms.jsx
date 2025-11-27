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

const Terms = () => (
  <div className="flex flex-col items-center justify-center min-h-full bg-slate-900 p-8">
    <div className="max-w-4xl w-full bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700/50">
      <h1 className="text-3xl font-bold text-indigo-400 mb-6">VRS/A Terms of Service</h1>
      
      <div className="text-slate-300 text-sm space-y-6">
        <p className="italic text-slate-400">Last updated: November 25, 2025</p>
        <p>
          By accessing or using VRS/A ("we", "us", or "our"), you agree to be bound by these Terms. If you don't agree, please close the tab.
        </p>

        {/* Section 1 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">1. Accounts & Security</h3>
          <p className="mb-2">To access Ghostwriter or Analyzer features, you must create an account.</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>We implemented usernames and Cloudflare Turnstile to keep bots out. Don't try to bypass them.</li>
            <li>We reserve the right to ban accounts that exhibit suspicious behavior or API abuse.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">2. Fair Use & Abuse (The "Don't Be A Jerk" Clause)</h3>
          <p className="mb-2">This app runs on a limited budget. You agree NOT to:</p>
          <ul className="list-disc list-inside pl-4 space-y-1 mb-4">
            <li>Automate requests or scrape the API.</li>
            <li>Create multiple accounts to bypass limits.</li>
            <li>Reverse-engineer the prompt logic.</li>
          </ul>
          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <span className="font-bold text-red-400">Consequences:</span> Abuse gets you banned. If you cost me money by spamming the API, I will delete your account without a second thought.
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">3. Studio Pass & Membership</h3>
          <p className="mb-2">The "Studio Pass" is a membership program via Buy Me a Coffee.</p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li><span className="font-bold text-slate-200">Nature of Service:</span> This is a support tier. It unlocks higher-cost models (Claude 3 Opus, Flux 1.1 Pro, etc.) as a thank-you.</li>
            <li><span className="font-bold text-slate-200">Refunds:</span> Payments are donations/memberships to support development and are generally non-refundable.</li>
            <li><span className="font-bold text-slate-200">Availability:</span> We try to keep premium models up 24/7, but API outages happen.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">4. Content Ownership</h3>
          <p className="mb-2">
            <strong>Lyrics:</strong> You own the lyrics you generate. We claim no copyright over your output.
            <br/>
            <strong>Images:</strong> You own the images you generate, subject to the laws governing AI-generated art in your jurisdiction.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">5. Limitation of Liability</h3>
          <p>VRS/A is provided "as-is". We are not liable if the app crashes during your studio session, if the lyrics aren't a hit, or if the AI hallucinates a word that doesn't exist.</p>
        </section>

        {/* Section 6 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">6. Privacy</h3>
          <p>Refer to our <a href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</a>. Short version: We don't sell your data. We use essential cookies for login. We store your chats only if you enable memory.</p>
        </section>

        <div className="pt-6 border-t border-slate-700 text-center font-semibold text-slate-200">
          By using VRS/A, you agree to these terms. Now go make some music.
        </div>
      </div>
    </div>
  </div>
);

export default Terms;