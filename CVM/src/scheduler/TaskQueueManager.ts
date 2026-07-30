/**
 * Task Queue Manager Implementation
 * Manages multiple task queues with priority-based routing
 */

import { CognitiveTask, TaskStatus, TaskQueue, QueueMetrics, SchedulerConfig } from './types';

export class TaskQueueManager {
  private queues: Map<string, TaskQueue> = new Map();
  private config: SchedulerConfig;
  private metrics: QueueMetrics = {
    pendingTasks: 0,
    runningTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    averageQueueTime: 0,
    averageExecutionTime: 0,
    throughput: 0
  };
  private queueTimes: number[] = [];
  private executionTimes: number[] = [];
  private completedCount: number = 0;
  private startTime: number = Date.now();

  constructor(config: SchedulerConfig) {
    this.config = config;
  }

  /**
   * Enqueue a task into the appropriate queue
   */
  async enqueue(task: CognitiveTask): Promise<void> {
    const queueId = this.getQueueId(task);
    let queue = this.queues.get(queueId);
    
    if (!queue) {
      queue = {
        id: queueId,
        priority: task.priority,
        tasks: [],
        maxSize: this.config.maxQueueSize,
        createdAt: Date.now()
      };
      this.queues.set(queueId, queue);
    }
    
    if (queue.tasks.length >= queue.maxSize) {
      throw new Error(`Queue ${queueId} is full`);
    }
    
    task.status = TaskStatus.PENDING;
    task.scheduledAt = Date.now();
    queue.tasks.push(task);
    
    this.metrics.pendingTasks++;
  }

  /**
   * Dequeue a task from a specific queue
   */
  async dequeue(queueId: string): Promise<CognitiveTask | null> {
    const queue = this.queues.get(queueId);
    if (!queue || queue.tasks.length === 0) {
      return null;
    }
    
    const task = queue.tasks.shift()!;
    task.status = TaskStatus.SCHEDULED;
    
    this.metrics.pendingTasks--;
    this.metrics.runningTasks++;
    
    const queueTime = Date.now() - (task.scheduledAt || task.createdAt);
    this.queueTimes.push(queueTime);
    this.updateAverageQueueTime();
    
    return task;
  }

  /**
   * Peek at the next task in a queue without removing it
   */
  peek(queueId: string): CognitiveTask | null {
    const queue = this.queues.get(queueId);
    return queue && queue.tasks.length > 0 ? queue.tasks[0] : null;
  }

  /**
   * Get the size of a specific queue
   */
  size(queueId: string): number {
    const queue = this.queues.get(queueId);
    return queue ? queue.tasks.length : 0;
  }

  /**
   * Clear all tasks from a specific queue
   */
  async clear(queueId: string): Promise<void> {
    const queue = this.queues.get(queueId);
    if (queue) {
      this.metrics.pendingTasks -= queue.tasks.length;
      queue.tasks = [];
    }
  }

  /**
   * Get current queue metrics
   */
  getMetrics(): QueueMetrics {
    this.updateThroughput();
    return { ...this.metrics };
  }

  /**
   * Record task completion
   */
  recordTaskCompletion(task: CognitiveTask): void {
    this.metrics.runningTasks--;
    this.metrics.completedTasks++;
    this.completedCount++;
    
    const executionTime = (task.completedAt || Date.now()) - (task.startedAt || task.scheduledAt || task.createdAt);
    this.executionTimes.push(executionTime);
    this.updateAverageExecutionTime();
  }

  /**
   * Record task failure
   */
  recordTaskFailure(task: CognitiveTask): void {
    this.metrics.runningTasks--;
    this.metrics.failedTasks++;
  }

  /**
   * Get all queues
   */
  getQueues(): Map<string, TaskQueue> {
    return new Map(this.queues);
  }

  private getQueueId(task: CognitiveTask): string {
    return `priority_${task.priority}`;
  }

  private updateAverageQueueTime(): void {
    if (this.queueTimes.length === 0) {
      this.metrics.averageQueueTime = 0;
      return;
    }
    
    const sum = this.queueTimes.reduce((a, b) => a + b, 0);
    this.metrics.averageQueueTime = sum / this.queueTimes.length;
    
    if (this.queueTimes.length > 1000) {
      this.queueTimes = this.queueTimes.slice(-500);
    }
  }

  private updateAverageExecutionTime(): void {
    if (this.executionTimes.length === 0) {
      this.metrics.averageExecutionTime = 0;
      return;
    }
    
    const sum = this.executionTimes.reduce((a, b) => a + b, 0);
    this.metrics.averageExecutionTime = sum / this.executionTimes.length;
    
    if (this.executionTimes.length > 1000) {
      this.executionTimes = this.executionTimes.slice(-500);
    }
  }

  private updateThroughput(): void {
    const elapsed = (Date.now() - this.startTime) / 1000;
    if (elapsed > 0) {
      this.metrics.throughput = this.completedCount / elapsed;
    }
  }
}
