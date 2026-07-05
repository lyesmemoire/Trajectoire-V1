import { prisma } from "@/lib/prisma";
import { getServerDb } from "@/lib/db/client";
import { envServer } from "@/lib/env.server";

/**
 * Anti-Chaos Layer: AI Usage Domain
 * 
 * STRANGLER FIG PATTERN - PHASE 2:
 * - Reads: Routed via Feature Flag (Prisma OR Supabase)
 * - Shadow Mode: Double read and comparative logging to detect drift silently.
 * - Writes: Supabase ONLY (prevent divergence)
 */

const USE_PRISMA_READS = envServer.USE_PRISMA_AI_USAGE === true;

import { Prisma } from "@prisma/client";

export const AIUsageService = {
  /**
   * PRISMA ACCESS
   */
  async findMany(args?: Prisma.AIUsageLogFindManyArgs) {
    return prisma.aIUsageLog.findMany(args);
  },

  async create(args: Prisma.AIUsageLogCreateArgs) {
    return prisma.aIUsageLog.create(args);
  },

  /**
   * SUPABASE ACCESS
   */
  async insertSupabase(payload: any) {
    const supabase = await getServerDb();
    return supabase.from("ai_usage_logs").insert(payload);
  },
};
