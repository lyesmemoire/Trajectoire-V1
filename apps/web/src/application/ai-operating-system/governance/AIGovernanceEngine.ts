/**
 * AI Governance Engine
 * Validates all AI decisions against governance policies
 */

import {
  PolicySeverity,
  GovernancePolicy,
  PolicyViolation,
  GovernanceValidation,
  PolicyCorrection,
  GovernanceMetrics,
  AIGovernanceEngineConfig,
  defaultAIGovernanceEngineConfig,
} from "./interfaces/IAIGovernanceEngine";

// ============================================================================
// AI GOVERNANCE ENGINE CLASS
// ============================================================================

export class AIGovernanceEngine {
  private static instance: AIGovernanceEngine;
  private config: AIGovernanceEngineConfig;
  private policies: Map<string, GovernancePolicy> = new Map();
  private violations: Map<string, PolicyViolation> = new Map();
  private validations: Map<string, GovernanceValidation> = new Map();
  private corrections: Map<string, PolicyCorrection> = new Map();

  private constructor() {
    this.config = defaultAIGovernanceEngineConfig;
    this.initializeDefaultPolicies();
  }

  static getInstance(): AIGovernanceEngine {
    if (!AIGovernanceEngine.instance) {
      AIGovernanceEngine.instance = new AIGovernanceEngine();
    }
    return AIGovernanceEngine.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<AIGovernanceEngineConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Initialize default policies
   */
  private initializeDefaultPolicies(): void {
    const defaultPolicies: GovernancePolicy[] = [
      {
        id: "policy_never_increase_stress",
        type: "never_increase_stress",
        name: "Never Increase Stress",
        description: "Never make decisions that increase user stress",
        rule: "stress_level <= current_stress_level",
        severity: "high",
        enabled: true,
        conditions: {},
        exceptions: [],
        createdAt: new Date(),
        lastModified: new Date(),
      },
      {
        id: "policy_never_repeat_questions",
        type: "never_repeat_questions",
        name: "Never Repeat Questions",
        description: "Never ask the same question twice in a session",
        rule: "question not in asked_questions",
        severity: "medium",
        enabled: true,
        conditions: {},
        exceptions: [],
        createdAt: new Date(),
        lastModified: new Date(),
      },
      {
        id: "policy_never_exceed_budget",
        type: "never_exceed_budget",
        name: "Never Exceed Budget",
        description: "Never exceed the allocated budget for a session",
        rule: "cost <= session_budget",
        severity: "critical",
        enabled: true,
        conditions: {},
        exceptions: [],
        createdAt: new Date(),
        lastModified: new Date(),
      },
      {
        id: "policy_never_spam_notifications",
        type: "never_spam_notifications",
        name: "Never Spam Notifications",
        description: "Never send excessive notifications to users",
        rule: "notification_rate <= max_notification_rate",
        severity: "medium",
        enabled: true,
        conditions: {},
        exceptions: [],
        createdAt: new Date(),
        lastModified: new Date(),
      },
      {
        id: "policy_always_explain_score",
        type: "always_explain_score",
        name: "Always Explain Score",
        description: "Always provide an explanation for scores",
        rule: "score_explanation != null",
        severity: "high",
        enabled: true,
        conditions: {},
        exceptions: [],
        createdAt: new Date(),
        lastModified: new Date(),
      },
      {
        id: "policy_always_keep_realism",
        type: "always_keep_realism",
        name: "Always Keep Realism",
        description: "Always maintain realistic expectations",
        rule: "expectation <= realistic_limit",
        severity: "medium",
        enabled: true,
        conditions: {},
        exceptions: [],
        createdAt: new Date(),
        lastModified: new Date(),
      },
      {
        id: "policy_prefer_cheaper_models",
        type: "prefer_cheaper_models",
        name: "Prefer Cheaper Models",
        description: "Prefer cheaper AI models when possible",
        rule: "model_cost <= max_model_cost",
        severity: "low",
        enabled: true,
        conditions: {},
        exceptions: [],
        createdAt: new Date(),
        lastModified: new Date(),
      },
      {
        id: "policy_prefer_cached_response",
        type: "prefer_cached_response",
        name: "Prefer Cached Response",
        description: "Prefer cached responses when available",
        rule: "use_cache if cache_available",
        severity: "low",
        enabled: true,
        conditions: {},
        exceptions: [],
        createdAt: new Date(),
        lastModified: new Date(),
      },
    ];

    defaultPolicies.forEach(policy => {
      this.policies.set(policy.id, policy);
    });
  }

  /**
   * Validate decision
   */
  async validateDecision(decisionId: string, decisionType: string, decision: any, userId: string): Promise<GovernanceValidation> {
    const validationId = `validation_${decisionId}_${Date.now()}`;
    const violations: PolicyViolation[] = [];
    const warnings: string[] = [];

    // Check all active policies
    for (const policy of this.policies.values()) {
      if (!policy.enabled) continue;

      const result = await this.checkPolicy(policy, decisionId, decisionType, decision, userId);
      if (result.violation) {
        violations.push(result.violation);
      }
      if (result.warning) {
        warnings.push(result.warning);
      }
    }

    // Calculate score
    const score = this.calculateScore(violations);

    // Determine if validation passed
    const passed = this.determineValidationPassed(violations);

    const validation: GovernanceValidation = {
      id: validationId,
      decisionId,
      decisionType,
      passed,
      violations,
      warnings,
      score,
      timestamp: new Date(),
      userId,
    };

    this.validations.set(validationId, validation);

    // Auto-correct violations if enabled
    if (this.config.enableAutoCorrection && violations.length > 0) {
      await this.autoCorrectViolations(validation);
    }

    return validation;
  }

  /**
   * Check policy
   */
  private async checkPolicy(policy: GovernancePolicy, decisionId: string, decisionType: string, decision: any, userId: string): Promise<{ violation: PolicyViolation | null; warning: string | null }> {
    const context = decision as Record<string, unknown>;
    let violation: PolicyViolation | null = null;
    let warning: string | null = null;

    switch (policy.type) {
      case "never_increase_stress":
        if (context.stress_level && context.current_stress_level && context.stress_level > context.current_stress_level) {
          violation = this.createViolation(policy.id, decisionId, decisionType, policy.severity, "Decision would increase stress level", context);
        }
        break;

      case "never_repeat_questions":
        if (context.question && Array.isArray(context.asked_questions) && context.asked_questions.includes(context.question)) {
          violation = this.createViolation(policy.id, decisionId, decisionType, policy.severity, "Question already asked in this session", context);
        }
        break;

      case "never_exceed_budget":
        if (context.cost && context.session_budget && context.cost > context.session_budget) {
          violation = this.createViolation(policy.id, decisionId, decisionType, policy.severity, "Decision would exceed budget", context);
        }
        break;

      case "never_spam_notifications":
        if (context.notification_rate && context.max_notification_rate && context.notification_rate > context.max_notification_rate) {
          violation = this.createViolation(policy.id, decisionId, decisionType, policy.severity, "Notification rate too high", context);
        }
        break;

      case "always_explain_score":
        if (!context.score_explanation) {
          violation = this.createViolation(policy.id, decisionId, decisionType, policy.severity, "Score explanation missing", context);
        }
        break;

      case "always_keep_realism":
        if (context.expectation && context.realistic_limit && context.expectation > context.realistic_limit) {
          violation = this.createViolation(policy.id, decisionId, decisionType, policy.severity, "Expectation exceeds realistic limit", context);
        }
        break;

      case "prefer_cheaper_models":
        if (context.model_cost && context.max_model_cost && context.model_cost > context.max_model_cost) {
          warning = "Using expensive model, consider cheaper alternative";
        }
        break;

      case "prefer_cached_response":
        if (context.cache_available && !context.use_cache) {
          warning = "Cache available but not used";
        }
        break;
    }

    return { violation, warning };
  }

  /**
   * Create violation
   */
  private createViolation(policyId: string, decisionId: string, decisionType: string, severity: PolicySeverity, description: string, context: Record<string, unknown>): PolicyViolation {
    return {
      id: `violation_${policyId}_${decisionId}_${Date.now()}`,
      policyId,
      decisionId,
      decisionType,
      severity,
      description,
      detectedAt: new Date(),
      context,
      autoCorrected: false,
      correction: null,
    };
  }

  /**
   * Calculate score
   */
  private calculateScore(violations: PolicyViolation[]): number {
    if (violations.length === 0) return 1;

    const severityWeights = {
      low: 0.1,
      medium: 0.3,
      high: 0.6,
      critical: 1.0,
    };

    const totalWeight = violations.reduce((sum, violation) => sum + severityWeights[violation.severity], 0);
    return Math.max(0, 1 - totalWeight);
  }

  /**
   * Determine if validation passed
   */
  private determineValidationPassed(violations: PolicyViolation[]): boolean {
    for (const violation of violations) {
      if (this.config.blockOnCritical && violation.severity === "critical") return false;
      if (this.config.blockOnHigh && violation.severity === "high") return false;
      if (this.config.blockOnMedium && violation.severity === "medium") return false;
    }

    return true;
  }

  /**
   * Auto-correct violations
   */
  private async autoCorrectViolations(validation: GovernanceValidation): Promise<void> {
    for (const violation of validation.violations) {
      const correction = await this.generateCorrection(violation);
      if (correction) {
        violation.autoCorrected = true;
        violation.correction = correction.reason;
        this.corrections.set(correction.id, correction);
      }
    }
  }

  /**
   * Generate correction
   */
  private async generateCorrection(violation: PolicyViolation): Promise<PolicyCorrection | null> {
    const policy = this.policies.get(violation.policyId);
    if (!policy) return null;

    let correctionType: "modify" | "block" | "replace" | "defer" = "modify";
    let reason = "";

    switch (policy.type) {
      case "never_increase_stress":
        correctionType = "modify";
        reason = "Reduced stress level to current level";
        break;
      case "never_repeat_questions":
        correctionType = "replace";
        reason = "Replaced with alternative question";
        break;
      case "never_exceed_budget":
        correctionType = "defer";
        reason = "Deferred to next session when budget is available";
        break;
      case "never_spam_notifications":
        correctionType = "modify";
        reason = "Reduced notification rate to acceptable level";
        break;
      case "always_explain_score":
        correctionType = "modify";
        reason = "Added score explanation";
        break;
      case "always_keep_realism":
        correctionType = "modify";
        reason = "Adjusted expectation to realistic level";
        break;
      default:
        correctionType = "block";
        reason = "Blocked due to policy violation";
    }

    const correction: PolicyCorrection = {
      id: `correction_${violation.id}_${Date.now()}`,
      violationId: violation.id,
      originalDecision: violation.context,
      correctedDecision: { ...violation.context, corrected: true },
      correctionType,
      reason,
      timestamp: new Date(),
    };

    return correction;
  }

  /**
   * Add policy
   */
  addPolicy(policy: GovernancePolicy): void {
    this.policies.set(policy.id, policy);
  }

  /**
   * Update policy
   */
  updatePolicy(policyId: string, updates: Partial<GovernancePolicy>): void {
    const policy = this.policies.get(policyId);
    if (policy) {
      const updated = { ...policy, ...updates, lastModified: new Date() };
      this.policies.set(policyId, updated);
    }
  }

  /**
   * Remove policy
   */
  removePolicy(policyId: string): void {
    this.policies.delete(policyId);
  }

  /**
   * Enable policy
   */
  enablePolicy(policyId: string): void {
    this.updatePolicy(policyId, { enabled: true });
  }

  /**
   * Disable policy
   */
  disablePolicy(policyId: string): void {
    this.updatePolicy(policyId, { enabled: false });
  }

  /**
   * Get policy
   */
  getPolicy(policyId: string): GovernancePolicy | null {
    return this.policies.get(policyId) || null;
  }

  /**
   * Get policies
   */
  getPolicies(): GovernancePolicy[] {
    return Array.from(this.policies.values());
  }

  /**
   * Get active policies
   */
  getActivePolicies(): GovernancePolicy[] {
    return Array.from(this.policies.values()).filter(policy => policy.enabled);
  }

  /**
   * Get validation
   */
  getValidation(validationId: string): GovernanceValidation | null {
    return this.validations.get(validationId) || null;
  }

  /**
   * Get validations by decision
   */
  getValidationsByDecision(decisionId: string): GovernanceValidation[] {
    return Array.from(this.validations.values()).filter(validation => validation.decisionId === decisionId);
  }

  /**
   * Get violations
   */
  getViolations(): PolicyViolation[] {
    return Array.from(this.violations.values());
  }

  /**
   * Get violations by policy
   */
  getViolationsByPolicy(policyId: string): PolicyViolation[] {
    return Array.from(this.violations.values()).filter(violation => violation.policyId === policyId);
  }

  /**
   * Get corrections
   */
  getCorrections(): PolicyCorrection[] {
    return Array.from(this.corrections.values());
  }

  /**
   * Get metrics
   */
  getMetrics(): GovernanceMetrics {
    const totalPolicies = this.policies.size;
    const activePolicies = Array.from(this.policies.values()).filter(policy => policy.enabled).length;

    const totalValidations = this.validations.size;
    const passedValidations = Array.from(this.validations.values()).filter(validation => validation.passed).length;
    const failedValidations = totalValidations - passedValidations;

    const totalViolations = this.violations.size;

    const violationsBySeverity: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    this.violations.forEach(violation => {
      violationsBySeverity[violation.severity]++;
    });

    const violationsByPolicy: Record<string, number> = {};
    this.violations.forEach(violation => {
      violationsByPolicy[violation.policyId] = (violationsByPolicy[violation.policyId] || 0) + 1;
    });

    const autoCorrectionRate = totalViolations > 0
      ? Array.from(this.violations.values()).filter(v => v.autoCorrected).length / totalViolations
      : 0;

    const averageScore = totalValidations > 0
      ? Array.from(this.validations.values()).reduce((sum, validation) => sum + validation.score, 0) / totalValidations
      : 0;

    return {
      totalPolicies,
      activePolicies,
      totalValidations,
      passedValidations,
      failedValidations,
      totalViolations,
      violationsBySeverity,
      violationsByPolicy,
      autoCorrectionRate,
      averageScore,
    };
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.violations.clear();
    this.validations.clear();
    this.corrections.clear();
  }
}

export const aiGovernanceEngine = AIGovernanceEngine.getInstance();
