/**
 * Blueprint DSL CPR Governance
 * 
 * Manages governance policies and compliance.
 */

import { ClusterManager } from './cluster-manager';

export interface GovernancePolicy {
  id: string;
  name: string;
  type: GovernancePolicyType;
  rules: GovernanceRule[];
  enabled: boolean;
  priority: number;
}

export enum GovernancePolicyType {
  COMPLIANCE = 'COMPLIANCE',
  AUDIT = 'AUDIT',
  RESOURCE = 'RESOURCE',
  DATA = 'DATA',
  SECURITY = 'SECURITY',
}

export interface GovernanceRule {
  id: string;
  condition: string;
  action: GovernanceAction;
  severity: RuleSeverity;
}

export enum GovernanceAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REVIEW = 'REVIEW',
  ALERT = 'ALERT',
  LOG = 'LOG',
}

export enum RuleSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface GovernanceEvent {
  id: string;
  timestamp: number;
  policyId: string;
  ruleId: string;
  nodeId: string;
  action: GovernanceAction;
  severity: RuleSeverity;
  details: Record<string, unknown>;
}

export class Governance {
  private clusterManager: ClusterManager;
  private policies: Map<string, GovernancePolicy> = new Map();
  private events: GovernanceEvent[] = [];
  private policyCounter: number = 0;
  private eventCounter: number = 0;

  constructor(clusterManager: ClusterManager) {
    this.clusterManager = clusterManager;
    this.initializeDefaultPolicies();
  }

  /**
   * Initialize default governance policies
   */
  private initializeDefaultPolicies(): void {
    this.policies.set('default-compliance', {
      id: 'default-compliance',
      name: 'Default Compliance',
      type: GovernancePolicyType.COMPLIANCE,
      rules: [
        {
          id: 'rule-1',
          condition: 'node.status == "ACTIVE"',
          action: GovernanceAction.APPROVE,
          severity: RuleSeverity.MEDIUM,
        },
      ],
      enabled: true,
      priority: 1,
    });

    this.policies.set('default-audit', {
      id: 'default-audit',
      name: 'Default Audit',
      type: GovernancePolicyType.AUDIT,
      rules: [
        {
          id: 'rule-2',
          condition: 'node.lastHeartbeat < 60000',
          action: GovernanceAction.ALERT,
          severity: RuleSeverity.HIGH,
        },
      ],
      enabled: true,
      priority: 2,
    });
  }

  /**
   * Add governance policy
   */
  public addPolicy(policy: GovernancePolicy): void {
    this.policies.set(policy.id, policy);
  }

  /**
   * Remove governance policy
   */
  public removePolicy(policyId: string): boolean {
    return this.policies.delete(policyId);
  }

  /**
   * Get policy by id
   */
  public getPolicy(policyId: string): GovernancePolicy | null {
    const policy = this.policies.get(policyId);
    return policy ? { ...policy, rules: [...policy.rules] } : null;
  }

  /**
   * Get all policies
   */
  public getAllPolicies(): GovernancePolicy[] {
    return Array.from(this.policies.values()).map(p => ({ ...p, rules: [...p.rules] }));
  }

  /**
   * Get policies by type
   */
  public getPoliciesByType(type: GovernancePolicyType): GovernancePolicy[] {
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
   * Evaluate governance policies
   */
  public evaluate(context: Record<string, unknown>): GovernanceAction[] {
    const results: GovernanceAction[] = [];
    const enabledPolicies = Array.from(this.policies.values())
      .filter(p => p.enabled)
      .sort((a, b) => b.priority - a.priority);

    for (const policy of enabledPolicies) {
      for (const rule of policy.rules) {
        if (this.evaluateCondition(rule.condition, context)) {
          this.logEvent(policy.id, rule.id, context.nodeId || 'system', rule.action, rule.severity);
          results.push(rule.action);
        }
      }
    }

    return results;
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(condition: string, context: Record<string, unknown>): boolean {
    try {
      const func = new Function('context', `return ${condition}`);
      return func(context);
    } catch {
      return false;
    }
  }

  /**
   * Log governance event
   */
  private logEvent(policyId: string, ruleId: string, nodeId: string, action: GovernanceAction, severity: RuleSeverity): void {
    const event: GovernanceEvent = {
      id: `event_${this.eventCounter++}`,
      timestamp: Date.now(),
      policyId,
      ruleId,
      nodeId,
      action,
      severity,
      details: {},
    };

    this.events.push(event);
  }

  /**
   * Get governance events
   */
  public getEvents(): GovernanceEvent[] {
    return [...this.events];
  }

  /**
   * Get events in time range
   */
  public getEventsInRange(start: number, end: number): GovernanceEvent[] {
    return this.events.filter(e => e.timestamp >= start && e.timestamp <= end);
  }

  /**
   * Get events by policy
   */
  public getEventsByPolicy(policyId: string): GovernanceEvent[] {
    return this.events.filter(e => e.policyId === policyId);
  }

  /**
   * Get events by severity
   */
  public getEventsBySeverity(severity: RuleSeverity): GovernanceEvent[] {
    return this.events.filter(e => e.severity === severity);
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
   * Get governance statistics
   */
  public getStatistics(): {
    totalPolicies: number;
    enabledPolicies: number;
    totalEvents: number;
    approveActions: number;
    rejectActions: number;
    reviewActions: number;
    alertActions: number;
    criticalEvents: number;
  } {
    const enabled = Array.from(this.policies.values()).filter(p => p.enabled).length;
    const approve = this.events.filter(e => e.action === GovernanceAction.APPROVE).length;
    const reject = this.events.filter(e => e.action === GovernanceAction.REJECT).length;
    const review = this.events.filter(e => e.action === GovernanceAction.REVIEW).length;
    const alert = this.events.filter(e => e.action === GovernanceAction.ALERT).length;
    const critical = this.events.filter(e => e.severity === RuleSeverity.CRITICAL).length;

    return {
      totalPolicies: this.policies.size,
      enabledPolicies: enabled,
      totalEvents: this.events.length,
      approveActions: approve,
      rejectActions: reject,
      reviewActions: review,
      alertActions: alert,
      criticalEvents: critical,
    };
  }

  /**
   * Validate governance state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [id, policy] of this.policies) {
      if (policy.id !== id) {
        errors.push(`Policy ID mismatch at ${id}`);
      }

      if (policy.priority < 0) {
        errors.push(`Invalid priority in policy ${id}`);
      }

      for (const rule of policy.rules) {
        if (rule.id === '') {
          errors.push(`Invalid rule ID in policy ${id}`);
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

      if (!this.policies.has(event.policyId)) {
        errors.push(`Event ${event.id} references non-existent policy ${event.policyId}`);
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
    const data = JSON.parse(json) as GovernancePolicy[];

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
