import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({
    include: "**/*.jsx",
  })],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  logLevel: 'info',
  clearScreen: false,
  optimizeDeps: {
    include: ['@mantine/core', '@mantine/hooks', '@emotion/react']
  },
  resolve: {
    alias: {
      '@mantine/core': '@mantine/core/esm',
      '@mantine/hooks': '@mantine/hooks/esm'
    }
  }
}); 