import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // <-- Imports
import { useUser } from '../../hooks/useUser';

const Header = () => { // No props needed anymore!
  const { user, signOut } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Ghostwriter', path: '/ghostwriter' },
    { name: 'Analyzer', path: '/analyzer' },
    { name: 'AlbumArt', path: '/albumart' },
    { name: 'Guide', path: '/guide' },
    { name: 'Terms', path: '/terms' }
  ];
  
  // Helper to check active state
  const isActive = (path) => location.pathname === path;

  return (
    <header className="p-4 border-b border-slate-700/50 bg-slate-900 z-10 shrink-0">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Left Spacer or Logo Link */}
        <Link to="/" className="text-3xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
          VRS/A
        </Link>
        
        {/* Center (Removed redundant text, or keep it if you want) */}
        <div></div> 
        
        {/* Right navigation */}
        <nav className="flex items-center space-x-2 md:space-x-4">
          {navItems.map(item => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Auth Button */}
          {user ? (
            <div className="flex items-center space-x-2 ml-2">
              {/* ... existing user profile code ... */}
              <button
                onClick={async () => {
                  await signOut();
                  navigate('/'); // Use navigate instead of window.reload
                }}
                className="px-3 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ml-2 ${
                isActive('/login')
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-600/80 hover:bg-indigo-600 text-white'
              }`}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;