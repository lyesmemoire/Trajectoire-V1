// @ts-nocheck
export interface AuthorizationService {
  authorize(action: string, resource: string, context?: AuthorizationContext): Promise<boolean>;
}

export interface AuthorizationContext {
  userId: string;
  role: string;
  attributes?: Record<string, unknown>;
}

export interface AuthorizationPolicy {
  evaluate(action: string, resource: string, context: AuthorizationContext): boolean;
}

/**
 * Default implementation using a list of policies.
 * Supports RBAC and ABAC by composing policies.
 */
export class PolicyBasedAuthorizationService implements AuthorizationService {
  private policies: AuthorizationPolicy[] = [];

  addPolicy(policy: AuthorizationPolicy): void {
    this.policies.push(policy);
  }

  async authorize(action: string, resource: string, context?: AuthorizationContext): Promise<boolean> {
    if (!context) return false;

    // All policies must pass (AND semantics).
    // Switch to OR if you need "any policy grants access".
    for (const policy of this.policies) {
      if (!policy.evaluate(action, resource, context)) {
        return false;
      }
    }

    return this.policies.length > 0;
  }
}

/**
 * Simple role-based policy.
 * Maps roles to allowed actions on resources.
 */
export class RoleBasedPolicy implements AuthorizationPolicy {
  private rules = new Map<string, Set<string>>();

  /**
   * @param role - e.g. "ADMIN_FOUNDER"
   * @param actionPattern - e.g. "billing:*" or "users:read"
   */
  allow(role: string, actionPattern: string): this {
    if (!this.rules.has(role)) {
      this.rules.set(role, new Set());
    }
    this.rules.get(role)!.add(actionPattern);
    return this;
  }

  evaluate(action: string, _resource: string, context: AuthorizationContext): boolean {
    const allowed = this.rules.get(context.role);
    if (!allowed) return false;

    for (const pattern of allowed) {
      if (pattern === "*") return true;
      if (pattern === action) return true;
      // Wildcard: "billing:*" matches "billing:read", "billing:write", etc.
      if (pattern.endsWith(":*")) {
        const prefix = pattern.slice(0, -1);
        if (action.startsWith(prefix)) return true;
      }
    }

    return false;
  }
}
