import { createHash } from "crypto";
import prisma from "@/lib/prisma";
import { LoggerProvider } from "@/lib/core/observability/logger";

export interface PromptMetadata {
  version: string;
  engine: string;
  fragments: string[];
  config: any;
}

/**
 * Prompt Integrity Layer
 * Ensures consistency, auditability, and safety of AI behaviors.
 */
export const PromptIntegrity = {
  /**
   * Generates a unique fingerprint for an assembled prompt.
   */
  generateFingerprint: (text: string): string => {
    return createHash("sha256").update(text).digest("hex").slice(0, 16);
  },

  /**
   * Logs a prompt audit trail to monitor drift and consistency.
   */
  logAudit: async (
    userId: string,
    sessionId: string,
    metadata: PromptMetadata,
  ) => {
    const fingerprint = PromptIntegrity.generateFingerprint(
      JSON.stringify(metadata),
    );

    LoggerProvider.getLogger().debug(
      `[Prompt Audit] ${metadata.engine} | Version: ${metadata.version} | Hash: ${fingerprint}`,
      { userId, sessionId }
    );

    // Persist to DB for drift analysis
    await prisma.interviewEvent
      .create({
        data: {
          InterviewSession: { connect: { id: sessionId } },
          type: "prompt_audit",
          impactScore: 1.0, // Neutral status
        },
      })
      .catch(() => {});
  },

  /**
   * Detects behavioral drift (e.g., tone becoming too aggressive).
   */
  detectDrift: (response: string, expectedTone: string): boolean => {
    // Simple heuristic for now, could be an LLM-based check later
    if (
      expectedTone === "supportive" &&
      (response.includes("insuffisant") || response.includes("faible"))
    ) {
      return true; // Detected potential drift into aggressive territory
    }
    return false;
  },
};
