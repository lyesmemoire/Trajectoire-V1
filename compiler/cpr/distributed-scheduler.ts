/**
 * Blueprint DSL CPR Distributed Scheduler
 * 
 * Schedules tasks across distributed nodes.
 */

import { ClusterManager, Node, NodeStatus } from './cluster-manager';
import { RuntimeManager, InstanceStatus } from './runtime-manager';

export interface ScheduledTask {
  id: string;
  instanceId: string;
  nodeId: string;
  priority: number;
  status: TaskStatus;
  scheduledTime: number;
  startTime?: number;
  endTime?: number;
}

export enum TaskStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface SchedulingPolicy {
  name: string;
  selectNode: (nodes: Node[], task: ScheduledTask) => Node | null;
}

export class DistributedScheduler {
  private clusterManager: ClusterManager;
  private runtimeManager: RuntimeManager;
  private tasks: Map<string, ScheduledTask> = new Map();
  private taskCounter: number = 0;
  private policies: Map<string, SchedulingPolicy> = new Map();

  constructor(clusterManager: ClusterManager, runtimeManager: RuntimeManager) {
    this.clusterManager = clusterManager;
    this.runtimeManager = runtimeManager;
    this.initializePolicies();
  }

  /**
   * Initialize scheduling policies
   */
  private initializePolicies(): void {
    // Round-robin policy
    this.policies.set('round-robin', {
      name: 'round-robin',
      selectNode: (nodes, task) => {
        if (nodes.length === 0) return null;
        const index = this.taskCounter % nodes.length;
        return nodes[index];
      },
    });

    // Load-based policy
    this.policies.set('load-based', {
      name: 'load-based',
      selectNode: (nodes, task) => {
        if (nodes.length === 0) return null;
        // Select node with fewest running instances
        const nodeLoads = nodes.map(node => ({
          node,
          load: this.runtimeManager.getInstancesByNode(node.id).filter(i => i.status === InstanceStatus.RUNNING).length,
        }));
        nodeLoads.sort((a, b) => a.load - b.load);
        return nodeLoads[0].node;
      },
    });

    // Priority-based policy
    this.policies.set('priority', {
      name: 'priority',
      selectNode: (nodes, task) => {
        if (nodes.length === 0) return null;
        // Select best node for high priority tasks
        if (task.priority > 5) {
          return nodes[0]; // Assume first node is best
        }
        return nodes[nodes.length - 1];
      },
    });
  }

