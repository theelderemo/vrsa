import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ currentPage, setCurrentPage, children }) => {
  return (
    <div className="bg-slate-900 text-white font-sans h-screen flex flex-col">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 min-h-0 overflow-y-auto">
        {children}
      </div>
      <Footer onTermsClick={() => setCurrentPage('terms')} />
    </div>
  );
};

export default MainLayout;
