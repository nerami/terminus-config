/// <reference types="vitest/config" />
import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Served as a static SPA by the add-on's Starlette process behind HA ingress.
// base: './' keeps asset URLs relative so they resolve under the dynamic
// /api/hassio_ingress/<token>/ prefix.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    port: 63743,
    proxy: {
      '/playground': { target: 'http://localhost:9000', changeOrigin: true },
      '/mcp': { target: 'http://localhost:9000', changeOrigin: true },
      '/health': { target: 'http://localhost:9000', changeOrigin: true },
    },
  },
  build: { outDir: 'dist', emptyOutDir: true },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
