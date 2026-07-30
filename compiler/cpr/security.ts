/**
 * Blueprint DSL CPR Security
 * 
 * Manages security policies and access control.
 */

import { ClusterManager } from './cluster-manager';

export interface SecurityPolicy {
  id: string;
  name: string;
  type: SecurityPolicyType;
  rules: SecurityRule[];
  enabled: boolean;
}

export enum SecurityPolicyType {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  ENCRYPTION = 'ENCRYPTION',
  AUDIT = 'AUDIT',
  NETWORK = 'NETWORK',
}

export interface SecurityRule {
  id: string;
  condition: string;
  action: SecurityAction;
  priority: number;
}

export enum SecurityAction {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
  LOG = 'LOG',
  ALERT = 'ALERT',
}

export interface SecurityEvent {
  id: string;
  timestamp: number;
  type: SecurityEventType;
  nodeId: string;
  userId?: string;
  resource?: string;
  action: string;
  result: SecurityResult;
  details: Record<string, unknown>;
}

export enum SecurityEventType {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  ACCESS_DENIED = 'ACCESS_DENIED',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  ENCRYPTION_FAILURE = 'ENCRYPTION_FAILURE',
}

export enum SecurityResult {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  WARNING = 'WARNING',
}

export class Security {
  private clusterManager: ClusterManager;
  private policies: Map<string, SecurityPolicy> = new Map();
  private events: SecurityEvent[] = [];
  private policyCounter: number = 0;
  private eventCounter: number = 0;

  constructor(clusterManager: ClusterManager) {
    this.clusterManager = clusterManager;
    this.initializeDefaultPolicies();
  }

  /**
   * Initialize default security policies
   */
  private initializeDefaultPolicies(): void {
    this.policies.set('default-auth', {
      id: 'default-auth',
      name: 'Default Authentication',
      type: SecurityPolicyType.AUTHENTICATION,
      rules: [
        {
          id: 'rule-1',
          condition: 'authenticated == true',
          action: SecurityAction.ALLOW,
          priority: 1,
        },
      ],
      enabled: true,
    });

    this.policies.set('default-authz', {
      id: 'default-authz',
      name: 'Default Authorization',
      type: SecurityPolicyType.AUTHORIZATION,
      rules: [
        {
          id: 'rule-2',
          condition: 'role == "admin"',
          action: SecurityAction.ALLOW,
          priority: 1,
        },
      ],
      enabled: true,
    });
  }

  /**
   * Add security policy
   */
  public addPolicy(policy: SecurityPolicy): void {
    this.policies.set(policy.id, policy);
  }

  /**
   * Remove security policy
   */
  public removePolicy(policyId: string): boolean {
    return this.policies.delete(policyId);
  }

  /**
   * Get policy by id
   */
  public getPolicy(policyId: string): SecurityPolicy | null {
    const policy = this.policies.get(policyId);
    return policy ? { ...policy, rules: [...policy.rules] } : null;
  }

  /**
   * Get all policies
   */
  public getAllPolicies(): SecurityPolicy[] {
    return Array.from(this.policies.values()).map(p => ({ ...p, rules: [...p.rules] }));
  }

  /**
   * Get policies by type
   */
  public getPoliciesByType(type: SecurityPolicyType): SecurityPolicy[] {
    return Array.from(this.policies.values())
      .filter(p => p.type === type)
      .map(p => ({ ...p, rules: [...p.rules] }));
  }

  /**
   * Enable policy
   */
  public enablePolicy(policyId: string): void {
    const policy = this.policies.get(policyId);
    if (policy) {
      policy.enabled = true;
    }
  }

  /**
   * Disable policy
   */
  public disablePolicy(policyId: string): void {
    const policy = this.policies.get(policyId);
    if (policy) {
      policy.enabled = false;
    }
  }

