import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const webSrcDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "src"
);

/**
 * Suites qui écrivent sur Prisma SANS mock (deleteMany avant/après chaque test) et portent la garde
 * « [SAFETY] hôte local uniquement » : `PreviewStorageService` et `PreviewAnalysisRepository` vident la même
 * table `preview_analyses`. Exécutées en parallèle, elles s'effacent mutuellement leurs lignes (échecs aléatoires
 * sur une base locale). Elles forment donc un projet Vitest à part qui tourne fichier après fichier.
 * Tout nouveau test qui écrit sur Prisma sans mock doit être ajouté ici (et porter la même garde).
 */
const SERIAL_DB_TESTS = [
  "src/lib/preview/__tests__/PreviewStorageService.test.ts",
  "src/lib/preview-analysis/__tests__/PreviewAnalysisRepository.test.ts",
];

const BASE_INCLUDE = ["src/**/*.{test,spec}.{ts,tsx}"];
// src/e2e/** = specs Playwright (test.describe), pas des tests Vitest : ne pas les ramasser.
const BASE_EXCLUDE = ["**/node_modules/**", "**/.next/**", "src/e2e/**"];

/**
 * Vitest config local à apps/web.
 * Résout l'alias "@/*" → apps/web/src, conformément au tsconfig de Next.js.
 * Deux projets : « unit » (tout, en parallèle) et « db-serial » (suites ci-dessus, un fichier à la fois).
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
    env: {
      VITEST: "true",
      NODE_ENV: "test",
      SUPABASE_URL: "http://127.0.0.1:54321",
      SUPABASE_SERVICE_ROLE_KEY: "test-key-123",
      OPENAI_API_KEY: "sk-test-12345678901234567890",
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: BASE_INCLUDE,
          exclude: [...BASE_EXCLUDE, ...SERIAL_DB_TESTS],
        },
      },
      {
        extends: true,
        test: {
          name: "db-serial",
          include: SERIAL_DB_TESTS,
          exclude: BASE_EXCLUDE,
          fileParallelism: false,
        },
      },
    ],
  },
});
