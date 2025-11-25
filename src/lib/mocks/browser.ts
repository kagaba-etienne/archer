import { setupWorker } from "msw/browser";
import { authHandlers, goalHandlers, taskHandlers } from "./handlers";

/**
 * MSW worker instance for browser environment (development)
 *
 * This enables API mocking in the browser during development.
 * The service worker intercepts network requests and returns mock responses.
 */
export const worker = setupWorker(
  ...authHandlers,
  ...goalHandlers,
  ...taskHandlers,
);

/**
 * Start the mock service worker in development mode
 *
 * Usage in your app:
 * ```typescript
 * if (process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true') {
 *   import('@/lib/mocks/browser').then(({ worker }) => {
 *     worker.start();
 *   });
 * }
 * ```
 */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  worker.events.on("request:start", ({ request }) => {
    console.log("[MSW]", request.method, request.url);
  });

  worker.events.on("request:match", ({ request }) => {
    console.log("[MSW] Matched:", request.method, request.url);
  });

  worker.events.on("request:unhandled", ({ request }) => {
    console.warn("[MSW] Unhandled request:", request.method, request.url);
  });
}
