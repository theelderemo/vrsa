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

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for typewriter effect
 * @param {string} text - The full text to display
 * @param {number} speed - Typing speed in milliseconds (default: 20ms)
 * @param {boolean} enabled - Whether the effect is enabled
 * @returns {Object} - { displayedText, isTyping, skip }
 */
export const useTypewriter = (text, speed = 20, enabled = true) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);
  const timeoutRef = useRef(null);

  // Function to skip animation
  const skip = () => {
    setIsSkipped(true);
    setDisplayedText(text);
    setIsTyping(false);
    setCurrentIndex(text.length);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    // If effect is disabled or text is empty, show full text immediately
    if (!enabled || !text) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsTyping(true);
    setIsSkipped(false);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, enabled]);

  useEffect(() => {
    if (!enabled || !text || currentIndex >= text.length || isSkipped) {
      if (currentIndex >= text.length && text) {
        setIsTyping(false);
      }
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setDisplayedText(text.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, speed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, text, speed, enabled, isSkipped]);

  return { displayedText, isTyping, skip };
};
