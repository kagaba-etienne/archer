import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createGoal,
  updateGoal,
  deleteGoal,
  linkTaskToGoal,
  unlinkTaskFromGoal,
} from "@/lib/api/goals";
import { queryKeys } from "../queryClient";
import type { Goal, UpdateGoalDto } from "@/types";

/**
 * Create new goal
 */
export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGoal,

    onMutate: async (newGoal) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.goals.all });
      const previousGoals = queryClient.getQueryData<Goal[]>(
        queryKeys.goals.list,
      );

      if (previousGoals) {
        queryClient.setQueryData<Goal[]>(queryKeys.goals.list, (old = []) => [
          {
            ...newGoal,
            id: "temp-" + Date.now(),
            userId: "current-user",
            progress: 0,
            taskIds: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Goal,
          ...old,
        ]);
      }

      return { previousGoals };
    },

    onError: (err, newGoal, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(queryKeys.goals.list, context.previousGoals);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.alignment });
    },
  });
}

/**
 * Update existing goal
 */
export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalDto }) =>
      updateGoal(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.goals.all });
      const previousGoals = queryClient.getQueryData<Goal[]>(
        queryKeys.goals.list,
      );

      if (previousGoals) {
        queryClient.setQueryData<Goal[]>(queryKeys.goals.list, (old = []) =>
          old.map((goal) =>
            goal.id === id ? { ...goal, ...data, updatedAt: new Date() } : goal,
          ),
        );
      }

      return { previousGoals };
    },

    onError: (err, variables, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(queryKeys.goals.list, context.previousGoals);
      }
    },

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.detail(id) });
    },
  });
}

/**
 * Delete goal
 */
export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoal,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.goals.all });
      const previousGoals = queryClient.getQueryData<Goal[]>(
        queryKeys.goals.list,
      );

      if (previousGoals) {
        queryClient.setQueryData<Goal[]>(queryKeys.goals.list, (old = []) =>
          old.filter((goal) => goal.id !== id),
        );
      }

      return { previousGoals };
    },

    onError: (err, id, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(queryKeys.goals.list, context.previousGoals);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.alignment });
    },
  });
}

/**
 * Link task to goal
 */
export function useLinkTaskToGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: linkTaskToGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.alignment });
    },
  });
}

/**
 * Unlink task from goal
 */
export function useUnlinkTaskFromGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, goalId }: { taskId: string; goalId: string }) =>
      unlinkTaskFromGoal(taskId, goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.alignment });
    },
  });
}
