import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "happy-dom",
    globals: false,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "vite-plugin-graph.test.ts"],
    passWithNoTests: true,
  },
})
