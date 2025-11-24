import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- Import Outlet
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => { // No props needed
  return (
    <div className="bg-slate-900 text-white font-sans h-screen flex flex-col">
      <Header />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Outlet /> {/* <-- This is where the child route (Ghostwriter, Guide, etc.) renders */}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;