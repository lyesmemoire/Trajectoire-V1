/**
 * Blueprint DSL CPR Runtime Manager
 * 
 * Manages runtime execution across the cluster.
 */

import { ClusterManager, NodeStatus } from './cluster-manager';

export interface RuntimeInstance {
  id: string;
  nodeId: string;
  status: InstanceStatus;
  bytecode: Uint8Array;
  startTime: number;
  endTime?: number;
  metadata: Record<string, unknown>;
}

export enum InstanceStatus {
  STARTING = 'STARTING',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface RuntimeStatistics {
  totalInstances: number;
  runningInstances: number;
  completedInstances: number;
  failedInstances: number;
  averageExecutionTime: number;
}

export class RuntimeManager {
  private clusterManager: ClusterManager;
  private instances: Map<string, RuntimeInstance> = new Map();
  private instanceCounter: number = 0;

  constructor(clusterManager: ClusterManager) {
    this.clusterManager = clusterManager;
  }

  /**
   * Start runtime instance
   */
  public startInstance(bytecode: Uint8Array, nodeId?: string, metadata: Record<string, unknown> = {}): RuntimeInstance {
    const targetNode = nodeId || this.selectNode();

    if (!targetNode) {
      throw new Error('No available node');
    }

    const instance: RuntimeInstance = {
      id: `instance_${this.instanceCounter++}`,
      nodeId: targetNode,
      status: InstanceStatus.STARTING,
      bytecode,
      startTime: Date.now(),
      metadata,
    };

    this.instances.set(instance.id, instance);
    return instance;
  }

  /**
   * Select node for instance
   */
  private selectNode(): string | null {
    const activeNodes = this.clusterManager.getNodesByStatus(NodeStatus.ACTIVE);

    if (activeNodes.length === 0) {
      return null;
    }

    // Simple round-robin selection
    const instanceCount = this.instances.size;
    const selectedNode = activeNodes[instanceCount % activeNodes.length];

    return selectedNode.id;
  }

  /**
   * Get instance by id
   */
  public getInstance(id: string): RuntimeInstance | null {
    const instance = this.instances.get(id);
    return instance ? { ...instance } : null;
  }

  /**
   * Get all instances
   */
  public getAllInstances(): RuntimeInstance[] {
    return Array.from(this.instances.values()).map(i => ({ ...i }));
  }

  /**
   * Get instances by node
   */
  public getInstancesByNode(nodeId: string): RuntimeInstance[] {
    return Array.from(this.instances.values())
      .filter(i => i.nodeId === nodeId)
      .map(i => ({ ...i }));
  }

  /**
   * Get instances by status
   */
  public getInstancesByStatus(status: InstanceStatus): RuntimeInstance[] {
    return Array.from(this.instances.values())
      .filter(i => i.status === status)
      .map(i => ({ ...i }));
  }

  /**
   * Update instance status
   */
  public updateInstanceStatus(id: string, status: InstanceStatus): void {
    const instance = this.instances.get(id);

    if (instance) {
      instance.status = status;

      if (status === InstanceStatus.COMPLETED || status === InstanceStatus.FAILED || status === InstanceStatus.CANCELLED) {
        instance.endTime = Date.now();
      }
    }
  }

  /**
   * Pause instance
   */
  public pauseInstance(id: string): void {
    this.updateInstanceStatus(id, InstanceStatus.PAUSED);
  }

  /**
   * Resume instance
   */
  public resumeInstance(id: string): void {
    this.updateInstanceStatus(id, InstanceStatus.RUNNING);
  }

  /**
   * Cancel instance
   */
  public cancelInstance(id: string): void {
    this.updateInstanceStatus(id, InstanceStatus.CANCELLED);
  }

  /**
   * Delete instance
   */
  public deleteInstance(id: string): boolean {
    return this.instances.delete(id);
  }

  /**
   * Clear all instances
   */
  public clearInstances(): void {
    this.instances.clear();
    this.instanceCounter = 0;
  }

  /**
   * Get runtime statistics
   */
  public getStatistics(): RuntimeStatistics {
    const running = this.getInstancesByStatus(InstanceStatus.RUNNING).length;
    const completed = this.getInstancesByStatus(InstanceStatus.COMPLETED).length;
    const failed = this.getInstancesByStatus(InstanceStatus.FAILED).length;

    const completedInstances = this.getInstancesByStatus(InstanceStatus.COMPLETED);
    const executionTimes = completedInstances
      .filter(i => i.endTime !== undefined)
      .map(i => (i.endTime! - i.startTime));

    const averageExecutionTime = executionTimes.length > 0
      ? executionTimes.reduce((sum, t) => sum + t, 0) / executionTimes.length
      : 0;

    return {
      totalInstances: this.instances.size,
      runningInstances: running,
      completedInstances: completed,
      failedInstances: failed,
      averageExecutionTime,
    };
  }

  /**
   * Validate runtime state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [id, instance] of this.instances) {
      if (instance.id !== id) {
        errors.push(`Instance ID mismatch at ${id}`);
      }

      if (!this.clusterManager.getNode(instance.nodeId)) {
        errors.push(`Instance ${id} references non-existent node ${instance.nodeId}`);
      }

      if (instance.startTime < 0) {
        errors.push(`Invalid start time in instance ${id}`);
      }

      if (instance.endTime !== undefined && instance.endTime < instance.startTime) {
        errors.push(`Invalid end time in instance ${id}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get cluster manager
   */
  public getClusterManager(): ClusterManager {
    return this.clusterManager;
  }

  /**
   * Set cluster manager
   */
  public setClusterManager(clusterManager: ClusterManager): void {
    this.clusterManager = clusterManager;
  }
}
