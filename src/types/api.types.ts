/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API error response
 */
export interface APIError {
  message: string;
  code?: string;
  field?: string;
  details?: Record<string, unknown>;
}

/**
 * API success response
 */
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: APIError;
  timestamp: Date;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Sort parameters
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Common query parameters
 */
export interface QueryParams extends PaginationParams, SortParams {
  search?: string;
}
