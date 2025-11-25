import { useQuery } from "@tanstack/react-query";
import { getGoals, getGoal, getGoalProgress } from "@/lib/api/goals";
import { queryKeys } from "../queryClient";

/**
 * Fetch all goals
 */
export function useGoalsQuery() {
  return useQuery({
    queryKey: queryKeys.goals.list,
    queryFn: () => getGoals(),
    select: (data) => data.goals,
  });
}

/**
 * Fetch single goal by ID
 */
export function useGoalQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.goals.detail(id),
    queryFn: () => getGoal(id),
    enabled: !!id,
  });
}

/**
 * Fetch goal progress
 */
export function useGoalProgressQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.goals.progress(id),
    queryFn: () => getGoalProgress(id),
    enabled: !!id,
  });
}
