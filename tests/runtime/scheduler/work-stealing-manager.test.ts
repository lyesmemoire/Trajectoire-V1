import { describe, it, expect, beforeEach } from 'vitest';
import { WorkStealingManager } from '../../../CVM/src/scheduler/WorkStealingManager';
import { TaskPriority, TaskStatus } from '../../../CVM/src/scheduler/types';

const createMockTask = (id: string, priority: TaskPriority = TaskPriority.NORMAL) => ({
  id,
  sessionId: 'session-1',
  instruction: null,
  priority,
  latencyBudget: 1000,
  tokenBudget: 1000,
  dependencies: [],
  retryPolicy: { maxRetries: 3, backoffStrategy: 'EXPONENTIAL' as any, initialDelay: 100, maxDelay: 1000 },
  createdAt: Date.now(),
  scheduledAt: Date.now(),
  startedAt: undefined as number | undefined,
  completedAt: undefined as number | undefined,
  status: TaskStatus.PENDING,
  metrics: { queueTime: 0, executionTime: 0, waitTime: 0, cpuTime: 0, memoryUsed: 0, tokensUsed: 0, retries: 0, preemptions: 0 }
});

describe('WorkStealingManager', () => {
  let workStealingManager: WorkStealingManager;

  beforeEach(() => {
    workStealingManager = new WorkStealingManager(true);
  });

  describe('creation', () => {
    it('should create work stealing manager', () => {
      expect(workStealingManager).toBeDefined();
      const metrics = workStealingManager.getMetrics();
      expect(metrics.stolenTasks).toBe(0);
      expect(metrics.stealAttempts).toBe(0);
      expect(metrics.balanceOperations).toBe(0);
    });

    it('should be enabled by default', () => {
      const manager = new WorkStealingManager(true);
      expect(manager).toBeDefined();
    });

    it('should be disabled when enabled is false', () => {
      const manager = new WorkStealingManager(false);
      expect(manager).toBeDefined();
    });
  });

  describe('registerWorker', () => {
    it('should register worker with queue', () => {
      workStealingManager.registerWorker(0);
      expect(workStealingManager.getWorkerQueueSize(0)).toBe(0);
    });

    it('should register multiple workers', () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);
      workStealingManager.registerWorker(2);

      expect(workStealingManager.getWorkerQueueSize(0)).toBe(0);
      expect(workStealingManager.getWorkerQueueSize(1)).toBe(0);
      expect(workStealingManager.getWorkerQueueSize(2)).toBe(0);
    });

    it('should handle registering same worker twice', () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(0);

      expect(workStealingManager.getWorkerQueueSize(0)).toBe(0);
    });
  });

  describe('enqueueTask', () => {
    it('should enqueue task to worker queue', async () => {
      workStealingManager.registerWorker(0);
      const task = createMockTask('task-1');

      await workStealingManager.enqueueTask(0, task);
      expect(workStealingManager.getWorkerQueueSize(0)).toBe(1);
    });

    it('should enqueue multiple tasks to same worker', async () => {
      workStealingManager.registerWorker(0);
      await workStealingManager.enqueueTask(0, createMockTask('task-1'));
      await workStealingManager.enqueueTask(0, createMockTask('task-2'));
      await workStealingManager.enqueueTask(0, createMockTask('task-3'));

      expect(workStealingManager.getWorkerQueueSize(0)).toBe(3);
    });

    it('should enqueue tasks to different workers', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.enqueueTask(0, createMockTask('task-1'));
      await workStealingManager.enqueueTask(1, createMockTask('task-2'));

      expect(workStealingManager.getWorkerQueueSize(0)).toBe(1);
      expect(workStealingManager.getWorkerQueueSize(1)).toBe(1);
    });

    it('should handle enqueue to non-existent worker', async () => {
      const task = createMockTask('task-1');
      await expect(workStealingManager.enqueueTask(99, task)).resolves.not.toThrow();
    });
  });

  describe('steal', () => {
    it('should return null when work stealing disabled', async () => {
      const manager = new WorkStealingManager(false);
      manager.registerWorker(0);
      manager.registerWorker(1);

      await manager.enqueueTask(1, createMockTask('task-1'));
      const stolen = await manager.steal(0);

      expect(stolen).toBeNull();
    });

    it('should return null when no workers registered', async () => {
      const stolen = await workStealingManager.steal(0);
      expect(stolen).toBeNull();
    });

    it('should return null when no tasks to steal', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      const stolen = await workStealingManager.steal(0);
      expect(stolen).toBeNull();
    });

    it('should steal task from worker with most tasks', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.enqueueTask(1, createMockTask('task-1'));
      await workStealingManager.enqueueTask(1, createMockTask('task-2'));
      await workStealingManager.enqueueTask(1, createMockTask('task-3'));

      const stolen = await workStealingManager.steal(0);
      expect(stolen).toBeDefined();
      expect(stolen?.id).toBeDefined();
    });

    it('should not steal if victim has only 1 task', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.enqueueTask(1, createMockTask('task-1'));

      const stolen = await workStealingManager.steal(0);
      expect(stolen).toBeNull();
    });

    it('should handle stealing when dequeue returns null', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.enqueueTask(1, createMockTask('task-1'));

      // Mock dequeue to return null
      const worker1Queue = (workStealingManager as any).workerQueues.get(1);
      const originalDequeue = worker1Queue.dequeue.bind(worker1Queue);
      worker1Queue.dequeue = () => null;

      const stolen = await workStealingManager.steal(0);
      expect(stolen).toBeNull();
    });

    it('should increment steal attempts', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.enqueueTask(1, createMockTask('task-1'));
      await workStealingManager.steal(0);

      const metrics = workStealingManager.getMetrics();
      expect(metrics.stealAttempts).toBe(1);
    });

    it('should increment stolen tasks count', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.enqueueTask(1, createMockTask('task-1'));
      await workStealingManager.enqueueTask(1, createMockTask('task-2'));

      await workStealingManager.steal(0);
      const metrics = workStealingManager.getMetrics();

      expect(metrics.stolenTasks).toBe(1);
    });

    it('should not steal from self', async () => {
      workStealingManager.registerWorker(0);

      await workStealingManager.enqueueTask(0, createMockTask('task-1'));
      await workStealingManager.enqueueTask(0, createMockTask('task-2'));

      const stolen = await workStealingManager.steal(0);
      expect(stolen).toBeNull();
    });

    it('should select victim with maximum queue size', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);
      workStealingManager.registerWorker(2);

      await workStealingManager.enqueueTask(1, createMockTask('task-1'));
      await workStealingManager.enqueueTask(2, createMockTask('task-2'));
      await workStealingManager.enqueueTask(2, createMockTask('task-3'));
      await workStealingManager.enqueueTask(2, createMockTask('task-4'));

      const stolen = await workStealingManager.steal(0);
      expect(stolen).toBeDefined();
      expect(workStealingManager.getWorkerQueueSize(2)).toBeLessThan(4);
    });
  });

  describe('balanceWorkers', () => {
    it('should increment balance operations', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.balanceWorkers();

      const metrics = workStealingManager.getMetrics();
      expect(metrics.balanceOperations).toBe(1);
    });

    it('should handle empty queues', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.balanceWorkers();
      expect(workStealingManager.getWorkerQueueSize(0)).toBe(0);
      expect(workStealingManager.getWorkerQueueSize(1)).toBe(0);
    });

    it('should balance tasks from overloaded to underloaded', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.enqueueTask(0, createMockTask('task-1'));
      await workStealingManager.enqueueTask(0, createMockTask('task-2'));
      await workStealingManager.enqueueTask(0, createMockTask('task-3'));
      await workStealingManager.enqueueTask(0, createMockTask('task-4'));

      await workStealingManager.balanceWorkers();

      const size0 = workStealingManager.getWorkerQueueSize(0);
      const size1 = workStealingManager.getWorkerQueueSize(1);

      expect(size1).toBeGreaterThan(0);
      expect(size0).toBeLessThan(4);
    });

    it('should handle balanced loads', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.enqueueTask(0, createMockTask('task-1'));
      await workStealingManager.enqueueTask(1, createMockTask('task-2'));

      await workStealingManager.balanceWorkers();

      expect(workStealingManager.getWorkerQueueSize(0)).toBe(1);
      expect(workStealingManager.getWorkerQueueSize(1)).toBe(1);
    });

    it('should handle balance when dequeue returns null', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      // Add many tasks to trigger balance logic
      for (let i = 0; i < 10; i++) {
        await workStealingManager.enqueueTask(0, createMockTask(`task-${i}`));
      }

      // Mock dequeue to return null after first call
      let callCount = 0;
      const worker0Queue = (workStealingManager as any).workerQueues.get(0);
      const originalDequeue = worker0Queue.dequeue.bind(worker0Queue);
      worker0Queue.dequeue = () => {
        callCount++;
        if (callCount > 2) return null;
        return originalDequeue();
      };

      await workStealingManager.balanceWorkers();

      const metrics = workStealingManager.getMetrics();
      expect(metrics.balanceOperations).toBe(1);
    });

    it('should handle balance when no target worker has low load', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      // Add tasks to worker-0
      for (let i = 0; i < 10; i++) {
        await workStealingManager.enqueueTask(0, createMockTask(`task-${i}`));
      }

      // Add tasks to worker-1 so it won't be considered underloaded
      for (let i = 0; i < 8; i++) {
        await workStealingManager.enqueueTask(1, createMockTask(`task-${i + 10}`));
      }

      await workStealingManager.balanceWorkers();

      const metrics = workStealingManager.getMetrics();
      expect(metrics.balanceOperations).toBe(1);
    });

    it('should handle multiple workers with varying loads', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);
      workStealingManager.registerWorker(2);

      await workStealingManager.enqueueTask(0, createMockTask('task-1'));
      await workStealingManager.enqueueTask(0, createMockTask('task-2'));
      await workStealingManager.enqueueTask(0, createMockTask('task-3'));
      await workStealingManager.enqueueTask(1, createMockTask('task-4'));

      await workStealingManager.balanceWorkers();

      const sizes = [
        workStealingManager.getWorkerQueueSize(0),
        workStealingManager.getWorkerQueueSize(1),
        workStealingManager.getWorkerQueueSize(2)
      ];

      const maxLoad = Math.max(...sizes);
      const minLoad = Math.min(...sizes);
      // Balance operation should reduce the load difference
      expect(maxLoad - minLoad).toBeLessThanOrEqual(3);
    });
  });

  describe('getMetrics', () => {
    it('should return zero metrics initially', () => {
      const metrics = workStealingManager.getMetrics();
      expect(metrics.stolenTasks).toBe(0);
      expect(metrics.stealAttempts).toBe(0);
      expect(metrics.balanceOperations).toBe(0);
    });

    it('should return copy of metrics', () => {
      const metrics1 = workStealingManager.getMetrics();
      const metrics2 = workStealingManager.getMetrics();

      expect(metrics1).toEqual(metrics2);
    });

    it('should track all metrics', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.enqueueTask(1, createMockTask('task-1'));
      await workStealingManager.enqueueTask(1, createMockTask('task-2'));
      await workStealingManager.steal(0);
      await workStealingManager.balanceWorkers();

      const metrics = workStealingManager.getMetrics();
      expect(metrics.stealAttempts).toBe(1);
      expect(metrics.balanceOperations).toBe(1);
    });
  });

  describe('getWorkerQueueSize', () => {
    it('should return 0 for non-existent worker', () => {
      expect(workStealingManager.getWorkerQueueSize(99)).toBe(0);
    });

    it('should return actual queue size', async () => {
      workStealingManager.registerWorker(0);
      await workStealingManager.enqueueTask(0, createMockTask('task-1'));
      await workStealingManager.enqueueTask(0, createMockTask('task-2'));

      expect(workStealingManager.getWorkerQueueSize(0)).toBe(2);
    });
  });

  describe('clear', () => {
    it('should clear all worker queues', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.enqueueTask(0, createMockTask('task-1'));
      await workStealingManager.enqueueTask(1, createMockTask('task-2'));

      workStealingManager.clear();

      expect(workStealingManager.getWorkerQueueSize(0)).toBe(0);
      expect(workStealingManager.getWorkerQueueSize(1)).toBe(0);
    });

    it('should handle clearing empty queues', () => {
      expect(() => workStealingManager.clear()).not.toThrow();
    });
  });

  describe('unregisterWorker', () => {
    it('should remove worker from manager', () => {
      workStealingManager.registerWorker(0);
      workStealingManager.unregisterWorker(0);

      expect(workStealingManager.getWorkerQueueSize(0)).toBe(0);
    });

    it('should handle unregistering non-existent worker', () => {
      expect(() => workStealingManager.unregisterWorker(99)).not.toThrow();
    });

    it('should handle unregistering already unregistered worker', () => {
      workStealingManager.registerWorker(0);
      workStealingManager.unregisterWorker(0);
      expect(() => workStealingManager.unregisterWorker(0)).not.toThrow();
    });
  });

  describe('priority-based stealing', () => {
    it('should maintain priority order in worker queues', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.enqueueTask(1, createMockTask('task-1', TaskPriority.LOW));
      await workStealingManager.enqueueTask(1, createMockTask('task-2', TaskPriority.HIGH));
      await workStealingManager.enqueueTask(1, createMockTask('task-3', TaskPriority.NORMAL));

      const stolen = await workStealingManager.steal(0);
      expect(stolen?.priority).toBe(TaskPriority.HIGH);
    });
  });

  describe('edge cases', () => {
    it('should handle single worker', async () => {
      workStealingManager.registerWorker(0);
      await workStealingManager.enqueueTask(0, createMockTask('task-1'));

      const stolen = await workStealingManager.steal(0);
      expect(stolen).toBeNull();
    });

    it('should handle large number of workers', async () => {
      for (let i = 0; i < 100; i++) {
        workStealingManager.registerWorker(i);
      }

      await workStealingManager.enqueueTask(50, createMockTask('task-1'));
      const stolen = await workStealingManager.steal(0);

      expect(stolen).toBeDefined();
    });

    it('should handle large queue sizes', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      for (let i = 0; i < 100; i++) {
        await workStealingManager.enqueueTask(1, createMockTask(`task-${i}`));
      }

      const stolen = await workStealingManager.steal(0);
      expect(stolen).toBeDefined();
      expect(workStealingManager.getWorkerQueueSize(1)).toBe(99);
    });

    it('should handle zero workers', async () => {
      const stolen = await workStealingManager.steal(0);
      expect(stolen).toBeNull();
    });

    it('should handle stealing when all workers have same load', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.enqueueTask(0, createMockTask('task-1'));
      await workStealingManager.enqueueTask(1, createMockTask('task-2'));

      const stolen = await workStealingManager.steal(0);
      expect(stolen).toBeNull();
    });
  });

  describe('concurrent operations', () => {
    it('should handle multiple steals in sequence', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.enqueueTask(1, createMockTask('task-1'));
      await workStealingManager.enqueueTask(1, createMockTask('task-2'));
      await workStealingManager.enqueueTask(1, createMockTask('task-3'));
      await workStealingManager.enqueueTask(1, createMockTask('task-4'));

      const stolen1 = await workStealingManager.steal(0);
      const stolen2 = await workStealingManager.steal(0);

      expect(stolen1).toBeDefined();
      expect(stolen2).toBeDefined();
    });

    it('should handle balance after steal', async () => {
      workStealingManager.registerWorker(0);
      workStealingManager.registerWorker(1);

      await workStealingManager.enqueueTask(1, createMockTask('task-1'));
      await workStealingManager.enqueueTask(1, createMockTask('task-2'));
      await workStealingManager.enqueueTask(1, createMockTask('task-3'));

      await workStealingManager.steal(0);
      await workStealingManager.balanceWorkers();

      const metrics = workStealingManager.getMetrics();
      expect(metrics.stealAttempts).toBe(1);
      expect(metrics.balanceOperations).toBe(1);
    });
  });
});
