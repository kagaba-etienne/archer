import type { Task, TaskStatus } from "./task.types";
import type { Goal } from "./goal.types";
import type { Reflection, Sentiment } from "./reflection.types";

/**
 * Type guard: Check if task is completed
 */
export function isTaskCompleted(task: Task): boolean {
  return task.status === "COMPLETED";
}

/**
 * Type guard: Check if task is blocked
 */
export function isTaskBlocked(task: Task): boolean {
  return task.status === "BLOCKED";
}

/**
 * Type guard: Check if task is overdue
 */
export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate) return false;
  return new Date(task.dueDate) < new Date() && task.status !== "COMPLETED";
}

/**
 * Type guard: Check if task has AI suggestions
 */
export function hasAISuggestions(
  task: Task,
): task is Task & { aiSuggestions: NonNullable<Task["aiSuggestions"]> } {
  return task.aiSuggestions !== undefined && task.aiSuggestions !== null;
}

/**
 * Type guard: Check if goal has tasks
 */
export function goalHasTasks(goal: Goal): boolean {
  return goal.taskIds.length > 0;
}

/**
 * Type guard: Check if reflection has sentiment
 */
export function hasSentiment(
  reflection: Reflection,
): reflection is Reflection & { sentiment: Sentiment } {
  return reflection.sentiment !== undefined;
}

/**
 * Utility: Get task status color
 */
export function getTaskStatusColor(status: TaskStatus): string {
  const colors: Record<TaskStatus, string> = {
    CREATED: "bg-gray",
    SCHEDULED: "primary",
    IN_PROGRESS: "accent-info",
    BLOCKED: "accent-error",
    COMPLETED: "accent-success",
    CANCELLED: "text-muted",
  };
  return colors[status];
}

/**
 * Utility: Get sentiment color
 */
export function getSentimentColor(sentiment: Sentiment): string {
  const colors: Record<Sentiment, string> = {
    positive: "accent-success",
    neutral: "text-secondary",
    negative: "accent-warning",
  };
  return colors[sentiment];
}
