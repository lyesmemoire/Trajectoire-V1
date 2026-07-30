/**
 * Blueprint DSL CPR Recovery Manager
 * 
 * Manages failure detection and recovery.
 */

import { ClusterManager, NodeStatus } from './cluster-manager';
import { RuntimeManager, InstanceStatus } from './runtime-manager';

export interface RecoveryAction {
  id: string;
  type: RecoveryActionType;
  nodeId: string;
  instanceId?: string;
  timestamp: number;
  status: ActionStatus;
  result?: unknown;
}

export enum RecoveryActionType {
  RESTART_INSTANCE = 'RESTART_INSTANCE',
  MIGRATE_INSTANCE = 'MIGRATE_INSTANCE',
  MARK_NODE_FAILED = 'MARK_NODE_FAILED',
  REMOVE_NODE = 'REMOVE_NODE',
  RESTORE_SNAPSHOT = 'RESTORE_SNAPSHOT',
  ROLLBACK = 'ROLLBACK',
}

export enum ActionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface RecoveryPolicy {
  name: string;
  maxRetries: number;
  retryDelay: number;
  autoRecovery: boolean;
  actions: RecoveryActionType[];
}

export class RecoveryManager {
  private clusterManager: ClusterManager;
  private runtimeManager: RuntimeManager;
  private actions: Map<string, RecoveryAction> = new Map();
  private actionCounter: number = 0;
  private policies: Map<string, RecoveryPolicy> = new Map();

  constructor(clusterManager: ClusterManager, runtimeManager: RuntimeManager) {
    this.clusterManager = clusterManager;
    this.runtimeManager = runtimeManager;
    this.initializePolicies();
  }

  /**
   * Initialize recovery policies
   */
  private initializePolicies(): void {
    this.policies.set('default', {
      name: 'default',
      maxRetries: 3,
      retryDelay: 5000,
      autoRecovery: true,
      actions: [RecoveryActionType.RESTART_INSTANCE, RecoveryActionType.MIGRATE_INSTANCE],
    });

    this.policies.set('aggressive', {
      name: 'aggressive',
      maxRetries: 5,
      retryDelay: 1000,
      autoRecovery: true,
      actions: [RecoveryActionType.RESTART_INSTANCE, RecoveryActionType.MIGRATE_INSTANCE, RecoveryActionType.MARK_NODE_FAILED],
    });

    this.policies.set('conservative', {
      name: 'conservative',
      maxRetries: 1,
      retryDelay: 10000,
      autoRecovery: false,
      actions: [RecoveryActionType.RESTART_INSTANCE],
    });
  }

  /**
   * Handle node failure
   */
  public handleNodeFailure(nodeId: string, policy: string = 'default'): RecoveryAction[] {
    const recoveryPolicy = this.policies.get(policy) || this.policies.get('default');
    
    if (!recoveryPolicy) {
      return [];
    }

    const actions: RecoveryAction[] = [];

    for (const actionType of recoveryPolicy.actions) {
      const action = this.createAction(actionType, nodeId);
      actions.push(action);

      if (recoveryPolicy.autoRecovery) {
        this.executeAction(action.id);
      }
    }

    return actions;
  }

  /**
   * Handle instance failure
   */
  public handleInstanceFailure(instanceId: string, policy: string = 'default'): RecoveryAction[] {
    const instance = this.runtimeManager.getInstance(instanceId);

    if (!instance) {
      return [];
    }

    const recoveryPolicy = this.policies.get(policy) || this.policies.get('default');
    
    if (!recoveryPolicy) {
      return [];
    }

    const actions: RecoveryAction[] = [];

    for (const actionType of recoveryPolicy.actions) {
      const action = this.createAction(actionType, instance.nodeId, instanceId);
      actions.push(action);

      if (recoveryPolicy.autoRecovery) {
        this.executeAction(action.id);
      }
    }

    return actions;
  }

  /**
   * Create recovery action
   */
  private createAction(type: RecoveryActionType, nodeId: string, instanceId?: string): RecoveryAction {
    const action: RecoveryAction = {
      id: `action_${this.actionCounter++}`,
      type,
      nodeId,
      instanceId,
      timestamp: Date.now(),
      status: ActionStatus.PENDING,
    };

    this.actions.set(action.id, action);
    return action;
  }

  /**
   * Execute recovery action
   */
  public executeAction(actionId: string): void {
    const action = this.actions.get(actionId);

    if (!action || action.status !== ActionStatus.PENDING) {
      return;
    }

    action.status = ActionStatus.IN_PROGRESS;

    switch (action.type) {
      case RecoveryActionType.RESTART_INSTANCE:
        this.restartInstance(action);
        break;

      case RecoveryActionType.MIGRATE_INSTANCE:
        this.migrateInstance(action);
        break;

      case RecoveryActionType.MARK_NODE_FAILED:
        this.markNodeFailed(action);
        break;

      case RecoveryActionType.REMOVE_NODE:
        this.removeNode(action);
        break;

      case RecoveryActionType.RESTORE_SNAPSHOT:
        this.restoreSnapshot(action);
        break;

      case RecoveryActionType.ROLLBACK:
        this.rollback(action);
        break;
    }
  }

  /**
   * Restart instance
   */
  private restartInstance(action: RecoveryAction): void {
    if (!action.instanceId) {
      action.status = ActionStatus.FAILED;
      action.result = { error: 'No instance ID' };
      return;
    }

    try {
      this.runtimeManager.updateInstanceStatus(action.instanceId, InstanceStatus.RUNNING);
      action.status = ActionStatus.COMPLETED;
      action.result = { success: true };
    } catch (error) {
      action.status = ActionStatus.FAILED;
      action.result = { error: String(error) };
    }
  }

