/**
 * Retry Manager Implementation
 * Manages task retries with various backoff strategies
 */

import {
  CognitiveTask,
  BackoffStrategy,
  RetryMetrics
} from './types';
import { BinaryHeap } from './BinaryHeap';

export class RetryManager {
  private retryQueue: BinaryHeap<CognitiveTask> = new BinaryHeap<CognitiveTask>((a, b) => {
    const aNextRetry = this.calculateNextRetryTime(a);
    const bNextRetry = this.calculateNextRetryTime(b);
    return aNextRetry - bNextRetry;
  });
  
  private metrics: RetryMetrics = {
    totalRetries: 0,
    successfulRetries: 0,
    failedRetries: 0,
    averageRetriesPerTask: 0
  };
  
  private retryCounts: Map<string, number> = new Map();

  /**
   * Enqueue a task for retry
   */
  async enqueueRetry(task: CognitiveTask): Promise<void> {
    const retryCount = this.retryCounts.get(task.id) || 0;
    
    if (retryCount >= task.retryPolicy.maxRetries) {
      return;
    }
    
    const delay = this.calculateBackoff(task);
    
    const now = Date.now();
    task.scheduledAt = now + delay;
    task.status = 'PENDING' as unknown;
    
    this.retryQueue.enqueue(task);
    this.metrics.totalRetries++;
  }

  /**
   * Check if a task should be retried
   */
  shouldRetry(task: CognitiveTask): boolean {
    const retryCount = this.retryCounts.get(task.id) || 0;
    return retryCount < task.retryPolicy.maxRetries;
  }

  /**
   * Calculate backoff delay for a task
   */
  calculateBackoff(task: CognitiveTask): number {
    const retryCount = this.retryCounts.get(task.id) || 0;
    const { initialDelay, maxDelay, backoffStrategy } = task.retryPolicy;
    
    switch (backoffStrategy) {
      case BackoffStrategy.FIXED:
        return initialDelay;
      
      case BackoffStrategy.LINEAR:
        return Math.min(initialDelay * (retryCount + 1), maxDelay);
      
      case BackoffStrategy.EXPONENTIAL:
        return Math.min(initialDelay * Math.pow(2, retryCount), maxDelay);
      
      case BackoffStrategy.EXPONENTIAL_WITH_JITTER:
        {
          const baseDelay = Math.min(initialDelay * Math.pow(2, retryCount), maxDelay);
          const jitter = baseDelay * 0.1 * Math.random();
          return baseDelay + jitter;
        }
      
      default:
        return initialDelay;
    }
  }

  /**
   * Calculate next retry time for a task
   */
  calculateNextRetryTime(task: CognitiveTask): number {
    return task.scheduledAt || Date.now();
  }

  /**
   * Process tasks that are ready for retry
   */
  async processRetries(): Promise<CognitiveTask[]> {
    const readyTasks: CognitiveTask[] = [];
    const now = Date.now();
    
    while (!this.retryQueue.isEmpty()) {
      const task = this.retryQueue.peek()!;
      
      if (task.scheduledAt && task.scheduledAt > now) {
        break;
      }
      
      readyTasks.push(this.retryQueue.dequeue()!);
    }
    
    return readyTasks;
  }

  /**
   * Increment retry count for a task
   */
  incrementRetryCount(taskId: string): void {
    const count = this.retryCounts.get(taskId) || 0;
    this.retryCounts.set(taskId, count + 1);
  }

  /**
   * Record successful retry
   */
  recordSuccessfulRetry(taskId: string): void {
    this.metrics.successfulRetries++;
    this.retryCounts.delete(taskId);
  }

  /**
   * Record failed retry
   */
  recordFailedRetry(taskId: string): void {
    this.metrics.failedRetries++;
    this.retryCounts.delete(taskId);
  }

  /**
   * Get retry metrics
   */
  getMetrics(): RetryMetrics {
    const totalTasks = this.retryCounts.size;
    this.metrics.averageRetriesPerTask = totalTasks > 0 
      ? this.metrics.totalRetries / totalTasks 
      : 0;
    
    return { ...this.metrics };
  }

  /**
   * Get retry count for a task
   */
  getRetryCount(taskId: string): number {
    return this.retryCounts.get(taskId) || 0;
  }

  /**
   * Clear all retry tasks
   */
  clear(): void {
    this.retryQueue.clear();
    this.retryCounts.clear();
  }
}
