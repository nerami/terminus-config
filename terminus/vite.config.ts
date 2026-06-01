import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// HA serves /config/www at /local. Build emits a library bundle so the
// panel_custom module_url can load /local/terminus/index.js directly.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Lib mode does not inline `process.env.NODE_ENV` the way app builds do, so
  // React's dev/prod switch (`process.env.NODE_ENV === "production" ? ...`)
  // throws ReferenceError in the browser. Replace at build time.
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "../www/terminus",
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, "src/main.tsx"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: (asset) =>
          asset.name?.endsWith(".css") ? "style.css" : "[name][extname]",
      },
    },
  },
})
