import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  type = 'text',
  error,
  placeholder,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 pl-0.5">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200 form-input-ring ${
          error
            ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
            : 'focus:border-brand-500'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 pl-0.5 animate-fade-in">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const TextArea = forwardRef(({
  label,
  error,
  placeholder,
  rows = 3,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 pl-0.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200 form-input-ring ${
          error
            ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
            : 'focus:border-brand-500'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 pl-0.5 animate-fade-in">{error}</p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export const Select = forwardRef(({
  label,
  error,
  options = [],
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 pl-0.5">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200 form-input-ring ${
          error
            ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
            : 'focus:border-brand-500'
        }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 pl-0.5 animate-fade-in">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
