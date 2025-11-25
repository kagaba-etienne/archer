/**
 * Notification type
 */
export type NotificationType =
  | "task-due-soon"
  | "task-overdue"
  | "goal-milestone"
  | "ai-recommendation"
  | "reflection-reminder"
  | "system-update";

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
  sentAt: Date;
  readAt?: Date;
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
  inAppEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  taskDueSoonHours: number; // hours before due date
  reflectionReminderTime?: string; // HH:MM format
  types: {
    [key in NotificationType]: boolean;
  };
}
