/**
 * Blueprint DSL CPR Execution Coordinator
 * 
 * Coordinates execution across distributed nodes.
 */

import { RuntimeManager, InstanceStatus } from './runtime-manager';
import { ClusterManager } from './cluster-manager';

export interface ExecutionPlan {
  id: string;
  instances: string[];
  dependencies: Map<string, string[]>;
  status: PlanStatus;
  startTime: number;
  endTime?: number;
}

export enum PlanStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface CoordinatorStatistics {
  totalPlans: number;
  runningPlans: number;
  completedPlans: number;
  failedPlans: number;
  averageExecutionTime: number;
}

export class ExecutionCoordinator {
  private runtimeManager: RuntimeManager;
  private clusterManager: ClusterManager;
  private plans: Map<string, ExecutionPlan> = new Map();
  private planCounter: number = 0;

  constructor(runtimeManager: RuntimeManager, clusterManager: ClusterManager) {
    this.runtimeManager = runtimeManager;
    this.clusterManager = clusterManager;
  }

  /**
   * Create execution plan
   */
  public createPlan(bytecode: Uint8Array, instanceCount: number = 1): ExecutionPlan {
    const instances: string[] = [];
    const dependencies = new Map<string, string[]>();

    for (let i = 0; i < instanceCount; i++) {
      const instance = this.runtimeManager.startInstance(bytecode);
      instances.push(instance.id);
      dependencies.set(instance.id, []);
    }

    const plan: ExecutionPlan = {
      id: `plan_${this.planCounter++}`,
      instances,
      dependencies,
      status: PlanStatus.PENDING,
      startTime: Date.now(),
    };

    this.plans.set(plan.id, plan);
    return plan;
  }

  /**
   * Execute plan
   */
  public executePlan(planId: string): void {
    const plan = this.plans.get(planId);

    if (!plan) {
      throw new Error('Plan not found');
    }

    plan.status = PlanStatus.RUNNING;

    for (const instanceId of plan.instances) {
      this.runtimeManager.updateInstanceStatus(instanceId, InstanceStatus.RUNNING);
    }
  }

  /**
   * Get plan by id
   */
  public getPlan(planId: string): ExecutionPlan | null {
    const plan = this.plans.get(planId);
    return plan ? { ...plan, dependencies: new Map(plan.dependencies) } : null;
  }

  /**
   * Get all plans
   */
  public getAllPlans(): ExecutionPlan[] {
    return Array.from(this.plans.values()).map(p => ({
      ...p,
      dependencies: new Map(p.dependencies),
    }));
  }

  /**
   * Get plans by status
   */
  public getPlansByStatus(status: PlanStatus): ExecutionPlan[] {
    return Array.from(this.plans.values())
      .filter(p => p.status === status)
      .map(p => ({ ...p, dependencies: new Map(p.dependencies) }));
  }

  /**
   * Update plan status
   */
  public updatePlanStatus(planId: string, status: PlanStatus): void {
    const plan = this.plans.get(planId);

    if (plan) {
      plan.status = status;

      if (status === PlanStatus.COMPLETED || status === PlanStatus.FAILED || status === PlanStatus.CANCELLED) {
        plan.endTime = Date.now();
      }
    }
  }

  /**
   * Check plan completion
   */
  public checkPlanCompletion(planId: string): boolean {
    const plan = this.plans.get(planId);

    if (!plan) {
      return false;
    }

    const instances = plan.instances.map(id => this.runtimeManager.getInstance(id));
    const allCompleted = instances.every(i => i && (i.status === InstanceStatus.COMPLETED || i.status === InstanceStatus.FAILED));

    if (allCompleted) {
      const hasFailures = instances.some(i => i && i.status === InstanceStatus.FAILED);
      this.updatePlanStatus(planId, hasFailures ? PlanStatus.FAILED : PlanStatus.COMPLETED);
      return true;
    }

    return false;
  }

  /**
   * Cancel plan
   */
  public cancelPlan(planId: string): void {
    const plan = this.plans.get(planId);

    if (plan) {
      plan.status = PlanStatus.CANCELLED;

      for (const instanceId of plan.instances) {
        this.runtimeManager.cancelInstance(instanceId);
      }
    }
  }

  /**
   * Delete plan
   */
  public deletePlan(planId: string): boolean {
    return this.plans.delete(planId);
  }

  /**
   * Add dependency between instances
   */
  public addDependency(planId: string, instanceId: string, dependsOn: string): void {
    const plan = this.plans.get(planId);

    if (plan) {
      const deps = plan.dependencies.get(instanceId) || [];
      deps.push(dependsOn);
      plan.dependencies.set(instanceId, deps);
    }
  }

  /**
   * Check if instance dependencies are satisfied
   */
  public checkDependencies(instanceId: string, planId: string): boolean {
    const plan = this.plans.get(planId);

    if (!plan) {
      return true;
    }

    const dependencies = plan.dependencies.get(instanceId) || [];

    for (const depId of dependencies) {
      const depInstance = this.runtimeManager.getInstance(depId);
      if (!depInstance || depInstance.status !== InstanceStatus.COMPLETED) {
        return false;
      }
    }

    return true;
  }

  /**
   * Clear all plans
   */
  public clearPlans(): void {
    this.plans.clear();
    this.planCounter = 0;
  }

  /**
   * Get coordinator statistics
   */
  public getStatistics(): CoordinatorStatistics {
    const running = this.getPlansByStatus(PlanStatus.RUNNING).length;
    const completed = this.getPlansByStatus(PlanStatus.COMPLETED).length;
    const failed = this.getPlansByStatus(PlanStatus.FAILED).length;

    const completedPlans = this.getPlansByStatus(PlanStatus.COMPLETED);
    const executionTimes = completedPlans
      .filter(p => p.endTime !== undefined)
      .map(p => (p.endTime! - p.startTime));

    const averageExecutionTime = executionTimes.length > 0
      ? executionTimes.reduce((sum, t) => sum + t, 0) / executionTimes.length
      : 0;

    return {
      totalPlans: this.plans.size,
      runningPlans: running,
      completedPlans: completed,
      failedPlans: failed,
      averageExecutionTime,
    };
  }

  /**
   * Validate coordinator state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [id, plan] of this.plans) {
      if (plan.id !== id) {
        errors.push(`Plan ID mismatch at ${id}`);
      }

      for (const instanceId of plan.instances) {
        if (!this.runtimeManager.getInstance(instanceId)) {
          errors.push(`Plan ${id} references non-existent instance ${instanceId}`);
        }
      }

      for (const [instanceId, deps] of plan.dependencies) {
        if (!plan.instances.includes(instanceId)) {
          errors.push(`Plan ${id} has dependency for non-existent instance ${instanceId}`);
        }

        for (const depId of deps) {
          if (!plan.instances.includes(depId)) {
            errors.push(`Plan ${id} has dependency on non-existent instance ${depId}`);
          }
        }
      }

      if (plan.startTime < 0) {
        errors.push(`Invalid start time in plan ${id}`);
      }

      if (plan.endTime !== undefined && plan.endTime < plan.startTime) {
        errors.push(`Invalid end time in plan ${id}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
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
