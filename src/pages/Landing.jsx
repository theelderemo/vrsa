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

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Animated border card component
const AnimatedBorderCard = ({ children, className = '', delay = 0 }) => {
  const topRef = useRef(null);
  const rightRef = useRef(null);
  const bottomRef = useRef(null);
  const leftRef = useRef(null);

  useEffect(() => {
    let animationId;
    const animateBorder = () => {
      const now = Date.now() / 1000;
      const speed = 0.5;

      const topX = Math.sin(now * speed + delay) * 100;
      const rightY = Math.cos(now * speed + delay) * 100;
      const bottomX = Math.sin(now * speed + Math.PI + delay) * 100;
      const leftY = Math.cos(now * speed + Math.PI + delay) * 100;

      if (topRef.current) topRef.current.style.transform = `translateX(${topX}%)`;
      if (rightRef.current) rightRef.current.style.transform = `translateY(${rightY}%)`;
      if (bottomRef.current) bottomRef.current.style.transform = `translateX(${bottomX}%)`;
      if (leftRef.current) leftRef.current.style.transform = `translateY(${leftY}%)`;

      animationId = requestAnimationFrame(animateBorder);
    };

    animationId = requestAnimationFrame(animateBorder);
    return () => cancelAnimationFrame(animationId);
  }, [delay]);

  return (
    <div className={`relative bg-slate-800/40 backdrop-blur-sm rounded-2xl overflow-hidden ${className}`}>
      {/* Animated borders */}
      <div className="absolute top-0 left-0 w-full h-0.5 overflow-hidden">
        <div ref={topRef} className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
      </div>
      <div className="absolute top-0 right-0 w-0.5 h-full overflow-hidden">
        <div ref={rightRef} className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500/60 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
        <div ref={bottomRef} className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
      </div>
      <div className="absolute top-0 left-0 w-0.5 h-full overflow-hidden">
        <div ref={leftRef} className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500/60 to-transparent" />
      </div>
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Feature card with hover effects
const FeatureCard = ({ title, description, color, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-${color}-500/50 transition-all duration-300 h-full`}>
        <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

const Landing = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    document.title = 'VRS/A - AI Lyric Assistant & Co-Writer';
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <div ref={heroRef} className="relative z-10 container mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Logo/Brand */}
          <motion.div variants={itemVariants} className="mb-8 flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center bg-slate-800/50 backdrop-blur-sm px-6 py-3 rounded-full border border-indigo-500/30"
            >
              <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                VRS/A
              </span>
            </motion.div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              VRS/A - AI-Powered Lyrical Co-Writing Studio
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.h2 variants={itemVariants} className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-normal">
            Generate lyrics in any artist's style. Analyze and deconstruct songs. 
            Create album art. All powered by advanced AI models including Claude Opus, GPT 5.1, and DeepSeek.
          </motion.h2>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/ghostwriter">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Start Ghostwriting
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/writing-tools">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 bg-slate-800/80 backdrop-blur-sm border-2 border-indigo-500/50 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-indigo-400 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Explore Writing Tools
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 mb-16">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Always Free Core Features</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>No Ads or Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Multiple AI Models</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20">
          {/* Ghostwriter Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedBorderCard delay={0} className="h-full">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-indigo-300 mb-4">Ghostwriter</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Chat-based lyric generation. Input an artist, theme, mood, and rhyme scheme—the AI channels 
                  their style to create authentic verses, hooks, and full songs in seconds.
                </p>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">•</span>
                    Structured input for precision control
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">•</span>
                    17+ poetic forms & rhyme schemes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">•</span>
                    Project management & history
                  </li>
                </ul>
              </div>
            </AnimatedBorderCard>
          </motion.div>

          {/* Writing Tools Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <AnimatedBorderCard delay={Math.PI / 2} className="h-full">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-purple-300 mb-4">Writing Tools</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  A full suite of utilities for analyzing lyrics, finding rhymes, generating hooks, 
                  and exploring wordplay. Deconstruct what makes great songs work.
                </p>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Style Palette & Stat-Sheet analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    13-mode Word Finder (rhymes, synonyms, etc.)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span>
                    Hook Generator & Wordplay Suggester
                  </li>
                </ul>
              </div>
            </AnimatedBorderCard>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Everything You Need to Write Better Lyrics
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard
              title="Style Palette"
              description="Extract genre, themes, word choice, flow habits, and artist signatures from any lyrics."
              color="indigo"
              delay={0}
            />
            <FeatureCard
              title="Stat-Sheet"
              description="Lexical density, sentiment analysis, reading level, and banned word detection."
              color="purple"
              delay={0.1}
            />
            <FeatureCard
              title="Album Art"
              description="Generate album covers, artist avatars, and band logos with Flux 1.1 Pro."
              color="pink"
              delay={0.2}
            />
            <FeatureCard
              title="Suno Tags"
              description="Auto-generate genre, instrument, and style tags compatible with Suno AI."
              color="amber"
              delay={0.3}
            />
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <AnimatedBorderCard className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Ready to Write Your Next Hit?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join artists using VRS/A to push creative boundaries. Free tier available forever—upgrade to Studio Pass for premium models and unlimited tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/ghostwriter">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Get Started Free
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/studio-pass">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-slate-700/50 border border-slate-600 rounded-xl font-semibold transition-all duration-300 hover:border-indigo-500/50 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  View Studio Pass
                </motion.button>
              </Link>
            </div>
          </AnimatedBorderCard>
        </motion.div>
      </div>

      {/* Footer with Links */}
      <footer className="relative z-10 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto mb-8">
            {/* Tools */}
            <div>
              <h3 className="text-white font-semibold mb-4">Tools</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/ghostwriter" className="text-slate-400 hover:text-indigo-400 transition-colors">
                    Ghostwriter
                  </Link>
                </li>
                <li>
                  <Link to="/writing-tools" className="text-slate-400 hover:text-indigo-400 transition-colors">
                    Writing Tools
                  </Link>
                </li>
                <li>
                  <Link to="/albumart" className="text-slate-400 hover:text-indigo-400 transition-colors">
                    Album Art Generator
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className="text-slate-400 hover:text-indigo-400 transition-colors">
                    Projects
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="text-white font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/feed" className="text-slate-400 hover:text-indigo-400 transition-colors">
                    Feed
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-slate-400 hover:text-indigo-400 transition-colors">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/studio-pass" className="text-slate-400 hover:text-indigo-400 transition-colors">
                    Studio Pass
                  </Link>
                </li>
                <li>
                  <a href="https://discord.com/invite/FQ6XGNf53P" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors">
                    Discord
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/guide" className="text-slate-400 hover:text-indigo-400 transition-colors">
                    Guide
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="text-slate-400 hover:text-indigo-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-slate-400 hover:text-indigo-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-slate-500 text-sm border-t border-slate-800/50 pt-8">
            <p>&copy; 2025 VRS/A. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
