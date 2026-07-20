import { prisma } from "@/lib/prisma";
import { getServerDb } from "@/lib/db/client";
import { logger } from "@/lib/logger/Logger";

/**
 * Anti-Chaos Layer: Prompts Domain
 * 
 * STRANGLER FIG PATTERN - PHASE 1:
 * - Reads: Routed via Feature Flag (Prisma OR Supabase)
 * - Writes: Supabase ONLY (prevent divergence)
 */

const USE_PRISMA_READS = process.env.USE_PRISMA_PROMPTS === "true";

export const PromptService = {
  /**
   * Fetch all active prompts
   */
  async getActivePrompts() {
    if (USE_PRISMA_READS) {
      logger.debug("[PromptService] READ via Prisma");
      return prisma.promptVersion.findMany({
        where: { active: true },
      });
    }

    // Fallback Legacy Supabase Read
    logger.debug("[PromptService] READ via Supabase SDK");
    const supabase = await getServerDb();
    const { data, error } = await supabase
      .from("prompt_versions")
      .select("*")
      .eq("active", true);

    if (error) throw error;
    
    // Map snake_case to camelCase for consistent contract
    return (data || []).map(p => ({
      ...p,
      createdAt: p.created_at ? new Date(p.created_at) : new Date(),
    }));
  },

  /**
   * Fetch a specific prompt by type and version
   */
  async getPrompt(type: string, version: string) {
    if (USE_PRISMA_READS) {
      logger.debug("[PromptService] READ via Prisma", { type, version });
      return prisma.promptVersion.findFirst({
        where: { type, version },
      });
    }

    logger.debug("[PromptService] READ via Supabase SDK", { type, version });
    const supabase = await getServerDb();
    const { data, error } = await supabase
      .from("prompt_versions")
      .select("*")
      .eq("type", type)
      .eq("version", version)
      .single();

    if (error) return null;
    
    return data ? {
      ...data,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    } : null;
  },

  /**
   * WRITE: Supabase ONLY (Phase 1 rule)
   */
  async createPrompt(payload: {
    type: string;
    version: string;
    content: string;
    active?: boolean;
  }) {
    logger.debug("[PromptService] WRITE via Supabase SDK (Phase 1 Lock)", { type: payload.type, version: payload.version });
    const supabase = await getServerDb();
    const { data, error } = await supabase
      .from("prompt_versions")
      .insert({
        type: payload.type,
        version: payload.version,
        content: payload.content,
        active: payload.active ?? false,
      })
      .select()
      .single();

    if (error) throw error;

    return data ? {
      ...data,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    } : null;
  },

  /**
   * WRITE: Deactivate all prompts for a given type
   */
  async deactivatePromptsByType(type: string) {
    logger.debug("[PromptService] WRITE via Supabase SDK (Deactivate Prompts)", { type });
    const supabase = await getServerDb();
    const { error } = await supabase
      .from("prompt_versions")
      .update({ active: false })
      .eq("type", type);
    
    if (error) throw error;
    return true;
  },
};
