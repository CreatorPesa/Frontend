import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // Next.js requires tsconfig's `jsx` set to "preserve"; override it here so
  // Vite's esbuild pre-transform doesn't choke on raw JSX in test files.
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    env: {
      NEXT_PUBLIC_API_URL: 'http://localhost:4000',
      NEXT_PUBLIC_WS_URL: 'ws://localhost:4000/ws',
      NEXT_PUBLIC_NETWORK: 'testnet',
      NEXT_PUBLIC_HORIZON_URL: 'https://horizon-testnet.stellar.org',
      NEXT_PUBLIC_SOROBAN_RPC: 'https://soroban-testnet.stellar.org',
      OVERLAY_SIGNING_SECRET: 'vitest-only-secret-not-for-prod-use',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
