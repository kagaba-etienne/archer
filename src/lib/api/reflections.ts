import { apiGet, apiPost, apiPatch, apiDelete } from "./client";
import type {
  Reflection,
  CreateReflectionDto,
  UpdateReflectionDto,
} from "@/types";

/**
 * Fetch all reflections with optional filters
 * To be implemented in Phase 6
 */
export async function getReflections(
  filters?: Record<string, unknown>,
): Promise<{ reflections: Reflection[] }> {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const queryString = params.toString();
  const endpoint = queryString ? `/reflections?${queryString}` : "/reflections";

  return apiGet<{ reflections: Reflection[] }>(endpoint);
}

/**
 * Fetch single reflection by ID
 */
export async function getReflection(id: string): Promise<Reflection> {
  return apiGet<Reflection>(`/reflections/${id}`);
}

/**
 * Create new reflection
 */
export async function createReflection(
  data: CreateReflectionDto,
): Promise<Reflection> {
  return apiPost<Reflection>("/reflections", data);
}

/**
 * Update existing reflection
 */
export async function updateReflection(
  id: string,
  data: UpdateReflectionDto,
): Promise<Reflection> {
  return apiPatch<Reflection>(`/reflections/${id}`, data);
}

/**
 * Delete reflection
 */
export async function deleteReflection(id: string): Promise<void> {
  return apiDelete<void>(`/reflections/${id}`);
}
