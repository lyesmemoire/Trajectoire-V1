import { defineConfig } from 'vitest/config';

import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['core/voice-interview/__tests__/**/*.test.ts', 'tests/unit/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['core/voice-interview/**/*.ts'],
      exclude: ['core/voice-interview/__tests__/**', 'core/voice-interview/bootstrap/**', 'core/voice-interview/**/index.ts'],
      all: true,
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90
      }
    }
  }
});
