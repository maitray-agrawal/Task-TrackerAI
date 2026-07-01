import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const COLORS = {
  status: ['#f59e0b', '#10b981'], // Pending, Completed
  priority: {
    High: '#ef4444',
    Medium: '#f59e0b',
    Low: '#10b981',
  },
  category: ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'],
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-left">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{payload[0].name}</p>
        <p className="text-xs text-brand-500 dark:text-brand-400 font-bold mt-1">
          Tasks: <span className="font-extrabold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const StatsCharts = ({ tasks = [] }) => {
  const total = tasks.length;

  if (total === 0) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center text-slate-400 dark:text-slate-500 py-12">
        <p className="text-sm">No task data available for visualizations</p>
      </div>
    );
  }

  // 1. Status Data (Pending vs Completed)
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const statusData = [
    { name: 'Pending', value: pendingCount },
    { name: 'Completed', value: completedCount },
  ];

  // 2. Priority Data (High, Medium, Low)
  const priorityCounts = tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 }
  );
  const priorityData = [
    { name: 'High', value: priorityCounts.High, fill: COLORS.priority.High },
    { name: 'Medium', value: priorityCounts.Medium, fill: COLORS.priority.Medium },
    { name: 'Low', value: priorityCounts.Low, fill: COLORS.priority.Low },
  ];

  // 3. Category Data (Work, Personal, Shopping, Others etc.)
  const categoryCounts = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.keys(categoryCounts).map((catName) => ({
    name: catName,
    value: categoryCounts[catName],
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Status Chart */}
      <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-[300px]">
        <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 text-left">
          Tasks by Status
        </h4>
        <div className="flex-1 min-h-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.status[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {total}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Total
            </span>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Pending ({pendingCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Completed ({completedCount})</span>
          </div>
        </div>
      </div>

      {/* Priority Chart */}
      <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-[300px]">
        <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 text-left">
          Tasks by Priority
        </h4>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 'bold' }}
                className="text-slate-500 dark:text-slate-400"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 11 }}
                className="text-slate-500 dark:text-slate-400"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.04)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Chart */}
      <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-[300px]">
        <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 text-left">
          Tasks by Category
        </h4>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.category[index % COLORS.category.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-[10px] font-semibold text-slate-650 dark:text-slate-450 max-h-[50px] overflow-y-auto">
          {categoryData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS.category[index % COLORS.category.length] }}
              />
              <span>{entry.name} ({entry.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsCharts;
