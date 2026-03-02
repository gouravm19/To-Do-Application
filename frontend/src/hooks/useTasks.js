import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import taskApi from '../api/taskApi';
import toast from 'react-hot-toast';

// Query keys
export const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
  list: (filters) => [...taskKeys.lists(), filters],
  detail: (id) => [...taskKeys.all, 'detail', id],
  stats: () => [...taskKeys.all, 'stats'],
};

// Get tasks with filters
export const useTasks = (filters = {}) => {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => taskApi.getTasks(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get single task
export const useTask = (id) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskApi.getTask(id),
    enabled: !!id,
  });
};

// Get task stats
export const useTaskStats = () => {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: taskApi.getTaskStats,
    staleTime: 30 * 1000,
  });
};

// Create task mutation
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    },
  });
};

// Update task mutation
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => taskApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    },
  });
};

// Update task status mutation with optimistic update
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => taskApi.updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

      // Snapshot previous value
      const previousTasks = queryClient.getQueriesData({ queryKey: taskKeys.lists() });

      // Optimistically update
      queryClient.setQueriesData({ queryKey: taskKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status,
                  completed_at: status === 'COMPLETED' ? new Date().toISOString() : null,
                }
              : task
          ),
        };
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update task status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
};

// Toggle pin mutation
export const useTogglePin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => taskApi.togglePin(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueriesData({ queryKey: taskKeys.lists() });

      queryClient.setQueriesData({ queryKey: taskKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((task) =>
            task.id === id ? { ...task, is_pinned: !task.is_pinned } : task
          ),
        };
      });

      return { previousTasks };
    },
    onError: (err, id, context) => {
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update task');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
};

// Delete task mutation
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskApi.deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueriesData({ queryKey: taskKeys.lists() });

      queryClient.setQueriesData({ queryKey: taskKeys.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((task) => task.id !== id),
          total: old.total - 1,
        };
      });

      return { previousTasks };
    },
    onError: (err, id, context) => {
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to delete task');
    },
    onSuccess: () => {
      toast.success('Task deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
};
