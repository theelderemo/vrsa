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
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import { PillBase } from '../ui/3d-adaptive-navigation-bar';
import { NotificationAlertDialog } from '../ui/NotificationAlertDialog';
import { ADMIN_EMAIL } from '../../lib/admin';

const Header = () => {
  const { user } = useUser();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedSubmenus, setExpandedSubmenus] = useState({});
  
  const isAdmin = user?.email === ADMIN_EMAIL;
  
  const navItems = [
    {
      name: 'Ghostwriter',
      path: '/ghostwriter',
      submenu: [
        {
          name: 'Workflows',
          items: [
            { name: 'Chat', path: '/ghostwriter' },
            { name: 'Notion-Style Canvas', path: '/ghostwriter/notion-canvas' }
          ]
        }
      ]
    },
    { name: 'Feed', path: '/feed' },
    { 
      name: 'Tools', 
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
        },
        {
          name: 'Image Tools',
          items: [
            { name: 'Album Cover', path: '/albumart?type=album-cover' },
            { name: 'Artist Avatar', path: '/albumart?type=artist-avatar' },
            { name: 'Band Logo', path: '/albumart?type=band-logo' }
          ]
        }
      ]
    },
    { name: 'Blog', path: '/blog' },
    { name: 'Projects', path: '/projects' },
    { name: 'Guide', path: '/guide' },
    { name: 'Studio Pass', path: '/studio-pass' },
    { name: 'Terms', path: '/terms' }
  ];
  
  // Add Admin link for admin user, then Profile or Login
  let allNavItems = [...navItems];
  if (isAdmin) {
    allNavItems.push({ name: 'Admin', path: '/admin' });
  }
  allNavItems = user
    ? [...allNavItems, { name: 'Profile', path: '/profile' }]
    : [...allNavItems, { name: 'Login', path: '/login' }];
  
  const isActive = (path) => location.pathname === path;

  const toggleSubmenu = (itemName) => {
    setExpandedSubmenus(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const handleNavClick = () => {
    setMenuOpen(false);
    setExpandedSubmenus({});
  };

  return (
    <header className="p-4 border-b border-slate-700/50 bg-slate-900 z-50 shrink-0 relative">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-3xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors z-50"
          onClick={() => setMenuOpen(false)}
        >
          VRS/A
        </Link>
        
        {/* 3D Adaptive Navigation Pill - Desktop */}
        <div className="hidden md:flex items-center justify-center flex-1 px-8">
          <PillBase />
        </div>

        {/* Notification Bell & Hamburger - Right side */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <NotificationAlertDialog />
          
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors z-50"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sliding Menu - Mobile Only */}
      <nav
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-slate-900 border-l border-slate-700/50 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-20 px-6 pb-6 overflow-y-auto">
          {/* Navigation Items */}
          <div className="space-y-2">
            {allNavItems.map(item => {
              // Handle items with submenus
              if (item.submenu) {
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className="w-full flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      <span>{item.name}</span>
                      {expandedSubmenus[item.name] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    
                    {expandedSubmenus[item.name] && (
                      <div className="ml-4 space-y-1">
                        {item.submenu.map(category => (
                          <div key={category.name} className="space-y-1">
                            <div className="px-4 py-2 text-sm font-semibold text-slate-400 uppercase tracking-wide">
                              {category.name}
                            </div>
                            {category.items.map(subItem => (
                              <Link
                                key={subItem.name}
                                to={subItem.path}
                                onClick={handleNavClick}
                                className={`block px-4 py-2 text-sm rounded-lg transition-colors ml-4 ${
                                  isActive(subItem.path)
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-800'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              
              // Handle regular menu items
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;