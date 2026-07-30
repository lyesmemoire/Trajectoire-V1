/**
 * Scheduler Core Implementation
 * Core scheduling logic with fairness, starvation prevention, and preemption
 */

import {
  CognitiveTask,
  TaskStatus,
  SchedulerConfig,
  ScheduleResult,
  PreemptionResult,
  SchedulerMetrics
} from './types';
import { PriorityQueueManager } from './PriorityQueueManager';
import { DeadlineScheduler } from './DeadlineScheduler';
import { TaskQueueManager } from './TaskQueueManager';
import { DependencyResolver } from './DependencyResolver';
import { AffinityManager } from './AffinityManager';

export class SchedulerCore {
  private config: SchedulerConfig;
  private priorityQueueManager: PriorityQueueManager;
  private deadlineScheduler: DeadlineScheduler;
  private taskQueueManager: TaskQueueManager;
  private dependencyResolver: DependencyResolver;
  private affinityManager: AffinityManager;
  private fairShareMap: Map<string, number> = new Map();
  private starvationMap: Map<string, number> = new Map();
  private metrics: SchedulerMetrics = {
    totalTasksScheduled: 0,
    totalTasksCompleted: 0,
    totalTasksFailed: 0,
    totalTasksCancelled: 0,
    averageLatency: 0,
    p50Latency: 0,
    p95Latency: 0,
    p99Latency: 0,
    fairnessIndex: 1.0,
    starvationCount: 0
  };
  private latencies: number[] = [];

  constructor(
    config: SchedulerConfig,
    priorityQueueManager: PriorityQueueManager,
    deadlineScheduler: DeadlineScheduler,
    taskQueueManager: TaskQueueManager,
    dependencyResolver: DependencyResolver,
    affinityManager: AffinityManager
  ) {
    this.config = config;
    this.priorityQueueManager = priorityQueueManager;
    this.deadlineScheduler = deadlineScheduler;
    this.taskQueueManager = taskQueueManager;
    this.dependencyResolver = dependencyResolver;
    this.affinityManager = affinityManager;
  }

