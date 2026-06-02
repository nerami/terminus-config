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
    // Stub CSS imports that come in transitively from @copilotkit/react-core/v2
    css: true,
    server: {
      deps: {
        inline: ["@copilotkit/react-core"],
      },
    },
  },
})
