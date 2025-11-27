/**
 * Recommendation type
 */
export type RecommendationType =
  | "link-task-to-goal"
  | "adjust-priority"
  | "schedule-task"
  | "unblock-task"
  | "break-down-task"
  | "reflection-prompt";

/**
 * Recommendation priority
 */
export type RecommendationPriority = "high" | "medium" | "low";

/**
 * Recommendation category
 */
export type RecommendationCategory =
  | "task-prioritization"
  | "goal-alignment"
  | "time-management"
  | "habit-formation";

/**
 * Recommendation status
 */
export type RecommendationStatus = "pending" | "accepted" | "dismissed";

/**
 * Recommendation entity from UML class diagram
 */
export interface Recommendation {
  id: string;
  userId: string;
  type: RecommendationType;
  taskId?: string;
  goalId?: string;
  score: number; // 0-1 confidence
  rationale: string;
  actionText: string;
  dismissed: boolean;
  appliedAt?: Date;
  createdAt: Date;
  // Additional fields for Phase 9
  title: string;
  description: string;
  priority: RecommendationPriority;
  category: RecommendationCategory;
  status: RecommendationStatus;
  confidence?: number; // 0-1 for display
  reasoning?: string; // Detailed explanation
}

/**
 * Apply recommendation request
 */
export interface ApplyRecommendationDto {
  recommendationId: string;
  taskId?: string;
}

/**
 * Accept recommendation DTO
 */
export interface AcceptRecommendationDto {
  recommendationId: string;
}

/**
 * Dismiss recommendation request
 */
export interface DismissRecommendationDto {
  recommendationId: string;
  reason?: "not-relevant" | "already-done" | "not-now" | "other";
}

/**
 * Explain recommendation request
 */
export interface ExplainRecommendationDto {
  recommendationId: string;
}

/**
 * Recommendation explanation
 */
export interface RecommendationExplanation {
  reasoning: string;
  dataPoints: string[];
  alternativeOptions?: string[];
}
