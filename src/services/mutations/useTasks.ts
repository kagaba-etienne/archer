import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost, apiPatch, apiDelete } from "@/lib/api/client";
import {
  startTask,
  completeTask,
  blockTask,
  unblockTask,
  archiveTask,
} from "@/lib/api/tasks";
import { queryKeys } from "../queryClient";
import type { Task, CreateTaskDto, UpdateTaskDto } from "@/types";

/**
 * Create new task with optimistic update
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDto) => apiPost<Task>("/tasks", data),

    // Optimistic update
    onMutate: async (newTask) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });

      // Snapshot previous value - note the data structure is { tasks: Task[] }
      const previousTasks = queryClient.getQueryData<{ tasks: Task[] }>(
        queryKeys.tasks.list(),
      );

      // Optimistically update cache
      if (previousTasks) {
        queryClient.setQueryData<{ tasks: Task[] }>(
          queryKeys.tasks.list(),
          (old) => {
            if (!old) return old;
            return {
              tasks: [
                {
                  ...newTask,
                  id: "temp-" + Date.now(),
                  userId: "current-user",
                  status: "created",
                  goalIds: newTask.goalIds || [],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                } as Task,
                ...old.tasks,
              ],
            };
          },
        );
      }

      return { previousTasks };
    },

    // Rollback on error
    onError: (err, newTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks.list(), context.previousTasks);
      }
    },

    // Refetch on success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.alignment });
    },
  });
}

/**
 * Update existing task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
      apiPatch<Task>(`/tasks/${id}`, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });

      // Get all task queries in the cache
      const previousData: Array<{
        queryKey: readonly unknown[];
        data: { tasks: Task[] };
      }> = [];

      queryClient
        .getQueryCache()
        .findAll({
          queryKey: queryKeys.tasks.all,
          type: "active",
        })
        .forEach((query) => {
          const oldData = query.state.data as { tasks: Task[] } | undefined;
          if (oldData && oldData.tasks) {
            previousData.push({
              queryKey: query.queryKey,
              data: oldData,
            });

            // Update the task in this specific query - note the data structure is { tasks: Task[] }
            queryClient.setQueryData<{ tasks: Task[] }>(
              query.queryKey,
              (old) => {
                if (!old) return old;
                return {
                  tasks: old.tasks.map((task) =>
                    task.id === id
                      ? { ...task, ...data, updatedAt: new Date() }
                      : task,
                  ),
                };
              },
            );
          }
        });

      return { previousData };
    },

    onError: (err, variables, context) => {
      // Rollback all updated queries
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      // Refetch in the background to ensure data consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.alignment });
    },
  });
}

/**
 * Delete task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete<void>(`/tasks/${id}`),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });

      const previousTasks = queryClient.getQueryData<{ tasks: Task[] }>(
        queryKeys.tasks.list(),
      );

      if (previousTasks) {
        queryClient.setQueryData<{ tasks: Task[] }>(
          queryKeys.tasks.list(),
          (old) => {
            if (!old) return old;
            return {
              tasks: old.tasks.filter((task) => task.id !== id),
            };
          },
        );
      }

      return { previousTasks };
    },

    onError: (err, id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks.list(), context.previousTasks);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.alignment });
    },
  });
}

/**
 * Start task (transition to in-progress)
 */
export function useStartTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

/**
 * Complete task
 */
export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.alignment });
    },
  });
}

/**
 * Block task with reason
 */
export function useBlockTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      blockTask(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

/**
 * Unblock task
 */
export function useUnblockTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unblockTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

/**
 * Archive task
 */
export function useArchiveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}
