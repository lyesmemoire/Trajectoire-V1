/**
 * Blueprint DSL CPR Runtime Kernel
 * 
 * Core runtime kernel for distributed execution.
 */

import { ClusterManager } from './cluster-manager';
import { RuntimeManager } from './runtime-manager';
import { ExecutionCoordinator, ExecutionPlan } from './execution-coordinator';
import { DistributedScheduler } from './distributed-scheduler';
import { ConsensusEngine } from './consensus-engine';
import { LeaderElection } from './leader-election';

export interface KernelState {
  status: KernelStatus;
  term: number;
  leader: string | null;
  startTime: number;
  lastHeartbeat: number;
}

export enum KernelStatus {
  STARTING = 'STARTING',
  RUNNING = 'RUNNING',
  STOPPING = 'STOPPING',
  STOPPED = 'STOPPED',
  ERROR = 'ERROR',
}

export interface KernelConfig {
  nodeId: string;
  heartbeatInterval: number;
  electionTimeout: number;
  maxInstances: number;
}

export class RuntimeKernel {
  private clusterManager: ClusterManager;
  private runtimeManager: RuntimeManager;
  private executionCoordinator: ExecutionCoordinator;
  private distributedScheduler: DistributedScheduler;
  private consensusEngine: ConsensusEngine;
  private leaderElection: LeaderElection;
  private config: KernelConfig;
  private state: KernelState;
  private heartbeatTimer: NodeJS.Timeout | null = null;

  constructor(config: KernelConfig) {
    this.config = config;
    
    this.clusterManager = new ClusterManager(config.nodeId);
    this.runtimeManager = new RuntimeManager(this.clusterManager);
    this.executionCoordinator = new ExecutionCoordinator(this.runtimeManager, this.clusterManager);
    this.distributedScheduler = new DistributedScheduler(this.clusterManager, this.runtimeManager);
    this.consensusEngine = new ConsensusEngine(this.clusterManager, config.nodeId);
    this.leaderElection = new LeaderElection(this.clusterManager, config.nodeId);

    this.state = {
      status: KernelStatus.STARTING,
      term: 0,
      leader: null,
      startTime: Date.now(),
      lastHeartbeat: Date.now(),
    };
  }

  /**
   * Start runtime kernel
   */
  public start(): void {
    this.state.status = KernelStatus.RUNNING;
    this.state.startTime = Date.now();

    // Start cluster manager
    this.clusterManager.startHeartbeat();

    // Start consensus engine
    this.consensusEngine.start();

    // Start leader election
    this.leaderElection.startElection();

    // Start heartbeat timer
    this.startHeartbeatTimer();
  }

  /**
   * Stop runtime kernel
   */
  public stop(): void {
    this.state.status = KernelStatus.STOPPING;

    // Stop heartbeat timer
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    // Stop consensus engine
    this.consensusEngine.stop();

    // Stop leader election
    this.leaderElection.stop();

    // Stop cluster manager
    this.clusterManager.stopHeartbeat();

    this.state.status = KernelStatus.STOPPED;
  }

  /**
   * Start heartbeat timer
   */
  private startHeartbeatTimer(): void {
    if (this.heartbeatTimer) {
      return;
    }

    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
      this.checkLeadership();
    }, this.config.heartbeatInterval);
  }

  /**
   * Send heartbeat
   */
  private sendHeartbeat(): void {
    this.clusterManager.sendHeartbeat(this.config.nodeId);
    this.state.lastHeartbeat = Date.now();
  }

  /**
   * Check leadership
   */
  private checkLeadership(): void {
    if (this.leaderElection.isLeader()) {
      this.state.leader = this.config.nodeId;
    } else {
      this.state.leader = this.leaderElection.getCurrentLeader();
    }
  }

  /**
   * Execute bytecode
   */
  public execute(bytecode: Uint8Array, instanceCount: number = 1): ExecutionPlan {
    const plan = this.executionCoordinator.createPlan(bytecode, instanceCount);
    this.executionCoordinator.executePlan(plan.id);
    return plan;
  }

  /**
   * Get kernel state
   */
  public getState(): KernelState {
    return { ...this.state };
  }

  /**
   * Get kernel status
   */
  public getStatus(): KernelStatus {
    return this.state.status;
  }

  /**
   * Check if kernel is leader
   */
  public isLeader(): boolean {
    return this.leaderElection.isLeader();
  }

  /**
   * Get cluster manager
   */
  public getClusterManager(): ClusterManager {
    return this.clusterManager;
  }

  /**
   * Get runtime manager
   */
  public getRuntimeManager(): RuntimeManager {
    return this.runtimeManager;
  }

  /**
   * Get execution coordinator
   */
  public getExecutionCoordinator(): ExecutionCoordinator {
    return this.executionCoordinator;
  }

  /**
   * Get distributed scheduler
   */
  public getDistributedScheduler(): DistributedScheduler {
    return this.distributedScheduler;
  }

  /**
   * Get consensus engine
   */
  public getConsensusEngine(): ConsensusEngine {
    return this.consensusEngine;
  }

  /**
   * Get leader election
   */
  public getLeaderElection(): LeaderElection {
    return this.leaderElection;
  }

  /**
   * Get kernel statistics
   */
  public getStatistics(): {
    status: KernelStatus;
    term: number;
    leader: string | null;
    uptime: number;
    nodeCount: number;
    instanceCount: number;
    planCount: number;
    taskCount: number;
  } {
    const clusterStats = this.clusterManager.getStatistics();
    const runtimeStats = this.runtimeManager.getStatistics();
    const coordinatorStats = this.executionCoordinator.getStatistics();
    const schedulerStats = this.distributedScheduler.getStatistics();

    return {
      status: this.state.status,
      term: this.state.term,
      leader: this.state.leader,
      uptime: Date.now() - this.state.startTime,
      nodeCount: clusterStats.totalNodes,
      instanceCount: runtimeStats.totalInstances,
      planCount: coordinatorStats.totalPlans,
      taskCount: schedulerStats.totalTasks,
    };
  }

  /**
   * Validate kernel state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const clusterValidation = this.clusterManager.validate();
    errors.push(...clusterValidation.errors);

    const runtimeValidation = this.runtimeManager.validate();
    errors.push(...runtimeValidation.errors);

    const coordinatorValidation = this.executionCoordinator.validate();
    errors.push(...coordinatorValidation.errors);

    const schedulerValidation = this.distributedScheduler.validate();
    errors.push(...schedulerValidation.errors);

    const consensusValidation = this.consensusEngine.validate();
    errors.push(...consensusValidation.errors);

    const electionValidation = this.leaderElection.validate();
    errors.push(...electionValidation.errors);

    if (this.state.startTime < 0) {
      errors.push('Invalid start time');
    }

    if (this.state.lastHeartbeat < 0) {
      errors.push('Invalid last heartbeat');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Update kernel configuration
   */
  public updateConfig(config: Partial<KernelConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get kernel configuration
   */
  public getConfig(): KernelConfig {
    return { ...this.config };
  }
}
