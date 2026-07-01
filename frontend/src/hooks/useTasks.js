import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/api';
import toast from 'react-hot-toast';
import { logActivity } from '../utils/activityLogger';

// Hook to fetch tasks
export const useTasks = (filters) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters),
    placeholderData: (previousData) => previousData, // smooth transitions while fetching new pages
    staleTime: 5000,
  });
};

// Hook to fetch a single task
export const useTask = (id) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id,
  });
};

// Hook to create a task
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: (createdTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (createdTask && createdTask.title) {
        logActivity('create', createdTask.title);
      }
      toast.success('Task created successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.error?.details?.[0]?.message || error.response?.data?.message || 'Failed to create task';
      toast.error(errorMessage);
    },
  });
};

// Hook to update a task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => taskService.updateTask(id, data),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', updatedTask._id] });
      if (updatedTask && updatedTask.title) {
        logActivity('update', updatedTask.title);
      }
      toast.success('Task updated successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.error?.details?.[0]?.message || error.response?.data?.message || 'Failed to update task';
      toast.error(errorMessage);
    },
  });
};

// Hook to toggle status (with Optimistic Updates)
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => taskService.updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value across all tasks queries (matching prefix)
      const previousQueries = queryClient.getQueriesData({ queryKey: ['tasks'] });

      // Optimistically update the list queries
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (old) => {
        if (!old || !old.tasks) return old;
        return {
          ...old,
          tasks: old.tasks.map((task) =>
            task._id === id ? { ...task, status } : task
          ),
        };
      });

      return { previousQueries };
    },
    onError: (err, variables, context) => {
      // Rollback to previous state
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, value]) => {
          queryClient.setQueryData(queryKey, value);
        });
      }
      toast.error('Failed to update task status');
    },
    onSuccess: (updatedTask) => {
      if (updatedTask && updatedTask.title) {
        logActivity('status', `${updatedTask.title} (${updatedTask.status})`);
      }
      toast.success('Task status updated!');
    },
    onSettled: () => {
      // Refetch after success/error to ensure sync
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// Hook to delete task (with Optimistic Updates)
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousQueries = queryClient.getQueriesData({ queryKey: ['tasks'] });

      let deletedTaskTitle = 'Task';
      for (const [, value] of previousQueries) {
        if (value && value.tasks) {
          const found = value.tasks.find((t) => t._id === id);
          if (found) {
            deletedTaskTitle = found.title;
            break;
          }
        }
      }

      // Optimistically remove the task
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (old) => {
        if (!old || !old.tasks) return old;
        return {
          ...old,
          tasks: old.tasks.filter((task) => task._id !== id),
          pagination: {
            ...old.pagination,
            totalTasks: Math.max(0, old.pagination.totalTasks - 1),
          },
        };
      });

      return { previousQueries, deletedTaskTitle };
    },
    onError: (err, variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, value]) => {
          queryClient.setQueryData(queryKey, value);
        });
      }
      toast.error('Failed to delete task');
    },
    onSuccess: (data, id, context) => {
      if (context?.deletedTaskTitle) {
        logActivity('delete', context.deletedTaskTitle);
      }
      toast.success('Task deleted successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
