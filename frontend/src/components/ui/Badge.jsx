import React from 'react';

const Badge = ({ children, variant = 'info', className = '' }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border';

  const variants = {
    // Priorities
    High: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    Low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',

    // Statuses
    Completed: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    Pending: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    Overdue: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',

    // Categories
    Personal: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    Work: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    Study: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    Shopping: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    Health: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    Others: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',

    // Default info
    info: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20',
  };

  return (
    <span className={`${baseStyles} ${variants[children] || variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
