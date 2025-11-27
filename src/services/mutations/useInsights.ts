import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  acceptRecommendation,
  dismissRecommendation,
  refreshInsights,
} from "@/lib/api/insights";
import { queryKeys } from "../queryClient";

/**
 * Accept a recommendation
 */
export function useAcceptRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptRecommendation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.insights.recommendations,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.alignment });
    },
  });
}

/**
 * Dismiss a recommendation
 */
export function useDismissRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dismissRecommendation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.insights.recommendations,
      });
    },
  });
}

/**
 * Refresh AI insights
 */
export function useRefreshInsights() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshInsights,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}
