import React from 'react';

const StatsCharts = ({ tasks = [] }) => {
  // 1. Calculate Priority Distribution
  const priorityCounts = tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 }
  );

  const totalPriorityTasks = tasks.length;

  // Pie/Donut Chart calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius; // ~377

  const priorities = [
    { label: 'High', count: priorityCounts.High, color: '#ef4444', class: 'text-red-500' },
    { label: 'Medium', count: priorityCounts.Medium, color: '#f59e0b', class: 'text-amber-500' },
    { label: 'Low', count: priorityCounts.Low, color: '#10b981', class: 'text-emerald-500' },
  ];

  let currentOffset = 0;
  const segments = priorities.map((p) => {
    const percentage = totalPriorityTasks > 0 ? p.count / totalPriorityTasks : 0;
    const strokeLength = percentage * circumference;
    const offset = currentOffset;
    currentOffset += strokeLength;

    return {
      ...p,
      percentage: Math.round(percentage * 100),
      strokeDasharray: `${strokeLength} ${circumference - strokeLength}`,
      strokeDashoffset: -offset,
    };
  });

  // 2. Calculate Category Distribution
  const categoryCounts = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  const categoriesList = [
    { name: 'Work', color: 'bg-sky-500' },
    { name: 'Personal', color: 'bg-indigo-500' },
    { name: 'Study', color: 'bg-violet-500' },
    { name: 'Shopping', color: 'bg-pink-500' },
    { name: 'Health', color: 'bg-teal-500' },
    { name: 'Others', color: 'bg-slate-500' },
  ].map((cat) => ({
    ...cat,
    count: categoryCounts[cat.name] || 0,
  }));

  const maxCategoryCount = Math.max(...categoriesList.map((c) => c.count), 1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Priority Distribution Chart */}
      <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 pl-0.5">
            Priority Distribution
          </h4>
        </div>

        {totalPriorityTasks === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-slate-400">
            <p className="text-sm">No task data available</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="16"
                  fill="transparent"
                />
                {/* Colored Segments */}
                {segments.map(
                  (seg, i) =>
                    seg.count > 0 && (
                      <circle
                        key={i}
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke={seg.color}
                        strokeWidth="18"
                        strokeDasharray={seg.strokeDasharray}
                        strokeDashoffset={seg.strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-500 hover:stroke-[22px] cursor-pointer"
                      />
                    )
                )}
              </svg>
              {/* Inner Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-none">
                  {totalPriorityTasks}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
                  Tasks
                </span>
              </div>
            </div>

            {/* Legends */}
            <div className="flex flex-col gap-2.5">
              {segments.map((seg, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {seg.label} Priority
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      {seg.count} task{seg.count !== 1 ? 's' : ''} ({seg.percentage}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Progress Bars */}
      <div className="glass-card p-6 rounded-2xl">
        <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 pl-0.5">
          Category Breakdown
        </h4>
        <div className="space-y-3.5">
          {categoriesList.map((cat) => {
            const pct = Math.round((cat.count / tasks.length || 0) * 100);
            return (
              <div key={cat.name} className="space-y-1 text-left">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300">{cat.name}</span>
                  <span className="text-slate-400 dark:text-slate-500 font-semibold">
                    {cat.count} ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cat.color}`}
                    style={{ width: `${Math.max(3, (cat.count / maxCategoryCount) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsCharts;
