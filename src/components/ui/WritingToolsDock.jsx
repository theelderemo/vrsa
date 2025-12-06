/**
 * MIT License
 *
 * Copyright (c) 2025 Christopher Dickinson
 */

import React, { useState } from 'react';
import { BrainCircuit, Search, Sparkles, Lightbulb, MoreHorizontal } from 'lucide-react';

const dockItems = [
  { id: 'analyzer', icon: <BrainCircuit size={20} />, label: 'Analyzer' },
  { id: 'rhyme-finder', icon: <Search size={20} />, label: 'Rhyme Finder' },
  { id: 'wordplay', icon: <Sparkles size={20} />, label: 'Wordplay' },
  { id: 'hook-generator', icon: <Lightbulb size={20} />, label: 'Hook Generator' },
  { id: 'more', icon: <MoreHorizontal size={20} />, label: 'More Coming...' },
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
          w-11 h-11 rounded-lg
          backdrop-blur-[2px]
          border transition-all duration-300 ease-out
          cursor-pointer
          ${isActive 
            ? 'bg-indigo-600/30 border-indigo-500/50 scale-110 -translate-y-1 shadow-lg shadow-indigo-500/20' 
            : isHovered 
              ? 'bg-slate-700/50 border-slate-600/50 scale-110 -translate-y-1 shadow-lg shadow-white/10' 
              : 'bg-slate-800/50 border-slate-700/30 hover:scale-105 hover:bg-slate-700/30 hover:-translate-y-0.5'
          }
        `}
        onClick={() => onClick(item.id)}
      >
        <div className={`
          transition-all duration-300
          ${isActive ? 'text-indigo-400' : 'text-slate-300'}
          ${isHovered && !isActive ? 'scale-105 text-white' : ''}
        `}>
          {item.icon}
        </div>
      </div>
      
      {/* Tooltip */}
      <div className={`
        absolute -top-10 left-1/2 transform -translate-x-1/2
        px-2.5 py-1 rounded-md
        bg-slate-900/90 backdrop-blur
        text-white text-xs font-normal
        border border-slate-700/50
        transition-all duration-200
        pointer-events-none
        whitespace-nowrap
        z-50
        ${isHovered 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-1'
        }
        shadow-sm
      `}>
        {item.label}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 bg-slate-900/90 rotate-45 border-r border-b border-slate-700/50"></div>
        </div>
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
