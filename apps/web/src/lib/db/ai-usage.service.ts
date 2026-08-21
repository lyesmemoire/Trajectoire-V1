import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

/**
 * Canonical AI Usage persistence service.
 *
 * Legacy Supabase `ai_usage_logs` writes have been removed.
 * Prisma AIUsageLog is now the single persistence path.
 */

export const AIUsageService = {
  async findMany(
    args?: Prisma.AIUsageLogFindManyArgs
  ) {
    return prisma.aIUsageLog.findMany(
      args
    );
  },

  async create(
    args: Prisma.AIUsageLogCreateArgs
  ) {
    return prisma.aIUsageLog.create(
      args
    );
  },
};
