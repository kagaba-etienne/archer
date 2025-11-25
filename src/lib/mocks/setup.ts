import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "@/lib/mocks/server";
import { resetMockSession } from "@/lib/mocks/handlers";

/**
 * MSW Test Setup
 *
 * This file configures the Mock Service Worker for Vitest tests.
 * Import this in your test files or add to vitest.config.ts setupFiles.
 */

// Start MSW server before all tests
beforeAll(() => {
  server.listen({
    onUnhandledRequest: "warn", // Warn about unhandled requests
  });
});

// Reset handlers and mock session after each test
afterEach(() => {
  server.resetHandlers();
  resetMockSession(); // Clear mock authentication state
});

// Clean up after all tests
afterAll(() => {
  server.close();
});
