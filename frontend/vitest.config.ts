import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config'; // We import your base config

// This merges the base Vite config with our specific test config
export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
}));