import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM'
        }
      }
    }
  },
  logLevel: 'info',
  clearScreen: false,
  optimizeDeps: {
    include: ['@mantine/core', '@mantine/hooks', '@emotion/react']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@mantine/core': '@mantine/core/esm',
      '@mantine/hooks': '@mantine/hooks/esm',
      '@galaxy/shared': path.resolve(__dirname, '../shared'),
    }
  }
}); 