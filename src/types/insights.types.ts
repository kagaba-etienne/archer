import type { Goal } from "./goal.types";
import type { Recommendation } from "./recommendation.types";
import type { TaskPriority } from "./task.types";

/**
 * Alignment score calculation
 */
export interface AlignmentScore {
  score: number; // 0-100
  trend: "improving" | "stable" | "declining";
  tasksAligned: number;
  tasksUnaligned: number;
  calculatedAt: Date;
  changeFromLastWeek?: number; // percentage change
  breakdown: {
    taskCompletion: number;
    goalProgress: number;
    consistency: number;
  };
}

/**
 * Alignment history point
 */
export interface AlignmentHistoryPoint {
  date: Date;
  score: number;
}

/**
 * AI insights response
 */
export interface AIInsights {
  alignmentScore: AlignmentScore;
  alignmentHistory: AlignmentHistoryPoint[];
  recommendations: Recommendation[];
  topGoals: Goal[];
  taskDistribution: TaskDistribution;
  productivityTrends: ProductivityTrend[];
}

/**
 * Task distribution by status
 */
export interface TaskDistribution {
  created: number;
  scheduled: number;
  inProgress: number;
  blocked: number;
  completed: number;
  archived: number;
}

/**
 * Productivity trend
 */
export interface ProductivityTrend {
  date: Date;
  tasksCompleted: number;
  tasksCreated: number;
  averagePriority: number;
  alignmentScore: number;
}

/**
 * Analyze tasks request
 */
export interface AnalyzeTasksDto {
  taskIds?: string[];
  includeGoals?: boolean;
  includeReflections?: boolean;
}

/**
 * Rank tasks request
 */
export interface RankTasksDto {
  taskIds: string[];
  goalIds?: string[];
}

/**
 * Task ranking result
 */
export interface TaskRanking {
  taskId: string;
  score: number;
  suggestedPriority: TaskPriority;
  reasoning: string;
}

/**
 * Insights trend over time
 */
export interface InsightsTrend {
  alignmentHistory: AlignmentHistoryPoint[];
  averageScore: number;
  peakScore: number;
  currentScore: number;
}
