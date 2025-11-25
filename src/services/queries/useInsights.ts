import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "../queryClient";
import type { AlignmentScore, Recommendation } from "@/types";

/**
 * Fetch alignment score and insights
 * To be implemented in Phase 6
 */
export function useAlignmentQuery() {
  return useQuery({
    queryKey: queryKeys.insights.alignment,
    queryFn: () => apiGet<AlignmentScore>("/insights/alignment"),
  });
}

/**
 * Fetch AI recommendations
 */
export function useRecommendationsQuery() {
  return useQuery({
    queryKey: queryKeys.insights.recommendations,
    queryFn: async () => {
      return apiGet<{ recommendations: Recommendation[] }>(
        "/insights/recommendations",
      );
    },
    select: (data) => data.recommendations,
  });
}

/**
 * Fetch productivity trends
 */
export function useTrendsQuery(period?: string) {
  return useQuery({
    queryKey: ["insights", "trends", period],
    queryFn: () => {
      const params = new URLSearchParams();
      if (period) {
        params.append("period", period);
      }
      const queryString = params.toString();
      const endpoint = queryString
        ? `/insights/trends?${queryString}`
        : "/insights/trends";
      return apiGet<unknown>(endpoint);
    },
  });
}
