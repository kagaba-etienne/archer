/**
 * Calendar provider
 */
export type CalendarProvider = "google" | "outlook" | "apple";

/**
 * Calendar integration scope
 */
export type CalendarScope = "read" | "write" | "read-write";

/**
 * Calendar integration entity from UML class diagram
 */
export interface CalendarIntegration {
  id: string;
  userId: string;
  provider: CalendarProvider;
  scope: CalendarScope;
  accessToken: string; // Encrypted
  refreshToken?: string; // Encrypted
  expiresAt: Date;
  lastSyncAt?: Date;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Calendar account
 */
export interface CalendarAccount {
  id: string;
  provider: CalendarProvider;
  email: string;
  calendars?: Calendar[];
  lastSyncAt?: Date;
  createdAt: Date;
}

/**
 * Individual calendar
 */
export interface Calendar {
  id: string;
  name: string;
  color?: string;
  isPrimary: boolean;
}

/**
 * Calendar event
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  allDay?: boolean;
  calendarId: string;
  calendarName?: string;
  calendarColor?: string;
  eventUrl?: string;
  location?: string;
}

/**
 * Connect calendar request
 */
export interface ConnectCalendarDto {
  provider: CalendarProvider;
  scope: CalendarScope;
  authCode: string;
}

/**
 * Sync calendar request
 */
export interface SyncCalendarDto {
  integrationId: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Calendar sync result
 */
export interface CalendarSyncResult {
  success: boolean;
  tasksImported: number;
  tasksExported: number;
  conflicts: CalendarSyncConflict[];
  lastSyncAt: Date;
}

/**
 * Calendar sync conflict
 */
export interface CalendarSyncConflict {
  taskId: string;
  taskTitle: string;
  localDueDate: Date;
  calendarDueDate: Date;
  resolution?: "use-local" | "use-calendar";
}
