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
import ReactMarkdown from 'react-markdown';
import { useTypewriter } from '../../hooks/useTypewriter';

/**
 * TypewriterText component - renders text with typewriter effect
 * @param {string} text - The text to display
 * @param {number} speed - Typing speed in milliseconds (default: 15ms)
 * @param {boolean} markdown - Whether to render as markdown
 * @param {string} className - Additional CSS classes
 */
const TypewriterText = ({ text, speed = 15, markdown = false, className = '' }) => {
  const { displayedText, isTyping, skip } = useTypewriter(text, speed, true);

  if (markdown) {
    return (
      <div className="relative">
        <ReactMarkdown>{displayedText}</ReactMarkdown>
        {isTyping && (
          <>
            <span className="inline-block w-1 h-4 ml-1 bg-indigo-400 animate-pulse" />
            <button
              onClick={skip}
              className="ml-3 px-2 py-1 text-xs rounded-md bg-indigo-600/80 hover:bg-indigo-500 text-white transition-colors"
              aria-label="Skip animation"
            >
              Skip
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <span className={className}>
      {displayedText}
      {isTyping && (
        <>
          <span className="inline-block w-1 h-4 ml-1 bg-indigo-400 animate-pulse" />
          <button
            onClick={skip}
            className="ml-3 px-2 py-1 text-xs rounded-md bg-indigo-600/80 hover:bg-indigo-500 text-white transition-colors"
            aria-label="Skip animation"
          >
            Skip
          </button>
        </>
      )}
    </span>
  );
};

export default TypewriterText;
