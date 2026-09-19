import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environmentMatchGlobs: [["src/blocks-web/**", "jsdom"]],
    environment: "node",
    testTimeout: 15_000,
    hookTimeout: 15_000,
  },
});
