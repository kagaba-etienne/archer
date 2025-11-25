/**
 * Mock server setup for Archer
 *
 * This module provides API mocking capabilities for development and testing.
 * It uses MSW (Mock Service Worker) to intercept HTTP requests and return mock data.
 */

// Mock data
export { mockUser, mockCredentials, mockUsers } from "./data";

// Mock handlers
export {
  authHandlers,
  resetMockSession,
  setMockUser,
  getMockUser,
} from "./handlers";

// Server setup (for tests)
export { server } from "./server";

// Browser setup (for development) - not exported by default to avoid Node.js errors
// Import directly: import { worker } from "@/lib/mocks/browser";
