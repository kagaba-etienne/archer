import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  connectCalendar,
  disconnectCalendar,
  syncCalendar,
  createTaskFromEvent,
} from "@/lib/api/calendar";
import { queryKeys } from "../queryClient";

/**
 * Connect calendar account
 */
export function useConnectCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: connectCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.calendar.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.calendar.events });
    },
  });
}

/**
 * Disconnect calendar account
 */
export function useDisconnectCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.calendar.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.calendar.events });
    },
  });
}

/**
 * Sync calendar
 */
export function useSyncCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.calendar.events });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

/**
 * Create task from event
 */
export function useCreateTaskFromEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskFromEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.calendar.events });
    },
  });
}
