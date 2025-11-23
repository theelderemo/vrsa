import React from 'react';
import { useUser } from '../../hooks/useUser';

const Header = ({ currentPage, setCurrentPage }) => {
  const { user, profile, signOut } = useUser();
  const navItems = ['Ghostwriter', 'Analyzer', 'AlbumArt', 'Guide', 'Terms'];
  
  return (
    <header className="p-4 border-b border-slate-700/50 bg-slate-900 z-10 shrink-0">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div>{/* Left spacer */}</div>
        
        {/* Center content */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-indigo-400">VRS/A</h1>
        </div>
        
        {/* Right navigation */}
        <nav className="flex items-center space-x-2 md:space-x-4">
          {navItems.map(item => (
            <button 
              key={item} 
              onClick={() => setCurrentPage(item.toLowerCase())}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === item.toLowerCase() 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              {item}
            </button>
          ))}
          
          {/* Auth Button */}
          {user ? (
            <div className="flex items-center space-x-2 ml-2">
              <span className="text-slate-400 text-sm hidden md:inline">
                {profile?.username ? `@${profile.username}` : user.email}
              </span>
              <button
                onClick={async () => {
                  await signOut();
                  setCurrentPage('landing');
                  window.location.reload();
                }}
                className="px-3 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentPage('login')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ml-2 ${
                currentPage === 'login'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-600/80 hover:bg-indigo-600 text-white'
              }`}
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
