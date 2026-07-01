import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search tasks by title or description...' }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
        <Search className="w-5 h-5" />
      </div>
      <input
        id="task-search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search tasks by title or description"
        className="w-full pl-11 pr-12 py-3 rounded-2xl border bg-white/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200 form-input-ring focus:border-brand-500 text-sm"
      />
      {value ? (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search query"
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      ) : (
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-flex select-none items-center justify-center rounded border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 w-5 h-5 font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 shadow-sm">
            /
          </kbd>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
