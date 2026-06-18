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
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
  },
});
