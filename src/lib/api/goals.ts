import { apiGet, apiPost, apiPatch, apiDelete } from "./client";
import type {
  Goal,
  CreateGoalDto,
  UpdateGoalDto,
  GoalProgress,
  LinkTaskToGoalDto,
} from "@/types";

/**
 * Fetch all goals
 */
export async function getGoals() {
  return apiGet<{ goals: Goal[] }>("/goals");
}

/**
 * Fetch single goal by ID
 */
export async function getGoal(id: string) {
  return apiGet<Goal>(`/goals/${id}`);
}

/**
 * Create new goal
 */
export async function createGoal(data: CreateGoalDto) {
  return apiPost<Goal>("/goals", data);
}

/**
 * Update existing goal
 */
export async function updateGoal(id: string, data: UpdateGoalDto) {
  return apiPatch<Goal>(`/goals/${id}`, data);
}

/**
 * Delete goal
 */
export async function deleteGoal(id: string) {
  return apiDelete<void>(`/goals/${id}`);
}

/**
 * Get goal progress details
 */
export async function getGoalProgress(id: string) {
  return apiGet<GoalProgress>(`/goals/${id}/progress`);
}

/**
 * Link task to goal
 */
export async function linkTaskToGoal(data: LinkTaskToGoalDto) {
  return apiPost<void>("/goals/link-task", data);
}

/**
 * Unlink task from goal
 */
export async function unlinkTaskFromGoal(taskId: string, goalId: string) {
  return apiDelete<void>(`/goals/${goalId}/tasks/${taskId}`);
}
