import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      name: "jsdom",
      root: "./src",
      environment: "jsdom",
      include: ["**/*.{test,spec}.tsx"],
      setupFiles: ["./setup.jsdom.ts"],
    },
  },
  {
    test: {
      name: "node",
      root: "./src",
      environment: "node",
      include: ["**/*.{test,spec}.ts"],
      // setupFiles: ['./setup.node.ts'],
    },
  },
]);
