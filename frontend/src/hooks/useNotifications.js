import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import notificationApi from '../api/notificationApi';

export const notificationKeys = {
  all: ['notifications'],
  list: (params) => [...notificationKeys.all, 'list', params],
  count: () => [...notificationKeys.all, 'count'],
};

export const useNotifications = (params = {}) => {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationApi.getNotifications(params),
    staleTime: 10 * 1000, // 10 seconds
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: notificationKeys.count(),
    queryFn: notificationApi.getUnreadCount,
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      
      // Optimistic update for count
      const previousCount = queryClient.getQueryData(notificationKeys.count());
      queryClient.setQueryData(notificationKeys.count(), (old) => ({
        unread_count: Math.max(0, (old?.unread_count || 1) - 1),
      }));

      return { previousCount };
    },
    onError: (err, id, context) => {
      if (context?.previousCount) {
        queryClient.setQueryData(notificationKeys.count(), context.previousCount);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData(notificationKeys.count(), { unread_count: 0 });
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};
