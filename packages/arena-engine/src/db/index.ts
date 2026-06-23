/**
 * Singleton Prisma exporté depuis arena-engine.
 * Tous les workspaces qui ont besoin de Prisma importent depuis ici
 * au lieu d'importer @prisma/client directement.
 *
 * Usage :
 *   import { prisma } from "@trajectoire/arena-engine/db"
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
