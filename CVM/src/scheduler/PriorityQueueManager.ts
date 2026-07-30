/**
 * Priority Queue Manager Implementation
 * Manages multiple priority queues using BinaryHeap for efficient operations
 */

import { CognitiveTask, TaskPriority, PriorityQueue, PriorityMetrics, SchedulerConfig } from './types';
import { BinaryHeap } from './BinaryHeap';

export class PriorityQueueManager {
  private queues: Map<TaskPriority, PriorityQueue> = new Map();
  private config: SchedulerConfig;

  constructor(config: SchedulerConfig) {
    this.config = config;
    this.initializeQueues();
  }

  private initializeQueues(): void {
    const priorities = [
      TaskPriority.CRITICAL,
      TaskPriority.HIGH,
      TaskPriority.NORMAL,
      TaskPriority.LOW,
      TaskPriority.BACKGROUND
    ];
    
    for (const priority of priorities) {
      this.queues.set(priority, {
        priority,
        tasks: new BinaryHeap<CognitiveTask>((a, b) => {
          // Higher priority tasks have lower values
          if (a.priority !== b.priority) {
            return a.priority - b.priority;
          }
          // Within same priority, use deadline
          const aDeadline = a.deadline || Infinity;
          const bDeadline = b.deadline || Infinity;
          return aDeadline - bDeadline;
        }),
        maxSize: this.config.maxQueueSize
      });
    }
  }

  /**
   * Enqueue a task into its priority queue
   */
  async enqueue(task: CognitiveTask): Promise<void> {
    const queue = this.queues.get(task.priority);
    if (!queue) {
      throw new Error(`No queue for priority ${task.priority}`);
    }
    
    if (queue.tasks.size() >= queue.maxSize) {
      throw new Error(`Priority queue ${task.priority} is full`);
    }
    
    queue.tasks.enqueue(task);
  }

  /**
   * Dequeue the highest priority task available
   */
  async dequeue(): Promise<CognitiveTask | null> {
    // Try to dequeue from highest priority queue first
    const priorities = [
      TaskPriority.CRITICAL,
      TaskPriority.HIGH,
      TaskPriority.NORMAL,
      TaskPriority.LOW,
      TaskPriority.BACKGROUND
    ];
    
    for (const priority of priorities) {
      const queue = this.queues.get(priority);
      if (queue && !queue.tasks.isEmpty()) {
        return queue.tasks.dequeue();
      }
    }
    
    return null;
  }

  /**
   * Peek at the next task in a specific priority queue
   */
  peek(priority: TaskPriority): CognitiveTask | null {
    const queue = this.queues.get(priority);
    return queue ? queue.tasks.peek() : null;
  }

  /**
   * Get the size of a specific priority queue
   */
  size(priority: TaskPriority): number {
    const queue = this.queues.get(priority);
    return queue ? queue.tasks.size() : 0;
  }

  /**
   * Get priority queue metrics
   */
  getMetrics(): PriorityMetrics {
    const queueSizes = new Map<TaskPriority, number>();
    const averageWaitTimes = new Map<TaskPriority, number>();
    
    for (const [priority, queue] of this.queues.entries()) {
      queueSizes.set(priority, queue.tasks.size());
      // Calculate average wait time for tasks in this queue
      const tasks = queue.tasks.toArray();
      if (tasks.length > 0) {
        const now = Date.now();
        const totalWaitTime = tasks.reduce((sum: number, task: CognitiveTask) => {
          return sum + (now - (task.scheduledAt || task.createdAt));
        }, 0);
        averageWaitTimes.set(priority, totalWaitTime / tasks.length);
      }
    }
    
    return { queueSizes, averageWaitTimes };
  }

  /**
   * Get total number of tasks across all queues
   */
  getTotalSize(): number {
    let total = 0;
    for (const queue of this.queues.values()) {
      total += queue.tasks.size();
    }
    return total;
  }

  /**
   * Clear all priority queues
   */
  clear(): void {
    for (const queue of this.queues.values()) {
      queue.tasks.clear();
    }
  }
}
