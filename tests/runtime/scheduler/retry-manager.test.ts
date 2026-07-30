import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RetryManager } from '../../../CVM/src/scheduler/RetryManager';
import { TaskPriority, TaskStatus, BackoffStrategy } from '../../../CVM/src/scheduler/types';

const createMockTask = (id: string, maxRetries: number = 3, backoffStrategy: BackoffStrategy = BackoffStrategy.EXPONENTIAL) => ({
  id,
  sessionId: 'session-1',
  instruction: null,
  priority: TaskPriority.NORMAL,
  latencyBudget: 1000,
  tokenBudget: 1000,
  dependencies: [],
  retryPolicy: {
    maxRetries,
    backoffStrategy,
    initialDelay: 100,
    maxDelay: 10000
  },
  createdAt: Date.now(),
  scheduledAt: Date.now(),
  startedAt: undefined as number | undefined,
  completedAt: undefined as number | undefined,
  status: TaskStatus.FAILED,
  metrics: { queueTime: 0, executionTime: 0, waitTime: 0, cpuTime: 0, memoryUsed: 0, tokensUsed: 0, retries: 0, preemptions: 0 }
});

describe('RetryManager', () => {
  let retryManager: RetryManager;

  beforeEach(() => {
    retryManager = new RetryManager();
  });

  describe('creation', () => {
    it('should create retry manager', () => {
      expect(retryManager).toBeDefined();
      const metrics = retryManager.getMetrics();
      expect(metrics.totalRetries).toBe(0);
      expect(metrics.successfulRetries).toBe(0);
      expect(metrics.failedRetries).toBe(0);
    });

    it('should initialize empty retry queue', () => {
      expect(retryManager.getRetryCount('task-1')).toBe(0);
    });
  });

  describe('enqueueRetry', () => {
    it('should enqueue task for retry', async () => {
      const task = createMockTask('task-1');
      await retryManager.enqueueRetry(task);

      const metrics = retryManager.getMetrics();
      expect(metrics.totalRetries).toBe(1);
    });

    it('should not enqueue when max retries reached', async () => {
      const task = createMockTask('task-1', 0);
      await retryManager.enqueueRetry(task);

      const metrics = retryManager.getMetrics();
      expect(metrics.totalRetries).toBe(0);
    });

    it('should calculate backoff delay', async () => {
      const task = createMockTask('task-1', 3, BackoffStrategy.EXPONENTIAL);
      await retryManager.enqueueRetry(task);

      expect(task.scheduledAt).toBeGreaterThan(Date.now());
    });

    it('should set task status to PENDING', async () => {
      const task = createMockTask('task-1');
      task.status = TaskStatus.FAILED;

      await retryManager.enqueueRetry(task);
      expect(task.status).toBe('PENDING');
    });

    it('should handle retry count increment', async () => {
      const task = createMockTask('task-1');
      retryManager.incrementRetryCount('task-1');
      retryManager.incrementRetryCount('task-1');

      await retryManager.enqueueRetry(task);
      expect(retryManager.getRetryCount('task-1')).toBe(2);
    });
  });

  describe('shouldRetry', () => {
    it('should return true when retries available', () => {
      const task = createMockTask('task-1', 3);
      expect(retryManager.shouldRetry(task)).toBe(true);
    });

    it('should return false when max retries reached', () => {
      const task = createMockTask('task-1', 0);
      expect(retryManager.shouldRetry(task)).toBe(false);
    });

    it('should return false when retry count equals max', () => {
      const task = createMockTask('task-1', 2);
      retryManager.incrementRetryCount('task-1');
      retryManager.incrementRetryCount('task-1');

      expect(retryManager.shouldRetry(task)).toBe(false);
    });

    it('should return true when retry count less than max', () => {
      const task = createMockTask('task-1', 5);
      retryManager.incrementRetryCount('task-1');
      retryManager.incrementRetryCount('task-1');

      expect(retryManager.shouldRetry(task)).toBe(true);
    });
  });

  describe('calculateBackoff', () => {
    it('should calculate fixed backoff', () => {
      const task = createMockTask('task-1', 3, BackoffStrategy.FIXED);
      const delay = retryManager.calculateBackoff(task);

      expect(delay).toBe(100);
    });

    it('should calculate linear backoff', () => {
      const task = createMockTask('task-1', 3, BackoffStrategy.LINEAR);
      retryManager.incrementRetryCount('task-1');
      retryManager.incrementRetryCount('task-1');

      const delay = retryManager.calculateBackoff(task);
      expect(delay).toBe(300); // 100 * (2 + 1)
    });

    it('should calculate exponential backoff', () => {
      const task = createMockTask('task-1', 3, BackoffStrategy.EXPONENTIAL);
      retryManager.incrementRetryCount('task-1');
      retryManager.incrementRetryCount('task-1');

      const delay = retryManager.calculateBackoff(task);
      expect(delay).toBe(400); // 100 * 2^2
    });

    it('should calculate exponential backoff with jitter', () => {
      const task = createMockTask('task-1', 3, BackoffStrategy.EXPONENTIAL_WITH_JITTER);
      const delay = retryManager.calculateBackoff(task);

      expect(delay).toBeGreaterThanOrEqual(100);
      expect(delay).toBeLessThanOrEqual(110); // 100 + 10% jitter
    });

    it('should cap at max delay', () => {
      const task = createMockTask('task-1', 3, BackoffStrategy.EXPONENTIAL);
      task.retryPolicy.maxDelay = 50;
      retryManager.incrementRetryCount('task-1');
      retryManager.incrementRetryCount('task-1');

      const delay = retryManager.calculateBackoff(task);
      expect(delay).toBe(50);
    });

    it('should handle zero retry count', () => {
      const task = createMockTask('task-1', 3, BackoffStrategy.EXPONENTIAL);
      const delay = retryManager.calculateBackoff(task);

      expect(delay).toBe(100); // 100 * 2^0
    });
  });

  describe('calculateNextRetryTime', () => {
    it('should return scheduledAt if set', () => {
      const task = createMockTask('task-1');
      task.scheduledAt = Date.now() + 5000;

      const nextRetry = retryManager.calculateNextRetryTime(task);
      expect(nextRetry).toBe(task.scheduledAt);
    });

    it('should return current time if scheduledAt not set', () => {
      const task = createMockTask('task-1');
      delete (task as any).scheduledAt;

      const nextRetry = retryManager.calculateNextRetryTime(task);
      expect(nextRetry).toBeGreaterThanOrEqual(Date.now() - 10);
      expect(nextRetry).toBeLessThanOrEqual(Date.now() + 10);
    });
  });

  describe('processRetries', () => {
    it('should return empty array when no tasks ready', async () => {
      const ready = await retryManager.processRetries();
      expect(ready).toEqual([]);
    });

    it('should return tasks ready for retry', async () => {
      const task = createMockTask('task-1');
      task.retryPolicy.initialDelay = 0; // No delay for immediate retry

      await retryManager.enqueueRetry(task);
      // Manually set scheduledAt to past to simulate ready task
      task.scheduledAt = Date.now() - 1000;
      const ready = await retryManager.processRetries();

      expect(ready).toHaveLength(1);
      expect(ready[0].id).toBe('task-1');
    });

    it('should not return tasks scheduled for future', async () => {
      const task = createMockTask('task-1');
      task.scheduledAt = Date.now() + 10000; // Future time

      await retryManager.enqueueRetry(task);
      const ready = await retryManager.processRetries();

      expect(ready).toHaveLength(0);
    });

    it('should return multiple ready tasks', async () => {
      const task1 = createMockTask('task-1');
      const task2 = createMockTask('task-2');
      task1.retryPolicy.initialDelay = 0;
      task2.retryPolicy.initialDelay = 0;

      await retryManager.enqueueRetry(task1);
      await retryManager.enqueueRetry(task2);
      // Manually set scheduledAt to past
      task1.scheduledAt = Date.now() - 1000;
      task2.scheduledAt = Date.now() - 500;
      const ready = await retryManager.processRetries();

      expect(ready).toHaveLength(2);
    });

    it('should process in order of scheduled time', async () => {
      const task1 = createMockTask('task-1');
      const task2 = createMockTask('task-2');
      task1.retryPolicy.initialDelay = 0;
      task2.retryPolicy.initialDelay = 0;

      await retryManager.enqueueRetry(task1);
      await retryManager.enqueueRetry(task2);
      // Manually set scheduledAt to past in order after enqueue
      task1.scheduledAt = Date.now() - 2000;
      task2.scheduledAt = Date.now() - 1000;
      const ready = await retryManager.processRetries();

      expect(ready).toHaveLength(2);
      expect(ready[0].id).toBe('task-1');
      expect(ready[1].id).toBe('task-2');
    });
  });

  describe('incrementRetryCount', () => {
    it('should increment retry count', () => {
      retryManager.incrementRetryCount('task-1');
      retryManager.incrementRetryCount('task-1');

      expect(retryManager.getRetryCount('task-1')).toBe(2);
    });

    it('should start from 0', () => {
      expect(retryManager.getRetryCount('task-1')).toBe(0);
    });

    it('should handle multiple tasks independently', () => {
      retryManager.incrementRetryCount('task-1');
      retryManager.incrementRetryCount('task-1');
      retryManager.incrementRetryCount('task-2');

      expect(retryManager.getRetryCount('task-1')).toBe(2);
      expect(retryManager.getRetryCount('task-2')).toBe(1);
    });
  });

  describe('recordSuccessfulRetry', () => {
    it('should increment successful retry count', () => {
      retryManager.recordSuccessfulRetry('task-1');
      retryManager.recordSuccessfulRetry('task-1');

      const metrics = retryManager.getMetrics();
      expect(metrics.successfulRetries).toBe(2);
    });

    it('should remove retry count', () => {
      retryManager.incrementRetryCount('task-1');
      retryManager.recordSuccessfulRetry('task-1');

      expect(retryManager.getRetryCount('task-1')).toBe(0);
    });

    it('should handle non-existent task', () => {
      expect(() => retryManager.recordSuccessfulRetry('nonexistent')).not.toThrow();
    });
  });

  describe('recordFailedRetry', () => {
    it('should increment failed retry count', () => {
      retryManager.recordFailedRetry('task-1');
      retryManager.recordFailedRetry('task-1');

      const metrics = retryManager.getMetrics();
      expect(metrics.failedRetries).toBe(2);
    });

    it('should remove retry count', () => {
      retryManager.incrementRetryCount('task-1');
      retryManager.recordFailedRetry('task-1');

      expect(retryManager.getRetryCount('task-1')).toBe(0);
    });

    it('should handle non-existent task', () => {
      expect(() => retryManager.recordFailedRetry('nonexistent')).not.toThrow();
    });
  });

  describe('getMetrics', () => {
    it('should return zero metrics initially', () => {
      const metrics = retryManager.getMetrics();
      expect(metrics.totalRetries).toBe(0);
      expect(metrics.successfulRetries).toBe(0);
      expect(metrics.failedRetries).toBe(0);
      expect(metrics.averageRetriesPerTask).toBe(0);
    });

    it('should calculate average retries per task', () => {
      retryManager.incrementRetryCount('task-1');
      retryManager.incrementRetryCount('task-2');
      retryManager.incrementRetryCount('task-2');

      // Need to enqueue to increment totalRetries
      const task1 = createMockTask('task-1');
      const task2 = createMockTask('task-2');
      retryManager.enqueueRetry(task1);
      retryManager.enqueueRetry(task2);

      const metrics = retryManager.getMetrics();
      expect(metrics.averageRetriesPerTask).toBeGreaterThan(0);
    });

    it('should return copy of metrics', () => {
      const metrics1 = retryManager.getMetrics();
      const metrics2 = retryManager.getMetrics();

      expect(metrics1).toEqual(metrics2);
    });
  });

  describe('getRetryCount', () => {
    it('should return 0 for non-existent task', () => {
      expect(retryManager.getRetryCount('nonexistent')).toBe(0);
    });

    it('should return actual retry count', () => {
      retryManager.incrementRetryCount('task-1');
      retryManager.incrementRetryCount('task-1');
      retryManager.incrementRetryCount('task-1');

      expect(retryManager.getRetryCount('task-1')).toBe(3);
    });
  });

  describe('clear', () => {
    it('should clear retry queue and counts', async () => {
      const task = createMockTask('task-1');
      await retryManager.enqueueRetry(task);
      retryManager.incrementRetryCount('task-1');

      retryManager.clear();

      expect(retryManager.getRetryCount('task-1')).toBe(0);
    });

    it('should handle clearing empty manager', () => {
      expect(() => retryManager.clear()).not.toThrow();
    });
  });

  describe('backoff strategies', () => {
    it('should handle all backoff strategies', () => {
      const strategies = [
        BackoffStrategy.FIXED,
        BackoffStrategy.LINEAR,
        BackoffStrategy.EXPONENTIAL,
        BackoffStrategy.EXPONENTIAL_WITH_JITTER
      ];

      strategies.forEach(strategy => {
        const task = createMockTask('task-1', 3, strategy);
        const delay = retryManager.calculateBackoff(task);
        expect(delay).toBeGreaterThan(0);
      });
    });

    it('should handle default strategy', () => {
      const task = createMockTask('task-1', 3, 'UNKNOWN' as BackoffStrategy);
      const delay = retryManager.calculateBackoff(task);

      expect(delay).toBe(100); // Default to initialDelay
    });
  });

  describe('edge cases', () => {
    it('should handle maxRetries of 0', () => {
      const task = createMockTask('task-1', 0);
      expect(retryManager.shouldRetry(task)).toBe(false);
    });

    it('should handle very large maxRetries', () => {
      const task = createMockTask('task-1', 1000);
      expect(retryManager.shouldRetry(task)).toBe(true);
    });

    it('should handle very large initialDelay', () => {
      const task = createMockTask('task-1', 3, BackoffStrategy.EXPONENTIAL);
      task.retryPolicy.initialDelay = 1000000;
      task.retryPolicy.maxDelay = 10000000;

      const delay = retryManager.calculateBackoff(task);
      expect(delay).toBe(1000000);
    });

    it('should handle zero initialDelay', () => {
      const task = createMockTask('task-1', 3, BackoffStrategy.EXPONENTIAL);
      task.retryPolicy.initialDelay = 0;

      const delay = retryManager.calculateBackoff(task);
      expect(delay).toBe(0);
    });

    it('should handle negative initialDelay', () => {
      const task = createMockTask('task-1', 3, BackoffStrategy.EXPONENTIAL);
      task.retryPolicy.initialDelay = -100;

      const delay = retryManager.calculateBackoff(task);
      expect(delay).toBe(-100);
    });

    it('should handle many retry attempts', () => {
      const task = createMockTask('task-1', 100, BackoffStrategy.EXPONENTIAL);
      for (let i = 0; i < 50; i++) {
        retryManager.incrementRetryCount('task-1');
      }

      const delay = retryManager.calculateBackoff(task);
      expect(delay).toBeLessThanOrEqual(task.retryPolicy.maxDelay);
    });
  });

  describe('retry queue ordering', () => {
    it('should maintain retry queue order by scheduled time', async () => {
      const task1 = createMockTask('task-1');
      const task2 = createMockTask('task-2');
      const task3 = createMockTask('task-3');

      task1.scheduledAt = Date.now() + 5000;
      task2.scheduledAt = Date.now() + 1000;
      task3.scheduledAt = Date.now() + 3000;

      await retryManager.enqueueRetry(task1);
      await retryManager.enqueueRetry(task2);
      await retryManager.enqueueRetry(task3);

      // Manually set scheduledAt to past for testing
      task1.scheduledAt = Date.now() - 5000;
      task2.scheduledAt = Date.now() - 1000;
      task3.scheduledAt = Date.now() - 3000;

      const ready = await retryManager.processRetries();
      expect(ready[0].id).toBe('task-1');
      expect(ready[1].id).toBe('task-3');
      expect(ready[2].id).toBe('task-2');
    });
  });
});
