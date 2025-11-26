import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import MainLayout from './components/layout/MainLayout';
import Landing from './pages/Landing';
import Ghostwriter from './pages/Ghostwriter';
import Analyzer from './pages/Analyzer';
import AlbumArt from './pages/AlbumArt';
import Guide from './pages/Guide';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import StudioPass from './pages/StudioPass';
import AuthComponent from './Auth';

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
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/albumart" element={<AlbumArt />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/studio-pass" element={<StudioPass />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<AuthComponent />} />
        </Route>
      </Routes>
    </AppProviders>
  );
};

export default App;