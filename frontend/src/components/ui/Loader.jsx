import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizes[size]} animate-spin rounded-full border-t-brand-600 border-r-transparent border-b-brand-600 border-l-transparent`}
      />
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-card p-5 rounded-2xl animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-16" />
      </div>
      <div className="space-y-2">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
      </div>
      <div className="h-px bg-slate-200 dark:bg-slate-800/80 my-3" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
        <div className="flex gap-2">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-8" />
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-8" />
        </div>
      </div>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="glass-card p-5 rounded-2xl animate-pulse space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
};

export const PageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3 animate-pulse" />
      <StatsSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
