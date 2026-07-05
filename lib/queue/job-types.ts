/**
 * Job Types for Background Processing
 * Defines all job types that can be processed by the background worker
 */

export enum JobType {
  // Document Generation
  GENERATE_PDF = "generate_pdf",
  GENERATE_DOCX = "generate_docx",

  // Email
  SEND_EMAIL = "send_email",
  SEND_RECOVERY_EMAIL = "send_recovery_email",

  // Cleanup
  CLEANUP_EXPIRED_TRANSACTIONS = "cleanup_expired_transactions",
  CLEANUP_OLD_SESSIONS = "cleanup_old_sessions",
  CLEANUP_TEMP_FILES = "cleanup_temp_files",

  // AI/Embeddings
  GENERATE_EMBEDDINGS = "generate_embeddings",
  RECALCULATE_VECTORS = "recalculate_vectors",

  // Billing
  SYNC_STRIPE_SUBSCRIPTION = "sync_stripe_subscription",
  PROCESS_WEBHOOK = "process_webhook",

  // Analytics
  AGGREGATE_DAILY_STATS = "aggregate_daily_stats",
  UPDATE_USER_METRICS = "update_user_metrics",
}

export interface BaseJobPayload {
  userId?: string;
  correlationId?: string;
}

export interface GeneratePdfJobPayload extends BaseJobPayload {
  cvId: string;
  templateId?: string;
}

export interface GenerateDocxJobPayload extends BaseJobPayload {
  cvId: string;
  templateId?: string;
}

export interface SendEmailJobPayload extends BaseJobPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface SendRecoveryEmailJobPayload extends BaseJobPayload {
  userId: string;
  email: string;
  firstName?: string;
  riskLevel: string;
  probableCause: string;
  recommendedAction: {
    title: string;
    duration: string;
  };
}

export interface CleanupExpiredTransactionsJobPayload extends BaseJobPayload {
  thresholdMinutes: number;
}

export interface GenerateEmbeddingsJobPayload extends BaseJobPayload {
  cvId: string;
  text: string;
}

export interface SyncStripeSubscriptionJobPayload extends BaseJobPayload {
  subscriptionId: string;
  customerId: string;
}

export interface ProcessWebhookJobPayload extends BaseJobPayload {
  webhookType: string;
  payload: any;
}

export type JobPayload =
  | GeneratePdfJobPayload
  | GenerateDocxJobPayload
  | SendEmailJobPayload
  | SendRecoveryEmailJobPayload
  | CleanupExpiredTransactionsJobPayload
  | GenerateEmbeddingsJobPayload
  | SyncStripeSubscriptionJobPayload
  | ProcessWebhookJobPayload;

export interface Job {
  id: string;
  type: JobType;
  payload: JobPayload;
  scheduledAt?: Date;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}
