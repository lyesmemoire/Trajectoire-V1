import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": rootDir,
    },
  },
  test: {
    globals: true,
    environment: "node",
    testTimeout: 60000,
    include: ["tests/runtime/scheduler/**/*.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
    coverage: {
      provider: 'v8',
      include: ['CVM/src/scheduler/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.spec.ts', '**/*.d.ts'],
      reporter: ['json', 'html', 'text'],
      reportsDirectory: './reports/runtime/coverage',
    },
    reporters: ['verbose', 'json'],
    outputFile: './reports/runtime/tests/vitest-results.json',
    env: {
      SUPABASE_URL: "http://127.0.0.1:54321",
      SUPABASE_SERVICE_ROLE_KEY: "test-key-123",
      OPENAI_API_KEY: "sk-test-12345678901234567890",
    }
  },
});
