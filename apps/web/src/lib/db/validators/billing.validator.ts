import { z } from "zod";
import type { CreditUsageRecord, CreditTransaction, CreditOperation } from "@/domain/billing.contract";

/**
 * Validates raw data from Supabase credit_usage table.
 */
export const CreditUsageSchema = z.object({
  user_id: z.string().uuid(),
  action: z.enum([
    "ats_check",
    "cv_optimize",
    "interview_generate",
    "interview_feedback",
  ]),
  credits_spent: z.number().int(),
  tokens_used: z.number().int().nonnegative(),
  estimated_cost_eur: z.number().nonnegative(),
  metadata: z.record(z.string(), z.unknown()),
});

/**
 * Validates raw data from Supabase credit_transactions table.
 */
export const CreditTransactionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  amount: z.number().int(),
  action: z.enum([
    "ats_check",
    "cv_optimize",
    "interview_generate",
    "interview_feedback",
  ]),
  state: z.enum(["reserved", "committed", "rolled_back"]),
  created_at: z.string(),
});

/**
 * Validates API inputs for a credit operation.
 */
export const CreditOperationSchema = z.object({
  userId: z.string().uuid(),
  action: z.enum([
    "ats_check",
    "cv_optimize",
    "interview_generate",
    "interview_feedback",
  ]),
  amount: z.number().int().nonnegative(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Helper to validate usage DB row.
 */
export function validateCreditUsage(data: unknown): CreditUsageRecord {
  return CreditUsageSchema.parse(data) as CreditUsageRecord;
}

/**
 * Helper to validate transaction DB row.
 */
export function validateCreditTransaction(data: unknown): CreditTransaction {
  return CreditTransactionSchema.parse(data) as CreditTransaction;
}

/**
 * Helper to validate API payload for credit operations.
 */
export function validateCreditOperationPayload(data: unknown): CreditOperation {
  return CreditOperationSchema.parse(data) as CreditOperation;
}
