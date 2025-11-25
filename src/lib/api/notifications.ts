import { apiGet, apiPost, apiPatch } from "./client";
import type { Notification } from "@/types";

/**
 * Fetch all notifications
 * To be implemented in Phase 6
 */
export async function getNotifications(): Promise<{
  notifications: Notification[];
}> {
  return apiGet<{ notifications: Notification[] }>("/notifications");
}

/**
 * Fetch unread notifications
 */
export async function getUnreadNotifications(): Promise<{
  notifications: Notification[];
}> {
  return apiGet<{ notifications: Notification[] }>(
    "/notifications?unread=true",
  );
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  id: string,
): Promise<Notification> {
  return apiPatch<Notification>(`/notifications/${id}`, { read: true });
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  return apiPost<void>("/notifications/mark-all-read");
}
