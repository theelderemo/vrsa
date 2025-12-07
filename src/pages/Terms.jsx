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

import React, { useEffect } from 'react';

const Terms = () => {
  useEffect(() => {
    document.title = 'Terms of Service | VRS/A';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'VRS/A Terms of Service. Read our terms for using the AI lyric assistant, account policies, content ownership, and user guidelines.');
    }
  }, []);

  return (
  <div className="flex flex-col items-center justify-center min-h-full bg-slate-900 p-8">
    <div className="max-w-4xl w-full bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700/50">
      <h1 className="text-3xl font-bold text-indigo-400 mb-6">VRS/A Terms of Service</h1>
      
      <div className="text-slate-300 text-sm space-y-6">
        <p className="italic text-slate-400">Last updated: November 25, 2025</p>
        <p>
          Terms of Service are legally required even though literally no one reads them. Anyway, don't be a dick and I won't be dicks. The legal version is below if you actually want to read it.
        </p>

        {/* Section 1 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Accounts</h3>
          <p className="mb-2">You need an account to use most features. Pretty standard.</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Keep your password secure. If someone logs into your account, that's on you.</li>
            <li>I use Cloudflare Turnstile to keep bots out. Don't try to bypass it.</li>
            <li>If your account does suspicious stuff or abuses the API, I'll ban it.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Don't Be A Dick</h3>
          <p className="mb-2">This app runs on a shoestring budget. Don't do these things:</p>
          <ul className="list-disc list-inside pl-4 space-y-1 mb-4">
            <li>Automate requests or scrape the API</li>
            <li>Make multiple accounts to bypass limits</li>
            <li>Try to reverse-engineer the prompts</li>
            <li>Spam the feed with garbage</li>
            <li>Harass people in comments or mentions</li>
            <li>Pretend to be other users or the bot</li>
            <li>Post illegal stuff, hate speech, or anything that violates someone else's rights</li>
          </ul>
          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <span className="font-bold text-red-400">What happens if you do:</span> Your account gets deleted. If you cost me money by spamming API calls, I'll ban you without hesitation. Same if you're toxic to other users.
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Studio Pass</h3>
          <p className="mb-2">Studio Pass is handled through Buy Me a Coffee. Here's how it works:</p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li><span className="font-bold text-slate-200">What it is:</span> A support tier that unlocks expensive models like Claude 3 Opus and Flux 1.1 Pro. You're basically funding the API bills in exchange for better tools.</li>
            <li><span className="font-bold text-slate-200">Refunds:</span> This is a donation/membership to keep the lights on. Generally non-refundable unless something actually broke on our end.</li>
            <li><span className="font-bold text-slate-200">Uptime:</span> I try to keep everything running 24/7 but sometimes OpenAI or Azure has an outage. Not much I can do about that.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Who Owns What</h3>
          <p className="mb-2">
            <strong>Lyrics:</strong> You own them. I'm not claiming copyright on your output.
          </p>
          <p className="mb-2">
            <strong>Images:</strong> Also yours, subject to whatever laws exist about AI-generated art where you live.
          </p>
          <p className="mb-2">
            <strong>Posts and comments:</strong> You own those too. By posting publicly you give us permission to show it on the platform, but you can delete it anytime.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Liability</h3>
          <p>VRS/A is provided as-is. I'm not responsible if the app crashes, the lyrics suck, or the AI makes up a word that doesn't exist. You're using experimental AI tools at your own risk.</p>
        </section>

        {/* Section 6 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Privacy Stuff</h3>
          <p>Check the <a href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</a> for details. Quick version: I don't sell your data, I only use essential cookies, and I only store your chats if you turn on memory.</p>
        </section>

        <div className="pt-6 border-t border-slate-700 text-center text-slate-400 text-sm">
          By using this, you agree to these terms. Now go make something.
        </div>
      </div>
    </div>
  </div>
  );
};

export default Terms;