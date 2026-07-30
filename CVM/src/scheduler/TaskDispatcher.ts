/**
 * Task Dispatcher Implementation
 * Dispatches tasks to appropriate workers based on affinity and load
 */

import {
  CognitiveTask,
  DispatchResult,
  DispatchMetrics,
  Worker
} from './types';
import { WorkerPool } from './WorkerPool';
import { AffinityManager } from './AffinityManager';

export class TaskDispatcher {
  private workerPool: WorkerPool;
  private affinityManager: AffinityManager;
  private metrics: DispatchMetrics = {
    totalDispatches: 0,
    successfulDispatches: 0,
    failedDispatches: 0,
    averageDispatchTime: 0
  };
  private dispatchTimes: number[] = [];

  constructor(workerPool: WorkerPool, affinityManager: AffinityManager) {
    this.workerPool = workerPool;
    this.affinityManager = affinityManager;
  }

  /**
   * Dispatch a task to an appropriate worker
   */
  async dispatch(task: CognitiveTask): Promise<DispatchResult> {
    const startTime = Date.now();
    
    try {
      const worker = await this.selectWorker(task);
      
      if (!worker) {
        return {
          dispatched: false,
          error: 'No available workers'
        };
      }
      
      await this.dispatchToWorker(task, worker);
      
      const dispatchTime = Date.now() - startTime;
      this.dispatchTimes.push(dispatchTime);
      this.updateAverageDispatchTime();
      
      this.metrics.totalDispatches++;
      this.metrics.successfulDispatches++;
      
      return {
        dispatched: true,
        workerId: worker.id
      };
    } catch (error) {
      this.metrics.totalDispatches++;
      this.metrics.failedDispatches++;
      
      return {
        dispatched: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Select the best worker for a task
   */
  async selectWorker(task: CognitiveTask): Promise<Worker | null> {
    const idleWorkers = this.workerPool.getIdleWorkers();
    
    // First try to find a worker that respects affinity
    for (const worker of idleWorkers) {
      if (this.affinityManager.respectAffinity(task, worker)) {
        return worker;
      }
    }
    
    // If no affinity match, use any idle worker
    if (idleWorkers.length > 0) {
      return idleWorkers[0];
    }
    
    return null;
  }

  /**
   * Dispatch a task to a specific worker
   */
  async dispatchToWorker(task: CognitiveTask, worker: Worker): Promise<void> {
    worker.currentTask = task;
    worker.status = 'BUSY' as unknown;
    task.status = 'RUNNING' as unknown;
    task.startedAt = Date.now();
    
    this.affinityManager.updateWorkerLoad(worker.id, 1);
    
    if (task.affinity?.providerAffinity) {
      for (const provider of task.affinity.providerAffinity) {
        this.affinityManager.updateProviderLoad(provider, 1);
      }
    }
  }

  /**
   * Get dispatch metrics
   */
  getMetrics(): DispatchMetrics {
    return { ...this.metrics };
  }

  /**
   * Record task completion and release worker
   */
  recordTaskCompletion(worker: Worker, task: CognitiveTask): void {
    worker.currentTask = undefined;
    worker.status = 'IDLE' as unknown;
    
    this.affinityManager.updateWorkerLoad(worker.id, -1);
    
    if (task.affinity?.providerAffinity) {
      for (const provider of task.affinity.providerAffinity) {
        this.affinityManager.updateProviderLoad(provider, -1);
      }
    }
  }

  private updateAverageDispatchTime(): void {
    if (this.dispatchTimes.length === 0) {
      this.metrics.averageDispatchTime = 0;
      return;
    }
    
    const sum = this.dispatchTimes.reduce((a, b) => a + b, 0);
    this.metrics.averageDispatchTime = sum / this.dispatchTimes.length;
    
    if (this.dispatchTimes.length > 10000) {
      this.dispatchTimes = this.dispatchTimes.slice(-5000);
    }
  }
}
