import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  updateNotificationPreferences,
} from "@/lib/api/notifications";
import { queryKeys } from "../queryClient";

/**
 * Mark notification as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount,
      });
    },
  });
}

/**
 * Mark all as read
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount,
      });
    },
  });
}

/**
 * Delete notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount,
      });
    },
  });
}

/**
 * Update preferences
 */
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.preferences,
      });
    },
  });
}
