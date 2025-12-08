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

import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import MainLayout from './components/layout/MainLayout';
import Landing from './pages/Landing';
import Ghostwriter from './pages/Ghostwriter';
import WritingTools from './pages/WritingTools';
import Analyzer from './pages/Analyzer';
import AudioTools from './pages/AudioTools';
import Tools from './pages/Tools';
import AlbumArt from './pages/AlbumArt';
import Guide from './pages/Guide';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import StudioPass from './pages/StudioPass';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Feed from './pages/Feed';
import Projects from './pages/Projects';
import ProjectView from './pages/ProjectView';
import AdminPanel from './pages/AdminPanel';
import AuthComponent from './Auth';
import BlogIndex from './pages/blog';
import BlogPost from './pages/blog/BlogPost';
import NotionStyleCanvas from './pages/Ghostwriter/NotionStyleCanvas';

const App = () => {
  // NOTE: currentPage state is gone!
  const [selectedRhymeSchemes, setSelectedRhymeSchemes] = useState([]);

  return (
    <AppProviders>
      <Routes>
        {/* Landing Page (No Layout) */}
        <Route path="/" element={
          <div className="bg-slate-900 text-white font-sans">
            <Landing />
          </div>
        } />

        {/* Main App Pages (With Layout) */}
        <Route element={<MainLayout />}>
          <Route path="/ghostwriter" element={
            <Ghostwriter
              selectedRhymeSchemes={selectedRhymeSchemes}
              setSelectedRhymeSchemes={setSelectedRhymeSchemes}
            />
          } />
          <Route path="/ghostwriter/notion-canvas" element={<NotionStyleCanvas />} />
          <Route path="/writing-tools" element={<WritingTools />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/audio-tools" element={<AudioTools />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/albumart" element={<AlbumArt />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectView />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/studio-pass" element={<StudioPass />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/u/:username" element={<PublicProfile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<AuthComponent />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Route>
      </Routes>
    </AppProviders>
  );
};

export default App;