import { defineConfig } from 'vite';

// F0: single static bundle, deploy idéntico a v1 (static site + 1 Netlify function).
// netlify.toml publish se ajusta a "dist" en F6 (deploy).
export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020'
  },
  server: { port: 5173, open: true }
});
