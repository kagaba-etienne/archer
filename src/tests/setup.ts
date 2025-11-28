/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, vi, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
(global as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver
(global as any).ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock SpeechRecognition for voice tests
(global as any).SpeechRecognition = vi.fn(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  abort: vi.fn(),
  onstart: null,
  onresult: null,
  onerror: null,
  onend: null,
  continuous: false,
  interimResults: false,
  language: "en-US",
}));

(global as any).webkitSpeechRecognition = (global as any).SpeechRecognition;

// Setup MSW (Mock Service Worker) server for API mocking in tests
const { server } = await import("@/lib/mocks/server");

beforeAll(() => {
  server.listen({
    onUnhandledRequest: "warn",
  });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
