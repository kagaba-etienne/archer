import { apiGet, apiPost, apiPatch, apiDelete } from "./client";
import type {
  Reflection,
  CreateReflectionDto,
  UpdateReflectionDto,
  ReflectionFilters,
  AnalyzeSentimentDto,
  SentimentAnalysisResult,
} from "@/types";

/**
 * Fetch all reflections with optional filters
 */
export async function getReflections(
  filters?: ReflectionFilters,
): Promise<{ reflections: Reflection[] }> {
  const params = new URLSearchParams();

  if (filters?.sentiment) {
    params.append("sentiment", filters.sentiment);
  }
  if (filters?.tags) {
    filters.tags.forEach((tag) => params.append("tags", tag));
  }
  if (filters?.startDate) {
    params.append("startDate", filters.startDate.toISOString());
  }
  if (filters?.endDate) {
    params.append("endDate", filters.endDate.toISOString());
  }
  if (filters?.search) {
    params.append("search", filters.search);
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

/**
 * Analyze sentiment of text
 */
export async function analyzeSentiment(
  data: AnalyzeSentimentDto,
): Promise<SentimentAnalysisResult> {
  return apiPost<SentimentAnalysisResult>(
    "/reflections/analyze-sentiment",
    data,
  );
}
