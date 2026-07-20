/**
 * AI Governance Engine Interfaces
 * Validates all AI decisions against governance policies
 */

import { z } from "zod";

// ============================================================================
// POLICY TYPE
// ============================================================================

export type PolicyType = 
  | "never_increase_stress"
  | "never_repeat_questions"
  | "never_exceed_budget"
  | "never_spam_notifications"
  | "always_explain_score"
  | "always_keep_realism"
  | "prefer_cheaper_models"
  | "prefer_cached_response"
  | "respect_user_privacy"
  | "ensure_fairness"
  | "maintain_transparency"
  | "prevent_bias"
  | "custom";

// ============================================================================
// POLICY SEVERITY
// ============================================================================

export type PolicySeverity = "low" | "medium" | "high" | "critical";

// ============================================================================
// GOVERNANCE POLICY
// ============================================================================

export interface GovernancePolicy {
  id: string;
  type: PolicyType;
  name: string;
  description: string;
  rule: string;
  severity: PolicySeverity;
  enabled: boolean;
  conditions: Record<string, unknown>;
  exceptions: string[];
  createdAt: Date;
  lastModified: Date;
}

export const GovernancePolicySchema = z.object({
  id: z.string(),
  type: z.enum(["never_increase_stress", "never_repeat_questions", "never_exceed_budget", "never_spam_notifications", "always_explain_score", "always_keep_realism", "prefer_cheaper_models", "prefer_cached_response", "respect_user_privacy", "ensure_fairness", "maintain_transparency", "prevent_bias", "custom"]),
  name: z.string(),
  description: z.string(),
  rule: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  enabled: z.boolean(),
  conditions: z.record(z.string(), z.unknown()),
  exceptions: z.array(z.string()),
  createdAt: z.date(),
  lastModified: z.date(),
});

// ============================================================================
// POLICY VIOLATION
// ============================================================================

export interface PolicyViolation {
  id: string;
  policyId: string;
  decisionId: string;
  decisionType: string;
  severity: PolicySeverity;
  description: string;
  detectedAt: Date;
  context: Record<string, unknown>;
  autoCorrected: boolean;
  correction: string | null;
}

export const PolicyViolationSchema = z.object({
  id: z.string(),
  policyId: z.string(),
  decisionId: z.string(),
  decisionType: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  description: z.string(),
  detectedAt: z.date(),
  context: z.record(z.string(), z.unknown()),
  autoCorrected: z.boolean(),
  correction: z.string().nullable(),
});

// ============================================================================
// GOVERNANCE VALIDATION
// ============================================================================

export interface GovernanceValidation {
  id: string;
  decisionId: string;
  decisionType: string;
  passed: boolean;
  violations: PolicyViolation[];
  warnings: string[];
  score: number; // 0-1
  timestamp: Date;
  userId: string;
}

export const GovernanceValidationSchema = z.object({
  id: z.string(),
  decisionId: z.string(),
  decisionType: z.string(),
  passed: z.boolean(),
  violations: z.array(z.lazy(() => PolicyViolationSchema)),
  warnings: z.array(z.string()),
  score: z.number(),
  timestamp: z.date(),
  userId: z.string(),
});

// ============================================================================
// POLICY CORRECTION
// ============================================================================

export interface PolicyCorrection {
  id: string;
  violationId: string;
  originalDecision: unknown;
  correctedDecision: unknown;
  correctionType: "modify" | "block" | "replace" | "defer";
  reason: string;
  timestamp: Date;
}

export const PolicyCorrectionSchema = z.object({
  id: z.string(),
  violationId: z.string(),
  originalDecision: z.unknown(),
  correctedDecision: z.unknown(),
  correctionType: z.enum(["modify", "block", "replace", "defer"]),
  reason: z.string(),
  timestamp: z.date(),
});

// ============================================================================
// GOVERNANCE METRICS
// ============================================================================

export interface GovernanceMetrics {
  totalPolicies: number;
  activePolicies: number;
  totalValidations: number;
  passedValidations: number;
  failedValidations: number;
  totalViolations: number;
  violationsBySeverity: Record<string, number>;
  violationsByPolicy: Record<string, number>;
  autoCorrectionRate: number;
  averageScore: number; // 0-1
}

export const GovernanceMetricsSchema = z.object({
  totalPolicies: z.number(),
  activePolicies: z.number(),
  totalValidations: z.number(),
  passedValidations: z.number(),
  failedValidations: z.number(),
  totalViolations: z.number(),
  violationsBySeverity: z.record(z.string(), z.number()),
  violationsByPolicy: z.record(z.string(), z.number()),
  autoCorrectionRate: z.number(),
  averageScore: z.number(),
});

// ============================================================================
// AI GOVERNANCE ENGINE CONFIG
// ============================================================================

export interface AIGovernanceEngineConfig {
  enableAutoCorrection: boolean;
  enableBlocking: boolean;
  blockOnCritical: boolean;
  blockOnHigh: boolean;
  blockOnMedium: boolean;
  enableWarnings: boolean;
  enableLogging: boolean;
  defaultSeverity: PolicySeverity;
}

export const AIGovernanceEngineConfigSchema = z.object({
  enableAutoCorrection: z.boolean(),
  enableBlocking: z.boolean(),
  blockOnCritical: z.boolean(),
  blockOnHigh: z.boolean(),
  blockOnMedium: z.boolean(),
  enableWarnings: z.boolean(),
  enableLogging: z.boolean(),
  defaultSeverity: z.enum(["low", "medium", "high", "critical"]),
});

export const defaultAIGovernanceEngineConfig: AIGovernanceEngineConfig = {
  enableAutoCorrection: true,
  enableBlocking: true,
  blockOnCritical: true,
  blockOnHigh: false,
  blockOnMedium: false,
  enableWarnings: true,
  enableLogging: true,
  defaultSeverity: "medium",
};
