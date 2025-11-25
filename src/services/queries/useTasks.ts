import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "../queryClient";
import type { Task, TaskFilters, TaskStats } from "@/types";

/**
 * Fetch all tasks with optional filters
 */
export function useTasksQuery(filters?: TaskFilters) {
  return useQuery({
    queryKey: queryKeys.tasks.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.status) {
        const statuses = Array.isArray(filters.status)
          ? filters.status
          : [filters.status];
        statuses.forEach((status) => params.append("status", status));
      }
      if (filters?.priority) {
        const priorities = Array.isArray(filters.priority)
          ? filters.priority
          : [filters.priority];
        priorities.forEach((priority) => params.append("priority", priority));
      }
      if (filters?.goalId) {
        params.append("goalId", filters.goalId);
      }
      if (filters?.search) {
        params.append("search", filters.search);
      }
      if (filters?.dueBefore) {
        params.append("dueBefore", filters.dueBefore.toISOString());
      }
      if (filters?.dueAfter) {
        params.append("dueAfter", filters.dueAfter.toISOString());
      }

      const queryString = params.toString();
      const endpoint = queryString ? `/tasks?${queryString}` : "/tasks";

      return apiGet<{ tasks: Task[] }>(endpoint);
    },
    select: (data) => data.tasks,
  });
}

/**
 * Fetch single task by ID
 */
export function useTaskQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => apiGet<Task>(`/tasks/${id}`),
    enabled: !!id,
  });
}

/**
 * Fetch task statistics
 */
export function useTaskStatsQuery() {
  return useQuery({
    queryKey: queryKeys.tasks.stats,
    queryFn: () => apiGet<TaskStats>("/tasks/stats"),
  });
}
