import { apiGet, apiPost, apiDelete } from "./client";
import type {
  CalendarIntegration,
  CalendarAccount,
  CalendarEvent,
} from "@/types";

/**
 * Get connected calendar accounts
 */
export async function getCalendarAccounts() {
  return apiGet<{ accounts: CalendarAccount[] }>("/calendar/accounts");
}

/**
 * Get OAuth authorization URL for calendar
 */
export async function getCalendarAuthUrl() {
  return apiGet<{ authUrl: string }>("/calendar/auth-url");
}

/**
 * Connect calendar account (with auth code)
 */
export async function connectCalendar(code: string) {
  return apiPost<CalendarAccount>("/calendar/connect", { code });
}

/**
 * Disconnect calendar account
 */
export async function disconnectCalendar(accountId: string) {
  return apiDelete<void>(`/calendar/accounts/${accountId}`);
}

/**
 * Get calendar events
 */
export async function getCalendarEvents(startDate: Date, endDate: Date) {
  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });
  return apiGet<{ events: CalendarEvent[] }>(`/calendar/events?${params}`);
}

/**
 * Sync specific calendar
 */
export async function syncCalendar(accountId: string) {
  return apiPost<void>(`/calendar/accounts/${accountId}/sync`, {});
}

/**
 * Create task from calendar event
 */
export async function createTaskFromEvent(eventId: string) {
  return apiPost<void>(`/calendar/events/${eventId}/create-task`, {});
}

/**
 * Fetch calendar integrations
 * Legacy endpoint - to be deprecated
 */
export async function getCalendarIntegrations(): Promise<{
  integrations: CalendarIntegration[];
}> {
  return apiGet<{ integrations: CalendarIntegration[] }>(
    "/calendar/integrations",
  );
}
