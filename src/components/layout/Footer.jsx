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
