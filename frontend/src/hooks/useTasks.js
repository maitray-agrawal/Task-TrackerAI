import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/api';
import toast from 'react-hot-toast';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || error.response?.data?.errors?.[0]?.message || 'Failed to create task';
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
      toast.success('Task updated successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || error.response?.data?.errors?.[0]?.message || 'Failed to update task';
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

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks']);

      // Optimistically update the list queries
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((task) =>
            task._id === id ? { ...task, status } : task
          ),
        };
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback to previous state
      if (context?.previousTasks) {
        queryClient.setQueriesData({ queryKey: ['tasks'] }, context.previousTasks);
      }
      toast.error('Failed to update task status');
    },
    onSuccess: () => {
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

      const previousTasks = queryClient.getQueryData(['tasks']);

      // Optimistically remove the task
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.filter((task) => task._id !== id),
          pagination: {
            ...old.pagination,
            totalTasks: Math.max(0, old.pagination.totalTasks - 1),
          },
        };
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueriesData({ queryKey: ['tasks'] }, context.previousTasks);
      }
      toast.error('Failed to delete task');
    },
    onSuccess: () => {
      toast.success('Task deleted successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
