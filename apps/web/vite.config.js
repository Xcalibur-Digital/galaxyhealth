import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../', '');
  
  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',
        include: '**/*.{jsx,tsx,js,ts}',
        future: {
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      mainFields: ['browser', 'module', 'main']
    },
    optimizeDeps: {
      include: ['@mantine/core', '@mantine/hooks', 'firebase/app', 'firebase/auth', 'firebase/firestore']
    },
    envDir: '../',
    define: {
      'process.env': env
    },
    server: {
      port: 3000,
      strictPort: false,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false
        }
      },
      host: true
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: []
    }
  };
}); 