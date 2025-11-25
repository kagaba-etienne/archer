import { apiGet, apiPost, apiPatch, apiDelete } from "./client";
import type { Goal, CreateGoalDto, UpdateGoalDto, GoalProgress } from "@/types";

/**
 * Fetch all goals
 * To be implemented in Phase 6
 */
export async function getGoals(): Promise<{ goals: Goal[] }> {
  return apiGet<{ goals: Goal[] }>("/goals");
}

/**
 * Fetch single goal by ID
 */
export async function getGoal(id: string): Promise<Goal> {
  return apiGet<Goal>(`/goals/${id}`);
}

/**
 * Create new goal
 */
export async function createGoal(data: CreateGoalDto): Promise<Goal> {
  return apiPost<Goal>("/goals", data);
}

/**
 * Update existing goal
 */
export async function updateGoal(
  id: string,
  data: UpdateGoalDto,
): Promise<Goal> {
  return apiPatch<Goal>(`/goals/${id}`, data);
}

/**
 * Delete goal
 */
export async function deleteGoal(id: string): Promise<void> {
  return apiDelete<void>(`/goals/${id}`);
}

/**
 * Get goal progress
 */
export async function getGoalProgress(id: string): Promise<GoalProgress> {
  return apiGet<GoalProgress>(`/goals/${id}/progress`);
}
