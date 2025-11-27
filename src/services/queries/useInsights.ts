import { useQuery } from "@tanstack/react-query";
import {
  getAlignmentScore,
  getRecommendations,
  getInsightsTrends,
} from "@/lib/api/insights";
import { queryKeys } from "../queryClient";

/**
 * Fetch current alignment score
 */
export function useAlignmentScoreQuery() {
  return useQuery({
    queryKey: queryKeys.insights.alignment,
    queryFn: getAlignmentScore,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch AI recommendations
 */
export function useRecommendationsQuery() {
  return useQuery({
    queryKey: queryKeys.insights.recommendations,
    queryFn: () => getRecommendations(),
    select: (data) => data.recommendations,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Fetch insights trends
 */
export function useInsightsTrendsQuery(days: number = 30) {
  return useQuery({
    queryKey: [...queryKeys.insights.trends, days],
    queryFn: () => getInsightsTrends(days),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
