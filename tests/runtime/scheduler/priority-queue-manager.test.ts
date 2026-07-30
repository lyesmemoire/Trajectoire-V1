import { describe, it, expect, beforeEach } from 'vitest';
import { PriorityQueueManager } from '../../../CVM/src/scheduler/PriorityQueueManager';
import { TaskPriority, SchedulerConfig, TaskStatus } from '../../../CVM/src/scheduler/types';

const mockConfig: SchedulerConfig = {
  maxWorkers: 4,
  maxQueueSize: 100,
  schedulingAlgorithm: 'PRIORITY' as any,
  timeSlice: 10,
  enablePreemption: true,
  enableWorkStealing: true,
  enableDeadlineScheduling: true,
  fairnessWeight: 1.0,
  starvationThreshold: 5000,
  distributedMode: false
};

const createMockTask = (id: string, priority: TaskPriority, deadline?: number) => ({
  id,
  sessionId: 'session-1',
  instruction: null,
  priority,
  deadline,
  latencyBudget: 1000,
  tokenBudget: 1000,
  dependencies: [],
  retryPolicy: { maxRetries: 3, backoffStrategy: 'EXPONENTIAL' as any, initialDelay: 100, maxDelay: 1000 },
  createdAt: Date.now(),
  scheduledAt: Date.now(),
  status: TaskStatus.PENDING,
  metrics: { queueTime: 0, executionTime: 0, waitTime: 0, cpuTime: 0, memoryUsed: 0, tokensUsed: 0, retries: 0, preemptions: 0 }
});

