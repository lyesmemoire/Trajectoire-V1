// @ts-nocheck
import "server-only";
import { PrismaClient } from "@prisma/client";
import { envServer } from "@/lib/env.server";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: envServer.NODE_ENV === "development" ? ["error"] : ["error"],
  });

if (envServer.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma;

export default prisma;
