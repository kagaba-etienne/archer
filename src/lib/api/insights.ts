import { apiGet, apiPost } from "./client";
import type {
  AlignmentScore,
  Recommendation,
  InsightsTrend,
  AcceptRecommendationDto,
  DismissRecommendationDto,
} from "@/types";

/**
 * Get current alignment score
 */
export async function getAlignmentScore() {
  return apiGet<AlignmentScore>("/insights/alignment");
}

/**
 * Get AI recommendations
 */
export async function getRecommendations() {
  return apiGet<{ recommendations: Recommendation[] }>(
    "/insights/recommendations",
  );
}

/**
 * Get insights trends over time
 */
export async function getInsightsTrends(days: number = 30) {
  return apiGet<InsightsTrend>(`/insights/trends?days=${days}`);
}

/**
 * Accept a recommendation
 */
export async function acceptRecommendation(data: AcceptRecommendationDto) {
  return apiPost<void>("/insights/recommendations/accept", data);
}

/**
 * Dismiss a recommendation
 */
export async function dismissRecommendation(data: DismissRecommendationDto) {
  return apiPost<void>("/insights/recommendations/dismiss", data);
}

/**
 * Refresh AI insights (trigger re-analysis)
 */
export async function refreshInsights() {
  return apiPost<void>("/insights/refresh", {});
}
