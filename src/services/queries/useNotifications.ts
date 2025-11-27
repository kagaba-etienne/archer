import { useQuery } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadCount,
  getNotificationPreferences,
} from "@/lib/api/notifications";
import { queryKeys } from "../queryClient";
import type { NotificationFilters } from "@/types";

/**
 * Fetch all notifications
 */
export function useNotificationsQuery(filters?: NotificationFilters) {
  return useQuery({
    queryKey: queryKeys.notifications.list(filters),
    queryFn: () => getNotifications(filters),
    select: (data) => data.notifications,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Fetch unread count
 */
export function useUnreadCountQuery() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: () => getUnreadCount(),
    select: (data) => data.count,
    refetchInterval: 15000, // Refetch every 15 seconds
  });
}

/**
 * Fetch notification preferences
 */
export function useNotificationPreferencesQuery() {
  return useQuery({
    queryKey: queryKeys.notifications.preferences,
    queryFn: getNotificationPreferences,
  });
}
