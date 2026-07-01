import React, { useState } from 'react';
import { useTasks, useCreateTask } from '../hooks/useTasks';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import StatsCard from '../components/ui/StatsCard';
import StatsCharts from '../components/StatsCharts';
import RecentActivity from '../components/RecentActivity';
import { PageSkeleton } from '../components/ui/Loader';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Button from '../components/ui/Button';
import {
  ListTodo,
  CheckCircle,
  Clock,
  AlertTriangle,
  Percent,
  Plus,
  Calendar,
  CheckSquare,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { mutate: createTask, isPending: createLoading } = useCreateTask();

  useKeyboardShortcuts({
    n: { action: () => setIsCreateOpen(true) },
    Escape: { action: () => setIsCreateOpen(false) },
  });

  // Fetch all tasks for analytics computation
  const { data, isLoading, isError, error } = useTasks({ limit: 1000 });

  if (isLoading) return <PageSkeleton />;
  if (isError) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-red-500">Failed to load dashboard data</h2>
        <p className="text-slate-500 dark:text-slate-400">{error?.message || 'Server error'}</p>
      </div>
    );
  }

  const tasks = data?.tasks || [];

  // Compute Metrics
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdue = tasks.filter((t) => {
    if (t.status === 'Completed') return false;
    return new Date(t.dueDate) < today;
  }).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Today's Tasks
  const todayTasks = tasks.filter((t) => {
    const dDate = new Date(t.dueDate);
    dDate.setHours(0, 0, 0, 0);
    return dDate.getTime() === today.getTime();
  });

  // Upcoming Deadlines (within next 3 days, excluding today/past)
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);

  const upcomingTasks = tasks
    .filter((t) => {
      if (t.status === 'Completed') return false;
      const dDate = new Date(t.dueDate);
      dDate.setHours(0, 0, 0, 0);
      return dDate > today && dDate <= threeDaysLater;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const handleCreateTask = (formData) => {
    createTask(formData, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track, prioritize, and master your daily workflow.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          icon={Plus}
          className="shadow-lg shadow-brand-500/20"
        >
          Add Task
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Tasks"
          value={total}
          icon={ListTodo}
          color="brand"
          subtitle="All active & completed"
        />
        <StatsCard
          title="Completed"
          value={completed}
          icon={CheckCircle}
          color="success"
          subtitle="Done tasks count"
        />
        <StatsCard
          title="Pending"
          value={pending}
          icon={Clock}
          color="info"
          subtitle="Awaiting attention"
        />
        <StatsCard
          title="Overdue"
          value={overdue}
          icon={AlertTriangle}
          color="danger"
          subtitle="Passed deadlines"
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={Percent}
          color="warning"
          subtitle="Performance metric"
        />
      </div>

      {/* Analytics Charts */}
      <StatsCharts tasks={tasks} />

      {/* Dynamic Schedule Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="glass-card p-6 rounded-2xl flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-brand-500" />
              Today's Schedule
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {todayTasks.length} task{todayTasks.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-1">
            {todayTasks.length === 0 ? (
              <div className="py-12 my-auto flex flex-col items-center justify-center text-slate-400">
                <p className="text-sm">No tasks scheduled for today</p>
                <Link to="/tasks" className="text-brand-500 hover:underline text-xs mt-2 font-medium">
                  View all tasks
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {todayTasks.slice(0, 2).map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            )}
            {todayTasks.length > 2 && (
              <div className="text-center pt-4 mt-auto">
                <Link to="/tasks" className="text-brand-500 hover:underline text-xs font-bold">
                  View all {todayTasks.length} tasks
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="glass-card p-6 rounded-2xl flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-500" />
              Upcoming Deadlines
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              Next 3 days
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {upcomingTasks.length === 0 ? (
              <div className="py-12 h-full flex flex-col items-center justify-center text-slate-400">
                <p className="text-sm">No upcoming deadlines found</p>
              </div>
            ) : (
              <div className="space-y-3 text-left">
                {upcomingTasks.map((task) => {
                  const daysLeft = Math.ceil(
                    (new Date(task.dueDate) - today) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <Link
                      key={task._id}
                      to={`/tasks/${task._id}`}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors"
                    >
                      <div className="min-w-0 pr-4">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-350 truncate">
                          {task.title}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold uppercase">
                          {task.category}
                        </p>
                      </div>
                      <span className="text-xs font-extrabold px-3 py-1 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex-shrink-0">
                        In {daysLeft} day{daysLeft > 1 ? 's' : ''}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="h-[400px]">
          <RecentActivity />
        </div>
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateTask}
        loading={createLoading}
      />
    </div>
  );
};

export default Dashboard;
