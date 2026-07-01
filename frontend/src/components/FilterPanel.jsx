import React from 'react';
import { RotateCcw } from 'lucide-react';
import Button from './ui/Button';

const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const categories = ['Personal', 'Work', 'Study', 'Shopping', 'Health', 'Others'];
  const priorities = ['Low', 'Medium', 'High'];
  const statuses = ['Pending', 'Completed'];

  const handleChange = (key, value) => {
    onFilterChange(key, value);
  };

  // Determine if any filters are currently active (ignoring defaults like page/limit/sortBy)
  const isFiltered = filters.status || filters.priority || filters.category || filters.q;

  return (
    <div className="glass-card p-5 rounded-2xl w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        {/* Status Filter */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-0.5">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border bg-white/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 transition-all duration-200 form-input-ring focus:border-brand-500 text-sm"
          >
            <option value="" className="bg-white dark:bg-slate-900">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status} className="bg-white dark:bg-slate-900">
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-0.5">
            Priority
          </label>
          <select
            value={filters.priority || ''}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border bg-white/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 transition-all duration-200 form-input-ring focus:border-brand-500 text-sm"
          >
            <option value="" className="bg-white dark:bg-slate-900">All Priorities</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority} className="bg-white dark:bg-slate-900">
                {priority}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-0.5">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border bg-white/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 transition-all duration-200 form-input-ring focus:border-brand-500 text-sm"
          >
            <option value="" className="bg-white dark:bg-slate-900">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category} className="bg-white dark:bg-slate-900">
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isFiltered && (
        <div className="flex justify-end mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            icon={RotateCcw}
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
