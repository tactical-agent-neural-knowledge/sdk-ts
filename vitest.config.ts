import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const mock = (name: string) => fileURLToPath(new URL(`./src/test/mocks/${name}.tsx`, import.meta.url));

export default defineConfig({
  resolve: {
    // src/blocks-native renders against these stand-ins (host elements + the SDK's Paper theme);
    // the real packages are dev-only for types and never ship in dist/.
    alias: { "react-native": mock("react-native"), "react-native-paper": mock("react-native-paper") },
  },
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environmentMatchGlobs: [["src/blocks-web/**", "jsdom"]],
    environment: "node",
    testTimeout: 15_000,
    hookTimeout: 15_000,
  },
});
