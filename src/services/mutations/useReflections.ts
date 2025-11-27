import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReflection,
  updateReflection,
  deleteReflection,
  analyzeSentiment,
} from "@/lib/api/reflections";
import { queryKeys } from "../queryClient";
import type { Reflection, UpdateReflectionDto } from "@/types";

/**
 * Create new reflection
 */
export function useCreateReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReflection,

    onMutate: async (newReflection) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.reflections.all });
      const previousReflections = queryClient.getQueryData<Reflection[]>(
        queryKeys.reflections.list(),
      );

      if (previousReflections) {
        queryClient.setQueryData<Reflection[]>(
          queryKeys.reflections.list(),
          (old = []) => [
            {
              ...newReflection,
              id: "temp-" + Date.now(),
              userId: "current-user",
              tags: newReflection.tags || [],
              createdAt: new Date(),
              updatedAt: new Date(),
            } as Reflection,
            ...old,
          ],
        );
      }

      return { previousReflections };
    },

    onError: (err, newReflection, context) => {
      if (context?.previousReflections) {
        queryClient.setQueryData(
          queryKeys.reflections.list(),
          context.previousReflections,
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reflections.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.alignment });
    },
  });
}

/**
 * Update existing reflection
 */
export function useUpdateReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReflectionDto }) =>
      updateReflection(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.reflections.all });
      const previousReflections = queryClient.getQueryData<Reflection[]>(
        queryKeys.reflections.list(),
      );

      if (previousReflections) {
        queryClient.setQueryData<Reflection[]>(
          queryKeys.reflections.list(),
          (old = []) =>
            old.map((reflection) =>
              reflection.id === id
                ? { ...reflection, ...data, updatedAt: new Date() }
                : reflection,
            ),
        );
      }

      return { previousReflections };
    },

    onError: (err, variables, context) => {
      if (context?.previousReflections) {
        queryClient.setQueryData(
          queryKeys.reflections.list(),
          context.previousReflections,
        );
      }
    },

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reflections.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reflections.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.alignment });
    },
  });
}

/**
 * Delete reflection
 */
export function useDeleteReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReflection,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.reflections.all });
      const previousReflections = queryClient.getQueryData<Reflection[]>(
        queryKeys.reflections.list(),
      );

      if (previousReflections) {
        queryClient.setQueryData<Reflection[]>(
          queryKeys.reflections.list(),
          (old = []) => old.filter((reflection) => reflection.id !== id),
        );
      }

      return { previousReflections };
    },

    onError: (err, id, context) => {
      if (context?.previousReflections) {
        queryClient.setQueryData(
          queryKeys.reflections.list(),
          context.previousReflections,
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reflections.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.alignment });
    },
  });
}

/**
 * Analyze sentiment
 */
export function useAnalyzeSentiment() {
  return useMutation({
    mutationFn: analyzeSentiment,
  });
}
