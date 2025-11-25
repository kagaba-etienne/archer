import { apiGet, apiPost, apiDelete } from "./client";
import type { CalendarIntegration } from "@/types";

/**
 * Fetch calendar integrations
 * To be implemented in Phase 6
 */
export async function getCalendarIntegrations(): Promise<{
  integrations: CalendarIntegration[];
}> {
  return apiGet<{ integrations: CalendarIntegration[] }>(
    "/calendar/integrations",
  );
}

/**
 * Connect calendar integration
 */
export async function connectCalendar(
  provider: string,
  credentials: unknown,
): Promise<CalendarIntegration> {
  return apiPost<CalendarIntegration>("/calendar/integrations", {
    provider,
    credentials,
  });
}

/**
 * Disconnect calendar integration
 */
export async function disconnectCalendar(integrationId: string): Promise<void> {
  return apiDelete<void>(`/calendar/integrations/${integrationId}`);
}

/**
 * Sync calendar events
 */
export async function syncCalendar(integrationId: string): Promise<void> {
  return apiPost<void>(`/calendar/integrations/${integrationId}/sync`);
}
