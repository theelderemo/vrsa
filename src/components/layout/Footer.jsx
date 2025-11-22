import React from 'react';

const Footer = ({ onTermsClick }) => (
  <footer className="p-2 bg-slate-900 border-t border-slate-700/50 shrink-0 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
    <span>2025 VRS/A. All rights reserved. Built independently. Not affiliated with any label, artist, or platform. Use at your own risk. Don't be weird with it.</span>
    <span className="mx-2">|</span>
    <span
      className="underline text-indigo-400 hover:text-indigo-300 cursor-pointer select-none"
      onClick={onTermsClick}
      tabIndex={0}
      role="link"
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onTermsClick(); }}
    >
      Terms of Service
    </span>
  </footer>
);

export default Footer;
