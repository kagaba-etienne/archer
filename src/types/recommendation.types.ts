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
}

/**
 * Apply recommendation request
 */
export interface ApplyRecommendationDto {
  recommendationId: string;
  taskId?: string;
}

/**
 * Dismiss recommendation request
 */
export interface DismissRecommendationDto {
  recommendationId: string;
  reason?: string;
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
