import React from 'react';

const Terms = () => (
  <div className="flex flex-col items-center justify-center min-h-full bg-slate-900 p-8">
    <div className="max-w-4xl w-full bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700/50">
      <h1 className="text-3xl font-bold text-indigo-400 mb-4">VRS/A Terms of Service</h1>
      <div className="text-slate-300 text-sm whitespace-pre-line">
        {`
Last updated: August 17, 2025

By accessing or using the VRS/A web application ("VRS/A", "we", "us", or "our"), you agree to be bound by the following Terms of Service ("Terms"). If you do not agree to these Terms, do not use the application.

1. Acceptance of Terms

By using VRS/A, you acknowledge that you have read, understood, and agree to be bound by these Terms, along with our Privacy Policy. These Terms apply to all users, including developers, musicians, writers, and any other individuals accessing the app.

2. Usage Guidelines

You agree not to use VRS/A for any purpose that:

Violates any applicable local, state, national, or international law;

Involves hate speech, threats, or harassment;

Promotes violence or harm toward any group or individual;

Generates or distributes unlawful, libelous, defamatory, or obscene content;

Attempts to reverse-engineer, clone, or extract source materials from the app;

Abuses the API or infrastructure in a way that degrades service for others.

We reserve the right to suspend or ban any user for violations, without notice.

3. No Warranty / "As-Is" Clause

VRS/A is provided "as-is" and "as-available" without warranties of any kind, express or implied. This includes but is not limited to merchantability, fitness for a particular purpose, and non-infringement.

We do not guarantee the app will be error-free, uninterrupted, or that the content generated will be accurate, appropriate, or safe. You use it at your own risk.

4. Limitation of Liability

To the maximum extent permitted by law, VRS/A and its creator(s) shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to loss of data, revenue, or business, resulting from:

The use or inability to use the app;

Any content generated through the app;

Unauthorized access to or alteration of your data;

Any bugs, errors, or security issues.

Using VRS/A does not create any warranty, relationship, or obligation between you and the creator beyond what is explicitly stated here.

5. User Responsibility

You are solely responsible for any content you generate using VRS/A. If you choose to publish, share, or monetize content created through the app, you assume full legal responsibility for how that content is used.

You also agree not to represent VRS/A as an official service of, or affiliated with, any musical artist, label, or company.

6. Intellectual Property

All branding, UI design, logic, and backend infrastructure related to VRS/A remain the intellectual property of the creator. You may not reproduce, repurpose, or clone any part of the app without explicit written permission.

Generated lyrical content is not claimed by VRS/A, and users may retain or disclaim ownership as they see fit.

7. Privacy & Data Collection

VRS/A is designed with user privacy as a priority. The application does not use any third-party trackers or advertising cookies. The core functionality of the app is available without an account and does not require you to provide personal information.

If you choose to create an account, your authentication is handled securely by Supabase. We do not sell or share your data.

8. Modifications to Terms

We reserve the right to update or modify these Terms at any time. Changes will be posted on this page with a revised "last updated" date. Your continued use after such changes constitutes acceptance.

9. Contact

Questions or legal inquiries? Email: vrsa.app@mailfence.com

By using VRS/A, you accept these Terms and agree not to sue, whine, or attempt to hold the app liable for your bad lyrics, broken dreams, or existential crises.
        `}
      </div>
    </div>
  </div>
);

export default Terms;
