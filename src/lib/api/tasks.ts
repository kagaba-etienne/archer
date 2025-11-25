import { apiGet, apiPost, apiPatch, apiDelete } from "./client";
import type {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TaskFilters,
  TaskStats,
} from "@/types";

/**
 * Fetch all tasks with optional filters
 */
export async function getTasks(
  filters?: TaskFilters,
): Promise<{ tasks: Task[] }> {
  const params = new URLSearchParams();

  if (filters?.status) {
    const statuses = Array.isArray(filters.status)
      ? filters.status
      : [filters.status];
    statuses.forEach((status) => params.append("status", status));
  }
  if (filters?.priority) {
    const priorities = Array.isArray(filters.priority)
      ? filters.priority
      : [filters.priority];
    priorities.forEach((priority) => params.append("priority", priority));
  }
  if (filters?.goalId) {
    params.append("goalId", filters.goalId);
  }
  if (filters?.search) {
    params.append("search", filters.search);
  }
  if (filters?.dueBefore) {
    params.append("dueBefore", filters.dueBefore.toISOString());
  }
  if (filters?.dueAfter) {
    params.append("dueAfter", filters.dueAfter.toISOString());
  }

  const queryString = params.toString();
  const endpoint = queryString ? `/tasks?${queryString}` : "/tasks";

  return apiGet<{ tasks: Task[] }>(endpoint);
}

/**
 * Fetch single task by ID
 */
export async function getTask(id: string): Promise<Task> {
  return apiGet<Task>(`/tasks/${id}`);
}

/**
 * Create new task
 */
export async function createTask(data: CreateTaskDto): Promise<Task> {
  return apiPost<Task>("/tasks", data);
}

/**
 * Update existing task
 */
export async function updateTask(
  id: string,
  data: UpdateTaskDto,
): Promise<Task> {
  return apiPatch<Task>(`/tasks/${id}`, data);
}

/**
 * Delete task
 */
export async function deleteTask(id: string): Promise<void> {
  return apiDelete<void>(`/tasks/${id}`);
}

/**
 * Get task statistics
 */
export async function getTaskStats(): Promise<TaskStats> {
  return apiGet<TaskStats>("/tasks/stats");
}

/**
 * Start task (transition to in-progress)
 */
export async function startTask(id: string): Promise<Task> {
  return apiPost<Task>(`/tasks/${id}/start`, {});
}

/**
 * Complete task
 */
export async function completeTask(id: string): Promise<Task> {
  return apiPost<Task>(`/tasks/${id}/complete`, {});
}

/**
 * Block task with reason
 */
export async function blockTask(id: string, reason: string): Promise<Task> {
  return apiPost<Task>(`/tasks/${id}/block`, { reason });
}

/**
 * Unblock task
 */
export async function unblockTask(id: string): Promise<Task> {
  return apiPost<Task>(`/tasks/${id}/unblock`, {});
}

/**
 * Archive task
 */
export async function archiveTask(id: string): Promise<Task> {
  return apiPost<Task>(`/tasks/${id}/archive`, {});
}
