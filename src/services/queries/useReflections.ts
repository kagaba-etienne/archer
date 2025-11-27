import { useQuery } from "@tanstack/react-query";
import { getReflections, getReflection } from "@/lib/api/reflections";
import { queryKeys } from "../queryClient";
import type { ReflectionFilters } from "@/types";

/**
 * Fetch all reflections with optional filters
 */
export function useReflectionsQuery(filters?: ReflectionFilters) {
  return useQuery({
    queryKey: queryKeys.reflections.list(filters),
    queryFn: () => getReflections(filters),
    select: (data) => data.reflections,
  });
}

/**
 * Fetch single reflection by ID
 */
export function useReflectionQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.reflections.detail(id),
    queryFn: () => getReflection(id),
    enabled: !!id,
  });
}
