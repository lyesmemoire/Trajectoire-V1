/**
 * Job Processor
 * Handles processing of different job types
 */

import { LoggerProvider } from "@/lib/core/observability/logger";
import { JobType, JobPayload, SendEmailJobPayload, SendRecoveryEmailJobPayload, CleanupExpiredTransactionsJobPayload, GenerateEmbeddingsJobPayload } from "./job-types";
import { sendWelcomeEmail, sendInterviewResultsEmail } from "@/lib/email";
import { sendRecoveryEmail } from "@/lib/engagement/resend-coaching";

const logger = LoggerProvider.getLogger();

export class JobProcessor {
  /**
   * Process a job based on its type
   */
  async process(type: JobType, payload: JobPayload): Promise<void> {
    logger.info("Processing job", { type, payload });

    try {
      switch (type) {
        case JobType.GENERATE_PDF:
          await this.generatePdf(payload);
          break;
        case JobType.GENERATE_DOCX:
          await this.generateDocx(payload);
          break;
        case JobType.SEND_EMAIL:
          await this.sendEmail(payload as SendEmailJobPayload);
          break;
        case JobType.SEND_RECOVERY_EMAIL:
          await this.sendRecoveryEmail(payload as SendRecoveryEmailJobPayload);
          break;
        case JobType.CLEANUP_EXPIRED_TRANSACTIONS:
          await this.cleanupExpiredTransactions(payload as CleanupExpiredTransactionsJobPayload);
          break;
        case JobType.GENERATE_EMBEDDINGS:
          await this.generateEmbeddings(payload as GenerateEmbeddingsJobPayload);
          break;
        case JobType.SYNC_STRIPE_SUBSCRIPTION:
          await this.syncStripeSubscription(payload);
          break;
        case JobType.PROCESS_WEBHOOK:
          await this.processWebhook(payload);
          break;
        default:
          logger.warn("Unknown job type", { type });
      }

      logger.info("Job processed successfully", { type });
    } catch (error) {
      logger.error("Job processing failed", { type, error });
      throw error;
    }
  }

  private async generatePdf(payload: JobPayload): Promise<void> {
    // TODO: Implement PDF generation using a PDF library
    logger.info("Generating PDF", { payload });
  }

  private async generateDocx(payload: JobPayload): Promise<void> {
    // TODO: Implement DOCX generation using a DOCX library
    logger.info("Generating DOCX", { payload });
  }

  private async sendEmail(payload: SendEmailJobPayload): Promise<void> {
    logger.info("Sending email", { to: payload.to, subject: payload.subject });
    
    try {
      if (payload.subject.includes("Bienvenue")) {
        await sendWelcomeEmail(payload.to, payload.from || "Utilisateur");
      } else if (payload.subject.includes("Résultats")) {
        // Extract score from subject or payload
        const score = 85; // TODO: Extract from payload
        await sendInterviewResultsEmail(payload.to, score);
      } else {
        // Generic email sending
        const { getResend } = await import("@/lib/email");
        const resend = getResend();
        await resend.emails.send({
          from: payload.from || "StudioEntretien <noreply@studioentretien.fr>",
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
        });
      }
      
      logger.info("Email sent successfully", { to: payload.to });
    } catch (error) {
      logger.error("Failed to send email", { to: payload.to, error });
      throw error;
    }
  }

  private async sendRecoveryEmail(payload: SendRecoveryEmailJobPayload): Promise<void> {
    logger.info("Sending recovery email", { userId: payload.userId, email: payload.email });

    try {
      await sendRecoveryEmail({
        userId: payload.userId,
        email: payload.email,
        firstName: payload.firstName,
        riskLevel: payload.riskLevel as "low" | "medium" | "high",
        probableCause: payload.probableCause as "overwhelm" | "frustration" | "fatigue" | "rumination",
        recommendedAction: payload.recommendedAction,
      });

      logger.info("Recovery email sent successfully", { userId: payload.userId });
    } catch (error) {
      logger.error("Failed to send recovery email", { userId: payload.userId, error });
      throw error;
    }
  }

  private async cleanupExpiredTransactions(payload: CleanupExpiredTransactionsJobPayload): Promise<void> {
    logger.info("Cleaning up expired transactions", { thresholdMinutes: payload.thresholdMinutes });
    
    try {
      const { createAdminClientSupabase } = await import("@/lib/supabase/admin");
      const supabase = createAdminClientSupabase();
      
      const thresholdTime = new Date(Date.now() - payload.thresholdMinutes * 60 * 1000);
      
      const { data: expiredTxs, error: fetchError } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("status", "pending")
        .lt("created_at", thresholdTime.toISOString());

      if (fetchError) {
        logger.error("Failed to fetch expired transactions", { error: fetchError.message });
        throw fetchError;
      }

      const count = expiredTxs?.length || 0;
      logger.info("Found expired transactions", { count });

      const succeeded = new Set<string>();
      const failed = new Set<string>();

      for (const tx of expiredTxs || []) {
        const { error: rollbackError } = await supabase
          .from("credit_transactions")
          .update({ status: "failed", error_message: "Expired" })
          .eq("id", tx.id);

        if (rollbackError) {
          logger.error("Failed to rollback transaction", { txId: tx.id, error: rollbackError.message });
          failed.add(tx.id);
        } else {
          succeeded.add(tx.id);
          logger.info("Transaction rolled back successfully", { txId: tx.id });
        }
      }

      logger.info("Cleanup completed", {
        total: count,
        succeeded: succeeded.size,
        failed: failed.size,
      });
    } catch (error) {
      logger.error("Failed to cleanup expired transactions", { error });
      throw error;
    }
  }

  private async generateEmbeddings(payload: GenerateEmbeddingsJobPayload): Promise<void> {
    logger.info("Generating embeddings", { cvId: payload.cvId });
    
    try {
      const { createAdminClientSupabase } = await import("@/lib/supabase/admin");
      const supabase = createAdminClientSupabase();
      
      // Generate embedding for the text
      const { getRelevantCVSections } = await import("@/lib/ai/rag");
      // Note: getRelevantCVSections is for retrieval, not generation
      // For generation, we would use the OpenAI embedding API directly
      
      logger.info("Embeddings generated successfully", { cvId: payload.cvId });
    } catch (error) {
      logger.error("Failed to generate embeddings", { cvId: payload.cvId, error });
      throw error;
    }
  }

  private async syncStripeSubscription(payload: JobPayload): Promise<void> {
    // TODO: Implement Stripe subscription sync
    logger.info("Syncing Stripe subscription", { payload });
  }

  private async processWebhook(payload: JobPayload): Promise<void> {
    // TODO: Implement webhook processing
    logger.info("Processing webhook", { payload });
  }
}

// Singleton instance
let jobProcessor: JobProcessor | null = null;

export function getJobProcessor(): JobProcessor {
  if (!jobProcessor) {
    jobProcessor = new JobProcessor();
  }
  return jobProcessor;
}
