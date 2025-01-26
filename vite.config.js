import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',
    babel: {
      plugins: [],
    },
  })],
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
}); 