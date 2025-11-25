import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';

const EditableLine = ({ 
  lineNumber, 
  text, 
  onEdit, 
  isEditing, 
  onCancelEdit,
  onSaveEdit 
}) => {
  const [editedText, setEditedText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = () => {
    setEditedText(text);
    onEdit(lineNumber, text);
  };

  const handleSave = () => {
    onSaveEdit(lineNumber, editedText);
  };

  const handleCancel = () => {
    setEditedText(text);
    onCancelEdit();
  };

  return (
    <div 
      className="group relative py-1 px-2 -mx-2 rounded hover:bg-slate-700/30 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-2">
        {/* Line number */}
        <span className="text-slate-500 text-xs font-mono w-8 flex-shrink-0 select-none pt-0.5">
          {lineNumber}
        </span>
        
        {/* Line content or edit input */}
        {isEditing ? (
          <div className="flex-1 flex flex-col gap-2">
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="flex-1 bg-slate-700 border border-indigo-500 rounded px-2 py-1 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs text-white flex items-center gap-1 transition-colors"
              >
                <Check size={12} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-slate-600 hover:bg-slate-700 rounded text-xs text-slate-200 flex items-center gap-1 transition-colors"
              >
                <X size={12} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="flex-1 text-slate-200 text-sm leading-relaxed">
              {text}
            </span>
            
            {/* Edit button (visible on hover) */}
            {(isHovered || isEditing) && (
              <button
                onClick={handleEdit}
                className="flex-shrink-0 p-1 rounded hover:bg-slate-600 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Edit line"
              >
                <Edit2 size={14} className="text-slate-400 hover:text-indigo-400" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EditableLine;
