/**
 * Worker Pool Implementation
 * Manages a pool of workers for task execution
 */

import {
  Worker,
  WorkerStatus,
  WorkerMetrics,
  SchedulerConfig
} from './types';
import { AffinityManager } from './AffinityManager';
import { WorkStealingManager } from './WorkStealingManager';

export class WorkerPool {
  workers: Worker[] = [];
  idleWorkers: Worker[] = [];
  busyWorkers: Worker[] = [];
  private config: SchedulerConfig;
  private affinityManager: AffinityManager;
  private workStealingManager: WorkStealingManager;

  constructor(
    config: SchedulerConfig,
    affinityManager: AffinityManager,
    workStealingManager: WorkStealingManager
  ) {
    this.config = config;
    this.affinityManager = affinityManager;
    this.workStealingManager = workStealingManager;
    
    this.initializeWorkers();
  }

  private initializeWorkers(): void {
    for (let i = 0; i < this.config.maxWorkers; i++) {
      const worker: Worker = {
        id: i,
        status: WorkerStatus.IDLE,
        queue: [],
        cpuAffinity: [i % 4],
        gpuAffinity: [0],
        providerAffinity: [],
        metrics: {
          activeWorkers: 0,
          idleWorkers: 0,
          averageUtilization: 0,
          stolenTasks: 0,
          preemptions: 0
        }
      };
      
      this.workers.push(worker);
      this.idleWorkers.push(worker);
      this.affinityManager.registerWorker(worker);
      this.workStealingManager.registerWorker(i);
    }
  }

  /**
   * Acquire an available worker
   */
  async acquire(): Promise<Worker> {
    if (this.idleWorkers.length > 0) {
      const worker = this.idleWorkers.shift()!;
      this.busyWorkers.push(worker);
      return worker;
    }
    
    // Try work stealing
    const stolenTask = await this.workStealingManager.steal(0);
    if (stolenTask) {
      const worker = this.workers[0];
      worker.queue.push(stolenTask);
      return worker;
    }
    
    // Balance workers
    await this.workStealingManager.balanceWorkers();
    
    throw new Error('No available workers');
  }

  /**
   * Release a worker back to the pool
   */
  async release(worker: Worker): Promise<void> {
    const busyIndex = this.busyWorkers.indexOf(worker);
    if (busyIndex !== -1) {
      this.busyWorkers.splice(busyIndex, 1);
    }
    
    worker.status = WorkerStatus.IDLE;
    worker.currentTask = undefined;
    this.idleWorkers.push(worker);
  }

  /**
   * Shutdown the worker pool
   */
  async shutdown(): Promise<void> {
    for (const worker of this.workers) {
      worker.status = WorkerStatus.SHUTTING_DOWN;
    }
    
    this.workers = [];
    this.idleWorkers = [];
    this.busyWorkers = [];
  }

  /**
   * Get worker pool metrics
   */
  getMetrics(): WorkerMetrics {
    const activeWorkers = this.busyWorkers.length;
    const idleWorkers = this.idleWorkers.length;
    const totalWorkers = this.workers.length;
    
    const averageUtilization = totalWorkers > 0 
      ? activeWorkers / totalWorkers 
      : 0;
    
    let stolenTasks = 0;
    for (const worker of this.workers) {
      stolenTasks += worker.metrics.stolenTasks;
    }
    
    let preemptions = 0;
    for (const worker of this.workers) {
      preemptions += worker.metrics.preemptions;
    }
    
    return {
      activeWorkers,
      idleWorkers,
      averageUtilization,
      stolenTasks,
      preemptions
    };
  }

  /**
   * Get all idle workers
   */
  getIdleWorkers(): Worker[] {
    return [...this.idleWorkers];
  }

  /**
   * Get a specific worker by ID
   */
  getWorker(id: number): Worker | undefined {
    return this.workers.find(w => w.id === id);
  }

  /**
   * Get all workers
   */
  getWorkers(): Worker[] {
    return [...this.workers];
  }
}