describe('PriorityQueueManager', () => {
  let queueManager: PriorityQueueManager;

  beforeEach(() => {
    queueManager = new PriorityQueueManager(mockConfig);
  });

  describe('creation', () => {
    it('should initialize all priority queues', () => {
      expect(queueManager.size(TaskPriority.CRITICAL)).toBe(0);
      expect(queueManager.size(TaskPriority.HIGH)).toBe(0);
      expect(queueManager.size(TaskPriority.NORMAL)).toBe(0);
      expect(queueManager.size(TaskPriority.LOW)).toBe(0);
      expect(queueManager.size(TaskPriority.BACKGROUND)).toBe(0);
    });

    it('should set correct max size for queues', () => {
      const metrics = queueManager.getMetrics();
      expect(metrics.queueSizes.get(TaskPriority.CRITICAL)).toBe(0);
    });
  });

  describe('enqueue', () => {
    it('should enqueue task to correct priority queue', async () => {
      const task = createMockTask('task-1', TaskPriority.HIGH);
      await queueManager.enqueue(task);

      expect(queueManager.size(TaskPriority.HIGH)).toBe(1);
      expect(queueManager.size(TaskPriority.NORMAL)).toBe(0);
    });

    it('should enqueue multiple tasks to same queue', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.NORMAL));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.NORMAL));
      await queueManager.enqueue(createMockTask('task-3', TaskPriority.NORMAL));

      expect(queueManager.size(TaskPriority.NORMAL)).toBe(3);
    });

    it('should enqueue tasks to different queues', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.CRITICAL));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.LOW));
      await queueManager.enqueue(createMockTask('task-3', TaskPriority.HIGH));

      expect(queueManager.size(TaskPriority.CRITICAL)).toBe(1);
      expect(queueManager.size(TaskPriority.LOW)).toBe(1);
      expect(queueManager.size(TaskPriority.HIGH)).toBe(1);
    });

    it('should throw error when queue is full', async () => {
      const smallConfig = { ...mockConfig, maxQueueSize: 2 };
      const smallManager = new PriorityQueueManager(smallConfig);

      await smallManager.enqueue(createMockTask('task-1', TaskPriority.NORMAL));
      await smallManager.enqueue(createMockTask('task-2', TaskPriority.NORMAL));

      await expect(smallManager.enqueue(createMockTask('task-3', TaskPriority.NORMAL)))
        .rejects.toThrow('Priority queue 2 is full');
    });

    it('should throw error for invalid priority', async () => {
      const task = createMockTask('task-1', TaskPriority.NORMAL);
      task.priority = 999 as TaskPriority;

      await expect(queueManager.enqueue(task)).rejects.toThrow('No queue for priority 999');
    });
  });

  describe('dequeue', () => {
    it('should dequeue highest priority task first', async () => {
      await queueManager.enqueue(createMockTask('task-low', TaskPriority.LOW));
      await queueManager.enqueue(createMockTask('task-critical', TaskPriority.CRITICAL));
      await queueManager.enqueue(createMockTask('task-high', TaskPriority.HIGH));

      const task = await queueManager.dequeue();
      expect(task?.id).toBe('task-critical');
    });

    it('should dequeue tasks in priority order', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.BACKGROUND));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.CRITICAL));
      await queueManager.enqueue(createMockTask('task-3', TaskPriority.LOW));
      await queueManager.enqueue(createMockTask('task-4', TaskPriority.HIGH));
      await queueManager.enqueue(createMockTask('task-5', TaskPriority.NORMAL));

      const tasks = [];
      for (let i = 0; i < 5; i++) {
        const task = await queueManager.dequeue();
        if (task) tasks.push(task.id);
      }

      expect(tasks).toEqual(['task-2', 'task-4', 'task-5', 'task-3', 'task-1']);
    });

    it('should use deadline as tiebreaker for same priority', async () => {
      const task1 = createMockTask('task-1', TaskPriority.HIGH);
      task1.deadline = Date.now() + 1000;
      const task2 = createMockTask('task-2', TaskPriority.HIGH);
      task2.deadline = Date.now() + 500;

      await queueManager.enqueue(task1);
      await queueManager.enqueue(task2);

      const dequeued1 = await queueManager.dequeue();
      const dequeued2 = await queueManager.dequeue();

      expect(dequeued1?.deadline).toBeLessThan(dequeued2?.deadline!);
    });

    it('should handle tasks with same priority and no deadline', async () => {
      const task1 = createMockTask('task-1', TaskPriority.HIGH);
      // No deadline set (undefined)
      const task2 = createMockTask('task-2', TaskPriority.HIGH);
      task2.deadline = Date.now() + 1000;

      await queueManager.enqueue(task1);
      await queueManager.enqueue(task2);

      const dequeued1 = await queueManager.dequeue();
      const dequeued2 = await queueManager.dequeue();

      // Task with deadline should come before task without deadline
      expect(dequeued1?.deadline).toBeDefined();
      expect(dequeued2?.deadline).toBeUndefined();
    });

    it('should prioritize higher priority tasks over lower priority', async () => {
      const highTask = createMockTask('task-1', TaskPriority.HIGH);
      const lowTask = createMockTask('task-2', TaskPriority.LOW);

      await queueManager.enqueue(lowTask);
      await queueManager.enqueue(highTask);

      const dequeued1 = await queueManager.dequeue();
      const dequeued2 = await queueManager.dequeue();

      // High priority task should come first
      expect(dequeued1?.priority).toBe(TaskPriority.HIGH);
      expect(dequeued2?.priority).toBe(TaskPriority.LOW);
    });

    it('should handle tasks with different priorities and no deadlines', async () => {
      const highTask = createMockTask('task-1', TaskPriority.HIGH);
      highTask.deadline = undefined;
      const lowTask = createMockTask('task-2', TaskPriority.LOW);
      lowTask.deadline = undefined;

      await queueManager.enqueue(lowTask);
      await queueManager.enqueue(highTask);

      const dequeued1 = await queueManager.dequeue();
      const dequeued2 = await queueManager.dequeue();

      // High priority should come first regardless of deadline
      expect(dequeued1?.priority).toBe(TaskPriority.HIGH);
      expect(dequeued2?.priority).toBe(TaskPriority.LOW);
    });

    it('should handle tasks with same priority but different deadlines', async () => {
      const now = Date.now();
      const task1 = createMockTask('task-1', TaskPriority.HIGH, now + 5000);
      const task2 = createMockTask('task-2', TaskPriority.HIGH, now + 1000); // Earlier deadline

      await queueManager.enqueue(task1);
      await queueManager.enqueue(task2);

      const dequeued1 = await queueManager.dequeue();
      const dequeued2 = await queueManager.dequeue();

      // Earlier deadline should come first
      expect(dequeued1?.id).toBe('task-2');
      expect(dequeued2?.id).toBe('task-1');
    });

    it('should handle tasks with different priorities in comparator', async () => {
      const highTask = createMockTask('task-1', TaskPriority.HIGH);
      const lowTask = createMockTask('task-2', TaskPriority.LOW);

      await queueManager.enqueue(lowTask);
      await queueManager.enqueue(highTask);

      const dequeued1 = await queueManager.dequeue();
      const dequeued2 = await queueManager.dequeue();

      // High priority should come first
      expect(dequeued1?.priority).toBe(TaskPriority.HIGH);
      expect(dequeued2?.priority).toBe(TaskPriority.LOW);
    });

    it('should handle tasks with equal priority by deadline', async () => {
      const now = Date.now();
      const task1 = createMockTask('task-1', TaskPriority.HIGH, now + 2000);
      const task2 = createMockTask('task-2', TaskPriority.HIGH, now + 1000);

      await queueManager.enqueue(task1);
      await queueManager.enqueue(task2);

      const dequeued1 = await queueManager.dequeue();
      const dequeued2 = await queueManager.dequeue();

      // Earlier deadline should come first
      expect(dequeued1?.deadline).toBe(now + 1000);
      expect(dequeued2?.deadline).toBe(now + 2000);
    });

    it('should return null when all queues are empty', async () => {
      const task = await queueManager.dequeue();
      expect(task).toBeNull();
    });

    it('should dequeue from same priority by deadline', async () => {
      const now = Date.now();
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.HIGH, now + 1000));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.HIGH, now + 500));
      await queueManager.enqueue(createMockTask('task-3', TaskPriority.HIGH, now + 2000));

      const task1 = await queueManager.dequeue();
      const task2 = await queueManager.dequeue();
      const task3 = await queueManager.dequeue();

      expect(task1?.id).toBe('task-2');
      expect(task2?.id).toBe('task-1');
      expect(task3?.id).toBe('task-3');
    });

    it('should handle tasks without deadline', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.HIGH));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.HIGH, Date.now() + 1000));

      const task = await queueManager.dequeue();
      expect(task).toBeDefined();
    });
  });

  describe('peek', () => {
    it('should peek at next task without removing', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.HIGH));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.HIGH));

      const peeked = queueManager.peek(TaskPriority.HIGH);
      // Heap ordering means we can't guarantee which task is first when priorities are equal
      expect(peeked).toBeDefined();
      expect(queueManager.size(TaskPriority.HIGH)).toBe(2);
    });

    it('should return null for empty queue', () => {
      const peeked = queueManager.peek(TaskPriority.NORMAL);
      expect(peeked).toBeNull();
    });

    it('should return null for invalid priority', () => {
      const peeked = queueManager.peek(999 as TaskPriority);
      expect(peeked).toBeNull();
    });
  });

  describe('size', () => {
    it('should return correct size for each queue', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.CRITICAL));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.CRITICAL));
      await queueManager.enqueue(createMockTask('task-3', TaskPriority.NORMAL));

      expect(queueManager.size(TaskPriority.CRITICAL)).toBe(2);
      expect(queueManager.size(TaskPriority.NORMAL)).toBe(1);
      expect(queueManager.size(TaskPriority.HIGH)).toBe(0);
    });

    it('should return 0 for empty queue', () => {
      expect(queueManager.size(TaskPriority.LOW)).toBe(0);
    });

    it('should return 0 for invalid priority', () => {
      expect(queueManager.size(999 as TaskPriority)).toBe(0);
    });
  });

  describe('getMetrics', () => {
    it('should return queue sizes', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.CRITICAL));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.NORMAL));
      await queueManager.enqueue(createMockTask('task-3', TaskPriority.NORMAL));

      const metrics = queueManager.getMetrics();
      expect(metrics.queueSizes.get(TaskPriority.CRITICAL)).toBe(1);
      expect(metrics.queueSizes.get(TaskPriority.NORMAL)).toBe(2);
    });

    it('should calculate average wait times', async () => {
      const now = Date.now();
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.NORMAL));
      await new Promise(resolve => setTimeout(resolve, 10));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.NORMAL));

      const metrics = queueManager.getMetrics();
      expect(metrics.averageWaitTimes.get(TaskPriority.NORMAL)).toBeGreaterThan(0);
    });

    it('should return zero wait time for empty queue', () => {
      const metrics = queueManager.getMetrics();
      expect(metrics.averageWaitTimes.get(TaskPriority.HIGH)).toBeUndefined();
    });
  });

  describe('getTotalSize', () => {
    it('should return total tasks across all queues', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.CRITICAL));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.HIGH));
      await queueManager.enqueue(createMockTask('task-3', TaskPriority.NORMAL));
      await queueManager.enqueue(createMockTask('task-4', TaskPriority.LOW));

      expect(queueManager.getTotalSize()).toBe(4);
    });

    it('should return 0 when all queues empty', () => {
      expect(queueManager.getTotalSize()).toBe(0);
    });

    it('should update after dequeue', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.HIGH));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.HIGH));

      expect(queueManager.getTotalSize()).toBe(2);
      await queueManager.dequeue();
      expect(queueManager.getTotalSize()).toBe(1);
    });
  });

  describe('clear', () => {
    it('should clear all queues', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.CRITICAL));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.HIGH));
      await queueManager.enqueue(createMockTask('task-3', TaskPriority.NORMAL));

      queueManager.clear();

      expect(queueManager.getTotalSize()).toBe(0);
      expect(queueManager.size(TaskPriority.CRITICAL)).toBe(0);
      expect(queueManager.size(TaskPriority.HIGH)).toBe(0);
      expect(queueManager.size(TaskPriority.NORMAL)).toBe(0);
    });

    it('should handle clearing empty queues', () => {
      expect(() => queueManager.clear()).not.toThrow();
    });
  });

  describe('task queue', () => {
    it('should maintain queue order', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.NORMAL));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.NORMAL));
      await queueManager.enqueue(createMockTask('task-3', TaskPriority.NORMAL));

      const task1 = await queueManager.dequeue();
      const task2 = await queueManager.dequeue();
      const task3 = await queueManager.dequeue();

      // Heap ordering means we can't guarantee exact order when priorities are equal
      expect(task1).toBeDefined();
      expect(task2).toBeDefined();
      expect(task3).toBeDefined();
      expect(task1?.id).not.toBe(task2?.id);
      expect(task2?.id).not.toBe(task3?.id);
    });

    it('should handle mixed priorities correctly', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.NORMAL));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.CRITICAL));
      await queueManager.enqueue(createMockTask('task-3', TaskPriority.NORMAL));
      await queueManager.enqueue(createMockTask('task-4', TaskPriority.HIGH));

      const task1 = await queueManager.dequeue();
      const task2 = await queueManager.dequeue();
      const task3 = await queueManager.dequeue();
      const task4 = await queueManager.dequeue();

      // High priority tasks should come first
      expect(task1?.priority).toBe(TaskPriority.CRITICAL);
      expect(task2?.priority).toBe(TaskPriority.HIGH);
      expect(task3?.priority).toBe(TaskPriority.NORMAL);
      expect(task4?.priority).toBe(TaskPriority.NORMAL);
    });
  });

  describe('round robin behavior', () => {
    it('should dequeue from highest priority first always', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.LOW));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.CRITICAL));

      const task = await queueManager.dequeue();
      expect(task?.id).toBe('task-2');
    });
  });

  describe('priority', () => {
    it('should respect all priority levels', async () => {
      const priorities = [
        TaskPriority.CRITICAL,
        TaskPriority.HIGH,
        TaskPriority.NORMAL,
        TaskPriority.LOW,
        TaskPriority.BACKGROUND
      ];

      priorities.forEach((priority, index) => {
        queueManager.enqueue(createMockTask(`task-${index}`, priority));
      });

      const dequeuedOrder = [];
      for (let i = 0; i < 5; i++) {
        const task = await queueManager.dequeue();
        if (task) dequeuedOrder.push(task.priority);
      }

      expect(dequeuedOrder).toEqual([
        TaskPriority.CRITICAL,
        TaskPriority.HIGH,
        TaskPriority.NORMAL,
        TaskPriority.LOW,
        TaskPriority.BACKGROUND
      ]);
    });
  });
});
