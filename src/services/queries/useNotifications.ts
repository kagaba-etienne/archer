import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "../queryClient";
import type { Notification } from "@/types";

/**
 * Fetch all notifications
 * To be implemented in Phase 6
 */
export function useNotificationsQuery() {
  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: async () => {
      return apiGet<{ notifications: Notification[] }>("/notifications");
    },
    select: (data) => data.notifications,
  });
}

/**
 * Fetch unread notifications
 */
export function useUnreadNotificationsQuery() {
  return useQuery({
    queryKey: queryKeys.notifications.unread,
    queryFn: async () => {
      return apiGet<{ notifications: Notification[] }>(
        "/notifications?unread=true",
      );
    },
    select: (data) => data.notifications,
  });
}
