import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPatch, apiPost } from "@/lib/api/client";
import { queryKeys } from "../queryClient";
import type { Notification } from "@/types";

/**
 * Mark notification as read
 * To be implemented in Phase 6
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiPatch<Notification>(`/notifications/${id}`, { read: true }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unread,
      });
    },
  });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiPost<void>("/notifications/mark-all-read"),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unread,
      });
    },
  });
}
