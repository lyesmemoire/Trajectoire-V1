/**
 * Work Stealing Manager Implementation
 * Implements work stealing for load balancing across workers
 */

import { CognitiveTask, WorkStealingMetrics } from './types';
import { BinaryHeap } from './BinaryHeap';

export class WorkStealingManager {
  private enabled: boolean;
  private workerQueues: Map<number, BinaryHeap<CognitiveTask>> = new Map();
  private metrics: WorkStealingMetrics = {
    stolenTasks: 0,
    stealAttempts: 0,
    balanceOperations: 0
  };

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Register a worker with a task queue
   */
  registerWorker(workerId: number): void {
    this.workerQueues.set(workerId, new BinaryHeap<CognitiveTask>((a, b) => {
      return a.priority - b.priority;
    }));
  }

  /**
   * Enqueue a task to a specific worker's queue
   */
  async enqueueTask(workerId: number, task: CognitiveTask): Promise<void> {
    const queue = this.workerQueues.get(workerId);
    if (queue) {
      queue.enqueue(task);
    }
  }

  /**
   * Steal a task from another worker
   */
  async steal(workerId: number): Promise<CognitiveTask | null> {
    if (!this.enabled) {
      return null;
    }
    
    this.metrics.stealAttempts++;
    
    // Find a worker with tasks to steal from
    let victimWorkerId: number | null = null;
    let maxQueueSize = 0;
    
    for (const [id, queue] of this.workerQueues.entries()) {
      if (id !== workerId && queue.size() > maxQueueSize) {
        maxQueueSize = queue.size();
        victimWorkerId = id;
      }
    }
    
    if (victimWorkerId === null || maxQueueSize <= 1) {
      return null;
    }
    
    // Steal half of the tasks from victim
    const victimQueue = this.workerQueues.get(victimWorkerId)!;
    const tasksToSteal = Math.ceil(victimQueue.size() / 2);
    const stolenTask: CognitiveTask | null = victimQueue.dequeue() || null;
    
    if (stolenTask) {
      this.metrics.stolenTasks++;
    }
    
    return stolenTask;
  }

  /**
   * Balance tasks across workers
   */
  async balanceWorkers(): Promise<void> {
    this.metrics.balanceOperations++;
    
    const workerLoads = new Map<number, number>();
    let totalLoad = 0;
    
    for (const [id, queue] of this.workerQueues.entries()) {
      const load = queue.size();
      workerLoads.set(id, load);
      totalLoad += load;
    }
    
    if (totalLoad === 0) {
      return;
    }
    
    const averageLoad = totalLoad / this.workerQueues.size;
    
    // Rebalance tasks from overloaded to underloaded workers
    for (const [id, queue] of this.workerQueues.entries()) {
      const load = workerLoads.get(id) || 0;
      
      if (load > averageLoad * 1.5) {
        const excess = Math.floor((load - averageLoad) / 2);
        
        for (let i = 0; i < excess && !queue.isEmpty(); i++) {
          const task = queue.dequeue();
          if (task) {
            for (const [targetId, targetQueue] of this.workerQueues.entries()) {
              const targetLoad = workerLoads.get(targetId) || 0;
              if (targetLoad < averageLoad * 0.5) {
                targetQueue.enqueue(task);
                workerLoads.set(targetId, targetLoad + 1);
                break;
              }
            }
          }
        }
      }
    }
  }

  /**
   * Get work stealing metrics
   */
  getMetrics(): WorkStealingMetrics {
    return { ...this.metrics };
  }

  /**
   * Get the size of a worker's queue
   */
  getWorkerQueueSize(workerId: number): number {
    const queue = this.workerQueues.get(workerId);
    return queue ? queue.size() : 0;
  }

  /**
   * Clear all worker queues
   */
  clear(): void {
    for (const queue of this.workerQueues.values()) {
      queue.clear();
    }
  }

  /**
   * Unregister a worker
   */
  unregisterWorker(workerId: number): void {
    this.workerQueues.delete(workerId);
  }
}