  /**
   * Schedule task
   */
  public schedule(instanceId: string, policy: string = 'round-robin', priority: number = 0): ScheduledTask {
    const instance = this.runtimeManager.getInstance(instanceId);

    if (!instance) {
      throw new Error('Instance not found');
    }

    const activeNodes = this.clusterManager.getNodesByStatus(NodeStatus.ACTIVE);

    if (activeNodes.length === 0) {
      throw new Error('No available nodes');
    }

    const schedulingPolicy = this.policies.get(policy) || this.policies.get('round-robin');
    
    if (!schedulingPolicy) {
      throw new Error('No scheduling policy available');
    }

    const selectedNode = schedulingPolicy.selectNode(activeNodes, {
      id: '',
      instanceId,
      nodeId: '',
      priority,
      status: TaskStatus.PENDING,
      scheduledTime: Date.now(),
    });

    if (!selectedNode) {
      throw new Error('No node selected by policy');
    }

    const task: ScheduledTask = {
      id: `task_${this.taskCounter++}`,
      instanceId,
      nodeId: selectedNode.id,
      priority,
      status: TaskStatus.SCHEDULED,
      scheduledTime: Date.now(),
    };

    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * Get task by id
   */
  public getTask(taskId: string): ScheduledTask | null {
    const task = this.tasks.get(taskId);
    return task ? { ...task } : null;
  }

  /**
   * Get all tasks
   */
  public getAllTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values()).map(t => ({ ...t }));
  }

  /**
   * Get tasks by node
   */
  public getTasksByNode(nodeId: string): ScheduledTask[] {
    return Array.from(this.tasks.values())
      .filter(t => t.nodeId === nodeId)
      .map(t => ({ ...t }));
  }

  /**
   * Get tasks by status
   */
  public getTasksByStatus(status: TaskStatus): ScheduledTask[] {
    return Array.from(this.tasks.values())
      .filter(t => t.status === status)
      .map(t => ({ ...t }));
  }

  /**
   * Update task status
   */
  public updateTaskStatus(taskId: string, status: TaskStatus): void {
    const task = this.tasks.get(taskId);

    if (task) {
      task.status = status;

      if (status === TaskStatus.RUNNING) {
        task.startTime = Date.now();
      }

      if (status === TaskStatus.COMPLETED || status === TaskStatus.FAILED || status === TaskStatus.CANCELLED) {
        task.endTime = Date.now();
      }
    }
  }

  /**
   * Cancel task
   */
  public cancelTask(taskId: string): void {
    this.updateTaskStatus(taskId, TaskStatus.CANCELLED);
  }

  /**
   * Delete task
   */
  public deleteTask(taskId: string): boolean {
    return this.tasks.delete(taskId);
  }

  /**
   * Add scheduling policy
   */
  public addPolicy(name: string, policy: SchedulingPolicy): void {
    this.policies.set(name, policy);
  }

  /**
   * Remove scheduling policy
   */
  public removePolicy(name: string): boolean {
    return this.policies.delete(name);
  }

  /**
   * Get scheduling policy
   */
  public getPolicy(name: string): SchedulingPolicy | null {
    return this.policies.get(name) || null;
  }

  /**
   * Get all policies
   */
  public getAllPolicies(): SchedulingPolicy[] {
    return Array.from(this.policies.values());
  }

  /**
   * Clear all tasks
   */
  public clearTasks(): void {
    this.tasks.clear();
    this.taskCounter = 0;
  }

  /**
   * Get scheduler statistics
   */
  public getStatistics(): {
    totalTasks: number;
    pendingTasks: number;
    scheduledTasks: number;
    runningTasks: number;
    completedTasks: number;
    failedTasks: number;
    averageExecutionTime: number;
  } {
    const pending = this.getTasksByStatus(TaskStatus.PENDING).length;
    const scheduled = this.getTasksByStatus(TaskStatus.SCHEDULED).length;
    const running = this.getTasksByStatus(TaskStatus.RUNNING).length;
    const completed = this.getTasksByStatus(TaskStatus.COMPLETED).length;
    const failed = this.getTasksByStatus(TaskStatus.FAILED).length;

    const completedTasks = this.getTasksByStatus(TaskStatus.COMPLETED);
    const executionTimes = completedTasks
      .filter(t => t.startTime !== undefined && t.endTime !== undefined)
      .map(t => (t.endTime! - t.startTime!));

    const averageExecutionTime = executionTimes.length > 0
      ? executionTimes.reduce((sum, t) => sum + t, 0) / executionTimes.length
      : 0;

    return {
      totalTasks: this.tasks.size,
      pendingTasks: pending,
      scheduledTasks: scheduled,
      runningTasks: running,
      completedTasks: completed,
      failedTasks: failed,
      averageExecutionTime,
    };
  }

  /**
   * Validate scheduler state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [id, task] of this.tasks) {
      if (task.id !== id) {
        errors.push(`Task ID mismatch at ${id}`);
      }

      if (!this.clusterManager.getNode(task.nodeId)) {
        errors.push(`Task ${id} references non-existent node ${task.nodeId}`);
      }

      if (!this.runtimeManager.getInstance(task.instanceId)) {
        errors.push(`Task ${id} references non-existent instance ${task.instanceId}`);
      }

      if (task.scheduledTime < 0) {
        errors.push(`Invalid scheduled time in task ${id}`);
      }

      if (task.startTime !== undefined && task.startTime < task.scheduledTime) {
        errors.push(`Invalid start time in task ${id}`);
      }

      if (task.endTime !== undefined && task.startTime !== undefined && task.endTime < task.startTime) {
        errors.push(`Invalid end time in task ${id}`);
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

  /**
   * Get runtime manager
   */
  public getRuntimeManager(): RuntimeManager {
    return this.runtimeManager;
  }

  /**
   * Set runtime manager
   */
  public setRuntimeManager(runtimeManager: RuntimeManager): void {
    this.runtimeManager = runtimeManager;
  }
}
