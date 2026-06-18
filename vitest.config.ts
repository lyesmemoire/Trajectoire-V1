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
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/*.spec.ts"],
    env: {
      SUPABASE_URL: "http://127.0.0.1:54321",
      SUPABASE_SERVICE_ROLE_KEY: "test-key-123",
      OPENAI_API_KEY: "sk-test-12345678901234567890", // requires >20 chars
    }
  },
});
