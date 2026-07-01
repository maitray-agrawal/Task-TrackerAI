import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trash2, Edit, Eye, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from './ui/Badge';
import { useUpdateTaskStatus } from '../hooks/useTasks';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { mutate: updateStatus } = useUpdateTaskStatus();

  const isCompleted = task.status === 'Completed';

  // Check if overdue
  const isOverdue = () => {
    if (isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  };

  const handleToggleStatus = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateStatus({
      id: task._id,
      status: isCompleted ? 'Pending' : 'Completed',
    });
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between relative group ${
        isCompleted ? 'opacity-65 dark:opacity-55' : ''
      }`}
    >
      <div>
        {/* Card Header Tags */}
        <div className="flex justify-between items-center gap-2 mb-3.5">
          <Badge variant={task.category}>{task.category}</Badge>
          <Badge variant={task.priority}>{task.priority}</Badge>
        </div>

        {/* Title & Checkbox */}
        <div className="flex items-start gap-3.5 mb-2.5">
          <button
            onClick={handleToggleStatus}
            className="mt-0.5 text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex-shrink-0"
            title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 fill-emerald-500/10" />
            ) : (
              <Circle className="w-5 h-5 text-slate-400 dark:text-slate-600 hover:scale-105 transition-transform" />
            )}
          </button>

          <div className="text-left">
            <h4
              className={`font-bold text-base text-slate-800 dark:text-slate-100 leading-snug break-words transition-all duration-200 ${
                isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {task.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 break-words line-clamp-2">
              {task.description || <span className="italic opacity-60">No description provided</span>}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
        {/* Due Date Indicator */}
        <div
          className={`flex items-center gap-2 text-xs font-semibold ${
            isOverdue()
              ? 'text-rose-500 dark:text-rose-400 animate-pulse'
              : 'text-slate-400 dark:text-slate-500'
          }`}
          title={isOverdue() ? 'Overdue task!' : 'Due Date'}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(task.dueDate)}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* View Details */}
          <Link
            to={`/tasks/${task._id}`}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            title="Edit Task"
          >
            <Edit className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
