import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "../queryClient";
import type { Goal, GoalProgress } from "@/types";

/**
 * Fetch all goals
 * To be implemented in Phase 6
 */
export function useGoalsQuery() {
  return useQuery({
    queryKey: queryKeys.goals.list,
    queryFn: async () => {
      return apiGet<{ goals: Goal[] }>("/goals");
    },
    select: (data) => data.goals,
  });
}

/**
 * Fetch single goal by ID
 */
export function useGoalQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.goals.detail(id),
    queryFn: () => apiGet<Goal>(`/goals/${id}`),
    enabled: !!id,
  });
}

/**
 * Fetch goal progress
 */
export function useGoalProgressQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.goals.progress(id),
    queryFn: () => apiGet<GoalProgress>(`/goals/${id}/progress`),
    enabled: !!id,
  });
}
