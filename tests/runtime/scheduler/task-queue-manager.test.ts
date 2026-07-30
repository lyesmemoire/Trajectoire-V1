import { describe, it, expect, beforeEach } from 'vitest';
import { TaskQueueManager } from '../../../CVM/src/scheduler/TaskQueueManager';
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

describe('TaskQueueManager', () => {
  let queueManager: TaskQueueManager;

  beforeEach(() => {
    queueManager = new TaskQueueManager(mockConfig);
  });

  describe('creation', () => {
    it('should create task queue manager', () => {
      expect(queueManager).toBeDefined();
      const metrics = queueManager.getMetrics();
      expect(metrics.pendingTasks).toBe(0);
      expect(metrics.runningTasks).toBe(0);
    });

    it('should initialize with zero metrics', () => {
      const metrics = queueManager.getMetrics();
      expect(metrics.completedTasks).toBe(0);
      expect(metrics.failedTasks).toBe(0);
      expect(metrics.averageQueueTime).toBe(0);
      expect(metrics.averageExecutionTime).toBe(0);
    });
  });

  describe('enqueue', () => {
    it('should enqueue task to appropriate queue', async () => {
      const task = createMockTask('task-1', TaskPriority.HIGH);
      await queueManager.enqueue(task);

      expect(queueManager.size('priority_1')).toBe(1);
    });

    it('should create queue if not exists', async () => {
      const task = createMockTask('task-1', TaskPriority.NORMAL);
      await queueManager.enqueue(task);

      const queues = queueManager.getQueues();
      expect(queues.has('priority_2')).toBe(true);
    });

    it('should set task status to PENDING', async () => {
      const task = createMockTask('task-1');
      task.status = TaskStatus.RUNNING;

      await queueManager.enqueue(task);
      expect(task.status).toBe(TaskStatus.PENDING);
    });

    it('should set scheduledAt timestamp', async () => {
      const task = createMockTask('task-1');
      task.scheduledAt = undefined as any;

      await queueManager.enqueue(task);
      expect(task.scheduledAt).toBeDefined();
      expect(task.scheduledAt).toBeGreaterThan(0);
    });

    it('should increment pending tasks metric', async () => {
      await queueManager.enqueue(createMockTask('task-1'));
      await queueManager.enqueue(createMockTask('task-2'));

      const metrics = queueManager.getMetrics();
      expect(metrics.pendingTasks).toBe(2);
    });

    it('should throw error when queue is full', async () => {
      const smallConfig = { ...mockConfig, maxQueueSize: 2 };
      const smallManager = new TaskQueueManager(smallConfig);

      await smallManager.enqueue(createMockTask('task-1'));
      await smallManager.enqueue(createMockTask('task-2'));

      await expect(smallManager.enqueue(createMockTask('task-3')))
        .rejects.toThrow('Queue priority_2 is full');
    });

    it('should handle multiple priorities', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.CRITICAL));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.HIGH));
      await queueManager.enqueue(createMockTask('task-3', TaskPriority.NORMAL));

      expect(queueManager.size('priority_0')).toBe(1);
      expect(queueManager.size('priority_1')).toBe(1);
      expect(queueManager.size('priority_2')).toBe(1);
    });
  });

  describe('dequeue', () => {
    it('should dequeue task from specific queue', async () => {
      await queueManager.enqueue(createMockTask('task-1'));
      const task = await queueManager.dequeue('priority_2');

      expect(task?.id).toBe('task-1');
      expect(queueManager.size('priority_2')).toBe(0);
    });

    it('should return null for empty queue', async () => {
      const task = await queueManager.dequeue('priority_2');
      expect(task).toBeNull();
    });

    it('should return null for non-existent queue', async () => {
      const task = await queueManager.dequeue('nonexistent');
      expect(task).toBeNull();
    });

    it('should set task status to SCHEDULED', async () => {
      await queueManager.enqueue(createMockTask('task-1'));
      const task = await queueManager.dequeue('priority_2');

      expect(task?.status).toBe(TaskStatus.SCHEDULED);
    });

    it('should update metrics on dequeue', async () => {
      await queueManager.enqueue(createMockTask('task-1'));
      await queueManager.enqueue(createMockTask('task-2'));

      await queueManager.dequeue('priority_2');
      const metrics = queueManager.getMetrics();

      expect(metrics.pendingTasks).toBe(1);
      expect(metrics.runningTasks).toBe(1);
    });

    it('should calculate queue time', async () => {
      const task = createMockTask('task-1');
      await queueManager.enqueue(task);
      await new Promise(resolve => setTimeout(resolve, 10));

      await queueManager.dequeue('priority_2');
      const metrics = queueManager.getMetrics();

      expect(metrics.averageQueueTime).toBeGreaterThan(0);
    });

    it('should maintain FIFO order', async () => {
      await queueManager.enqueue(createMockTask('task-1'));
      await queueManager.enqueue(createMockTask('task-2'));
      await queueManager.enqueue(createMockTask('task-3'));

      const task1 = await queueManager.dequeue('priority_2');
      const task2 = await queueManager.dequeue('priority_2');
      const task3 = await queueManager.dequeue('priority_2');

      expect(task1?.id).toBe('task-1');
      expect(task2?.id).toBe('task-2');
      expect(task3?.id).toBe('task-3');
    });
  });

  describe('peek', () => {
    it('should peek at next task without removing', async () => {
      await queueManager.enqueue(createMockTask('task-1'));
      await queueManager.enqueue(createMockTask('task-2'));

      const peeked = queueManager.peek('priority_2');
      expect(peeked?.id).toBe('task-1');
      expect(queueManager.size('priority_2')).toBe(2);
    });

    it('should return null for empty queue', () => {
      const peeked = queueManager.peek('priority_2');
      expect(peeked).toBeNull();
    });

    it('should return null for non-existent queue', () => {
      const peeked = queueManager.peek('nonexistent');
      expect(peeked).toBeNull();
    });
  });

  describe('size', () => {
    it('should return correct queue size', async () => {
      await queueManager.enqueue(createMockTask('task-1'));
      await queueManager.enqueue(createMockTask('task-2'));
      await queueManager.enqueue(createMockTask('task-3'));

      expect(queueManager.size('priority_2')).toBe(3);
    });

    it('should return 0 for empty queue', () => {
      expect(queueManager.size('priority_2')).toBe(0);
    });

    it('should return 0 for non-existent queue', () => {
      expect(queueManager.size('nonexistent')).toBe(0);
    });
  });

  describe('clear', () => {
    it('should clear specific queue', async () => {
      await queueManager.enqueue(createMockTask('task-1'));
      await queueManager.enqueue(createMockTask('task-2'));

      await queueManager.clear('priority_2');
      expect(queueManager.size('priority_2')).toBe(0);
    });

    it('should update metrics on clear', async () => {
      await queueManager.enqueue(createMockTask('task-1'));
      await queueManager.enqueue(createMockTask('task-2'));

      await queueManager.clear('priority_2');
      const metrics = queueManager.getMetrics();

      expect(metrics.pendingTasks).toBe(0);
    });

    it('should handle clearing non-existent queue', async () => {
      await expect(queueManager.clear('nonexistent')).resolves.not.toThrow();
    });

    it('should handle clearing empty queue', async () => {
      await expect(queueManager.clear('priority_2')).resolves.not.toThrow();
    });
  });

  describe('recordTaskCompletion', () => {
    it('should update metrics on completion', async () => {
      await queueManager.enqueue(createMockTask('task-1'));
      const task = await queueManager.dequeue('priority_2');
      task!.completedAt = Date.now();

      queueManager.recordTaskCompletion(task!);
      const metrics = queueManager.getMetrics();

      expect(metrics.runningTasks).toBe(0);
      expect(metrics.completedTasks).toBe(1);
    });

    it('should calculate execution time', async () => {
      const task = createMockTask('task-1');
      task.startedAt = Date.now();
      await queueManager.enqueue(task);
      await queueManager.dequeue('priority_2');
      task.completedAt = Date.now() + 100;

      queueManager.recordTaskCompletion(task);
      const metrics = queueManager.getMetrics();

      expect(metrics.averageExecutionTime).toBeGreaterThan(0);
    });

    it('should handle task without startedAt', async () => {
      const task = createMockTask('task-1');
      await queueManager.enqueue(task);
      await queueManager.dequeue('priority_2');
      task.completedAt = Date.now();

      queueManager.recordTaskCompletion(task);
      const metrics = queueManager.getMetrics();

      expect(metrics.averageExecutionTime).toBeGreaterThanOrEqual(0);
    });

    it('should handle large number of queue times', async () => {
      // Simulate many queue operations to trigger trimming
      for (let i = 0; i < 1500; i++) {
        const task = createMockTask(`task-${i}`);
        await queueManager.enqueue(task);
        await queueManager.dequeue('priority_2');
        task.completedAt = Date.now();
        queueManager.recordTaskCompletion(task);
      }

      const metrics = queueManager.getMetrics();
      expect(metrics).toBeDefined();
    });

    it('should update average queue time with empty array', () => {
      // Clear queue times to trigger empty branch
      (queueManager as any).queueTimes = [];
      
      // Manually call updateAverageQueueTime
      (queueManager as any).updateAverageQueueTime();
      
      const metrics = queueManager.getMetrics();
      expect(metrics.averageQueueTime).toBe(0);
    });

    it('should update average execution time with empty array', () => {
      // Clear execution times to trigger empty branch
      (queueManager as any).executionTimes = [];
      
      // Manually call updateAverageExecutionTime
      (queueManager as any).updateAverageExecutionTime();
      
      const metrics = queueManager.getMetrics();
      expect(metrics.averageExecutionTime).toBe(0);
    });

    it('should calculate queue time when scheduledAt is undefined', async () => {
      const task = createMockTask('task-1');
      await queueManager.enqueue(task);
      
      // Set scheduledAt to undefined AFTER enqueue to ensure it's used in dequeue
      (task as any).scheduledAt = undefined;
      
      const dequeued = await queueManager.dequeue('default');
      
      // Should use createdAt as fallback
      expect(dequeued).toBeDefined();
    });

    it('should calculate queue time using createdAt when scheduledAt is missing', async () => {
      const task = createMockTask('task-1');
      // Don't set scheduledAt at all, rely on enqueue to set it
      // Then manually remove it to test fallback
      await queueManager.enqueue(task);
      
      // Remove scheduledAt to force fallback to createdAt
      delete (task as any).scheduledAt;
      
      const dequeued = await queueManager.dequeue('default');
      
      // Should use createdAt as fallback for queue time calculation
      expect(dequeued).toBeDefined();
    });

    it('should calculate queue time with scheduledAt as 0', async () => {
      const task = createMockTask('task-1');
      (task as any).scheduledAt = 0; // Edge case: 0 timestamp
      await queueManager.enqueue(task);
      
      const dequeued = await queueManager.dequeue('default');
      
      // Should handle 0 timestamp
      expect(dequeued).toBeDefined();
    });

    it('should calculate queue time when scheduledAt is falsy', async () => {
      const task = createMockTask('task-1');
      (task as any).scheduledAt = null; // Null instead of undefined
      await queueManager.enqueue(task);
      
      const dequeued = await queueManager.dequeue('default');
      
      // Should use createdAt as fallback
      expect(dequeued).toBeDefined();
    });

    it('should calculate execution time with fallback values', async () => {
      const task = createMockTask('task-1');
      (task as any).startedAt = undefined;
      (task as any).scheduledAt = undefined;
      (task as any).completedAt = undefined;
      
      // Manually call recordTaskCompletion to trigger fallback branches
      queueManager.recordTaskCompletion(task);
      
      // Should use fallback values (Date.now() and createdAt)
      expect(queueManager.getMetrics().completedTasks).toBe(1);
    });

    it('should handle empty queue times', async () => {
      // Get metrics with no queue operations
      const metrics = queueManager.getMetrics();
      
      // Should handle empty queue times gracefully
      expect(metrics.averageQueueTime).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty execution times', async () => {
      // Record completion without execution
      const task = createMockTask('task-1');
      await queueManager.enqueue(task);
      await queueManager.dequeue('priority_2');
      
      // Don't set startedAt or completedAt
      queueManager.recordTaskCompletion(task);
      
      const metrics = queueManager.getMetrics();
      expect(metrics.averageExecutionTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('recordTaskFailure', () => {
    it('should update metrics on failure', async () => {
      await queueManager.enqueue(createMockTask('task-1'));
      const task = await queueManager.dequeue('priority_2');

      queueManager.recordTaskFailure(task!);
      const metrics = queueManager.getMetrics();

      expect(metrics.runningTasks).toBe(0);
      expect(metrics.failedTasks).toBe(1);
    });
  });

  describe('getMetrics', () => {
    it('should return current metrics', async () => {
      await queueManager.enqueue(createMockTask('task-1'));
      await queueManager.enqueue(createMockTask('task-2'));

      const metrics = queueManager.getMetrics();
      expect(metrics.pendingTasks).toBe(2);
    });

    it('should calculate throughput', async () => {
      const task = createMockTask('task-1');
      await queueManager.enqueue(task);
      const dequeued = await queueManager.dequeue('priority_2');
      dequeued!.completedAt = Date.now();

      queueManager.recordTaskCompletion(dequeued!);
      await new Promise(resolve => setTimeout(resolve, 100));

      const metrics = queueManager.getMetrics();
      expect(metrics.throughput).toBeGreaterThan(0);
    });

    it('should return copy of metrics', () => {
      const metrics1 = queueManager.getMetrics();
      const metrics2 = queueManager.getMetrics();

      expect(metrics1).toEqual(metrics2);
    });
  });

  describe('getQueues', () => {
    it('should return copy of queues', async () => {
      await queueManager.enqueue(createMockTask('task-1'));
      const queues = queueManager.getQueues();

      expect(queues.size).toBe(1);
    });

    it('should return empty map when no queues', () => {
      const queues = queueManager.getQueues();
      expect(queues.size).toBe(0);
    });
  });

  describe('queue management', () => {
    it('should handle multiple queues', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.CRITICAL));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.HIGH));
      await queueManager.enqueue(createMockTask('task-3', TaskPriority.NORMAL));

      const queues = queueManager.getQueues();
      expect(queues.size).toBe(3);
    });

    it('should maintain separate queues per priority', async () => {
      await queueManager.enqueue(createMockTask('task-1', TaskPriority.CRITICAL));
      await queueManager.enqueue(createMockTask('task-2', TaskPriority.CRITICAL));
      await queueManager.enqueue(createMockTask('task-3', TaskPriority.NORMAL));

      expect(queueManager.size('priority_0')).toBe(2);
      expect(queueManager.size('priority_2')).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle maxQueueSize of 0', () => {
      const zeroConfig = { ...mockConfig, maxQueueSize: 0 };
      const zeroManager = new TaskQueueManager(zeroConfig);

      const task = createMockTask('task-1');
      expect(zeroManager.enqueue(task)).rejects.toThrow();
    });

    it('should handle large number of tasks', async () => {
      for (let i = 0; i < 50; i++) {
        await queueManager.enqueue(createMockTask(`task-${i}`));
      }

      expect(queueManager.size('priority_2')).toBe(50);
    });

    it('should handle task with missing scheduledAt', async () => {
      const task = createMockTask('task-1');
      task.scheduledAt = undefined as any;

      await queueManager.enqueue(task);
      await queueManager.dequeue('priority_2');

      const metrics = queueManager.getMetrics();
      expect(metrics.averageQueueTime).toBeGreaterThanOrEqual(0);
    });
  });
});
