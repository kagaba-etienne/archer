import { setupServer } from "msw/node";
import { authHandlers, goalHandlers, taskHandlers } from "./handlers";

/**
 * MSW server instance for Node.js environment (tests)
 *
 * Usage in tests:
 * ```typescript
 * import { server } from '@/lib/mocks/server';
 *
 * beforeAll(() => server.listen());
 * afterEach(() => server.resetHandlers());
 * afterAll(() => server.close());
 * ```
 */
export const server = setupServer(
  ...authHandlers,
  ...goalHandlers,
  ...taskHandlers,
);

/**
 * Configure server for test environment
 */
if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
  // Log unhandled requests in test environment for debugging
  server.events.on("request:unhandled", ({ request }) => {
    console.warn(`[MSW] Unhandled ${request.method} request to ${request.url}`);
  });
}