  /**
   * Evaluate security policies
   */
  public evaluate(context: Record<string, unknown>): SecurityAction {
    const enabledPolicies = Array.from(this.policies.values()).filter(p => p.enabled);

    for (const policy of enabledPolicies) {
      for (const rule of policy.rules.sort((a, b) => b.priority - a.priority)) {
        if (this.evaluateCondition(rule.condition, context)) {
          this.logEvent(SecurityEventType.AUTHORIZATION, context.nodeId || 'system', context.userId, context.resource, rule.action);
          return rule.action;
        }
      }
    }

    return SecurityAction.DENY;
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(condition: string, context: Record<string, unknown>): boolean {
    // Simple condition evaluation
    // In a real implementation, this would use a proper expression parser
    try {
      const func = new Function('context', `return ${condition}`);
      return func(context);
    } catch {
      return false;
    }
  }

  /**
   * Log security event
   */
  private logEvent(type: SecurityEventType, nodeId: string, userId?: string, resource?: string, action: string = '', result: SecurityResult = SecurityResult.SUCCESS): void {
    const event: SecurityEvent = {
      id: `event_${this.eventCounter++}`,
      timestamp: Date.now(),
      type,
      nodeId,
      userId,
      resource,
      action,
      result,
      details: {},
    };

    this.events.push(event);
  }

  /**
   * Get security events
   */
  public getEvents(): SecurityEvent[] {
    return [...this.events];
  }

  /**
   * Get events in time range
   */
  public getEventsInRange(start: number, end: number): SecurityEvent[] {
    return this.events.filter(e => e.timestamp >= start && e.timestamp <= end);
  }

  /**
   * Get events by type
   */
  public getEventsByType(type: SecurityEventType): SecurityEvent[] {
    return this.events.filter(e => e.type === type);
  }

  /**
   * Get events by node
   */
  public getEventsByNode(nodeId: string): SecurityEvent[] {
    return this.events.filter(e => e.nodeId === nodeId);
  }

  /**
   * Get events by user
   */
  public getEventsByUser(userId: string): SecurityEvent[] {
    return this.events.filter(e => e.userId === userId);
  }

  /**
   * Clear events
   */
  public clearEvents(): void {
    this.events = [];
    this.eventCounter = 0;
  }

  /**
   * Clear all policies
   */
  public clearPolicies(): void {
    this.policies.clear();
    this.policyCounter = 0;
  }

  /**
   * Get security statistics
   */
  public getStatistics(): {
    totalPolicies: number;
    enabledPolicies: number;
    totalEvents: number;
    authenticationEvents: number;
    authorizationEvents: number;
    accessDeniedEvents: number;
    policyViolations: number;
  } {
    const enabled = Array.from(this.policies.values()).filter(p => p.enabled).length;
    const authEvents = this.getEventsByType(SecurityEventType.AUTHENTICATION).length;
    const authzEvents = this.getEventsByType(SecurityEventType.AUTHORIZATION).length;
    const deniedEvents = this.getEventsByType(SecurityEventType.ACCESS_DENIED).length;
    const violations = this.getEventsByType(SecurityEventType.POLICY_VIOLATION).length;

    return {
      totalPolicies: this.policies.size,
      enabledPolicies: enabled,
      totalEvents: this.events.length,
      authenticationEvents: authEvents,
      authorizationEvents: authzEvents,
      accessDeniedEvents: deniedEvents,
      policyViolations: violations,
    };
  }

  /**
   * Validate security state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [id, policy] of this.policies) {
      if (policy.id !== id) {
        errors.push(`Policy ID mismatch at ${id}`);
      }

      for (const rule of policy.rules) {
        if (rule.priority < 0) {
          errors.push(`Invalid priority in rule ${rule.id}`);
        }
      }
    }

    for (const event of this.events) {
      if (event.timestamp < 0) {
        errors.push(`Invalid timestamp in event ${event.id}`);
      }

      if (!this.clusterManager.getNode(event.nodeId)) {
        errors.push(`Event ${event.id} references non-existent node ${event.nodeId}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Export policies to JSON
   */
  public exportPolicies(): string {
    const data = Array.from(this.policies.values());
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import policies from JSON
   */
  public importPolicies(json: string): void {
    const data = JSON.parse(json) as SecurityPolicy[];

    for (const policy of data) {
      this.policies.set(policy.id, { ...policy, rules: [...policy.rules] });
    }
  }

  /**
   * Set cluster manager
   */
  public setClusterManager(clusterManager: ClusterManager): void {
    this.clusterManager = clusterManager;
  }

  /**
   * Get cluster manager
   */
  public getClusterManager(): ClusterManager {
    return this.clusterManager;
  }
}
