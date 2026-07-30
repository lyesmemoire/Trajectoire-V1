import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WorkerPool } from '../../../CVM/src/scheduler/WorkerPool';
import { WorkerStatus, SchedulerConfig, TaskPriority, TaskStatus } from '../../../CVM/src/scheduler/types';

// Mock dependencies
const mockAffinityManager = {
  registerWorker: vi.fn(),
  assignAffinity: vi.fn()
};

const mockWorkStealingManager = {
  registerWorker: vi.fn(),
  steal: vi.fn(),
  balanceWorkers: vi.fn()
};

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

describe('WorkerPool', () => {
  let workerPool: WorkerPool;

  beforeEach(() => {
    vi.clearAllMocks();
    workerPool = new WorkerPool(mockConfig, mockAffinityManager as any, mockWorkStealingManager as any);
  });

  describe('creation', () => {
    it('should create worker pool with correct number of workers', () => {
      expect(workerPool.workers).toHaveLength(4);
      expect(workerPool.idleWorkers).toHaveLength(4);
      expect(workerPool.busyWorkers).toHaveLength(0);
    });

    it('should initialize workers with correct status', () => {
      workerPool.workers.forEach(worker => {
        expect(worker.status).toBe(WorkerStatus.IDLE);
        expect(worker.queue).toEqual([]);
        expect(worker.metrics.activeWorkers).toBe(0);
        expect(worker.metrics.idleWorkers).toBe(0);
      });
    });

    it('should register workers with affinity manager', () => {
      expect(mockAffinityManager.registerWorker).toHaveBeenCalledTimes(4);
    });

    it('should register workers with work stealing manager', () => {
      expect(mockWorkStealingManager.registerWorker).toHaveBeenCalledTimes(4);
    });

    it('should assign CPU affinity correctly', () => {
      workerPool.workers.forEach((worker, index) => {
        expect(worker.cpuAffinity).toEqual([index % 4]);
      });
    });

    it('should assign GPU affinity', () => {
      workerPool.workers.forEach(worker => {
        expect(worker.gpuAffinity).toEqual([0]);
      });
    });
  });

  describe('acquire', () => {
    it('should acquire idle worker when available', async () => {
      const worker = await workerPool.acquire();
      expect(worker).toBeDefined();
      expect(worker.status).toBe(WorkerStatus.IDLE);
      expect(workerPool.idleWorkers).toHaveLength(3);
      expect(workerPool.busyWorkers).toHaveLength(1);
    });

    it('should throw error when no workers available', async () => {
      // Acquire all workers
      for (let i = 0; i < 4; i++) {
        await workerPool.acquire();
      }

      await expect(workerPool.acquire()).rejects.toThrow('No available workers');
    });

    it('should try work stealing when no idle workers', async () => {
      const mockTask = {
        id: 'task-1',
        sessionId: 'session-1',
        instruction: null,
        priority: TaskPriority.NORMAL,
        latencyBudget: 1000,
        tokenBudget: 1000,
        dependencies: [],
        retryPolicy: { maxRetries: 3, backoffStrategy: 'EXPONENTIAL' as any, initialDelay: 100, maxDelay: 1000 },
        createdAt: Date.now(),
        status: TaskStatus.PENDING,
        metrics: { queueTime: 0, executionTime: 0, waitTime: 0, cpuTime: 0, memoryUsed: 0, tokensUsed: 0, retries: 0, preemptions: 0 }
      };

      mockWorkStealingManager.steal.mockResolvedValue(mockTask);

      // Acquire all workers
      for (let i = 0; i < 4; i++) {
        await workerPool.acquire();
      }

      const worker = await workerPool.acquire();
      expect(mockWorkStealingManager.steal).toHaveBeenCalled();
      expect(worker.queue).toContain(mockTask);
    });

    it('should balance workers when work stealing fails', async () => {
      mockWorkStealingManager.steal.mockResolvedValue(null);

      // Acquire all workers
      for (let i = 0; i < 4; i++) {
        await workerPool.acquire();
      }

      try {
        await workerPool.acquire();
      } catch (e) {
        // Expected to throw
      }

      expect(mockWorkStealingManager.balanceWorkers).toHaveBeenCalled();
    });
  });

  describe('release', () => {
    it('should release worker back to idle pool', async () => {
      const worker = await workerPool.acquire();
      await workerPool.release(worker);

      expect(worker.status).toBe(WorkerStatus.IDLE);
      expect(worker.currentTask).toBeUndefined();
      expect(workerPool.idleWorkers).toHaveLength(4);
      expect(workerPool.busyWorkers).toHaveLength(0);
    });

    it('should handle releasing worker not in busy list', async () => {
      const worker = workerPool.workers[0];
      await workerPool.release(worker);

      // Worker is already in idle list, so releasing it adds it again
      expect(workerPool.idleWorkers).toHaveLength(5);
    });

    it('should clear current task on release', async () => {
      const worker = await workerPool.acquire();
      worker.currentTask = {
        id: 'task-1',
        sessionId: 'session-1',
        instruction: null,
        priority: TaskPriority.NORMAL,
        latencyBudget: 1000,
        tokenBudget: 1000,
        dependencies: [],
        retryPolicy: { maxRetries: 3, backoffStrategy: 'EXPONENTIAL' as any, initialDelay: 100, maxDelay: 1000 },
        createdAt: Date.now(),
        status: TaskStatus.RUNNING,
        metrics: { queueTime: 0, executionTime: 0, waitTime: 0, cpuTime: 0, memoryUsed: 0, tokensUsed: 0, retries: 0, preemptions: 0 }
      };

      await workerPool.release(worker);
      expect(worker.currentTask).toBeUndefined();
    });
  });

  describe('shutdown', () => {
    it('should shutdown all workers', async () => {
      await workerPool.shutdown();

      expect(workerPool.workers).toHaveLength(0);
      expect(workerPool.idleWorkers).toHaveLength(0);
      expect(workerPool.busyWorkers).toHaveLength(0);
    });

    it('should set worker status to shutting down before clearing', async () => {
      const workersBefore = [...workerPool.workers];
      await workerPool.shutdown();

      workersBefore.forEach(worker => {
        expect(worker.status).toBe(WorkerStatus.SHUTTING_DOWN);
      });
    });

    it('should handle shutdown when workers are busy', async () => {
      await workerPool.acquire();
      await workerPool.acquire();

      await workerPool.shutdown();

      expect(workerPool.workers).toHaveLength(0);
    });
  });

  describe('getMetrics', () => {
    it('should return correct metrics for idle pool', () => {
      const metrics = workerPool.getMetrics();

      expect(metrics.activeWorkers).toBe(0);
      expect(metrics.idleWorkers).toBe(4);
      expect(metrics.averageUtilization).toBe(0);
      expect(metrics.stolenTasks).toBe(0);
      expect(metrics.preemptions).toBe(0);
    });

    it('should calculate utilization correctly', async () => {
      await workerPool.acquire();
      await workerPool.acquire();

      const metrics = workerPool.getMetrics();
      expect(metrics.activeWorkers).toBe(2);
      expect(metrics.idleWorkers).toBe(2);
      expect(metrics.averageUtilization).toBe(0.5);
    });

    it('should aggregate stolen tasks from all workers', () => {
      workerPool.workers[0].metrics.stolenTasks = 5;
      workerPool.workers[1].metrics.stolenTasks = 3;
      workerPool.workers[2].metrics.stolenTasks = 2;

      const metrics = workerPool.getMetrics();
      expect(metrics.stolenTasks).toBe(10);
    });

    it('should aggregate preemptions from all workers', () => {
      workerPool.workers[0].metrics.preemptions = 2;
      workerPool.workers[1].metrics.preemptions = 1;

      const metrics = workerPool.getMetrics();
      expect(metrics.preemptions).toBe(3);
    });

    it('should handle zero workers', async () => {
      await workerPool.shutdown();
      const metrics = workerPool.getMetrics();

      expect(metrics.activeWorkers).toBe(0);
      expect(metrics.idleWorkers).toBe(0);
      expect(metrics.averageUtilization).toBe(0);
    });
  });

  describe('getIdleWorkers', () => {
    it('should return copy of idle workers', () => {
      const idleWorkers = workerPool.getIdleWorkers();
      expect(idleWorkers).toHaveLength(4);

      // Modify returned array should not affect original
      idleWorkers.pop();
      expect(workerPool.idleWorkers).toHaveLength(4);
    });

    it('should return empty array when no idle workers', async () => {
      for (let i = 0; i < 4; i++) {
        await workerPool.acquire();
      }

      const idleWorkers = workerPool.getIdleWorkers();
      expect(idleWorkers).toHaveLength(0);
    });
  });

  describe('getWorker', () => {
    it('should return worker by ID', () => {
      const worker = workerPool.getWorker(0);
      expect(worker).toBeDefined();
      expect(worker?.id).toBe(0);
    });

    it('should return undefined for non-existent worker', () => {
      const worker = workerPool.getWorker(99);
      expect(worker).toBeUndefined();
    });

    it('should return correct worker for all IDs', () => {
      for (let i = 0; i < 4; i++) {
        const worker = workerPool.getWorker(i);
        expect(worker?.id).toBe(i);
      }
    });
  });

  describe('getWorkers', () => {
    it('should return copy of all workers', () => {
      const workers = workerPool.getWorkers();
      expect(workers).toHaveLength(4);

      // Modify returned array should not affect original
      workers.pop();
      expect(workerPool.workers).toHaveLength(4);
    });

    it('should return empty array after shutdown', async () => {
      await workerPool.shutdown();
      const workers = workerPool.getWorkers();
      expect(workers).toHaveLength(0);
    });
  });

  describe('multiple workers', () => {
    it('should handle concurrent worker acquisition', async () => {
      const promises = [];
      for (let i = 0; i < 4; i++) {
        promises.push(workerPool.acquire());
      }

      const workers = await Promise.all(promises);
      expect(workers).toHaveLength(4);
      expect(workerPool.idleWorkers).toHaveLength(0);
    });

    it('should handle concurrent worker release', async () => {
      const workers = [];
      for (let i = 0; i < 4; i++) {
        workers.push(await workerPool.acquire());
      }

      const promises = workers.map(w => workerPool.release(w));
      await Promise.all(promises);

      expect(workerPool.idleWorkers).toHaveLength(4);
      expect(workerPool.busyWorkers).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('should handle maxWorkers of 1', () => {
      const singleWorkerConfig = { ...mockConfig, maxWorkers: 1 };
      const singlePool = new WorkerPool(singleWorkerConfig, mockAffinityManager as any, mockWorkStealingManager as any);

      expect(singlePool.workers).toHaveLength(1);
      expect(singlePool.idleWorkers).toHaveLength(1);
    });

    it('should handle maxWorkers of 0', () => {
      const zeroWorkerConfig = { ...mockConfig, maxWorkers: 0 };
      const zeroPool = new WorkerPool(zeroWorkerConfig, mockAffinityManager as any, mockWorkStealingManager as any);

      expect(zeroPool.workers).toHaveLength(0);
      expect(zeroPool.idleWorkers).toHaveLength(0);
    });

    it('should handle large number of workers', () => {
      const largeConfig = { ...mockConfig, maxWorkers: 100 };
      const largePool = new WorkerPool(largeConfig, mockAffinityManager as any, mockWorkStealingManager as any);

      expect(largePool.workers).toHaveLength(100);
      expect(largePool.idleWorkers).toHaveLength(100);
    });
  });
});
