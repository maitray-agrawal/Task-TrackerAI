import React from 'react';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = 'brand',
  subtitle,
}) => {
  const colors = {
    brand: {
      bg: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20',
      glow: 'from-brand-500/20 to-transparent',
    },
    success: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      glow: 'from-emerald-500/20 to-transparent',
    },
    warning: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      glow: 'from-amber-500/20 to-transparent',
    },
    danger: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      glow: 'from-rose-500/20 to-transparent',
    },
    info: {
      bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      glow: 'from-sky-500/20 to-transparent',
    },
  };

  const selectedColor = colors[color] || colors.brand;

  return (
    <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
      {/* Background ambient glow on hover */}
      <div className={`absolute -right-10 -bottom-10 w-24 h-24 rounded-full bg-gradient-to-br ${selectedColor.glow} blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />

      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${selectedColor.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2.5 pl-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatsCard;
