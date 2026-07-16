// @ts-nocheck
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['core/voice-interview/__tests__/**/*.test.ts'],
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
