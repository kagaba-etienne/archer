import { apiGet, apiPost, apiPatch } from "./client";
import type {
  Notification,
  NotificationFilters,
  NotificationPreferences,
} from "@/types";

/**
 * Fetch all notifications with optional filters
 */
export async function getNotifications(filters?: NotificationFilters) {
  const params = new URLSearchParams();

  if (filters?.read !== undefined) {
    params.append("read", filters.read.toString());
  }
  if (filters?.type) {
    filters.type.forEach((t) => params.append("type", t));
  }

  const queryString = params.toString();
  const endpoint = queryString
    ? `/notifications?${queryString}`
    : "/notifications";

  return apiGet<{ notifications: Notification[] }>(endpoint);
}

/**
 * Get unread notification count
 */
export async function getUnreadCount() {
  return apiGet<{ count: number }>("/notifications/unread-count");
}

/**
 * Mark notification as read
 */
export async function markAsRead(id: string) {
  return apiPatch<Notification>(`/notifications/${id}/read`, {});
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead() {
  return apiPost<void>("/notifications/mark-all-read", {});
}

/**
 * Delete notification
 */
export async function deleteNotification(id: string) {
  return apiPost<void>(`/notifications/${id}/delete`, {});
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferences() {
  return apiGet<NotificationPreferences>("/notifications/preferences");
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>,
) {
  return apiPatch<NotificationPreferences>(
    "/notifications/preferences",
    preferences,
  );
}
