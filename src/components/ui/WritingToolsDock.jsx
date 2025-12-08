/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useState } from 'react';

const dockItems = [
  { id: 'analyzer', label: 'Analyzer' },
  { id: 'rhyme-finder', label: 'Rhyme Finder' },
  { id: 'wordplay', label: 'Wordplay' },
  { id: 'hook-generator', label: 'Hook Generator' },
  { id: 'more', label: 'More Coming...' },
];

const DockItemComponent = ({ item, isHovered, isActive, onHover, onClick }) => {
  return (
    <div
      className="relative group"
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className={`
          relative flex items-center justify-center
          px-4 py-2.5 rounded-lg
          backdrop-blur-[2px]
          border transition-all duration-300 ease-out
          cursor-pointer
          ${isActive 
            ? 'bg-indigo-600/30 border-indigo-500/50 scale-105 -translate-y-1 shadow-lg shadow-indigo-500/20' 
            : isHovered 
              ? 'bg-slate-700/50 border-slate-600/50 scale-105 -translate-y-1 shadow-lg shadow-white/10' 
              : 'bg-slate-800/50 border-slate-700/30 hover:scale-102 hover:bg-slate-700/30 hover:-translate-y-0.5'
          }
        `}
        onClick={() => onClick(item.id)}
      >
        <span className={`
          transition-all duration-300 text-sm font-medium whitespace-nowrap
          ${isActive ? 'text-indigo-400' : 'text-slate-300'}
          ${isHovered && !isActive ? 'text-white' : ''}
        `}>
          {item.label}
        </span>
      </div>
    </div>
  );
};

const WritingToolsDock = ({ activeTool, onToolSelect }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div className="flex justify-center">
      <div className={`
        flex items-end gap-3 px-6 py-4
        rounded-2xl
        bg-slate-800/60 backdrop-blur-xl
        border border-slate-700/50
        shadow-2xl
        transition-all duration-500 ease-out
      `}>
        {dockItems.map((item) => (
          <DockItemComponent
            key={item.id}
            item={item}
            isHovered={hoveredItem === item.id}
            isActive={activeTool === item.id}
            onHover={setHoveredItem}
            onClick={onToolSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default WritingToolsDock;
