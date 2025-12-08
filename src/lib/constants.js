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

// Model options
export const MODEL_OPTIONS = [
  { id: 'gpt-4o', name: 'gpt-4o', premium: false },
  { id: 'gpt-4o-mini', name: 'gpt-4o-mini', premium: false},
  { id: 'DeepSeek-R1', name: 'DeepSeek R1', premium: false },
  { id: 'DeepSeek-R1-0528', name: 'DeepSeek R1 0528', premium: true },
  { id: 'DeepSeek-V3-0324', name: 'DeepSeek V3 0324', premium: false },
  { id: 'DeepSeek-V3.1', name: 'DeepSeek V3.1', premium: true },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', premium: true }, 
  { id: 'claude-4.5-haiku', name: 'Claude 4.5 Haiku', premium: true },
  { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', premium: false, beta: false },
  { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', premium: true},
  { id: 'Kimi-K2-Thinking', name: 'Kimi K2 Thinking', premium: true },
  { id: 'gpt-4.1', name: 'GPT 4.1', premium: true },
  { id: 'gpt-5.1-chat', name: 'GPT 5.1', premium: true},
  { id: 'model-router', name: 'Model Router', premium: true }
];

// Image generator options
export const IMAGE_GENERATOR_OPTIONS = [
  { id: 'FLUX-1.1-pro', name: 'Flux 1.1', premium: true }
];

// Rhyme scheme options organized by category
export const rhymePlacementOptions = [
  "End rhyme",
  "Internal rhyme",
  "Cross-line rhyme"
];

export const rhymeQualityOptions = [
  "Perfect rhyme",
  "Slant rhyme",
  "Assonance",
  "Consonance",
  "Multisyllabic rhyme"
];

export const rhymePatternOptions = [
  "AABB (couplets)",
  "ABAB (alternating)",
  "ABBA (enclosed)",
  "ABCCB Pattern",
  "ABCCA",
  "Free/irregular"
];

export const poeticFormOptions = [
  "Haiku",
  "Sonnet",
  "Free verse",
  "Limerick",
  "Villanelle",
  "Elegy",
  "Ode",
  "Acrostic",
  "Sestina",
  "Narrative",
  "Cinquain",
  "Prose",
  "Ekphrastic",
  "Pantoum",
  "Pastoral",
  "Ballad",
  "Ghazal"
];
