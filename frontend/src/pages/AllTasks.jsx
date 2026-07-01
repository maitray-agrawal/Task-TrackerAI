import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '../hooks/useTasks';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Button from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Loader';
import { Plus, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

const AllTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States synchronizing with SearchParams for bookmarkable state!
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [priority, setPriority] = useState(searchParams.get('priority') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // Sync state changes back to search URL params
  useEffect(() => {
    const params = {};
    if (q) params.q = q;
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (category) params.category = category;
    if (sortBy !== 'newest') params.sortBy = sortBy;
    if (page > 1) params.page = page.toString();

    setSearchParams(params);
  }, [q, status, priority, category, sortBy, page, setSearchParams]);

  // Handle category filter updates from Sidebar links
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam !== null) {
      setCategory(categoryParam);
    }
  }, [searchParams]);

  const filters = { q, status, priority, category, sortBy, page, limit: 9 };

  // Queries
  const { data, isLoading, isError, error } = useTasks(filters);
  const { mutate: createTask, isPending: createLoading } = useCreateTask();
  const { mutate: updateTask, isPending: editLoading } = useUpdateTask();
  const { mutate: deleteTask, isPending: deleteLoading } = useDeleteTask();

  // Modals States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useKeyboardShortcuts({
    n: { action: () => setIsCreateOpen(true) },
    f: { action: () => setShowFilters((prev) => !prev) },
    '/': {
      action: () => {
        const input = document.getElementById('task-search-input');
        if (input) input.focus();
      },
    },
    Escape: {
      action: () => {
        setIsCreateOpen(false);
        setEditingTask(null);
        setDeletingId(null);
      },
    },
  });

  const tasks = data?.tasks || [];
  const pagination = data?.pagination || { totalTasks: 0, totalPages: 1, currentPage: 1 };

  const handleResetFilters = () => {
    setQ('');
    setStatus('');
    setPriority('');
    setCategory('');
    setSortBy('newest');
    setPage(1);
  };

  const handleFilterChange = (key, value) => {
    setPage(1);
    if (key === 'status') setStatus(value);
    if (key === 'priority') setPriority(value);
    if (key === 'category') setCategory(value);
  };

  const handleCreateSubmit = (formData) => {
    createTask(formData, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleEditSubmit = (formData) => {
    updateTask(
      { id: editingTask._id, data: formData },
      {
        onSuccess: () => setEditingTask(null),
      }
    );
  };

  const handleDeleteConfirm = () => {
    deleteTask(deletingId, {
      onSuccess: () => setDeletingId(null),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            All Tasks
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Found {pagination.totalTasks} task{pagination.totalTasks !== 1 ? 's' : ''} in total.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            icon={SlidersHorizontal}
            className={showFilters ? 'bg-slate-200 dark:bg-slate-800' : ''}
          >
            Filters
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            icon={Plus}
            className="shadow-lg shadow-brand-500/20"
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Search and Sort Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <SearchBar value={q} onChange={(val) => { setQ(val); setPage(1); }} />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto text-left">
          <div className="flex items-center gap-2 flex-shrink-0 text-slate-400">
            <ArrowUpDown className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Sort By</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="w-full md:w-48 px-3 py-2.5 rounded-2xl border bg-white/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 transition-all duration-200 form-input-ring focus:border-brand-500 text-sm"
          >
            <option value="newest" className="bg-white dark:bg-slate-900">Newest</option>
            <option value="oldest" className="bg-white dark:bg-slate-900">Oldest</option>
            <option value="dueDate" className="bg-white dark:bg-slate-900">Due Date</option>
            <option value="priority" className="bg-white dark:bg-slate-900">Priority</option>
            <option value="alphabetical" className="bg-white dark:bg-slate-900">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Filter Widgets Panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      )}

      {/* Task Listing Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <p className="text-red-500 font-semibold">{error?.message || 'Server error'}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-card py-20 px-6 rounded-3xl text-center max-w-xl mx-auto flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-transparent opacity-50" />
            { (status || priority || category || q) ? (
              <SlidersHorizontal className="w-10 h-10 relative z-10 text-brand-500 animate-pulse" />
            ) : (
              <Plus className="w-10 h-10 relative z-10 text-slate-450 dark:text-slate-500" />
            )}
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-bold text-slate-850 dark:text-slate-200">
              { (status || priority || category || q) ? 'No matching tasks found' : 'Start organizing your tasks' }
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              { (status || priority || category || q) 
                ? 'Your active filters are excluding all tasks. Try resetting your search filters or add a new task to match.'
                : 'No tasks have been added to this workflow yet. Create your first task to get started.' }
            </p>
          </div>
          <div className="flex gap-4">
            { (status || priority || category || q) && (
              <Button variant="secondary" onClick={handleResetFilters} size="sm">
                Clear Filters
              </Button>
            )}
            <Button onClick={() => setIsCreateOpen(true)} size="sm" icon={Plus}>
              Add Task
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={setEditingTask}
                  onDelete={setDeletingId}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-450">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        loading={createLoading}
      />

      {/* Task Editing Modal */}
      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleEditSubmit}
        initialData={editingTask}
        loading={editLoading}
      />

      {/* Deletion Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default AllTasks;
