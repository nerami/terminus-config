/// <reference types="vitest/config" />
import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// Built as a plain SPA served by the add-on's FastAPI process behind HA ingress.
// `base: "./"` keeps asset URLs relative so they resolve under the dynamic
// /api/hassio_ingress/<token>/ prefix.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // reagraph pulls three/r3f transitively; the topology-3d code now also
    // imports them directly. Force a single copy — a second `three` breaks r3f's
    // cross-instance `instanceof` checks in the reconciler.
    dedupe: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  server: {
    port: 63740,
    proxy: {
      // Dev: forward backend routes to the FastAPI process.
      '/ha': { target: 'http://localhost:8099', changeOrigin: true },
      '/api': { target: 'http://localhost:8099', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
