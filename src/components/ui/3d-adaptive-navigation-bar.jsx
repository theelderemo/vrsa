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

export const PillBase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [hovering, setHovering] = useState(false);
  const containerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Navigation items matching the app structure
  const baseNavItems = [
    { label: 'Home', id: 'home', path: '/' },
    { label: 'Ghostwriter', id: 'ghostwriter', path: '/ghostwriter' },
    { label: 'Analyzer', id: 'analyzer', path: '/analyzer' },
    { label: 'AlbumArt', id: 'albumart', path: '/albumart' },
    { label: 'Guide', id: 'guide', path: '/guide' },
    { label: 'Studio Pass', id: 'studio-pass', path: '/studio-pass' },
  ];

  // Add Profile or Login based on auth state
  const navItems = user
    ? [...baseNavItems, { label: 'Profile', id: 'profile', path: '/profile' }]
    : [...baseNavItems, { label: 'Login', id: 'login', path: '/login' }];

  // Get active section from current path
  const getActiveSection = () => {
    const path = location.pathname;
    const item = navItems.find(item => item.path === path);
    return item?.id || 'home';
  };

  const activeSection = getActiveSection();

  // Spring animations for smooth motion
  const pillWidth = useSpring(160, { stiffness: 220, damping: 25, mass: 1 });

  // Handle hover expansion
  useEffect(() => {
    if (hovering) {
      setExpanded(true);
      pillWidth.set(680);
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
    };
  }, [hovering, pillWidth]);

  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  const handleSectionClick = (item) => {
    setHovering(false);
    navigate(item.path);
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
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ 
                    delay: index * 0.04,
                    duration: 0.2,
                    ease: 'easeOut'
                  }}
                  onClick={() => handleSectionClick(item)}
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
              );
            })}
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default PillBase;
