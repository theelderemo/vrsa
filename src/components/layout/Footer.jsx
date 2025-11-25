import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="p-4 bg-slate-900 border-t border-slate-700/50 shrink-0 flex flex-col md:flex-row items-center justify-center gap-4 text-xs text-slate-400">
    <span className="text-center md:text-left">
      2025 VRS/A. All rights reserved. Built independently. Use at your own risk. Don't be weird with it.
    </span>
    
    <div className="flex items-center gap-4">
      <span className="hidden md:inline text-slate-600">|</span>
      <Link 
        to="/terms" 
        className="hover:text-indigo-400 transition-colors"
      >
        Terms of Service
      </Link>
      <span className="text-slate-600">|</span>
      <Link 
        to="/privacy" 
        className="hover:text-indigo-400 transition-colors"
      >
        Privacy Policy
      </Link>
    </div>
  </footer>
);

export default Footer;
