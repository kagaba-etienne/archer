import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost, apiPatch, apiDelete } from "@/lib/api/client";
import { queryKeys } from "../queryClient";
import type {
  Reflection,
  CreateReflectionDto,
  UpdateReflectionDto,
} from "@/types";

/**
 * Create new reflection
 * To be implemented in Phase 6
 */
export function useCreateReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReflectionDto) =>
      apiPost<Reflection>("/reflections", data),

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
      apiPatch<Reflection>(`/reflections/${id}`, data),

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
    mutationFn: (id: string) => apiDelete<void>(`/reflections/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reflections.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.insights.alignment });
    },
  });
}
