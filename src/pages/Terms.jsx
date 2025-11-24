import React from 'react';

const Terms = () => (
  <div className="flex flex-col items-center justify-center min-h-full bg-slate-900 p-8">
    <div className="max-w-4xl w-full bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700/50">
      <h1 className="text-3xl font-bold text-indigo-400 mb-6">VRS/A Terms of Service</h1>
      
      <div className="text-slate-300 text-sm space-y-6">
        <p className="italic text-slate-400">Last updated: November 23, 2025</p>
        <p>
          By accessing or using the VRS/A web application ("VRS/A", "we", "us", or "our"), you agree to be bound by the following Terms of Service ("Terms").
        </p>

        {/* Section 1 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">1. Acceptance of Terms</h3>
          <p>By using VRS/A, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please close the tab and go write lyrics the old-fashioned way.</p>
        </section>

        {/* Section 2 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">2. Fair Use & Abuse Policy (The "Don't Be A Jerk" Clause)</h3>
          <p className="mb-2">This app is run by one person. It is not backed by venture capital. It runs on a limited budget.</p>
          <p className="mb-2 font-semibold text-slate-200">You agree NOT to:</p>
          <ul className="list-disc list-inside pl-4 space-y-1 mb-4">
            <li>Automate requests, scrape the API, or build bots that interact with VRS/A.</li>
            <li>Create multiple accounts to bypass generation limits.</li>
            <li>Attempt to reverse-engineer the prompt logic or inject malicious code.</li>
            <li>Spam the generation button unnecessarily.</li>
          </ul>
          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <span className="font-bold text-red-400">Consequences:</span> If we detect abuse or abnormal usage patterns that threaten the stability or financial viability of the app, we reserve the right to ban your account, block your IP, and mock you in the release notes.
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">3. Image Generation & Album Art</h3>
          <p className="mb-2">VRS/A utilizes third-party AI models (including Flux 1.1 Pro) to generate images.</p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li><span className="font-bold text-slate-200">Ownership:</span> You own the images you generate, to the extent permitted by current law regarding AI-generated content. VRS/A claims no ownership over your creations.</li>
            <li><span className="font-bold text-slate-200">No Warranties:</span> We do not guarantee that images will be unique, error-free, or suitable for trademarking. AI models can be unpredictable; if it generates a hand with seven fingers, that's on the model, not us.</li>
            <li><span className="font-bold text-slate-200">Usage:</span> You are responsible for ensuring your use of generated images does not violate the intellectual property rights of others.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">4. Studio Pass & Membership</h3>
          <p className="mb-2">The "Studio Pass" is a membership program supported via Buy Me a Coffee.</p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li><span className="font-bold text-slate-200">Nature of Service:</span> This is primarily a donation/support tier. In exchange, we provide access to premium, higher-cost AI models.</li>
            <li><span className="font-bold text-slate-200">Availability:</span> We aim to keep premium models available 24/7, but API outages happen. We do not guarantee 100% uptime.</li>
            <li><span className="font-bold text-slate-200">Refunds:</span> Payments are processed as donations/memberships to support development. As such, they are generally non-refundable. If you have a genuine issue, email us, and we'll work it out like humans.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">5. Usage Guidelines & Content</h3>
          <p className="mb-2">You agree not to use VRS/A to generate:</p>
          <ul className="list-disc list-inside pl-4 space-y-1 mb-2">
            <li>Hate speech, threats, or harassment.</li>
            <li>Content that promotes violence or illegal acts.</li>
            <li>Child sexual abuse material (CSAM) or non-consensual sexual content.</li>
          </ul>
          <p>We maintain logs and will report illegal activity to the relevant authorities.</p>
        </section>

        {/* Section 6 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">6. No Warranty / "As-Is" Clause</h3>
          <p>VRS/A is provided "as-is" without warranties of any kind. We do not guarantee the app will be error-free, uninterrupted, or that the lyrics generated will get you a Grammy. You use it at your own risk.</p>
        </section>

        {/* Section 7 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">7. Limitation of Liability</h3>
          <p>To the maximum extent permitted by law, VRS/A and its creator shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the app. If the app goes down right before your studio session, we are sorry, but we are not liable.</p>
        </section>

        {/* Section 8 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">8. Privacy</h3>
          <p>We respect your privacy. We do not sell your data. We use Supabase for authentication and basic user preferences. We use Sentry for error tracking. We do not track you across the web with creepy ad pixels.</p>
        </section>

        {/* Section 9 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">9. Modifications</h3>
          <p>We reserve the right to update these Terms at any time. Continued use of the app constitutes acceptance of the new Terms.</p>
        </section>

        {/* Section 10 */}
        <section>
          <h3 className="text-lg font-bold text-slate-100 mb-2">10. Contact</h3>
          <p>Questions? Found a bug? Want to say thanks?</p>
          <p className="mt-1">Email: <a href="mailto:support@vrsa.app" className="text-indigo-400 hover:text-indigo-300 transition-colors">support@vrsa.app</a></p>
        </section>

        <div className="pt-6 border-t border-slate-700 text-center font-semibold text-slate-200">
          By using VRS/A, you agree to these terms. Now go make some music.
        </div>
      </div>
    </div>
  </div>
);

export default Terms;