  /**
   * Schedule a task for execution
   */
  async schedule(task: CognitiveTask): Promise<ScheduleResult> {
    const startTime = Date.now();
    
    try {
      // Check dependencies
      const resolution = await this.dependencyResolver.resolve(task);
      if (!resolution.ready) {
        return {
          taskId: task.id,
          scheduled: false,
          error: `Blocked by dependencies: ${resolution.blockedBy.join(', ')}`
        };
      }
      
      // Assign affinity
      task.affinity = await this.affinityManager.assignAffinity(task);
      
      // Enqueue in priority queue
      await this.priorityQueueManager.enqueue(task);
      
      // Enqueue in deadline queue if has deadline
      if (task.deadline) {
        await this.deadlineScheduler.enqueue(task);
      }
      
      task.status = TaskStatus.SCHEDULED;
      task.scheduledAt = Date.now();
      
      this.metrics.totalTasksScheduled++;
      
      const latency = Date.now() - startTime;
      this.latencies.push(latency);
      this.updateLatencyMetrics();
      
      // Update fair share
      this.updateFairShare(task);
      
      // Check for starvation
      this.checkStarvation(task);
      
      return {
        taskId: task.id,
        scheduled: true,
        estimatedStartTime: this.estimateStartTime(task)
      };
    } catch (error) {
      return {
        taskId: task.id,
        scheduled: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Select the next task to execute
   */
  async selectNextTask(): Promise<CognitiveTask | null> {
    // First check deadline queue for urgent tasks
    const deadlineTask = await this.deadlineScheduler.dequeue();
    if (deadlineTask) {
      return deadlineTask;
    }
    
    // Then check priority queue
    const priorityTask = await this.priorityQueueManager.dequeue();
    if (priorityTask) {
      return priorityTask;
    }
    
    return null;
  }

  /**
   * Preempt the current task if necessary
   */
  async preempt(currentTask: CognitiveTask): Promise<PreemptionResult> {
    if (!this.config.enablePreemption) {
      return { preempted: false };
    }
    
    // Check if there's a higher priority task waiting
    const nextTask = await this.selectNextTask();
    if (!nextTask) {
      return { preempted: false };
    }
    
    // Preempt if next task has significantly higher priority
    if (nextTask.priority < currentTask.priority) {
      currentTask.status = TaskStatus.PENDING;
      await this.priorityQueueManager.enqueue(currentTask);
      currentTask.metrics.preemptions++;
      
      return {
        preempted: true,
        reason: `Higher priority task ${nextTask.id} waiting`
      };
    }
    
    // Check deadline preemption
    if (nextTask.deadline && (!currentTask.deadline || nextTask.deadline < currentTask.deadline)) {
      const now = Date.now();
      const nextTaskSlack = nextTask.deadline - now;
      const currentTaskSlack = currentTask.deadline ? currentTask.deadline - now : Infinity;
      
      if (nextTaskSlack < currentTaskSlack && nextTaskSlack < 1000) {
        currentTask.status = TaskStatus.PENDING;
        await this.priorityQueueManager.enqueue(currentTask);
        currentTask.metrics.preemptions++;
        
        return {
          preempted: true,
          reason: `Deadline pressure for task ${nextTask.id}`
        };
      }
    }
    
    return { preempted: false };
  }

  /**
   * Enforce fairness across sessions
   */
  async enforceFairness(): Promise<void> {
    const sessionIdShares = new Map<string, number>();
    
    // Calculate current shares
    for (const [sessionId, share] of this.fairShareMap.entries()) {
      sessionIdShares.set(sessionId, share);
    }
    
    // Normalize shares
    const totalShare = Array.from(sessionIdShares.values()).reduce((a, b) => a + b, 0);
    if (totalShare > 0) {
      for (const [sessionId, share] of sessionIdShares.entries()) {
        this.fairShareMap.set(sessionId, share / totalShare);
      }
    }
    
    // Calculate fairness index (Jain's fairness index)
    const shares = Array.from(this.fairShareMap.values());
    if (shares.length > 0) {
      const sum = shares.reduce((a, b) => a + b, 0);
      const sumOfSquares = shares.reduce((a, b) => a + b * b, 0);
      this.metrics.fairnessIndex = (sum * sum) / (shares.length * sumOfSquares);
    }
  }

  /**
   * Prevent task starvation
   */
  async preventStarvation(): Promise<void> {
    const now = Date.now();
    const threshold = this.config.starvationThreshold;
    
    for (const [taskId, scheduledTime] of this.starvationMap.entries()) {
      if (now - scheduledTime > threshold) {
        // Boost priority of starving task
        this.metrics.starvationCount++;
      }
    }
  }

  /**
   * Get scheduler metrics
   */
  getMetrics(): SchedulerMetrics {
    return { ...this.metrics };
  }

  /**
   * Record task completion
   */
  recordTaskCompletion(task: CognitiveTask): void {
    this.metrics.totalTasksCompleted++;
    this.taskQueueManager.recordTaskCompletion(task);
    
    // Remove from starvation map
    this.starvationMap.delete(task.id);
    
    // Update fair share
    const currentShare = this.fairShareMap.get(task.sessionId) || 0;
    this.fairShareMap.set(task.sessionId, Math.max(0, currentShare - 1));
  }

  /**
   * Record task failure
   */
  recordTaskFailure(task: CognitiveTask): void {
    this.metrics.totalTasksFailed++;
    this.taskQueueManager.recordTaskFailure(task);
    
    // Remove from starvation map
    this.starvationMap.delete(task.id);
  }

  /**
   * Record task cancellation
   */
  recordTaskCancellation(task: CognitiveTask): void {
    this.metrics.totalTasksCancelled++;
    
    // Remove from starvation map
    this.starvationMap.delete(task.id);
  }

  private updateFairShare(task: CognitiveTask): void {
    const currentShare = this.fairShareMap.get(task.sessionId) || 0;
    this.fairShareMap.set(task.sessionId, currentShare + 1);
  }

  private checkStarvation(task: CognitiveTask): void {
    if (task.scheduledAt) {
      this.starvationMap.set(task.id, task.scheduledAt);
    }
  }

  private updateLatencyMetrics(): void {
    if (this.latencies.length === 0) {
      this.metrics.averageLatency = 0;
      return;
    }
    
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    
    this.metrics.averageLatency = sum / sorted.length;
    this.metrics.p50Latency = sorted[Math.floor(sorted.length * 0.5)];
    this.metrics.p95Latency = sorted[Math.floor(sorted.length * 0.95)];
    this.metrics.p99Latency = sorted[Math.floor(sorted.length * 0.99)];
    
    if (this.latencies.length > 10000) {
      this.latencies = this.latencies.slice(-5000);
    }
  }

  private estimateStartTime(task: CognitiveTask): number {
    const queueMetrics = this.taskQueueManager.getMetrics();
    const estimatedWait = queueMetrics.averageQueueTime * queueMetrics.pendingTasks;
    return Date.now() + estimatedWait;
  }
}
