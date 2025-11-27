/**
 * Notification type
 */
export type NotificationType =
  | "task-reminder"
  | "goal-milestone"
  | "ai-insight"
  | "system";

/**
 * Notification channel
 */
export type NotificationChannel = "in-app" | "email" | "push";

/**
 * Notification entity from UML class diagram
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  channel: NotificationChannel;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  readAt?: string;
}

/**
 * Mark notification as read
 */
export interface MarkNotificationReadDto {
  notificationId: string;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  taskReminders: boolean;
  goalMilestones: boolean;
  aiInsights: boolean;
  weeklySummary: boolean;
  systemUpdates: boolean;
}

/**
 * Notification filters
 */
export interface NotificationFilters {
  read?: boolean;
  type?: NotificationType[];
}
