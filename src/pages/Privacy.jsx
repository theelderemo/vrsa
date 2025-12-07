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
          Look, privacy policies are legally required even though everyone just scrolls to the bottom and clicks accept. This one's different. The short version: I'm not selling your data or doing anything creepy. I collect what I need to make the app work and nothing more.
        </p>

        {/* Data Collection */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">What I Actually Collect</h3>
          <p className="mb-3">Here's what's up. I need some info to make this work:</p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li><strong>Account stuff:</strong> Email and username when you sign up. I use Supabase for this. It's how you log in and how I keep bots out.</li>
            <li><strong>Error logs:</strong> When the app crashes, Sentry tells us what broke so I can fix it. It doesn't follow you around the internet.</li>
            <li><strong>Your lyrics and chat history:</strong> Only if you turn on "Remember Context." Otherwise I don't keep it. If you do enable memory, it auto-deletes after 7 days of not using the app. You can also nuke it yourself anytime.</li>
            <li><strong>Social stuff:</strong> Posts, comments, published tracks, who you follow. You control whether posts are public or folloIrs-only. Delete button works anytime you want.</li>
            <li><strong>Your profile:</strong> Username, profile pic if you upload one, bio. This is public so people can find you. You can change or delete it whenever.</li>
          </ul>
        </section>

        {/* Cookies */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Cookies (Yeah, I Have To Talk About This)</h3>
          <div className="bg-slate-900/50 p-4 rounded border border-slate-700 mb-2">
            <p className="text-indigo-300 font-semibold mb-1">The deal:</p>
            <p>I use essential cookies only. No ad tracking. No Facebook Pixel bullshit.</p>
          </div>
          <p className="mb-2">Basically I need to store a token in your browser so you don't have to log in every time you refresh the page. That's it. I might also save your settings locally (like whether you have memory turned on) so they persist betIen sessions.</p>
          <p className="mt-2">I don't use any third-party cookies to follow you around the internet. The EU's ePrivacy Directive and California's CCPA require us to tell you this, so now you know.</p>
        </section>

        {/* Third Parties */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Who Else Sees Your Data</h3>
          <p className="mb-2">I can't run this whole thing ourselves, so I use some services. They see your data but they're not alloId to do anything sketchy with it:</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li><strong>Supabase:</strong> Handles the database and login stuff. US-based.</li>
            <li><strong>OpenAI / Azure OpenAI:</strong> The AI that generates your lyrics. They process your prompts but don't use them to train models. Zero data retention where I can enable it.</li>
            <li><strong>Sentry:</strong> Tells us when things break.</li>
            <li><strong>Buy Me a Coffee:</strong> Processes Studio Pass payments. I never see your credit card info.</li>
          </ul>
        </section>

        {/* User Rights */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Your Rights</h3>
          <p className="mb-2">GDPR and CCPA say you have rights. I'm giving them to everyone because dealing with geographic restrictions is a pain:</p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li><strong>See your data:</strong> Email us and I'll tell you what I have. Spoiler - it's your email, username, and chat history if you enabled memory.</li>
            <li><strong>Delete your data:</strong> Hit the "Delete All History" button for chat logs. For full account deletion, email us.</li>
            <li><strong>Opt out of data sales:</strong> I don't sell your data, so there's nothing to opt out of.</li>
          </ul>
        </section>

        {/* Contact */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Questions or Problems</h3>
          <p>Email us: <a href="mailto:support@vrsa.app" className="text-indigo-400 hover:text-indigo-300 transition-colors">support@vrsa.app</a></p>
          <p className="mt-2 text-slate-400 text-xs">I'll actually respond. Usually within a day or two.</p>
        </section>

        <div className="pt-6 border-t border-slate-700 text-center text-slate-400 text-xs">
          This was written by a human, not a lawyer. It's designed to be readable.
        </div>
      </div>
    </div>
  </div>
);

export default Privacy;