import { apiGet } from "./client";
import type { AlignmentScore, Recommendation } from "@/types";

/**
 * Fetch alignment score and insights
 * To be implemented in Phase 6
 */
export async function getAlignmentScore(): Promise<AlignmentScore> {
  return apiGet<AlignmentScore>("/insights/alignment");
}

/**
 * Fetch AI recommendations
 */
export async function getRecommendations(): Promise<{
  recommendations: Recommendation[];
}> {
  return apiGet<{ recommendations: Recommendation[] }>(
    "/insights/recommendations",
  );
}

/**
 * Fetch productivity trends
 */
export async function getTrends(params?: {
  period?: string;
}): Promise<unknown> {
  const queryParams = new URLSearchParams();

  if (params?.period) {
    queryParams.append("period", params.period);
  }

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `/insights/trends?${queryString}`
    : "/insights/trends";

  return apiGet<unknown>(endpoint);
}
