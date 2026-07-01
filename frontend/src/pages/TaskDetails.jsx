import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTask, useUpdateTask, useDeleteTask, useUpdateTaskStatus } from '../hooks/useTasks';
import { PageSkeleton } from '../components/ui/Loader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import TaskModal from '../components/TaskModal';
import ConfirmationModal from '../components/ConfirmationModal';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Folder,
  Trash2,
  Edit,
  Activity,
  CheckCircle2,
  Circle,
} from 'lucide-react';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Queries
  const { data: task, isLoading, isError, error } = useTask(id);
  const { mutate: updateTask, isPending: editLoading } = useUpdateTask();
  const { mutate: deleteTask, isPending: deleteLoading } = useDeleteTask();
  const { mutate: updateStatus } = useUpdateTaskStatus();

  // Modals States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (isLoading) return <PageSkeleton />;
  if (isError || !task) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-red-500">Task Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400">
          {error?.message || 'The requested task could not be retrieved.'}
        </p>
        <Link to="/tasks">
          <Button variant="secondary" icon={ArrowLeft}>Back to Tasks</Button>
        </Link>
      </div>
    );
  }

  const isCompleted = task.status === 'Completed';

  // Overdue check
  const isOverdue = () => {
    if (isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  };

  const handleToggleStatus = () => {
    updateStatus({
      id: task._id,
      status: isCompleted ? 'Pending' : 'Completed',
    });
  };

  const handleEditSubmit = (formData) => {
    updateTask(
      { id: task._id, data: formData },
      {
        onSuccess: () => setIsEditOpen(false),
      }
    );
  };

  const handleDeleteConfirm = () => {
    deleteTask(task._id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        navigate('/tasks');
      },
    });
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-left">
      {/* Back Link */}
      <div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks List</span>
        </Link>
      </div>

      {/* Main Details Panel */}
      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Header Badges & Actions */}
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
          <div className="flex gap-2">
            <Badge variant={task.category}>{task.category}</Badge>
            <Badge variant={task.priority}>{task.priority}</Badge>
            {isOverdue() && <Badge variant="Overdue">Overdue</Badge>}
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Edit}
              onClick={() => setIsEditOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Task Title & Toggle Status */}
        <div className="flex items-start gap-4">
          <button
            onClick={handleToggleStatus}
            className="mt-1 flex-shrink-0 text-slate-400 hover:text-brand-500 transition-colors"
          >
            {isCompleted ? (
              <CheckCircle className="w-7 h-7 text-emerald-500 fill-emerald-500/10" />
            ) : (
              <Circle className="w-7 h-7 text-slate-355 hover:scale-105 transition-transform" />
            )}
          </button>
          <div className="space-y-2">
            <h1
              className={`text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words leading-tight ${
                isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {task.title}
            </h1>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-550">
              <Activity className="w-3.5 h-3.5" />
              <span>Status: {task.status}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-0.5">
            Description
          </h4>
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-100 dark:border-slate-800/40 min-h-24">
            <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
              {task.description || <span className="italic text-slate-400 dark:text-slate-600">No description provided for this task.</span>}
            </p>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Due date */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-500">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Due Date
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {formatFullDate(task.dueDate)}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/15 text-brand-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Timestamps
              </p>
              <div className="text-sm text-slate-800 dark:text-slate-200 mt-0.5 space-y-0.5">
                <p>
                  <span className="font-bold">Created:</span> {formatFullDate(task.createdAt)} at{' '}
                  {formatTime(task.createdAt)}
                </p>
                {task.updatedAt !== task.createdAt && (
                  <p>
                    <span className="font-bold">Updated:</span> {formatFullDate(task.updatedAt)} at{' '}
                    {formatTime(task.updatedAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Edit Modal */}
      <TaskModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={task}
        loading={editLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default TaskDetails;
