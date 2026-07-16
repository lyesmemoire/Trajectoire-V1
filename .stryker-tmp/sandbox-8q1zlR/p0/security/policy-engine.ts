// @ts-nocheck
// --- OPA-style Policy Engine (embedded, no external dependency) ---

export type PolicyDecision = "ALLOW" | "DENY" | "REDACT";

export interface PolicyInput {
  readonly action: string;
  readonly tenantId: string;
  readonly sessionId?: string;
  readonly role: "user" | "admin";
  readonly jwt: {
    readonly tenantId: string;
    readonly did: string;
    readonly role: "user" | "admin";
  };
  readonly resource?: {
    readonly tenantId: string;
    readonly sessionId?: string;
  };
}

export interface PolicyRule {
  readonly name: string;
  readonly description: string;
  evaluate(input: PolicyInput): PolicyDecision;
}

// --- Core Policy Rules ---

/**
 * RULE: Tenant Isolation
 * A request can only access resources belonging to its own tenant.
 */
export const tenantIsolationRule: PolicyRule = {
  name: "tenant_isolation",
  description: "Requests can only access resources within their own tenant boundary",
  evaluate(input: PolicyInput): PolicyDecision {
    if (input.role === "admin") return "ALLOW";
    if (!input.resource) return "ALLOW";
    return input.jwt.tenantId === input.resource.tenantId ? "ALLOW" : "DENY";
  },
};

/**
 * RULE: Session Ownership
 * Only the tenant that created a session can read/write it.
 */
export const sessionOwnershipRule: PolicyRule = {
  name: "session_ownership",
  description: "Sessions can only be accessed by their owning tenant",
  evaluate(input: PolicyInput): PolicyDecision {
    if (input.role === "admin") return "ALLOW";
    if (!input.resource?.sessionId) return "ALLOW";
    return input.jwt.tenantId === input.resource.tenantId ? "ALLOW" : "DENY";
  },
};

/**
 * RULE: P7 Internal Event Protection
 * External callers cannot publish internal P7 events.
 */
export const p7InternalProtectionRule: PolicyRule = {
  name: "p7_internal_protection",
  description: "P7 internal events cannot be published by external callers",
  evaluate(input: PolicyInput): PolicyDecision {
    const internalActions = [
      "evaluation.result",
      "ranking.result",
      "report.generated",
    ];
    if (internalActions.includes(input.action) && input.role !== "admin") {
      return "DENY";
    }
    return "ALLOW";
  },
};

/**
 * RULE: Report Access requires same tenant OR admin
 */
export const reportAccessRule: PolicyRule = {
  name: "report_access",
  description: "Reports can only be accessed by same tenant or admin",
  evaluate(input: PolicyInput): PolicyDecision {
    if (input.action !== "report.read") return "ALLOW";
    if (input.role === "admin") return "ALLOW";
    if (!input.resource) return "DENY";
    return input.jwt.tenantId === input.resource.tenantId ? "ALLOW" : "DENY";
  },
};

// --- Policy Engine ---

export interface PolicyEngine {
  readonly rules: readonly PolicyRule[];
  evaluate(input: PolicyInput): { decision: PolicyDecision; deniedBy?: string };
}

/**
 * Create the default DEDS policy engine with all core rules.
 */
export function createPolicyEngine(
  additionalRules: PolicyRule[] = []
): PolicyEngine {
  const rules: PolicyRule[] = [
    tenantIsolationRule,
    sessionOwnershipRule,
    p7InternalProtectionRule,
    reportAccessRule,
    ...additionalRules,
  ];

  return {
    rules,

    evaluate(input: PolicyInput): { decision: PolicyDecision; deniedBy?: string } {
      for (const rule of rules) {
        const result = rule.evaluate(input);
        if (result === "DENY") {
          return { decision: "DENY", deniedBy: rule.name };
        }
      }
      return { decision: "ALLOW" };
    },
  };
}
