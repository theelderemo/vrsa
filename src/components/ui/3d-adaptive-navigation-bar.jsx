/**
 * Adaptive Navigation Pill
 * Smart navigation with hover expansion
 * Flat design for VRS/A dark theme
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { useUser } from '../../hooks/useUser';
import { ADMIN_EMAIL } from '../../lib/admin';

export const PillBase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(null);
  const containerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const submenuTimeoutRef = useRef(null);

  const isAdmin = user?.email === ADMIN_EMAIL;

  // Navigation items matching the app structure
  const baseNavItems = [
    { label: 'Home', id: 'home', path: '/' },
    { label: 'Ghostwriter', id: 'ghostwriter', path: '/ghostwriter' },
    { label: 'Feed', id: 'feed', path: '/feed' },
    { 
      label: 'Tools', 
      id: 'tools', 
      path: '/tools',
      submenu: [
        {
          name: 'Writing Tools',
          items: [
            { name: 'Analyzer', path: '/analyzer' },
            { name: 'Rhyme Finder', path: '/writing-tools?tool=rhyme-finder' },
            { name: 'Wordplay Suggester', path: '/writing-tools?tool=wordplay-suggester' },
            { name: 'Hook Generator', path: '/writing-tools?tool=hook-generator' }
          ]
        },
        {
          name: 'Audio Tools',
          items: [
            { name: 'Audio Analyzer', path: '/audio-tools' }
          ]
        }
      ]
    },
    { label: 'AlbumArt', id: 'albumart', path: '/albumart' },
    { label: 'Projects', id: 'projects', path: '/projects' },
    { label: 'Guide', id: 'guide', path: '/guide' },
    { label: 'Studio Pass', id: 'studio-pass', path: '/studio-pass' },
  ];

  // Add Admin link for admin user, then Profile or Login based on auth state
  let navItems = [...baseNavItems];
  if (isAdmin) {
    navItems.push({ label: 'Admin', id: 'admin', path: '/admin' });
  }
  navItems = user
    ? [...navItems, { label: 'Profile', id: 'profile', path: '/profile' }]
    : [...navItems, { label: 'Login', id: 'login', path: '/login' }];

  // Get active section from current path
  const getActiveSection = () => {
    const path = location.pathname;
    
    // Handle tool-related paths
    if (path === '/analyzer' || path === '/writing-tools' || path.startsWith('/writing-tools') || path === '/audio-tools' || path.startsWith('/audio-tools')) {
      return 'tools';
    }
    
    const item = navItems.find(item => item.path === path);
    return item?.id || 'home';
  };

  const activeSection = getActiveSection();

  // Spring animations for smooth motion
  const pillWidth = useSpring(160, { stiffness: 220, damping: 25, mass: 1 });

  // Calculate expanded width based on number of items
  const expandedWidth = isAdmin ? 920 : 860;

  // Handle hover expansion
  useEffect(() => {
    if (hovering) {
      setExpanded(true);
      pillWidth.set(expandedWidth);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setExpanded(false);
        pillWidth.set(160);
      }, 600);
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
    };
  }, [hovering, pillWidth, expandedWidth]);

  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  const handleSectionClick = (item) => {
    if (item.submenu) {
      // Don't navigate for submenu items, just show submenu
      return;
    }
    setHovering(false);
    setSubmenuOpen(null);
    navigate(item.path);
  };

  const handleSubmenuEnter = (itemId) => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }
    setSubmenuOpen(itemId);
  };

  const handleSubmenuLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setSubmenuOpen(null);
    }, 200);
  };

  const handleSubmenuItemClick = (path) => {
    setHovering(false);
    setSubmenuOpen(null);
    navigate(path);
  };

  const activeItem = navItems.find(item => item.id === activeSection);

  return (
    <motion.nav
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-full bg-slate-800 border border-slate-700/50"
      style={{
        width: pillWidth,
        height: '48px',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Navigation items container */}
      <div 
        ref={containerRef}
        className="relative z-10 h-full flex items-center justify-center px-5"
      >
        {/* Collapsed state - show only active section with smooth text transitions */}
        {!expanded && (
          <div className="flex items-center relative">
            <AnimatePresence mode="wait">
              {activeItem && (
                <motion.span
                  key={activeItem.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{
                    duration: 0.25,
                    ease: [0.4, 0.0, 0.2, 1]
                  }}
                  className="text-indigo-400 font-semibold text-sm whitespace-nowrap"
                >
                  {activeItem.label}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Expanded state - show all sections with stagger */}
        {expanded && (
          <div className="flex items-center justify-evenly w-full">
            {navItems.map((item, index) => {
              const isActive = item.id === activeSection;
              
              return (
                <div key={item.id} className="relative">
                  <motion.button
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ 
                      delay: index * 0.04,
                      duration: 0.2,
                      ease: 'easeOut'
                    }}
                    onClick={() => handleSectionClick(item)}
                    onMouseEnter={() => item.submenu ? handleSubmenuEnter(item.id) : null}
                    onMouseLeave={() => item.submenu ? handleSubmenuLeave() : null}
                    className={`
                      relative cursor-pointer transition-colors duration-150
                      text-sm px-3 py-2 rounded-md whitespace-nowrap
                      ${isActive 
                        ? 'text-indigo-400 font-semibold' 
                        : 'text-slate-400 hover:text-slate-200 font-medium'
                      }
                    `}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                    }}
                  >
                    {item.label}
                  </motion.button>

                  {/* Submenu dropdown */}
                  {item.submenu && submenuOpen === item.id && (
                    <div 
                      className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-700/50 rounded-lg shadow-xl z-50"
                      onMouseEnter={() => handleSubmenuEnter(item.id)}
                      onMouseLeave={handleSubmenuLeave}
                    >
                      {item.submenu.map(category => (
                        <div key={category.name} className="p-2">
                          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            {category.name}
                          </div>
                          <div className="space-y-1">
                            {category.items.map(subItem => (
                              <button
                                key={subItem.name}
                                onClick={() => handleSubmenuItemClick(subItem.path)}
                                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors"
                              >
                                {subItem.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default PillBase;
