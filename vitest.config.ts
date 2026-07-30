import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Config Vitest minimale.
 * Seul ajout : l'alias "@/*" -> racine, pour aligner les tests sur l'alias
 * utilisé par Next.js/TypeScript. N'altère pas les tests à chemins relatifs.
 */
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
    include: ["**/*.{test,spec,bench}.?(c|m)[jt]s?(x)", "tests/runtime/**/*.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
    coverage: {
      provider: 'v8',
      include: ['src/cli/**/*.ts', 'compiler/**/*.ts', 'CVM/src/scheduler/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.spec.ts', '**/*.d.ts', 'compiler/parser/ast-types.ts'],
      reporter: ['json', 'html', 'text'],
      reportsDirectory: './reports/cli/coverage',
    },
    reporters: ['verbose', 'json'],
    outputFile: './reports/cli/tests/vitest-results.json',
    env: {
      SUPABASE_URL: "http://127.0.0.1:54321",
      SUPABASE_SERVICE_ROLE_KEY: "test-key-123",
      OPENAI_API_KEY: "sk-test-12345678901234567890", // requires >20 chars
    }
  },
});
