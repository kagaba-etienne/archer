import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query client configuration
 * Handles all server state management
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

/**
 * Query keys factory for consistent cache keys
 */
export const queryKeys = {
  // Auth
  auth: {
    me: ["auth", "me"] as const,
  },
  // Tasks
  tasks: {
    all: ["tasks"] as const,
    list: (filters?: unknown) => ["tasks", "list", filters] as const,
    detail: (id: string) => ["tasks", "detail", id] as const,
    stats: ["tasks", "stats"] as const,
  },
  // Goals
  goals: {
    all: ["goals"] as const,
    list: ["goals", "list"] as const,
    detail: (id: string) => ["goals", "detail", id] as const,
    progress: (id: string) => ["goals", "progress", id] as const,
  },
  // Reflections
  reflections: {
    all: ["reflections"] as const,
    list: (filters?: unknown) => ["reflections", "list", filters] as const,
    detail: (id: string) => ["reflections", "detail", id] as const,
  },
  // Insights
  insights: {
    all: ["insights"] as const,
    alignment: ["insights", "alignment"] as const,
    recommendations: ["insights", "recommendations"] as const,
    trends: ["insights", "trends"] as const,
  },
  // Notifications
  notifications: {
    all: ["notifications"] as const,
    list: (filters?: unknown) => ["notifications", "list", filters] as const,
    unreadCount: ["notifications", "unreadCount"] as const,
    preferences: ["notifications", "preferences"] as const,
  },
  // Calendar
  calendar: {
    all: ["calendar"] as const,
    accounts: ["calendar", "accounts"] as const,
    events: ["calendar", "events"] as const,
    integrations: ["calendar", "integrations"] as const,
    sync: (integrationId: string) =>
      ["calendar", "sync", integrationId] as const,
  },
};
