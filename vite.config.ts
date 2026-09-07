import { defineConfig } from 'vite';

export default defineConfig({
  // Using relative base so the build works both locally and deployed under GitHub Pages (/dinnerdatewithdeath/)
  base: './',
  build: {
    target: 'esnext',
    assetsInlineLimit: 0,
  },
  server: {
    port: 3000,
    open: false,
  },
});
