/// <reference types="vitest/config" />
import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Backend dev target. Defaults to the add-on contract (:9000); override via
// DEV_BACKEND_PORT (set in .env, exported by dev.sh) to match the backend when
// something else holds 9000 locally.
const backendTarget = `http://localhost:${process.env.DEV_BACKEND_PORT ?? '9000'}`;

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
      '/playground': { target: backendTarget, changeOrigin: true },
      '/mcp': { target: backendTarget, changeOrigin: true },
      '/health': { target: backendTarget, changeOrigin: true },
    },
  },
  build: { outDir: 'dist', emptyOutDir: true },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
