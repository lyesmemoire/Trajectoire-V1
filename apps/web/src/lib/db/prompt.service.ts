import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger/Logger"

/**
 * Prompt persistence.
 *
 * Canonical storage:
 * Prisma PromptVersion -> public."PromptVersion"
 *
 * The former Supabase table `prompt_versions` no longer exists.
 * All reads and writes now use the canonical Prisma model.
 */
export const PromptService = {
  /**
   * Fetch all active prompts.
   */
  async getActivePrompts() {
    logger.debug("[PromptService] READ via Prisma")

    return prisma.promptVersion.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  },

  /**
   * Fetch one prompt by type/version.
   */
  async getPrompt(type: string, version: string) {
    logger.debug("[PromptService] READ via Prisma", {
      type,
      version,
    })

    return prisma.promptVersion.findFirst({
      where: {
        type,
        version,
      },
    })
  },

  /**
   * Create a prompt version.
   */
  async createPrompt(payload: {
    type: string
    version: string
    content: string
    active?: boolean
  }) {
    logger.debug("[PromptService] WRITE via Prisma", {
      type: payload.type,
      version: payload.version,
    })

    return prisma.promptVersion.create({
      data: {
        type: payload.type,
        version: payload.version,
        content: payload.content,
        active: payload.active ?? false,
      },
    })
  },

  /**
   * Deactivate every prompt version for a type.
   */
  async deactivatePromptsByType(type: string) {
    logger.debug(
      "[PromptService] WRITE via Prisma (deactivate)",
      { type },
    )

    await prisma.promptVersion.updateMany({
      where: {
        type,
      },
      data: {
        active: false,
      },
    })

    return true
  },
}
