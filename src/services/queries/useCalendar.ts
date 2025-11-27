import { useQuery } from "@tanstack/react-query";
import { getCalendarAccounts, getCalendarEvents } from "@/lib/api/calendar";
import { queryKeys } from "../queryClient";

/**
 * Fetch connected calendar accounts
 */
export function useCalendarAccountsQuery() {
  return useQuery({
    queryKey: queryKeys.calendar.accounts,
    queryFn: getCalendarAccounts,
    select: (data) => data.accounts,
  });
}

/**
 * Fetch calendar events for date range
 */
export function useCalendarEventsQuery(startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: [...queryKeys.calendar.events, { startDate, endDate }],
    queryFn: () => getCalendarEvents(startDate, endDate),
    select: (data) => data.events,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
