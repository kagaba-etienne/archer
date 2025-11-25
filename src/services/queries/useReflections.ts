import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "../queryClient";
import type { Reflection } from "@/types";

/**
 * Fetch all reflections with optional filters
 * To be implemented in Phase 6
 */
export function useReflectionsQuery(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.reflections.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      const queryString = params.toString();
      const endpoint = queryString
        ? `/reflections?${queryString}`
        : "/reflections";

      return apiGet<{ reflections: Reflection[] }>(endpoint);
    },
    select: (data) => data.reflections,
  });
}

/**
 * Fetch single reflection by ID
 */
export function useReflectionQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.reflections.detail(id),
    queryFn: () => apiGet<Reflection>(`/reflections/${id}`),
    enabled: !!id,
  });
}