  /**
   * Migrate instance
   */
  private migrateInstance(action: RecoveryAction): void {
    if (!action.instanceId) {
      action.status = ActionStatus.FAILED;
      action.result = { error: 'No instance ID' };
      return;
    }

    try {
      const instance = this.runtimeManager.getInstance(action.instanceId);
      if (!instance) {
        action.status = ActionStatus.FAILED;
        action.result = { error: 'Instance not found' };
        return;
      }

      // Select new node
      const activeNodes = this.clusterManager.getNodesByStatus(NodeStatus.ACTIVE);
      const availableNodes = activeNodes.filter(n => n.id !== action.nodeId);

      if (availableNodes.length === 0) {
        action.status = ActionStatus.FAILED;
        action.result = { error: 'No available nodes' };
        return;
      }

      const newNode = availableNodes[0];
      // In a real implementation, this would migrate the instance
      action.status = ActionStatus.COMPLETED;
      action.result = { success: true, newNode: newNode.id };
    } catch (error) {
      action.status = ActionStatus.FAILED;
      action.result = { error: String(error) };
    }
  }

  /**
   * Mark node as failed
   */
  private markNodeFailed(action: RecoveryAction): void {
    try {
      this.clusterManager.updateNodeStatus(action.nodeId, NodeStatus.FAILED);
      action.status = ActionStatus.COMPLETED;
      action.result = { success: true };
    } catch (error) {
      action.status = ActionStatus.FAILED;
      action.result = { error: String(error) };
    }
  }

  /**
   * Remove node
   */
  private removeNode(action: RecoveryAction): void {
    try {
      this.clusterManager.removeNode(action.nodeId);
      action.status = ActionStatus.COMPLETED;
      action.result = { success: true };
    } catch (error) {
      action.status = ActionStatus.FAILED;
      action.result = { error: String(error) };
    }
  }

  /**
   * Restore snapshot
   */
  private restoreSnapshot(action: RecoveryAction): void {
    // In a real implementation, this would restore from snapshot
    action.status = ActionStatus.COMPLETED;
    action.result = { success: true };
  }

  /**
   * Rollback
   */
  private rollback(action: RecoveryAction): void {
    // In a real implementation, this would perform rollback
    action.status = ActionStatus.COMPLETED;
    action.result = { success: true };
  }

  /**
   * Get action by id
   */
  public getAction(actionId: string): RecoveryAction | null {
    const action = this.actions.get(actionId);
    return action ? { ...action } : null;
  }

  /**
   * Get all actions
   */
  public getAllActions(): RecoveryAction[] {
    return Array.from(this.actions.values()).map(a => ({ ...a }));
  }

  /**
   * Get actions by node
   */
  public getActionsByNode(nodeId: string): RecoveryAction[] {
    return Array.from(this.actions.values())
      .filter(a => a.nodeId === nodeId)
      .map(a => ({ ...a }));
  }

  /**
   * Get actions by status
   */
  public getActionsByStatus(status: ActionStatus): RecoveryAction[] {
    return Array.from(this.actions.values())
      .filter(a => a.status === status)
      .map(a => ({ ...a }));
  }

  /**
   * Add recovery policy
   */
  public addPolicy(policy: RecoveryPolicy): void {
    this.policies.set(policy.name, policy);
  }

  /**
   * Get recovery policy
   */
  public getPolicy(name: string): RecoveryPolicy | null {
    return this.policies.get(name) || null;
  }

  /**
   * Get all policies
   */
  public getAllPolicies(): RecoveryPolicy[] {
    return Array.from(this.policies.values());
  }

  /**
   * Clear all actions
   */
  public clearActions(): void {
    this.actions.clear();
    this.actionCounter = 0;
  }

  /**
   * Get recovery statistics
   */
  public getStatistics(): {
    totalActions: number;
    pendingActions: number;
    inProgressActions: number;
    completedActions: number;
    failedActions: number;
    successRate: number;
  } {
    const pending = this.getActionsByStatus(ActionStatus.PENDING).length;
    const inProgress = this.getActionsByStatus(ActionStatus.IN_PROGRESS).length;
    const completed = this.getActionsByStatus(ActionStatus.COMPLETED).length;
    const failed = this.getActionsByStatus(ActionStatus.FAILED).length;
    const successRate = (completed + failed) > 0 ? completed / (completed + failed) : 0;

    return {
      totalActions: this.actions.size,
      pendingActions: pending,
      inProgressActions: inProgress,
      completedActions: completed,
      failedActions: failed,
      successRate,
    };
  }

  /**
   * Validate recovery manager state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [id, action] of this.actions) {
      if (action.id !== id) {
        errors.push(`Action ID mismatch at ${id}`);
      }

      if (!this.clusterManager.getNode(action.nodeId)) {
        errors.push(`Action ${id} references non-existent node ${action.nodeId}`);
      }

      if (action.instanceId && !this.runtimeManager.getInstance(action.instanceId)) {
        errors.push(`Action ${id} references non-existent instance ${action.instanceId}`);
      }

      if (action.timestamp < 0) {
        errors.push(`Invalid timestamp in action ${id}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Set cluster manager
   */
  public setClusterManager(clusterManager: ClusterManager): void {
    this.clusterManager = clusterManager;
  }

  /**
   * Set runtime manager
   */
  public setRuntimeManager(runtimeManager: RuntimeManager): void {
    this.runtimeManager = runtimeManager;
  }
}
