import React, { useState, useEffect } from 'react';
import AppProviders from './providers/AppProviders';
import MainLayout from './components/layout/MainLayout';
import Landing from './pages/Landing';
import Ghostwriter from './pages/Ghostwriter';
import Analyzer from './pages/Analyzer';
import Guide from './pages/Guide';
import Terms from './pages/Terms';
import AuthComponent from './Auth';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedRhymeSchemes, setSelectedRhymeSchemes] = useState([]);

  // Handle hash-based routing for login navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      if (hash === 'login') {
        setCurrentPage('login');
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <AppProviders>
      {currentPage === 'landing' ? (
        <div className="bg-slate-900 text-white font-sans">
          <Landing setCurrentPage={setCurrentPage} />
        </div>
      ) : (
        <MainLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
          {currentPage === 'ghostwriter' && (
            <Ghostwriter 
              selectedRhymeSchemes={selectedRhymeSchemes} 
              setSelectedRhymeSchemes={setSelectedRhymeSchemes} 
            />
          )}
          {currentPage === 'analyzer' && <Analyzer />}
          {currentPage === 'guide' && <Guide />}
          {currentPage === 'terms' && <Terms />}
          {currentPage === 'login' && <AuthComponent />}
        </MainLayout>
      )}
    </AppProviders>
  );
};

export default App;
