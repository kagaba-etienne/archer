import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

import { playwright } from "@vitest/browser-playwright";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/tests/",
        "**/*.config.ts",
        "**/*.config.mjs",
        "**/dist/**",
        "**/*.stories.{ts,tsx}",
        ".storybook/**",
        "storybook-static/**",
        "src/lib/mocks/**",
        "src/types/**",
        "**/*.d.ts",
        "e2e/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
    projects: [
      // Unit tests with MSW mocking and coverage
      {
        plugins: [tsconfigPaths()],
        test: {
          name: "unit",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./src/tests/setup.ts"],
          include: ["src/**/*.{test,spec}.{ts,tsx}"],
          exclude: ["src/**/*.stories.{ts,tsx}", "node_modules", "e2e/**"],
        },
      },
      // Storybook tests
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
