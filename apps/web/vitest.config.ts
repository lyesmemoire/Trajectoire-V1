import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const webSrcDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "src"
);

/**
 * Vitest config local à apps/web.
 * Résout l'alias "@/*" → apps/web/src, conformément au tsconfig de Next.js.
 * Hérite des réglages de test depuis le vitest.config.ts racine via le mécanisme
 * de workspace ou en redéfinissant uniquement l'alias nécessaire.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": webSrcDir,
    },
  },
  test: {
    globals: true,
    environment: "node",
    testTimeout: 60000,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/.next/**"],
    env: {
      VITEST: "true",
      NODE_ENV: "test",
      SUPABASE_URL: "http://127.0.0.1:54321",
      SUPABASE_SERVICE_ROLE_KEY: "test-key-123",
      OPENAI_API_KEY: "sk-test-12345678901234567890",
    },
  },
});
