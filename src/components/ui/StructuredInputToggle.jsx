import React from 'react';
import { Settings, Sliders } from 'lucide-react';

const StructuredInputToggle = ({ enabled, onChange, className = "" }) => {
  return (
    <div className={`flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700 ${className}`}>
      <div className="flex items-center gap-2">
        {enabled ? (
          <Sliders className="w-5 h-5 text-indigo-400" />
        ) : (
          <Settings className="w-5 h-5 text-slate-500" />
        )}
        <div>
          <p className="text-sm font-medium text-slate-300">Use Structured Input</p>
          <p className="text-xs text-slate-500">
            {enabled ? 'Form fields guide the AI' : 'Free-form chat only'}
          </p>
        </div>
      </div>
      
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className={`w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600`}></div>
      </label>
    </div>
  );
};

export default StructuredInputToggle;
